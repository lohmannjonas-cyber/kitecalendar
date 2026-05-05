import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryCrawl } from "@/lib/crawler";
import { requireCronSecret } from "@/lib/cron";

export async function GET(request: NextRequest) {
  const blocked = requireCronSecret(request);
  if (blocked) return blocked;

  const results = await runDiscoveryCrawl();
  return NextResponse.json({ ok: true, results });
}
