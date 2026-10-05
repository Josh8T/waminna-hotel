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
    const {
      orderId,
      grossAmountIdr,
      customerDetails,
      itemDetails,
    } = await req.json();

    if (!orderId || !grossAmountIdr) {
      return new Response(
        JSON.stringify({ error: "Missing orderId or grossAmountIdr" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Explicitly enforce Sandbox unless MIDTRANS_IS_PRODUCTION is strictly "true"
    const isProduction = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const authHeader = `Basic ${btoa(`${serverKey}:`)}`;

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
    let errorMessage = "Midtrans Sandbox payment creation failed";
    if (status === 401) {
      errorMessage = "Midtrans Sandbox (401 Unauthorized): The Sandbox Server Key was not accepted by Midtrans Sandbox. Please verify the account activation or regenerate the key in dashboard.sandbox.midtrans.com.";
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
