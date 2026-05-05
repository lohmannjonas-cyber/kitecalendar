import { Check, CopyCheck, ExternalLink, X } from "lucide-react";
import { reviewAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/badges";
import type { Dictionary } from "@/i18n/dictionaries";
import type { EventSubmission } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function ReviewTable({ items, dictionary }: { items: EventSubmission[]; dictionary: Dictionary }) {
  return (
    <div className="overflow-hidden rounded-md border border-sky-100 bg-white shadow-sm">
      <div className="grid gap-4 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={item.reviewStatus} />
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">
                  {item.sourceType.replace("_", " ")}
                </span>
                {item.duplicateOfId ? (
                  <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-black text-amber-800">
                    {dictionary.common.duplicateWarning}
                  </span>
                ) : null}
              </div>
              <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {formatDateRange(item.startDate, item.endDate)} · {item.city}, {item.country}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span>{item.organizerName}</span>
                <span>{item.eventTypeSlug}</span>
                {item.brandNames.map((brand) => (
                  <span key={brand} className="rounded-md bg-sky-50 px-2 py-1 text-sky-700">
                    {brand}
                  </span>
                ))}
              </div>
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-black text-sky-700 hover:text-sky-800"
                >
                  {dictionary.admin.sourceUrl}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            <div className="grid content-start gap-2">
              <ReviewButton id={item.id} status="approved" label={dictionary.common.approve} icon={<Check className="size-4" />} />
              <ReviewButton id={item.id} status="rejected" label={dictionary.common.reject} icon={<X className="size-4" />} />
              <ReviewButton
                id={item.id}
                status="duplicate"
                label={dictionary.common.markDuplicate}
                icon={<CopyCheck className="size-4" />}
              />
            </div>
          </div>
        ))}
        {items.length === 0 ? <p className="p-6 text-sm font-semibold text-slate-500">{dictionary.common.noResults}</p> : null}
      </div>
    </div>
  );
}

function ReviewButton({ id, status, label, icon }: { id: string; status: string; label: string; icon: React.ReactNode }) {
  return (
    <form action={reviewAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
        {icon}
        {label}
      </button>
    </form>
  );
}
