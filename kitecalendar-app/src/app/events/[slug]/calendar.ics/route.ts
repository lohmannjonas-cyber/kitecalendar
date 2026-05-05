import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getEventBySlug } from "@/lib/repository";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return new NextResponse("Not found", { status: 404 });

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kitecalendar.com//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@kitecalendar.com`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(event.startDate)}`,
    `DTEND:${icsDate(event.endDate)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(`${event.description}\n${SITE_URL}/events/${event.slug}`)}`,
    `LOCATION:${escapeIcs(`${event.spotName ?? event.city}, ${event.country}`)}`,
    `URL:${SITE_URL}/events/${event.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}

function icsDate(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}
