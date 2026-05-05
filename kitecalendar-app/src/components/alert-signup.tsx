import { BellRing } from "lucide-react";
import { subscribeAlertAction } from "@/app/actions/alerts";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Brand } from "@/lib/types";

export function AlertSignup({
  dictionary,
  brands,
  countries,
}: {
  dictionary: Dictionary;
  brands: Brand[];
  countries: string[];
}) {
  return (
    <form action={subscribeAlertAction} className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <BellRing className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-black text-slate-950">{dictionary.common.alertsTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{dictionary.common.alertsBody}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
        <input
          type="email"
          name="email"
          required
          placeholder={dictionary.common.email}
          className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
        />
        <select name="country" className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300">
          <option value="">{dictionary.common.country}</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select name="brandNames" className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300">
          <option value="">{dictionary.common.brand}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        <input type="hidden" name="minRating" value="Good" />
        <button className="h-11 rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800">
          {dictionary.common.subscribe}
        </button>
      </div>
    </form>
  );
}
