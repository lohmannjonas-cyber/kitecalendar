import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function EventSearchHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="hero-image relative overflow-hidden">
      <div
        className="mx-auto grid max-w-7xl content-center px-4 pb-8 pt-24 sm:px-6 lg:px-8"
        style={{ minHeight: "min(620px, calc(100svh - 80px))" }}
      >
        <div className="max-w-4xl text-white">
          <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.94] tracking-normal drop-shadow-xl sm:text-7xl lg:text-8xl">
            <span className="block">Chase wind.</span>
            <span className="block text-[#42d5c8]">Live free.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-white drop-shadow md:text-2xl">
            Your global kiteboarding companion. Events. Spots. Conditions. All in one place.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#events"
            className="inline-flex h-12 items-center justify-center gap-3 rounded-md bg-[#42d5c8] px-6 text-sm font-black uppercase tracking-normal text-[#042232] shadow-lg shadow-cyan-950/20 transition hover:bg-[#67eadf]"
          >
            <CalendarDays className="size-5" aria-hidden="true" />
            {dictionary.hero.explore}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/submit-event"
            className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-white/70 bg-white/10 px-6 text-sm font-black uppercase tracking-normal text-white shadow-lg shadow-cyan-950/20 backdrop-blur transition hover:bg-white/18"
          >
            <MapPin className="size-5" aria-hidden="true" />
            {dictionary.hero.submit}
          </Link>
        </div>
      </div>
    </section>
  );
}
