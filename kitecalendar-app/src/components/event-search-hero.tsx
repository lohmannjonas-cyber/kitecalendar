import { ArrowRight, CalendarDays, Globe2, Search } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function EventSearchHero({ dictionary, countries }: { dictionary: Dictionary; countries: string[] }) {
  const countryOptions = Array.from(new Set(["Germany", ...countries])).sort((a, b) => {
    if (a === "Germany") return -1;
    if (b === "Germany") return 1;
    return a.localeCompare(b);
  });

  return (
    <section className="hero-image relative overflow-hidden">
      <div
        className="mx-auto grid max-w-7xl content-end px-4 pb-10 pt-24 sm:px-6 lg:px-8"
        style={{ minHeight: "min(620px, calc(100svh - 96px))" }}
      >
        <div className="max-w-4xl text-white">
          <p className="mb-4 inline-flex rounded-md bg-white/15 px-3 py-1 text-sm font-black backdrop-blur">
            {dictionary.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl">{dictionary.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-sky-50">{dictionary.hero.subtitle}</p>
        </div>

        <form action="/events" className="glass-panel mt-8 grid gap-3 rounded-md border border-white/70 p-3 shadow-2xl sm:grid-cols-[1.4fr_0.9fr_0.8fr_auto]">
          <label className="flex h-12 items-center gap-2 rounded-md bg-white px-3">
            <Search className="size-5 text-sky-700" aria-hidden="true" />
            <input
              name="q"
              placeholder={dictionary.hero.searchPlaceholder}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>
          <label className="flex h-12 items-center gap-2 rounded-md bg-white px-3">
            <Globe2 className="size-5 text-sky-700" aria-hidden="true" />
            <select name="country" defaultValue="Germany" className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none">
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="flex h-12 items-center gap-2 rounded-md bg-white px-3">
            <CalendarDays className="size-5 text-sky-700" aria-hidden="true" />
            <select name="datePreset" className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none">
              <option value="">{dictionary.hero.datePlaceholder}</option>
              <option value="week">{dictionary.hero.thisWeek}</option>
              <option value="month">{dictionary.hero.thisMonth}</option>
            </select>
          </label>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-sky-700">
            {dictionary.hero.explore}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-4">
          <Link
            href="/submit-event"
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-black text-sky-700 shadow-sm transition hover:bg-sky-50"
          >
            {dictionary.hero.submit}
          </Link>
        </div>
      </div>
    </section>
  );
}
