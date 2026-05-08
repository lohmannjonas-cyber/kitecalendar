"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventTypeFilterChips({
  dictionary,
  eventTypes,
  basePath = "/",
}: {
  dictionary: Dictionary;
  eventTypes: EventType[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const selectedTypes = searchParams.getAll("eventType");

  function pushParams(params: URLSearchParams) {
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${basePath}?${query}#events` : `${basePath}#events`);
    });
  }

  function toggleType(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll("eventType");
    const nextValues = values.includes(slug) ? values.filter((value) => value !== slug) : [...values, slug];

    params.delete("eventType");
    for (const value of nextValues) {
      params.append("eventType", value);
    }

    pushParams(params);
  }

  function clearTypes() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("eventType");
    pushParams(params);
  }

  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase text-slate-500">{dictionary.common.type}</h3>
        {selectedTypes.length ? (
          <button type="button" onClick={clearTypes} className="text-sm font-black text-sky-700 hover:text-sky-800">
            {dictionary.common.reset}
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clearTypes}
          disabled={pending}
          className={cn(
            "h-9 rounded-md border px-3 text-sm font-black transition disabled:opacity-60",
            selectedTypes.length === 0
              ? "border-sky-600 bg-sky-600 text-white"
              : "border-sky-100 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700",
          )}
        >
          {dictionary.common.all}
        </button>
        {eventTypes.map((type) => {
          const selected = selectedTypes.includes(type.slug);

          return (
            <button
              key={type.slug}
              type="button"
              onClick={() => toggleType(type.slug)}
              disabled={pending}
              className={cn(
                "h-9 rounded-md border px-3 text-sm font-black transition disabled:opacity-60",
                selected
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-sky-100 bg-sky-50 text-sky-800 hover:border-sky-300 hover:bg-sky-100",
              )}
            >
              {type.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
