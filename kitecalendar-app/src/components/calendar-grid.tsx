import { addDays, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { KiteEvent } from "@/lib/types";

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

  return (
    <div className="overflow-hidden rounded-md border border-sky-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-sky-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-sky-700">Showing</p>
          <h2 className="text-2xl font-black text-slate-950">{format(monthStart, "MMMM yyyy")}</h2>
        </div>
        <div className="grid grid-cols-[44px_minmax(150px,1fr)_44px] overflow-hidden rounded-md border border-sky-100 text-sm font-black text-slate-700">
          <Link
            href={previousHref}
            aria-label="Previous month"
            title="Previous month"
            className="flex h-11 items-center justify-center hover:bg-sky-50 hover:text-sky-700"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex h-11 items-center justify-center border-x border-sky-100 px-4 text-center text-slate-950">
            {format(monthStart, "MMMM yyyy")}
          </div>
          <Link
            href={nextHref}
            aria-label="Next month"
            title="Next month"
            className="flex h-11 items-center justify-center hover:bg-sky-50 hover:text-sky-700"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-sky-100 bg-slate-50 text-center text-xs font-black uppercase text-slate-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-2 py-3">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = events.filter((event) => format(parseISO(event.startDate), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
          return (
            <div key={day.toISOString()} className="min-h-28 border-b border-r border-sky-50 p-2">
              <p className={`mb-2 text-xs font-black ${isSameMonth(day, monthStart) ? "text-slate-500" : "text-slate-300"}`}>
                {format(day, "d")}
              </p>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="block truncate rounded-sm bg-sky-100 px-2 py-1 text-xs font-bold text-sky-800 hover:bg-sky-200"
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
