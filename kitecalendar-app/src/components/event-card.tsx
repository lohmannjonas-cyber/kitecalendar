import { ArrowRight, CalendarDays, ExternalLink, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { BrandDemoBadge, RatingBadge } from "@/components/badges";
import type { Dictionary } from "@/i18n/dictionaries";
import type { KiteEvent } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function EventCard({ event, dictionary, compact = false }: { event: KiteEvent; dictionary: Dictionary; compact?: boolean }) {
  const hasBrandDemo = event.brands.length > 0 && event.brands.some((brand) => !["Other", "LakeUnited"].includes(brand.name));
  const showTypeBadge = !(hasBrandDemo && event.eventType.slug === "demo-day");

  return (
    <article className="group rounded-xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-[#58d7d0] hover:shadow-xl hover:shadow-slate-950/8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {showTypeBadge ? (
            <span className="rounded-md px-2 py-1 text-xs font-black text-white" style={{ background: event.eventType.color }}>
              {event.eventType.name}
            </span>
          ) : null}
          {event.forecast?.rating === "Good" || event.forecast?.rating === "Epic" ? (
            <RatingBadge rating={event.forecast.rating} />
          ) : null}
          {hasBrandDemo ? <BrandDemoBadge /> : null}
        </div>

        <div>
          <Link href={`/events/${event.slug}`} className="block">
            <h3 className="text-xl font-black tracking-normal text-[#061b34] transition group-hover:text-[#139f9a]">
              {event.title}
            </h3>
          </Link>
          {!compact ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{event.description}</p> : null}
        </div>

        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <Info icon={<CalendarDays className="size-4" />} value={formatDateRange(event.startDate, event.endDate)} />
          <Info icon={<MapPin className="size-4" />} value={`${event.city}${event.spotName ? `, ${event.spotName}` : ""}`} />
          <Info icon={<Users className="size-4" />} value={event.organizerName} />
          <Info icon={<ExternalLink className="size-4" />} value={event.country} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {event.brands.slice(0, 4).map((brand) => (
              <span
                key={brand.id}
                className="rounded-md px-2 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: brand.color ?? "#64748b" }}
              >
                {brand.name}
              </span>
            ))}
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#061b34] px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#0c2a4d]"
          >
            {dictionary.common.view}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Info({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="text-teal-600">{icon}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
