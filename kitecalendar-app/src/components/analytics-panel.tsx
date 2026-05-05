import { CalendarClock, CircleAlert, Globe2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

export function AnalyticsPanel({
  analytics,
  dictionary,
}: {
  analytics: {
    approvedEvents: number;
    pendingReview: number;
    duplicateWarnings: number;
    upcomingThisMonth: number;
    byCountry: { country: string; count: number }[];
  };
  dictionary: Dictionary;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<CalendarClock className="size-5" />} label={dictionary.admin.upcomingMonth} value={analytics.upcomingThisMonth} />
        <StatCard icon={<Globe2 className="size-5" />} label={dictionary.admin.pendingReview} value={analytics.pendingReview} />
        <StatCard icon={<CircleAlert className="size-5" />} label={dictionary.admin.duplicateWarnings} value={analytics.duplicateWarnings} />
      </div>
      <div className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-slate-950">{dictionary.admin.eventsByCountry}</h2>
        <div className="space-y-3">
          {analytics.byCountry.map((item) => (
            <div key={item.country}>
              <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                <span>{item.country}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${Math.max(12, (item.count / Math.max(1, analytics.approvedEvents)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">{icon}</div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
