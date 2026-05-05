import { AdminShell } from "@/components/admin-shell";
import { CrawlerSourceTable } from "@/components/crawler-source-table";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { listCrawlerRuns, listCrawlSources } from "@/lib/repository";

export const metadata = {
  title: "Crawler Sources",
};

export default async function AdminSourcesPage() {
  await requireAdmin();
  const { dictionary } = await getI18n();
  const [sources, runs] = await Promise.all([listCrawlSources(), listCrawlerRuns()]);

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">Crawler sources</h1>
      </div>
      <CrawlerSourceTable sources={sources} runs={runs} />
    </AdminShell>
  );
}
