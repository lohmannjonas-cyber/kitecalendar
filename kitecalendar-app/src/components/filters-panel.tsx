"use client";

import { LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Brand, EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const selectedCountries = searchParams.getAll("country");
  const selectedEventTypes = searchParams.getAll("eventType");

  function submit(formData: FormData) {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      const stringValue = String(value);
      if (stringValue) params.append(key, stringValue);
    }
    if (geo) {
      params.set("latitude", String(geo.latitude));
      params.set("longitude", String(geo.longitude));
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  }

  function toggleMultiValue(key: "country" | "eventType", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll(key);
    const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

    params.delete(key);
    for (const nextValue of nextValues) {
      params.append(key, nextValue);
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  }

  function clearMultiValue(key: "country" | "eventType") {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

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

          {selectedCountries.map((country) => (
            <input key={country} type="hidden" name="country" value={country} />
          ))}
          {selectedEventTypes.map((eventType) => (
            <input key={eventType} type="hidden" name="eventType" value={eventType} />
          ))}

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

            <ChipGroup
              label={dictionary.common.country}
              allLabel={dictionary.common.all}
              values={countries}
              selectedValues={selectedCountries}
              onClear={() => clearMultiValue("country")}
              onToggle={(value) => toggleMultiValue("country", value)}
            />

            <ChipGroup
              label={dictionary.common.type}
              allLabel={dictionary.common.all}
              values={eventTypes.map((type) => ({ label: type.name, value: type.slug }))}
              selectedValues={selectedEventTypes}
              onClear={() => clearMultiValue("eventType")}
              onToggle={(value) => toggleMultiValue("eventType", value)}
            />

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

function ChipGroup({
  label,
  allLabel,
  values,
  selectedValues,
  onClear,
  onToggle,
}: {
  label: string;
  allLabel: string;
  values: Array<string | { label: string; value: string }>;
  selectedValues: string[];
  onClear: () => void;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2 md:col-span-2">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "h-9 rounded-md border px-3 text-sm font-black transition",
            selectedValues.length === 0
              ? "border-sky-600 bg-sky-600 text-white"
              : "border-sky-100 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700",
          )}
        >
          {allLabel}
        </button>
        {values.map((item) => {
          const value = typeof item === "string" ? item : item.value;
          const itemLabel = typeof item === "string" ? item : item.label;
          const selected = selectedValues.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={cn(
                "h-9 rounded-md border px-3 text-sm font-black transition",
                selected
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-sky-100 bg-sky-50 text-sky-800 hover:border-sky-300 hover:bg-sky-100",
              )}
            >
              {itemLabel}
            </button>
          );
        })}
      </div>
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
