import { AdminShell } from "@/components/admin-shell";
import { EventTable } from "@/components/event-table";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { listEvents } from "@/lib/repository";

export const metadata = {
  title: "Admin Events",
};

export default async function AdminEventsPage() {
  await requireAdmin();
  const { dictionary } = await getI18n();
  const events = await listEvents();

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.admin.events}</h1>
      </div>
      <EventTable events={events} dictionary={dictionary} />
    </AdminShell>
  );
}
