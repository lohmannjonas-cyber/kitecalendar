import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/cron";

export async function GET(request: NextRequest) {
  const blocked = requireCronSecret(request);
  if (blocked) return blocked;

  /*
    Placeholder for production forecast writes:
    - Query approved events starting in the next 7 days.
    - Fetch the configured weather provider.
    - Upsert Forecast rows by event/date/provider.
  */
  return NextResponse.json({ ok: true, updated: 0, provider: process.env.WEATHER_PROVIDER ?? "mock" });
}
