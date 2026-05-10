import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const nav = [
    { href: "/", label: dictionary.nav.home },
    { href: "/submit-event", label: dictionary.nav.submit },
    { href: "/about", label: dictionary.nav.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-100/60 bg-[#041d2d]/92 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-end gap-2">
          <span className="leading-none">
            <span className="brand-wordmark block text-2xl font-black uppercase text-white">Kite</span>
            <span className="brand-wordmark-small block text-[10px] font-black uppercase text-[#42d5c8]">Calendar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-md bg-white/8 p-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 text-sm font-semibold text-cyan-50/82 transition hover:bg-white/12 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden size-10 items-center justify-center rounded-md border border-white/18 bg-white/8 text-cyan-50 shadow-sm transition hover:border-[#42d5c8] hover:text-[#42d5c8] sm:flex"
            aria-label={dictionary.nav.admin}
          >
            <ShieldCheck className="size-5" aria-hidden="true" />
          </Link>
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
