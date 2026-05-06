import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "@/lib/repository";
import { parseNumber, parseString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const events = await listEvents({
    q: parseString(params.get("q") ?? undefined),
    country: params.getAll("country"),
    region: parseString(params.get("region") ?? undefined),
    city: parseString(params.get("city") ?? undefined),
    datePreset: parseString(params.get("datePreset") ?? undefined) as "week" | "month" | "custom" | undefined,
    start: parseString(params.get("start") ?? undefined),
    end: parseString(params.get("end") ?? undefined),
    eventType: params.getAll("eventType"),
    brand: parseString(params.get("brand") ?? undefined),
    minWind: parseNumber(params.get("minWind") ?? undefined),
    windDirection: parseString(params.get("windDirection") ?? undefined),
    latitude: parseNumber(params.get("latitude") ?? undefined),
    longitude: parseNumber(params.get("longitude") ?? undefined),
    distanceKm: parseNumber(params.get("distanceKm") ?? undefined),
  });

  return NextResponse.json({ events });
}
