import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { runDiscoveryCrawl } from "@/lib/crawler";

export async function POST() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await runDiscoveryCrawl();
  return NextResponse.json({ results });
}
