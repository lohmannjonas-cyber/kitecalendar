import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import type { Dictionary } from "@/i18n/dictionaries";

export function AdminLogin({ dictionary, error }: { dictionary: Dictionary; error?: string }) {
  return (
    <section className="mx-auto flex min-h-[620px] max-w-md items-center px-4 pb-12 pt-28">
      <form action={loginAction} className="w-full rounded-md border border-sky-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-sky-600 text-white">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-950">{dictionary.admin.login}</h1>
            <p className="text-sm text-slate-500">Kitecalendar.com</p>
          </div>
        </div>
        {error ? (
          <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {dictionary.common.invalidLogin}
          </p>
        ) : null}
        <label className="mb-3 block space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">{dictionary.admin.email}</span>
          <input
            name="email"
            type="email"
            defaultValue={process.env.ADMIN_EMAIL ?? "admin@kitecalendar.com"}
            className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">{dictionary.admin.password}</span>
          <input
            name="password"
            type="password"
            className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
          />
        </label>
        <button className="mt-5 h-11 w-full rounded-md bg-sky-600 text-sm font-black text-white shadow-sm transition hover:bg-sky-700">
          {dictionary.admin.signIn}
        </button>
      </form>
    </section>
  );
}
