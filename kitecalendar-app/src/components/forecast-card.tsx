import { CalendarCheck, Gauge, Navigation, Wind } from "lucide-react";
import { RatingBadge } from "@/components/badges";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ForecastSummary } from "@/lib/types";

export function ForecastCard({ forecast, dictionary }: { forecast: ForecastSummary; dictionary: Dictionary }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950">{dictionary.common.forecast}</p>
          <p className="text-xs text-slate-500">{forecast.provider}</p>
        </div>
        <RatingBadge rating={forecast.rating} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric icon={<Wind className="size-4" />} label={dictionary.common.average} value={`${forecast.averageKnots} kt`} />
        <Metric icon={<Gauge className="size-4" />} label={dictionary.common.gusts} value={`${forecast.gustKnots} kt`} />
        <Metric icon={<Navigation className="size-4" />} label={dictionary.common.direction} value={forecast.direction} />
        <Metric icon={<CalendarCheck className="size-4" />} label={dictionary.common.bestDay} value={forecast.bestDay.date} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {forecast.days.map((day) => (
          <div key={day.date} className="rounded-md bg-sky-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-black text-slate-700">{day.date}</p>
              <RatingBadge rating={day.rating} />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {day.averageKnots} kt avg, {day.gustKnots} kt gusts
            </p>
            <p className="text-xs text-slate-500">{day.direction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-sky-700">{icon}</div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-base font-black text-slate-950">{value}</p>
    </div>
  );
}
