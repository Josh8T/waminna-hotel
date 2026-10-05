// Supabase Edge Function: create-midtrans-snap
// Generates a Midtrans Snap transaction token using the secret Server Key

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const rawServerKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!rawServerKey) {
      return new Response(
        JSON.stringify({ error: "Missing MIDTRANS_SERVER_KEY in Supabase secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serverKey = rawServerKey.trim().replace(/^["']|["']$/g, "");
    if (serverKey.toLowerCase().includes("client")) {
      return new Response(
        JSON.stringify({
          error: "MIDTRANS_SERVER_KEY in Supabase secrets appears to be a Client Key. Please copy the 'Server Key' from Midtrans Settings > Access Keys.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isProduction = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const authHeader = `Basic ${btoa(`${serverKey}:`)}`;

    // 1. ACTION: VERIFY TRANSACTION STATUS (Secure Server-to-Server Verification)
    if (body.action === "verify") {
      const orderId = body.orderId;
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: "Missing orderId for verification" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const statusApiUrl = isProduction
        ? `https://api.midtrans.com/v2/${orderId}/status`
        : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

      const statusRes = await fetch(statusApiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": authHeader,
        },
      });

      const statusData = await statusRes.json().catch(() => null);

      if (!statusRes.ok || !statusData) {
        return new Response(
          JSON.stringify({
            verified: false,
            isPaid: false,
            isPending: false,
            transactionStatus: "not_found",
            message: "No transaction found or payment was cancelled/unstarted.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const txnStatus = statusData.transaction_status;
      const fraudStatus = statusData.fraud_status;

      const isPaid =
        txnStatus === "settlement" ||
        (txnStatus === "capture" && fraudStatus === "accept");
      const isPending = txnStatus === "pending";

      return new Response(
        JSON.stringify({
          verified: isPaid,
          isPaid,
          isPending,
          transactionStatus: txnStatus,
          paymentType: statusData.payment_type,
          grossAmount: statusData.gross_amount,
          details: statusData,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. ACTION: CREATE SNAP TOKEN
    const {
      orderId,
      grossAmountIdr,
      customerDetails,
      itemDetails,
    } = body;

    if (!orderId || !grossAmountIdr) {
      return new Response(
        JSON.stringify({ error: "Missing orderId or grossAmountIdr" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(Number(grossAmountIdr)),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerDetails?.firstName || "Guest",
        last_name: customerDetails?.lastName || "",
        email: customerDetails?.email || "",
        phone: customerDetails?.phone || "",
      },
      item_details: itemDetails || [
        {
          id: orderId,
          price: Math.round(Number(grossAmountIdr)),
          quantity: 1,
          name: "Hotel Room Reservation",
        },
      ],
    };

    const midtransRes = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(payload),
    });

    const status = midtransRes.status;
    const data = await midtransRes.json().catch(() => null);

    if (midtransRes.ok && data?.token) {
      return new Response(
        JSON.stringify({
          token: data.token,
          redirect_url: data.redirect_url,
          environment: isProduction ? "production" : "sandbox",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clear human-friendly error extraction
    let errorMessage = `Midtrans ${isProduction ? "Production" : "Sandbox"} payment creation failed`;
    if (status === 401) {
      errorMessage = isProduction
        ? "Midtrans Production (401 Unauthorized): The Production Server Key was rejected. Please ensure the MIDTRANS_SERVER_KEY in Supabase secrets matches the Server Key in dashboard.midtrans.com."
        : "Midtrans Sandbox (401 Unauthorized): The Sandbox Server Key was not accepted by Midtrans Sandbox. Please verify the account activation or regenerate the key in dashboard.sandbox.midtrans.com.";
    } else if (Array.isArray(data?.error_messages)) {
      errorMessage = data.error_messages.join(", ");
    } else if (typeof data?.status_message === "string") {
      errorMessage = data.status_message;
    } else if (typeof data?.error === "string") {
      errorMessage = data.error;
    }

    return new Response(
      JSON.stringify({ error: errorMessage, details: data, status }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
