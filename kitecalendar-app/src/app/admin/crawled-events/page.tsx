import { DatabaseZap } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ReviewTable } from "@/components/review-table";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { listCrawlSources, listReviewItems } from "@/lib/repository";

export const metadata = {
  title: "Admin Crawled Events",
};

export default async function AdminCrawledEventsPage() {
  await requireAdmin();
  const { dictionary } = await getI18n();
  const [crawled, crawlerSources] = await Promise.all([listReviewItems("crawled"), listCrawlSources()]);

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.admin.crawled}</h1>
      </div>

      <div className="mb-5 rounded-md border border-sky-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
            <DatabaseZap className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-black text-slate-950">{dictionary.admin.crawlSources}</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {crawlerSources.map((source) => (
            <div key={source.id} className="rounded-md bg-slate-50 p-4">
              <p className="font-black text-slate-950">{source.name}</p>
              <p className="mt-1 text-sm text-slate-600">{source.baseUrl}</p>
              <p className="mt-2 text-xs font-black text-sky-700">
                {source.crawlFrequency} · {source.parserType} · {source.confidence}% confidence
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">{source.termsNote}</p>
            </div>
          ))}
        </div>
      </div>

      <ReviewTable items={crawled} dictionary={dictionary} />
    </AdminShell>
  );
}
