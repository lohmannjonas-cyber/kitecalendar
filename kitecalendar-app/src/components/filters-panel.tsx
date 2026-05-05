"use client";

import { LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Brand, EventType } from "@/lib/types";

export function FiltersPanel({
  dictionary,
  brands,
  eventTypes,
  countries,
}: {
  dictionary: Dictionary;
  brands: Brand[];
  eventTypes: EventType[];
  countries: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [geo, setGeo] = useState<{ latitude: number; longitude: number } | undefined>();
  const hasActiveFilters = ["q", "country", "eventType", "brand", "datePreset", "minWind", "distanceKm"].some((key) =>
    searchParams.get(key),
  );
  const [open, setOpen] = useState(hasActiveFilters);

  function submit(formData: FormData) {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      const stringValue = String(value);
      if (stringValue) params.set(key, stringValue);
    }
    if (geo) {
      params.set("latitude", String(geo.latitude));
      params.set("longitude", String(geo.longitude));
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  }

  function useLocation() {
    navigator.geolocation?.getCurrentPosition((position) => {
      setGeo({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 items-center gap-2 rounded-md border border-sky-200 bg-white px-4 text-sm font-black text-sky-700 shadow-sm transition hover:bg-sky-50"
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-5" aria-hidden="true" />
        {dictionary.common.filters}
      </button>

      {open ? (
        <form action={submit} className="mt-4 rounded-md border border-sky-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-sky-700" aria-hidden="true" />
              <h2 className="text-base font-black text-slate-950">{dictionary.common.filters}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => router.push("/events")} className="text-sm font-bold text-sky-700">
                {dictionary.common.reset}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700" aria-label="Close filters">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1">
              <span className="text-xs font-black uppercase text-slate-500">{dictionary.common.search}</span>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3">
                <Search className="size-4 text-slate-400" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue={searchParams.get("q") ?? ""}
                  placeholder={dictionary.hero.searchPlaceholder}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <Select label={dictionary.common.country} name="country" defaultValue={searchParams.get("country") ?? ""}>
              <option value="">{dictionary.common.all}</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>

            <Select label={dictionary.common.type} name="eventType" defaultValue={searchParams.get("eventType") ?? ""}>
              <option value="">{dictionary.common.all}</option>
              {eventTypes.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </Select>

            <Select label={dictionary.common.brand} name="brand" defaultValue={searchParams.get("brand") ?? ""}>
              <option value="">{dictionary.common.all}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>

            <Select label={dictionary.common.date} name="datePreset" defaultValue={searchParams.get("datePreset") ?? ""}>
              <option value="">{dictionary.common.all}</option>
              <option value="week">{dictionary.hero.thisWeek}</option>
              <option value="month">{dictionary.hero.thisMonth}</option>
            </Select>

            <label className="space-y-1">
              <span className="text-xs font-black uppercase text-slate-500">{dictionary.common.wind}</span>
              <input
                type="number"
                min="0"
                name="minWind"
                defaultValue={searchParams.get("minWind") ?? ""}
                placeholder="18 kt"
                className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-black uppercase text-slate-500">{dictionary.common.distance}</span>
              <select
                name="distanceKm"
                defaultValue={searchParams.get("distanceKm") ?? ""}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
              >
                <option value="">{dictionary.common.all}</option>
                <option value="100">100 km</option>
                <option value="300">300 km</option>
                <option value="800">800 km</option>
              </select>
            </label>

            <button
              type="button"
              onClick={useLocation}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 text-sm font-black text-sky-700 transition hover:bg-sky-100"
            >
              <LocateFixed className="size-4" aria-hidden="true" />
              {geo ? dictionary.common.locationOn : dictionary.common.useLocation}
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
          >
            {dictionary.common.apply}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
      >
        {children}
      </select>
    </label>
  );
}
