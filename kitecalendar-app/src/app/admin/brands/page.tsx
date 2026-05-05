import { AdminShell } from "@/components/admin-shell";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { getBrands, getEventTypes } from "@/lib/repository";

export const metadata = {
  title: "Admin Brands",
};

export default async function AdminBrandsPage() {
  await requireAdmin();
  const { dictionary } = await getI18n();
  const brands = getBrands();
  const eventTypes = getEventTypes();

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.admin.manageBrands}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-950">{dictionary.admin.brands}</h2>
          <div className="grid gap-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="size-4 rounded-full" style={{ background: brand.color }} />
                  <span className="font-black text-slate-900">{brand.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{brand.id}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-950">{dictionary.common.type}</h2>
          <div className="grid gap-2">
            {eventTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="size-4 rounded-full" style={{ background: type.color }} />
                  <span className="font-black text-slate-900">{type.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{type.slug}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
