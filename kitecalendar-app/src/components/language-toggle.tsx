"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/language";
import type { Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale, lightOnDark = false }: { locale: Locale; lightOnDark?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-full border p-1 text-xs font-semibold shadow-sm",
        lightOnDark ? "border-white/50 bg-white/20" : "border-[#d8dde6] bg-white",
      )}
    >
      {(["en", "de"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(item)}
          className={cn(
            "h-8 px-3 transition",
            locale === item
              ? lightOnDark
                ? "rounded-full bg-white text-[#061b34]"
                : "rounded-full bg-[#00658e] text-white"
              : lightOnDark
                ? "text-white/82 hover:text-white"
                : "text-[#706e6b] hover:text-[#00658e]",
          )}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
