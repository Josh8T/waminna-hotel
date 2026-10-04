// Supabase Edge Function: create-midtrans-snap
// Generates a Midtrans Snap transaction token using the secret Server Key

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
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

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) throw new Error("Missing MIDTRANS_SERVER_KEY");
    const isProduction = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    // Encode Basic Auth: ServerKey + ":" base64 encoded
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

    const data = await midtransRes.json();

    if (!midtransRes.ok) {
      return new Response(
        JSON.stringify({ error: data.error_messages || "Midtrans error", details: data }),
        { status: midtransRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        token: data.token,
        redirect_url: data.redirect_url,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
