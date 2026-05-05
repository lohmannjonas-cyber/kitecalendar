import { format, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { updateEventAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { getBrands, getEventById, getEventTypes } from "@/lib/repository";

export const metadata = {
  title: "Edit Event",
};

export default async function AdminEventEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { dictionary } = await getI18n();
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.common.edit}</h1>
      </div>

      <form action={updateEventAction} className="grid gap-5 rounded-md border border-sky-100 bg-white p-5 shadow-sm">
        <input type="hidden" name="id" value={event.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={dictionary.submit.eventName} name="title" defaultValue={event.title} required />
          <label className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-500">{dictionary.common.type}</span>
            <select
              name="eventTypeSlug"
              defaultValue={event.eventType.slug}
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
            >
              {getEventTypes().map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <Field label={dictionary.submit.startDate} name="startDate" type="date" defaultValue={format(parseISO(event.startDate), "yyyy-MM-dd")} required />
          <Field label={dictionary.submit.endDate} name="endDate" type="date" defaultValue={format(parseISO(event.endDate), "yyyy-MM-dd")} required />
          <Field label={dictionary.common.country} name="country" defaultValue={event.country} required />
          <Field label={dictionary.common.region} name="region" defaultValue={event.region ?? ""} />
          <Field label={dictionary.common.city} name="city" defaultValue={event.city} required />
          <Field label={dictionary.submit.spotName} name="spotName" defaultValue={event.spotName ?? ""} />
          <Field label={dictionary.submit.latitude} name="latitude" type="number" step="any" defaultValue={String(event.latitude)} required />
          <Field label={dictionary.submit.longitude} name="longitude" type="number" step="any" defaultValue={String(event.longitude)} required />
          <Field label={dictionary.submit.organizerName} name="organizerName" defaultValue={event.organizerName} required />
          <Field label={dictionary.submit.eventWebsite} name="organizerWebsite" type="url" defaultValue={event.organizerWebsite ?? ""} />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-black uppercase text-slate-500">{dictionary.submit.brandsAttending}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {getBrands().map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  name="brandNames"
                  value={brand.name}
                  defaultChecked={event.brands.some((eventBrand) => eventBrand.name === brand.name)}
                  className="size-4 accent-sky-600"
                />
                {brand.name}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="space-y-1">
          <span className="text-xs font-black uppercase text-slate-500">{dictionary.submit.description}</span>
          <textarea
            name="description"
            required
            minLength={20}
            rows={6}
            defaultValue={event.description}
            className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-sky-300"
          />
        </label>

        <button className="h-11 w-fit rounded-md bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-sky-700">
          {dictionary.common.save}
        </button>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  step,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        step={step}
        className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
      />
    </label>
  );
}
