import { BarChart3, CalendarCheck, DatabaseZap, LayoutDashboard, LogOut, Tags } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import type { Dictionary } from "@/i18n/dictionaries";

export function AdminShell({ dictionary, children }: { dictionary: Dictionary; children: React.ReactNode }) {
  const links = [
    { href: "/admin", label: dictionary.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/events", label: dictionary.admin.events, icon: CalendarCheck },
    { href: "/admin/submissions", label: dictionary.admin.submissions, icon: BarChart3 },
    { href: "/admin/crawled-events", label: dictionary.admin.crawled, icon: DatabaseZap },
    { href: "/admin/brands", label: dictionary.admin.brands, icon: Tags },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
      <aside className="rounded-md border border-sky-100 bg-white p-3 shadow-sm">
        <nav className="grid gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="mt-4 border-t border-slate-100 pt-3">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-black text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <LogOut className="size-4" aria-hidden="true" />
            {dictionary.admin.signOut}
          </button>
        </form>
      </aside>
      <section>{children}</section>
    </div>
  );
}
