import Link from "next/link";
import { addMonths, format, parse, startOfMonth } from "date-fns";
import { AlertSignup } from "@/components/alert-signup";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventCard } from "@/components/event-card";
import { FiltersPanel } from "@/components/filters-panel";
import { getI18n } from "@/i18n/server";
import { getBrands, getEventTypes, listEvents } from "@/lib/repository";
import { parseNumber, parseString } from "@/lib/utils";

export const metadata = {
  title: "Events",
};

function parseCalendarMonth(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return startOfMonth(new Date());

  const parsed = parse(value, "yyyy-MM", new Date());
  return Number.isNaN(parsed.getTime()) ? startOfMonth(new Date()) : startOfMonth(parsed);
}

function buildEventsHref(params: Record<string, string | string[] | undefined>, updates: Record<string, string | undefined>) {
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const stringValue = parseString(value);
    if (stringValue) nextParams.set(key, stringValue);
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  }

  const query = nextParams.toString();
  return query ? `/events?${query}` : "/events";
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { dictionary } = await getI18n();
  const filters = {
    q: parseString(params.q) ?? parseString(params.location),
    country: parseString(params.country),
    region: parseString(params.region),
    city: parseString(params.city),
    datePreset: parseString(params.datePreset) as "week" | "month" | "custom" | undefined,
    start: parseString(params.start),
    end: parseString(params.end),
    eventType: parseString(params.eventType),
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
  const view = parseString(params.view) ?? "list";
  const calendarMonth = parseCalendarMonth(parseString(params.month));
  const previousMonthHref = buildEventsHref(params, {
    view: "calendar",
    month: format(addMonths(calendarMonth, -1), "yyyy-MM"),
  });
  const nextMonthHref = buildEventsHref(params, {
    view: "calendar",
    month: format(addMonths(calendarMonth, 1), "yyyy-MM"),
  });
  const listHref = buildEventsHref(params, { view: "list", month: undefined });
  const calendarHref = buildEventsHref(params, {
    view: "calendar",
    month: format(calendarMonth, "yyyy-MM"),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
          <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.nav.events}</h1>
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

      <FiltersPanel dictionary={dictionary} brands={getBrands()} eventTypes={getEventTypes()} countries={countries} />

      {params.alert ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          {dictionary.common.alertSuccess}
        </div>
      ) : null}

      <div className="mt-6">
        {view === "calendar" ? (
          <CalendarGrid
            events={events}
            month={calendarMonth}
            nextHref={nextMonthHref}
            previousHref={previousMonthHref}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} dictionary={dictionary} />
            ))}
          </div>
        )}
      </div>

      {events.length === 0 ? (
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
    </div>
  );
}
