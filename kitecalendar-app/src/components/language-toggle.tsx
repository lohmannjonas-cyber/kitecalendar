"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/language";
import type { Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale, glassActive = false }: { locale: Locale; glassActive?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-full border border-white/50 bg-white/25 p-1 text-xs font-semibold shadow-sm backdrop-blur">
      {(["en", "de"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(item)}
          className={cn(
            "h-8 px-3 transition",
            locale === item
              ? glassActive
                ? "rounded-full bg-[#061b34] text-white"
                : "rounded-full bg-white text-[#061b34]"
              : glassActive
                ? "text-[#263f54] hover:text-[#061b34]"
                : "text-white/82 hover:text-white",
          )}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
