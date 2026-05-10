"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const glassActive = pathname !== "/" || scrolled;
  const nav = [
    { href: "/", label: dictionary.nav.home },
    { href: "/submit-event", label: dictionary.nav.submit },
    { href: "/about", label: dictionary.nav.about },
  ];

  useEffect(() => {
    function updateVisibility() {
      setScrolled(window.scrollY > 48);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 text-white transition duration-300 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 transition duration-300",
          glassActive
            ? "rounded-full border border-white/28 bg-white/18 shadow-lg shadow-slate-950/8 backdrop-blur-md"
            : "rounded-none border border-transparent bg-transparent shadow-none",
        )}
      >
        <Link href="/" className="flex w-[128px] flex-col leading-none">
          <span
            className={cn(
              "text-[34px] font-black uppercase tracking-[0.2em] drop-shadow-[0_1px_10px_rgba(255,255,255,0.35)]",
              glassActive ? "text-[#061b34]" : "text-white",
            )}
          >
            KITE
          </span>
          <span className="-mt-0.5 text-[16px] font-black uppercase tracking-[0.055em] text-[#58d7d0] drop-shadow-[0_1px_10px_rgba(88,215,208,0.38)]">
            CALENDAR
          </span>
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full p-1 transition duration-300 md:flex",
            glassActive ? "border border-white/40 bg-white/20 shadow-sm backdrop-blur" : "border border-transparent bg-transparent shadow-none",
          )}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition hover:shadow-sm",
                glassActive
                  ? "text-[#263f54] hover:bg-white/70 hover:text-[#061b34]"
                  : "text-white/88 hover:bg-white/18 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className={cn(
              "hidden size-10 items-center justify-center rounded-full transition sm:flex",
              glassActive ? "border border-white/50 bg-white/25 shadow-sm backdrop-blur" : "border border-transparent bg-transparent shadow-none",
              glassActive ? "text-[#263f54] hover:bg-white/70 hover:text-[#061b34]" : "text-white/88 hover:bg-white/18 hover:text-white",
            )}
            aria-label={dictionary.nav.admin}
          >
            <ShieldCheck className="size-5" aria-hidden="true" />
          </Link>
          <LanguageToggle locale={locale} glassActive={glassActive} />
        </div>
      </div>
    </header>
  );
}
