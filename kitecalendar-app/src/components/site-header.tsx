import { ShieldCheck, Wind } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-600 text-white shadow-sm shadow-sky-200">
            <Wind className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black tracking-normal text-slate-950">Kitecalendar.com</span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">Global kite event calendar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-md bg-slate-50 p-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-sky-700 hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden size-10 items-center justify-center rounded-md border border-sky-100 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700 sm:flex"
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
