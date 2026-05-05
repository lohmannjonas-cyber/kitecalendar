import { ArrowRight, CalendarDays, Globe2, Radar, Wind } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { EventSearchHero } from "@/components/event-search-hero";
import { getI18n } from "@/i18n/server";
import { getAnalytics, getFeaturedEvents, listEvents } from "@/lib/repository";

export default async function Home() {
  const { dictionary } = await getI18n();
  const [featuredEvents, events, analytics] = await Promise.all([getFeaturedEvents(), listEvents(), getAnalytics()]);
  const windLikely = events.filter((event) => event.forecast?.rating === "Good" || event.forecast?.rating === "Epic").length;

  return (
    <>
      <EventSearchHero dictionary={dictionary} />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric icon={<CalendarDays className="size-5" />} label={dictionary.common.upcomingEvents} value={events.length} />
          <Metric icon={<Wind className="size-5" />} label={dictionary.common.windLikely} value={windLikely} />
          <Metric icon={<Globe2 className="size-5" />} label={dictionary.common.countries} value={analytics.byCountry.length} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-sky-700">{dictionary.common.featured}</p>
              <h2 className="text-3xl font-black tracking-normal text-slate-950">{dictionary.common.bestUpcoming}</h2>
            </div>
            <Link href="/events" className="hidden items-center gap-2 text-sm font-black text-sky-700 hover:text-sky-800 sm:flex">
              {dictionary.nav.events}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} dictionary={dictionary} />
            ))}
          </div>
        </div>

        <aside className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-sky-50 text-sky-700">
            <Radar className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-black tracking-normal text-slate-950">{dictionary.common.reviewFirstTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{dictionary.common.reviewFirstBody}</p>
          <Link
            href="/submit-event"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            {dictionary.nav.submit}
          </Link>
        </aside>
      </section>
    </>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">{icon}</div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
