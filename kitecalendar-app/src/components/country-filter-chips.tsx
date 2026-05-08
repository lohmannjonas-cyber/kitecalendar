"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { countryFilterOptions } from "@/lib/country-groups";
import { cn } from "@/lib/utils";

export function CountryFilterChips({
  dictionary,
  countries,
  basePath = "/",
}: {
  dictionary: Dictionary;
  countries: string[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const selectedCountries = searchParams.getAll("country");
  const options = countryFilterOptions(countries);

  function pushParams(params: URLSearchParams) {
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${basePath}?${query}#events` : `${basePath}#events`);
    });
  }

  function toggleCountry(country: string) {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll("country");
    const nextValues = values.includes(country) ? values.filter((value) => value !== country) : [...values, country];

    params.delete("country");
    for (const value of nextValues) {
      params.append("country", value);
    }

    pushParams(params);
  }

  function clearCountries() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("country");
    pushParams(params);
  }

  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase text-slate-500">{dictionary.common.country}</h3>
        {selectedCountries.length ? (
          <button type="button" onClick={clearCountries} className="text-sm font-black text-sky-700 hover:text-sky-800">
            {dictionary.common.reset}
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clearCountries}
          disabled={pending}
          className={cn(
            "h-9 rounded-md border px-3 text-sm font-black transition disabled:opacity-60",
            selectedCountries.length === 0
              ? "border-sky-600 bg-sky-600 text-white"
              : "border-sky-100 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700",
          )}
        >
          {dictionary.common.all}
        </button>
        {options.map((country) => {
          const selected = selectedCountries.includes(country.value);

          return (
            <button
              key={country.value}
              type="button"
              onClick={() => toggleCountry(country.value)}
              disabled={pending}
              className={cn(
                "h-9 rounded-md border px-3 text-sm font-black transition disabled:opacity-60",
                selected
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-sky-100 bg-sky-50 text-sky-800 hover:border-sky-300 hover:bg-sky-100",
              )}
            >
              {country.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
