import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function EventSearchHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="hero-image relative overflow-hidden">
      <div
        className="mx-auto grid max-w-7xl content-center px-4 pb-10 pt-24 sm:px-6 lg:px-8"
        style={{ minHeight: "min(660px, calc(100svh - 64px))" }}
      >
        <div className="max-w-2xl text-[#061b34]">
          <p className="mb-5 inline-flex rounded-lg bg-[#00a1e0] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#00334a] shadow-sm">
            The community hub
          </p>
          <h1 className="max-w-xl text-[40px] font-black leading-[1.12] tracking-normal text-[#032d60] sm:text-6xl lg:text-7xl">
            <span className="block">Chase the wind.</span>
            <span className="block">Plan the ride.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-[#3e4850] md:text-lg">{dictionary.hero.subtitle}</p>
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href="#events"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#00a1e0] px-5 text-base font-black text-[#00334a] shadow-md transition hover:bg-[#0088c7] sm:h-12"
          >
            <CalendarDays className="size-5" aria-hidden="true" />
            {dictionary.hero.explore}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/submit-event"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d8dde6] bg-white px-5 text-base font-black text-[#00658e] shadow-sm transition hover:bg-[#f0f4f9] sm:h-12"
          >
            {dictionary.hero.submit}
          </Link>
        </div>
      </div>
    </section>
  );
}
