import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/repository";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const event = await getEventBySlug(slug);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ forecast: event.forecast ?? null });
}
