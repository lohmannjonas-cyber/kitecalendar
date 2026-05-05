import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { EventSearchHero } from "@/components/event-search-hero";
import { getI18n } from "@/i18n/server";
import { getFeaturedEvents, listEvents } from "@/lib/repository";

export default async function Home() {
  const { dictionary } = await getI18n();
  const [featuredEvents, events] = await Promise.all([getFeaturedEvents(), listEvents()]);
  const countries = Array.from(new Set(events.map((event) => event.country))).sort();

  return (
    <>
      <EventSearchHero dictionary={dictionary} countries={countries} />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
      </section>
    </>
  );
}
