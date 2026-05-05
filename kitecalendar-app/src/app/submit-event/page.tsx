import { CheckCircle2 } from "lucide-react";
import { SubmissionForm } from "@/components/submission-form";
import { getI18n } from "@/i18n/server";
import { getBrands, getEventTypes } from "@/lib/repository";

export const metadata = {
  title: "Submit Event",
};

export default async function SubmitEventPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { dictionary } = await getI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.submit.title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{dictionary.submit.intro}</p>
      </div>
      {params.success ? (
        <div className="mb-5 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          {dictionary.submit.success}
        </div>
      ) : null}
      <SubmissionForm dictionary={dictionary} brands={getBrands()} eventTypes={getEventTypes()} />
    </div>
  );
}
