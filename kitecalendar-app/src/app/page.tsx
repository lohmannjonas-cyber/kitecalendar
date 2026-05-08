import { addMonths, format, isBefore, parse, parseISO, startOfDay, startOfMonth } from "date-fns";
import Link from "next/link";
import { AlertSignup } from "@/components/alert-signup";
import { CalendarGrid } from "@/components/calendar-grid";
import { CountryFilterChips } from "@/components/country-filter-chips";
import { EventListByMonth } from "@/components/event-list-by-month";
import { EventSearchHero } from "@/components/event-search-hero";
import { EventTypeFilterChips } from "@/components/event-type-filter-chips";
import { FiltersPanel } from "@/components/filters-panel";
import { getI18n } from "@/i18n/server";
import { expandCountryFilters } from "@/lib/country-groups";
import { getBrands, getEventTypes, listEvents } from "@/lib/repository";
import { parseNumber, parseString, parseStringArray } from "@/lib/utils";

function parseCalendarMonth(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return startOfMonth(new Date());

  const parsed = parse(value, "yyyy-MM", new Date());
  return Number.isNaN(parsed.getTime()) ? startOfMonth(new Date()) : startOfMonth(parsed);
}

function buildHomeHref(params: Record<string, string | string[] | undefined>, updates: Record<string, string | undefined>) {
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const values = parseStringArray(value);
    for (const stringValue of values) {
      nextParams.append(key, stringValue);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  }

  const query = nextParams.toString();
  return query ? `/?${query}#events` : "/#events";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { dictionary } = await getI18n();
  const filters = {
    q: parseString(params.q) ?? parseString(params.location),
    country: expandCountryFilters(parseStringArray(params.country)),
    region: parseString(params.region),
    city: parseString(params.city),
    datePreset: parseString(params.datePreset) as "week" | "month" | "custom" | undefined,
    start: parseString(params.start),
    end: parseString(params.end),
    eventType: parseStringArray(params.eventType),
    brand: parseString(params.brand),
    minWind: parseNumber(params.minWind),
    windDirection: parseString(params.windDirection),
    latitude: parseNumber(params.latitude),
    longitude: parseNumber(params.longitude),
    distanceKm: parseNumber(params.distanceKm),
  };
  const events = await listEvents(filters);
  const allEvents = await listEvents();
  const countries = Array.from(new Set(allEvents.map((event) => event.country))).sort();
  const usedEventTypeSlugs = new Set(allEvents.map((event) => event.eventType.slug));
  const usedEventTypes = getEventTypes().filter((type) => usedEventTypeSlugs.has(type.slug));
  const view = parseString(params.view) ?? "list";
  const showPastEvents = parseString(params.showPast) === "1";
  const today = startOfDay(new Date());
  const visibleEvents = showPastEvents ? events : events.filter((event) => !isBefore(parseISO(event.endDate), today));
  const calendarMonth = parseCalendarMonth(parseString(params.month));
  const previousMonthHref = buildHomeHref(params, {
    view: "calendar",
    month: format(addMonths(calendarMonth, -1), "yyyy-MM"),
  });
  const nextMonthHref = buildHomeHref(params, {
    view: "calendar",
    month: format(addMonths(calendarMonth, 1), "yyyy-MM"),
  });
  const listHref = buildHomeHref(params, { view: "list", month: undefined });
  const calendarHref = buildHomeHref(params, {
    view: "calendar",
    month: format(calendarMonth, "yyyy-MM"),
  });
  const pastEventsHref = showPastEvents
    ? buildHomeHref(params, { showPast: undefined })
    : buildHomeHref(params, { showPast: "1" });

  return (
    <>
      <EventSearchHero dictionary={dictionary} />
      <section id="events" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-sky-700">{dictionary.common.upcomingEvents}</p>
            <h2 className="text-3xl font-black tracking-normal text-slate-950">{dictionary.common.bestUpcoming}</h2>
          </div>
          <div className="flex rounded-md border border-sky-100 bg-white p-1 shadow-sm">
            <Link
              href={listHref}
              className="rounded-sm px-3 py-2 text-sm font-black text-slate-600 hover:bg-sky-50 hover:text-sky-700"
            >
              {dictionary.common.list}
            </Link>
            <Link
              href={calendarHref}
              className="rounded-sm px-3 py-2 text-sm font-black text-slate-600 hover:bg-sky-50 hover:text-sky-700"
            >
              {dictionary.common.calendar}
            </Link>
          </div>
        </div>

        <FiltersPanel
          dictionary={dictionary}
          brands={getBrands()}
          basePath="/"
        />

        <div className="mt-4 space-y-4">
          <CountryFilterChips dictionary={dictionary} countries={countries} />
          <EventTypeFilterChips dictionary={dictionary} eventTypes={usedEventTypes} />
        </div>

        <div className="mt-3 flex justify-end">
          <Link href={pastEventsHref} className="text-sm font-bold text-slate-500 hover:text-sky-700">
            {showPastEvents ? dictionary.common.hidePastEvents : dictionary.common.showPastEvents}
          </Link>
        </div>

        <div className="mt-6">
          {view === "calendar" ? (
            <CalendarGrid events={visibleEvents} month={calendarMonth} nextHref={nextMonthHref} previousHref={previousMonthHref} />
          ) : (
            <EventListByMonth events={visibleEvents} dictionary={dictionary} />
          )}
        </div>

        {visibleEvents.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-sky-200 bg-white p-8 text-center">
            <p className="text-lg font-black text-slate-950">{dictionary.common.noResults}</p>
            <Link
              href="/submit-event"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-sky-600 px-4 text-sm font-black text-white"
            >
              {dictionary.common.submitMissing}
            </Link>
          </div>
        ) : null}

        <div className="mt-8">
          <AlertSignup dictionary={dictionary} brands={getBrands()} countries={countries} />
        </div>
      </section>
    </>
  );
}
