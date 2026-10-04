// Supabase Edge Function: midtrans-webhook
// Securely receives HTTP notifications from Midtrans, verifies SHA-512 signature,
// and updates booking status in Supabase PostgreSQL.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper to calculate SHA-512 hex string
async function sha512(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const notification = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = notification;

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) throw new Error("Missing MIDTRANS_SERVER_KEY");

    // 1. Verify SHA-512 signature
    const expectedSignature = await sha512(`${order_id}${status_code}${gross_amount}${serverKey}`);
    if (expectedSignature !== signature_key) {
      console.warn("Invalid Midtrans signature received for order:", order_id);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 403 });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Determine booking & payment status
    let paymentStatus = "pending";
    let bookingStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "paid";
        bookingStatus = "confirmed";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "paid";
      bookingStatus = "confirmed";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "pending";
      bookingStatus = "cancelled";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
      bookingStatus = "pending";
    }

    // 4. Update booking row
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: bookingStatus,
      })
      .eq("booking_reference", order_id);

    if (updateError) {
      console.error("Database update error:", updateError);
    }

    return new Response(JSON.stringify({ status: "OK", order_id, paymentStatus }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
