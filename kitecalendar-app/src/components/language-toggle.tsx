"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/language";
import type { Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/18 bg-white/8 p-1 text-xs font-semibold shadow-sm">
      {(["en", "de"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(item)}
          className={cn(
            "h-8 px-3 transition",
            locale === item ? "rounded-sm bg-[#42d5c8] text-[#042232]" : "text-cyan-50/80 hover:text-white",
          )}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
