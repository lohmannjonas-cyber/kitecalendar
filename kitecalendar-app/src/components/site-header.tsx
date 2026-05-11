"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="absolute inset-x-0 top-4 z-50 px-4 transition duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex w-[104px] flex-col leading-none">
          <span
            className={cn(
              "text-[34px] font-black uppercase tracking-normal drop-shadow-[0_1px_10px_rgba(255,255,255,0.35)]",
              isHome ? "text-white" : "text-[#032d60]",
            )}
          >
            KITE
          </span>
          <span className="-mt-0.5 text-[11px] font-black uppercase tracking-[0.42em] text-[#58d7d0] drop-shadow-[0_1px_10px_rgba(88,215,208,0.38)]">
            CALENDAR
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className={cn(
              "hidden size-10 items-center justify-center rounded-full transition sm:flex",
              isHome
                ? "text-white/88 hover:bg-white/18 hover:text-white"
                : "text-[#3e4850] hover:bg-[#eaeef4] hover:text-[#032d60]",
            )}
            aria-label={dictionary.nav.admin}
          >
            <ShieldCheck className="size-5" aria-hidden="true" />
          </Link>
          <LanguageToggle locale={locale} lightOnDark={isHome} />
        </div>
      </div>
    </header>
  );
}
