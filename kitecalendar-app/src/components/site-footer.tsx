import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="border-t border-[#d8dde6] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-semibold text-slate-700">Kitecalendar.com</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/#events" className="hover:text-[#00658e]">
            {dictionary.nav.home}
          </Link>
          <Link href="/submit-event" className="hover:text-[#00658e]">
            {dictionary.nav.submit}
          </Link>
          <Link href="/about" className="hover:text-[#00658e]">
            {dictionary.nav.about}
          </Link>
          <Link href="/admin" className="hover:text-[#00658e]">
            {dictionary.nav.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
