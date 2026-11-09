// Supabase Edge Function: pos-service
// Integrates with Hotel POS / Booking Engine XML API (2-Way Channel API)
// Automatically operates in Sandbox Simulator mode until live credentials are set.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory simulated inventory for Sandbox / Demo mode
const simulatedInventory: Record<string, Record<string, { quantity: number; isClosed: boolean; unitPrice: number }>> = {
  SGL: {},
  DLX: {},
  STE: {},
};

function getSimulatedDay(roomCode: string, dateStr: string) {
  if (!simulatedInventory[roomCode]) {
    simulatedInventory[roomCode] = {};
  }
  if (!simulatedInventory[roomCode][dateStr]) {
    const baseQuantity = roomCode === "STE" ? 2 : roomCode === "DLX" ? 4 : 6;
    const basePrice = roomCode === "STE" ? 1990000 : roomCode === "DLX" ? 1290000 : 890000;
    simulatedInventory[roomCode][dateStr] = {
      quantity: baseQuantity,
      isClosed: false,
      unitPrice: basePrice,
    };
  }
  return simulatedInventory[roomCode][dateStr];
}

// Helper to iterate date range
function getDateRange(fromStr: string, toStr: string): string[] {
  const dates: string[] = [];
  const curr = new Date(fromStr);
  const end = new Date(toStr);
  while (curr < end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// Simple XML attribute parser
function extractAttributes(tagStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(tagStr)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "get-planning";

    const posBaseUrl = Deno.env.get("POS_API_BASE_URL");
    const posLogin = Deno.env.get("POS_API_LOGIN");
    const posPassword = Deno.env.get("POS_API_PASSWORD");
    const posHotelCode = body.hotelCode || Deno.env.get("POS_HOTEL_CODE") || "HOTEL01";
    const posVersion = Deno.env.get("POS_API_VERSION") || "1.0";

    const isLive = Boolean(posBaseUrl && posLogin && posPassword);

    // ========================================================
    // ACTION: TEST-CONNECTION / STATUS
    // ========================================================
    if (action === "test-connection") {
      return new Response(
        JSON.stringify({
          mode: isLive ? "live" : "simulator",
          isLive,
          hotelCode: posHotelCode,
          baseUrl: posBaseUrl || "Built-in POS XML Simulator",
          version: posVersion,
          status: "connected",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================================
    // ACTION: GET-MAPPING
    // ========================================================
    if (action === "get-mapping") {
      if (!isLive) {
        return new Response(
          JSON.stringify({
            mode: "simulator",
            hotelCode: posHotelCode,
            rooms: [
              { roomPartnerCode: "SGL", roomName: "Single / Standard Room" },
              { roomPartnerCode: "DLX", roomName: "Executive & Pool Deluxe Room" },
              { roomPartnerCode: "STE", roomName: "Skyline Suite" },
            ],
            rates: [
              { ratePartnerCode: "RACKPRI", rateName: "Best Available Rate (Rack)" },
            ],
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Live XML Call
      const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<message>
  <authentication login="${posLogin}" password="${posPassword}"/>
  <mappingRequest hotelCode="${posHotelCode}" language="en-US"/>
</message>`;

      const res = await fetch(`${posBaseUrl}/GetMapping?version=${posVersion}`, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlPayload,
      });
      const xmlText = await res.text();

      // Parse room and rate codes from XML response
      const roomMatches = [...xmlText.matchAll(/<room\s+([^>]+)\/?>/g)].map((m) => extractAttributes(m[1]));
      const rateMatches = [...xmlText.matchAll(/<rate\s+([^>]+)\/?>/g)].map((m) => extractAttributes(m[1]));

      return new Response(
        JSON.stringify({
          mode: "live",
          hotelCode: posHotelCode,
          rooms: roomMatches,
          rates: rateMatches,
          rawXml: xmlText,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================================
    // ACTION: GET-PLANNING (Availability & Live Rates)
    // ========================================================
    if (action === "get-planning") {
      const from = body.from || new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const to = body.to || tomorrow.toISOString().split("T")[0];

      if (!isLive) {
        // Built-in Simulator
        const dates = getDateRange(from, to);
        const roomCodes = ["SGL", "DLX", "STE"];
        const roomsResult = roomCodes.map((code) => {
          const daily = dates.map((d) => {
            const day = getSimulatedDay(code, d);
            return {
              date: d,
              quantity: day.quantity,
              isClosed: day.isClosed,
              unitPrice: day.unitPrice,
            };
          });

          const minAvailable = Math.min(...daily.map((d) => d.quantity));
          const hasClosedDay = daily.some((d) => d.isClosed);
          const totalRate = daily.reduce((sum, d) => sum + d.unitPrice, 0);
          const avgRate = daily.length > 0 ? Math.round(totalRate / daily.length) : 0;

          return {
            roomCode: code,
            availableQuantity: minAvailable,
            isClosed: hasClosedDay || minAvailable <= 0,
            avgRatePerNight: avgRate,
            daily,
          };
        });

        return new Response(
          JSON.stringify({
            mode: "simulator",
            hotelCode: posHotelCode,
            from,
            to,
            nights: dates.length,
            rooms: roomsResult,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Live POS Call
      const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<message>
  <authentication login="${posLogin}" password="${posPassword}"/>
  <planning hotelCode="${posHotelCode}" from="${from}" to="${to}"/>
</message>`;

      const res = await fetch(`${posBaseUrl}/GetPlanning?version=${posVersion}`, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlPayload,
      });
      const xmlText = await res.text();

      // Extract rooms and daily planning from XML
      const roomBlocks = xmlText.split(/<room\s+/).slice(1);
      const parsedRooms = roomBlocks.map((block) => {
        const roomCodeMatch = block.match(/roomCode="([^"]+)"/);
        const roomCode = roomCodeMatch ? roomCodeMatch[1] : "UNKNOWN";

        const availabilities = [...block.matchAll(/<availability\s+([^>]+)\/?>/g)].map((m) => extractAttributes(m[1]));
        const ratePlans = [...block.matchAll(/<planning\s+([^>]+)\/?>/g)].map((m) => extractAttributes(m[1]));

        const minQty = availabilities.length > 0
          ? Math.min(...availabilities.map((a) => parseInt(a.quantity || "0", 10)))
          : 0;
        const isClosed = availabilities.some((a) => a.isClosed === "true") || minQty <= 0;

        return {
          roomCode,
          availableQuantity: minQty,
          isClosed,
          availabilities,
          ratePlans,
        };
      });

      return new Response(
        JSON.stringify({
          mode: "live",
          hotelCode: posHotelCode,
          from,
          to,
          rooms: parsedRooms,
          rawXml: xmlText,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================================
    // ACTION: UPDATE-INVENTORY (Deduct Allotment on Booking)
    // ========================================================
    if (action === "update-inventory") {
      const { roomCode, from, to, quantityDelta = 1 } = body;
      if (!roomCode || !from || !to) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: roomCode, from, to" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isLive) {
        // Built-in Simulator decrement
        const dates = getDateRange(from, to);
        dates.forEach((d) => {
          const day = getSimulatedDay(roomCode, d);
          day.quantity = Math.max(0, day.quantity - quantityDelta);
          if (day.quantity === 0) day.isClosed = true;
        });

        return new Response(
          JSON.stringify({
            success: true,
            mode: "simulator",
            message: `Simulated POS inventory updated: ${roomCode} reduced by ${quantityDelta} from ${from} to ${to}`,
            roomCode,
            dates,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Live POS Call
      const dates = getDateRange(from, to);
      const availXmlItems = dates
        .map((d) => {
          const nextDay = new Date(d);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextStr = nextDay.toISOString().split("T")[0];
          // Update request format from OpenAPI spec
          return `<availability from="${d}" to="${nextStr}" quantity="${body.newQuantity ?? 0}" isClosed="${body.isClosed ? "true" : "false"}"/>`;
        })
        .join("\n        ");

      const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<message>
  <authentication login="${posLogin}" password="${posPassword}"/>
  <inventoryUpdate hotelCode="${posHotelCode}">
    <room roomCode="${roomCode}">
      <inventory>
        ${availXmlItems}
      </inventory>
    </room>
  </inventoryUpdate>
</message>`;

      const res = await fetch(`${posBaseUrl}/Update?version=${posVersion}`, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlPayload,
      });
      const xmlText = await res.text();
      const isSuccess = xmlText.includes("<success>") || res.ok;

      return new Response(
        JSON.stringify({
          success: isSuccess,
          mode: "live",
          roomCode,
          rawXml: xmlText,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error in pos-service" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

