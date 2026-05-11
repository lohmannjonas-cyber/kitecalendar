import { addDays, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { KiteEvent } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function CalendarGrid({
  events,
  month,
  nextHref,
  previousHref,
}: {
  events: KiteEvent[];
  month: Date;
  nextHref: string;
  previousHref: string;
}) {
  const monthStart = startOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }).map((_, index) => {
    return addDays(gridStart, index);
  });
  const monthDaysWithEvents = days
    .filter((day) => isSameMonth(day, monthStart))
    .map((day) => ({
      day,
      events: events.filter((event) => format(parseISO(event.startDate), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")),
    }))
    .filter((day) => day.events.length > 0);

  return (
    <div className="overflow-hidden rounded-xl border border-[#d8dde6] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#d8dde6] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-[#00658e]">Showing</p>
          <h2 className="text-2xl font-black text-[#032d60]">{format(monthStart, "MMMM yyyy")}</h2>
        </div>
        <div className="grid grid-cols-[44px_minmax(150px,1fr)_44px] overflow-hidden rounded-lg border border-[#d8dde6] text-sm font-black text-[#3e4850]">
          <Link
            href={previousHref}
            aria-label="Previous month"
            title="Previous month"
            className="flex h-11 items-center justify-center hover:bg-[#c7e7ff] hover:text-[#00658e]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex h-11 items-center justify-center border-x border-[#d8dde6] px-4 text-center text-[#032d60]">
            {format(monthStart, "MMMM yyyy")}
          </div>
          <Link
            href={nextHref}
            aria-label="Next month"
            title="Next month"
            className="flex h-11 items-center justify-center hover:bg-[#c7e7ff] hover:text-[#00658e]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="border-t border-[#d8dde6] bg-[#f0f4f9] p-3 sm:hidden">
        {monthDaysWithEvents.length ? (
          <div className="space-y-3">
            {monthDaysWithEvents.map(({ day, events: dayEvents }) => (
              <section key={day.toISOString()} className="rounded-lg border border-[#d8dde6] bg-white p-3 shadow-sm">
                <p className="mb-2 text-xs font-black uppercase text-slate-500">{format(day, "EEE, MMM d")}</p>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block rounded-lg bg-[#c7e7ff] px-3 py-2 text-sm font-black leading-5 text-[#00334a] hover:bg-[#84cfff]"
                    >
                      <span className="block">{event.title}</span>
                      <span className="mt-1 block text-xs font-bold text-slate-500">
                        {formatDateRange(event.startDate, event.endDate)} · {event.city}, {event.country}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-[#84cfff] bg-white p-5 text-center text-sm font-bold text-[#706e6b]">
            No events in {format(monthStart, "MMMM yyyy")}.
          </p>
        )}
      </div>

      <div className="hidden grid-cols-7 border-b border-[#d8dde6] bg-[#f0f4f9] text-center text-xs font-black uppercase text-[#706e6b] sm:grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-2 py-3">
            {day}
          </div>
        ))}
      </div>
      <div className="hidden grid-cols-7 sm:grid">
        {days.map((day) => {
          const dayEvents = events.filter((event) => format(parseISO(event.startDate), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
          return (
            <div key={day.toISOString()} className="min-h-28 border-b border-r border-[#e4e9ee] p-2">
              <p className={`mb-2 text-xs font-black ${isSameMonth(day, monthStart) ? "text-slate-500" : "text-slate-300"}`}>
                {format(day, "d")}
              </p>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="block truncate rounded bg-[#c7e7ff] px-2 py-1 text-xs font-bold text-[#00334a] hover:bg-[#84cfff]"
                  >
                    {event.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
