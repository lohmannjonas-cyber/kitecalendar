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
    <div className="grid grid-cols-2 overflow-hidden rounded-md border border-sky-100 bg-white p-1 text-xs font-semibold shadow-sm">
      {(["en", "de"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(item)}
          className={cn(
            "h-8 px-3 transition",
            locale === item ? "rounded-sm bg-sky-600 text-white" : "text-slate-600 hover:text-sky-700",
          )}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
