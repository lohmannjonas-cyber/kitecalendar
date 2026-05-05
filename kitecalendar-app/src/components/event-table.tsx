import Link from "next/link";
import { deleteEventAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/badges";
import type { Dictionary } from "@/i18n/dictionaries";
import type { KiteEvent } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function EventTable({ events, dictionary }: { events: KiteEvent[]; dictionary: Dictionary }) {
  return (
    <div className="overflow-hidden rounded-md border border-sky-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{dictionary.common.event}</th>
              <th className="px-4 py-3">{dictionary.common.date}</th>
              <th className="px-4 py-3">{dictionary.common.location}</th>
              <th className="px-4 py-3">{dictionary.common.type}</th>
              <th className="px-4 py-3">{dictionary.common.status}</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <tr key={event.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-black text-slate-950">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.organizerName}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">{formatDateRange(event.startDate, event.endDate)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {event.city}, {event.country}
                </td>
                <td className="px-4 py-3 text-slate-600">{event.eventType.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={event.reviewStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                  <Link href={`/admin/events/${event.id}/edit`} className="font-black text-sky-700 hover:text-sky-800">
                    {dictionary.common.edit}
                  </Link>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <button className="font-black text-rose-700 hover:text-rose-800">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
