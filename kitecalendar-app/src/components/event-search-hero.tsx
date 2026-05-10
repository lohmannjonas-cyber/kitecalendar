import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function EventSearchHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="hero-image relative overflow-hidden">
      <div
        className="mx-auto grid max-w-7xl content-center px-4 pb-10 pt-24 sm:px-6 lg:px-8"
        style={{ minHeight: "min(640px, calc(100svh - 80px))" }}
      >
        <div className="max-w-2xl text-[#061b34]">
          <p className="mb-6 inline-flex rounded-full border border-white/70 bg-white/58 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#25445a] shadow-sm backdrop-blur">
            {dictionary.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            <span className="block">Chase the wind.</span>
            <span className="block">Plan the ride.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[#31465a] md:text-xl">{dictionary.hero.subtitle}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#events"
            className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#061b34] px-6 text-sm font-black text-white shadow-lg shadow-slate-950/20 transition hover:bg-[#0c2a4d]"
          >
            <CalendarDays className="size-5" aria-hidden="true" />
            {dictionary.hero.explore}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/submit-event"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white/58 px-6 text-sm font-black text-[#061b34] shadow-lg shadow-slate-950/10 backdrop-blur transition hover:bg-white/82"
          >
            {dictionary.hero.submit}
          </Link>
        </div>
      </div>
    </section>
  );
}
