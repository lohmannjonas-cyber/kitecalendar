"use client";

import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type GeocodingResult = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export function RadiusSearch({
  dictionary,
  basePath = "/",
}: {
  dictionary: Dictionary;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [city, setCity] = useState(searchParams.get("radiusLabel") ?? "");
  const [distanceKm, setDistanceKm] = useState(searchParams.get("distanceKm") ?? "300");
  const [error, setError] = useState<string | undefined>();

  const activeLabel = searchParams.get("radiusLabel");

  function pushParams(params: URLSearchParams) {
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${basePath}?${query}#events` : `${basePath}#events`);
    });
  }

  function applyRadius(latitude: number, longitude: number, label: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("latitude", String(latitude));
    params.set("longitude", String(longitude));
    params.set("distanceKm", distanceKm);
    params.set("radiusLabel", label);
    params.delete("country");
    setError(undefined);
    pushParams(params);
  }

  async function searchCity() {
    const query = city.trim();
    if (!query) return;

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      );
      const data = (await response.json()) as { results?: GeocodingResult[] };
      const place = data.results?.[0];

      if (!place) {
        setError(dictionary.common.noCityFound);
        return;
      }

      applyRadius(place.latitude, place.longitude, [place.name, place.country].filter(Boolean).join(", "));
    } catch {
      setError(dictionary.common.noCityFound);
    }
  }

  function useCurrentLocation() {
    navigator.geolocation?.getCurrentPosition((position) => {
      applyRadius(position.coords.latitude, position.coords.longitude, dictionary.common.myLocation);
    });
  }

  function clearRadius() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("latitude");
    params.delete("longitude");
    params.delete("distanceKm");
    params.delete("radiusLabel");
    setCity("");
    setError(undefined);
    pushParams(params);
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-950/5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-[#00658e]" aria-hidden="true" />
          <h3 className="text-sm font-black uppercase text-slate-500">{dictionary.common.radiusSearch}</h3>
        </div>
        {activeLabel ? (
          <button
            type="button"
            onClick={clearRadius}
            className="inline-flex items-center gap-1 text-sm font-black text-[#00658e] hover:text-[#0088c7]"
          >
            <X className="size-4" aria-hidden="true" />
            {dictionary.common.clearRadius}
          </button>
        ) : null}
      </div>

      {activeLabel ? (
        <p className="mb-3 text-sm font-bold text-slate-600">
          {dictionary.common.radiusAround} {activeLabel} · {searchParams.get("distanceKm") ?? distanceKm} km
        </p>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[1fr_160px_auto_auto]">
        <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3">
          <Search className="size-4 text-slate-400" aria-hidden="true" />
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") searchCity();
            }}
            placeholder={dictionary.common.cityOrSpot}
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={distanceKm}
          onChange={(event) => setDistanceKm(event.target.value)}
          className="h-11 rounded-md border border-[#d8dde6] bg-white px-3 text-sm outline-none focus:border-[#84cfff]"
          aria-label={dictionary.common.distance}
        >
          <option value="50">50 km</option>
          <option value="100">100 km</option>
          <option value="300">300 km</option>
          <option value="800">800 km</option>
          <option value="1500">1500 km</option>
        </select>

        <button
          type="button"
          onClick={searchCity}
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#00658e] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#0088c7] disabled:opacity-60"
        >
          {dictionary.common.searchRadius}
        </button>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#84cfff] bg-[#c7e7ff] px-4 text-sm font-black text-[#00658e] transition hover:bg-[#84cfff]/40 disabled:opacity-60"
        >
          <LocateFixed className="size-4" aria-hidden="true" />
          {dictionary.common.useLocation}
        </button>
      </div>

      {error ? <p className="mt-2 text-sm font-bold text-rose-600">{error}</p> : null}
    </div>
  );
}
