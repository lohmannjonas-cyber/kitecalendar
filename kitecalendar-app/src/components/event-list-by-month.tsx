import { format, parseISO } from "date-fns";
import { EventCard } from "@/components/event-card";
import type { Dictionary } from "@/i18n/dictionaries";
import type { KiteEvent } from "@/lib/types";

export function EventListByMonth({ events, dictionary }: { events: KiteEvent[]; dictionary: Dictionary }) {
  const grouped = events.reduce<Array<{ month: string; events: KiteEvent[] }>>((groups, event) => {
    const month = format(parseISO(event.startDate), "MMMM yyyy").toUpperCase();
    const existing = groups.find((group) => group.month === month);

    if (existing) {
      existing.events.push(event);
    } else {
      groups.push({ month, events: [event] });
    }

    return groups;
  }, []);

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section key={group.month} aria-labelledby={`events-${group.month.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
          <div className="mb-4 flex items-center gap-4">
            <h2 id={`events-${group.month.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-xl font-black text-[#032d60]">
              {group.month}
            </h2>
            <div className="h-px flex-1 bg-[#d8dde6]" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {group.events.map((event) => (
              <EventCard key={event.id} event={event} dictionary={dictionary} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
