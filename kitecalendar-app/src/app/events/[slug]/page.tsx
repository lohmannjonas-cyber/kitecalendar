import { CalendarPlus, ExternalLink, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ForecastCard } from "@/components/forecast-card";
import { EventMap } from "@/components/event-map";
import { getI18n } from "@/i18n/server";
import { SITE_URL } from "@/lib/constants";
import { getEventBySlug } from "@/lib/repository";
import { formatDateRange } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `/events/${event.slug}` },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const { dictionary } = await getI18n();
  if (!event) notFound();

  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", event.title);
  googleUrl.searchParams.set("details", `${event.description}\n\n${SITE_URL}/events/${event.slug}`);
  googleUrl.searchParams.set("location", `${event.spotName ?? event.city}, ${event.country}`);
  googleUrl.searchParams.set("dates", `${event.startDate.replace(/[-:]/g, "").slice(0, 15)}Z/${event.endDate.replace(/[-:]/g, "").slice(0, 15)}Z`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${SITE_URL}/events/${event.slug}`,
    location: {
      "@type": "Place",
      name: event.spotName ?? event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressRegion: event.region,
        addressCountry: event.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: event.latitude,
        longitude: event.longitude,
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizerName,
      url: event.organizerWebsite,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <article className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md px-2 py-1 text-xs font-black text-white" style={{ background: event.eventType.color }}>
              {event.eventType.name}
            </span>
            {event.brands.map((brand) => (
              <span key={brand.id} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">
                {brand.name}
              </span>
            ))}
          </div>
          <h1 className="max-w-3xl text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">{event.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-lg font-bold text-slate-600">
            <MapPin className="size-5 text-sky-700" aria-hidden="true" />
            {event.city}, {event.country} · {formatDateRange(event.startDate, event.endDate)}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label={dictionary.common.organizer} value={event.organizerName} />
            <Info label={dictionary.common.location} value={`${event.spotName ?? event.city}, ${event.region ?? event.country}`} />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-black text-slate-950">{dictionary.common.description}</h2>
            <p className="text-base leading-8 text-slate-600">{event.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {event.organizerWebsite ? (
              <a
                href={event.organizerWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-black text-white shadow-sm hover:bg-sky-700"
              >
                {dictionary.common.website}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            <a
              href={googleUrl.toString()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-sky-200 bg-white px-4 text-sm font-black text-sky-700 hover:bg-sky-50"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              {dictionary.common.addGoogle}
            </a>
            <a
              href={`/events/${event.slug}/calendar.ics`}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              {dictionary.common.addApple}
            </a>
          </div>

          {event.sourceUrl ? (
            <p className="mt-6 text-sm text-slate-500">
              {dictionary.common.source}:{" "}
              <a href={event.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-sky-700">
                {event.sourceUrl}
              </a>
            </p>
          ) : null}
        </article>

        <aside className="grid content-start gap-4">
          <EventMap event={event} />
          {event.forecast ? <ForecastCard forecast={event.forecast} dictionary={dictionary} /> : null}
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
