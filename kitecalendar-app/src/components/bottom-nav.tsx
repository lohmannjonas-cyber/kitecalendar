"use client";

import { Compass, Home, Info, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function BottomNav({ dictionary }: { dictionary: Dictionary }) {
  const pathname = usePathname();
  const items = [
    { href: "/#events", label: "Explore", icon: Compass, active: pathname === "/" },
    { href: "/", label: dictionary.nav.home, icon: Home, active: pathname === "/" },
    { href: "/submit-event", label: dictionary.nav.submit, icon: PlusCircle, active: pathname === "/submit-event" },
    { href: "/about", label: dictionary.nav.about, icon: Info, active: pathname === "/about" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-4 border-t border-[#d8dde6] bg-[#eaeef4]/96 px-1 shadow-[0_-10px_30px_rgba(3,45,96,0.08)] backdrop-blur">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[11px] font-black transition active:scale-95",
              item.active ? "text-[#00658e]" : "text-[#706e6b] hover:text-[#0088c7]",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
