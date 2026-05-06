import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function EventSearchHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="hero-image relative overflow-hidden">
      <div
        className="mx-auto grid max-w-7xl content-end px-4 pb-10 pt-24 sm:px-6 lg:px-8"
        style={{ minHeight: "min(540px, calc(100svh - 96px))" }}
      >
        <div className="max-w-4xl text-white">
          <p className="mb-4 inline-flex rounded-md bg-white/15 px-3 py-1 text-sm font-black backdrop-blur">
            {dictionary.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl">{dictionary.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-sky-50">{dictionary.hero.subtitle}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#events"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-sky-700"
          >
            {dictionary.hero.explore}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
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
