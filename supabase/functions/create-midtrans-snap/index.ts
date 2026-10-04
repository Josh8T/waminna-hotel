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

    // Determine initial environment
    const isProductionEnv = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const sandboxUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";
    const productionUrl = "https://app.midtrans.com/snap/v1/transactions";

    // If key starts with SB-, definitely sandbox. If explicitly production, try production first.
    const tryUrls = serverKey.startsWith("SB-")
      ? [sandboxUrl]
      : isProductionEnv
        ? [productionUrl, sandboxUrl]
        : [sandboxUrl, productionUrl];

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

    let lastData: any = null;
    let lastStatus = 500;

    for (const snapUrl of tryUrls) {
      const midtransRes = await fetch(snapUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(payload),
      });

      lastStatus = midtransRes.status;
      lastData = await midtransRes.json().catch(() => null);

      if (midtransRes.ok && lastData?.token) {
        return new Response(
          JSON.stringify({
            token: lastData.token,
            redirect_url: lastData.redirect_url,
            isProduction: snapUrl === productionUrl,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If not 401, don't retry other URL since auth wasn't the issue
      if (lastStatus !== 401) {
        break;
      }
    }

    // Extract human-friendly error message from Midtrans
    let errorMessage = "Midtrans payment creation failed";
    if (Array.isArray(lastData?.error_messages)) {
      errorMessage = lastData.error_messages.join(", ");
    } else if (typeof lastData?.status_message === "string") {
      errorMessage = lastData.status_message;
    } else if (typeof lastData?.error === "string") {
      if (lastData.error === "Unauthorized" || lastStatus === 401) {
        errorMessage = `Midtrans Unauthorized (401): The Server Key (${serverKey.slice(0, 10)}...) was rejected by Midtrans. Please verify you copied the active Server Key from Midtrans Settings > Access Keys.`;
      } else {
        errorMessage = lastData.error;
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage, details: lastData, status: lastStatus }),
      { status: lastStatus, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
