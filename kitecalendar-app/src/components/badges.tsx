import { Sparkles, Wind } from "lucide-react";
import type { KiteRating } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RatingBadge({ rating }: { rating: KiteRating }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-black",
        rating === "Epic" && "bg-orange-100 text-orange-700",
        rating === "Good" && "bg-emerald-100 text-emerald-700",
        rating === "Okay" && "bg-[#c7e7ff] text-[#00658e]",
        rating === "Poor" && "bg-slate-100 text-slate-600",
      )}
    >
      <Wind className="size-3.5" aria-hidden="true" />
      {rating}
    </span>
  );
}

export function BrandDemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-black text-white">
      <Sparkles className="size-3.5" aria-hidden="true" />
      Brand demo
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-1 text-xs font-black capitalize",
        status === "approved" && "bg-emerald-100 text-emerald-700",
        status === "pending" && "bg-amber-100 text-amber-800",
        status === "rejected" && "bg-rose-100 text-rose-700",
        status === "duplicate" && "bg-slate-200 text-slate-700",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
