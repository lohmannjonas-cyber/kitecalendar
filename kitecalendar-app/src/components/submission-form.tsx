import { Send } from "lucide-react";
import { submitEventAction } from "@/app/actions/submissions";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Brand, EventType } from "@/lib/types";

export function SubmissionForm({
  dictionary,
  brands,
  eventTypes,
}: {
  dictionary: Dictionary;
  brands: Brand[];
  eventTypes: EventType[];
}) {
  return (
    <form action={submitEventAction} className="grid gap-5 rounded-xl border border-[#d8dde6] bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={dictionary.submit.eventName} name="title" required />
        <Select label={dictionary.common.type} name="eventTypeSlug" required>
          {eventTypes.map((type) => (
            <option key={type.slug} value={type.slug}>
              {type.name}
            </option>
          ))}
        </Select>
        <Field label={dictionary.submit.startDate} name="startDate" type="date" required />
        <Field label={dictionary.submit.endDate} name="endDate" type="date" required />
        <Field label={dictionary.common.country} name="country" required />
        <Field label={dictionary.common.region} name="region" />
        <Field label={dictionary.common.city} name="city" required />
        <Field label={dictionary.submit.spotName} name="spotName" />
        <Field label={dictionary.submit.latitude} name="latitude" type="number" step="any" />
        <Field label={dictionary.submit.longitude} name="longitude" type="number" step="any" />
        <Field label={dictionary.submit.organizerName} name="organizerName" required />
        <Field label={dictionary.submit.eventWebsite} name="organizerWebsite" type="url" />
        <Field label={dictionary.submit.contactEmail} name="contactEmail" type="email" required />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs font-black uppercase text-slate-500">{dictionary.submit.brandsAttending}</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold">
              <input type="checkbox" name="brandNames" value={brand.name} className="size-4 accent-[#00658e]" />
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
          className="w-full rounded-md border border-[#d8dde6] px-3 py-3 text-sm outline-none focus:border-[#84cfff]"
        />
      </label>

      <button className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[#00658e] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#0088c7]">
        <Send className="size-4" aria-hidden="true" />
        {dictionary.submit.send}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  step,
}: {
  label: string;
  name: string;
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
        required={required}
        step={step}
        className="h-11 w-full rounded-md border border-[#d8dde6] px-3 text-sm outline-none focus:border-[#84cfff]"
      />
    </label>
  );
}

function Select({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <select
        name={name}
        required={required}
        className="h-11 w-full rounded-md border border-[#d8dde6] bg-white px-3 text-sm outline-none focus:border-[#84cfff]"
      >
        {children}
      </select>
    </label>
  );
}
