import { addDays, format, parseISO, startOfMonth, startOfWeek } from "date-fns";
import Link from "next/link";
import type { KiteEvent } from "@/lib/types";

export function CalendarGrid({ events }: { events: KiteEvent[] }) {
  const monthStart = startOfMonth(new Date());
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const days = Array.from({ length: 35 }).map((_, index) => {
    return addDays(gridStart, index);
  });

  return (
    <div className="overflow-hidden rounded-md border border-sky-100 bg-white shadow-sm">
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
              <p className="mb-2 text-xs font-black text-slate-500">{format(day, "d")}</p>
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
