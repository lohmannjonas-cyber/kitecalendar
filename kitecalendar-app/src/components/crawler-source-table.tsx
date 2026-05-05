import { Play, ShieldCheck, TimerReset } from "lucide-react";
import { runCrawlerAction } from "@/app/admin/actions";

type CrawlSourceView = {
  id: string;
  name: string;
  baseUrl: string;
  sourceType: string;
  crawlFrequency: string;
  parserType: string;
  confidence: number;
  robotsCheckedAt?: string;
  termsNote?: string;
  isActive: boolean;
  lastCrawledAt?: string;
};

type CrawlerRunView = {
  id: string;
  sourceName: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  eventsFound: number;
  eventsQueued: number;
  duplicates: number;
  errorMessage?: string;
};

export function CrawlerSourceTable({ sources, runs }: { sources: CrawlSourceView[]; runs: CrawlerRunView[] }) {
  return (
    <div className="grid gap-6">
      <section className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Source registry</h2>
            <p className="text-sm text-slate-500">Only public, approved sources are crawled. Candidates stay pending review.</p>
          </div>
          <form action={runCrawlerAction}>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-black text-white hover:bg-sky-700">
              <Play className="size-4" aria-hidden="true" />
              Run all now
            </button>
          </form>
        </div>

        <div className="grid gap-3">
          {sources.map((source) => (
            <article key={source.id} className="rounded-md border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-slate-950">{source.name}</h3>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-600">{source.sourceType}</span>
                    <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-black text-sky-700">{source.confidence}% confidence</span>
                  </div>
                  <a href={source.baseUrl} target="_blank" rel="noreferrer" className="break-all text-sm font-bold text-sky-700">
                    {source.baseUrl}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{source.termsNote}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1">
                      <TimerReset className="size-3.5" aria-hidden="true" />
                      {source.crawlFrequency}
                    </span>
                    <span className="rounded-md bg-white px-2 py-1">{source.parserType}</span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      robots {source.robotsCheckedAt ? "checked" : "pending"}
                    </span>
                    <span className="rounded-md bg-white px-2 py-1">
                      last crawl {source.lastCrawledAt ? new Date(source.lastCrawledAt).toLocaleString() : "never"}
                    </span>
                  </div>
                </div>
                <form action={runCrawlerAction}>
                  <input type="hidden" name="sourceId" value={source.id} />
                  <button className="inline-flex h-10 items-center gap-2 rounded-md border border-sky-200 bg-white px-3 text-sm font-black text-sky-700 hover:bg-sky-50">
                    <Play className="size-4" aria-hidden="true" />
                    Run
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black text-slate-950">Recent crawler runs</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="py-2">Source</th>
                <th className="py-2">Status</th>
                <th className="py-2">Found</th>
                <th className="py-2">Queued</th>
                <th className="py-2">Duplicates</th>
                <th className="py-2">Started</th>
                <th className="py-2">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runs.map((run) => (
                <tr key={run.id}>
                  <td className="py-3 font-bold text-slate-800">{run.sourceName}</td>
                  <td className="py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{run.status}</span>
                  </td>
                  <td className="py-3">{run.eventsFound}</td>
                  <td className="py-3">{run.eventsQueued}</td>
                  <td className="py-3">{run.duplicates}</td>
                  <td className="py-3">{new Date(run.startedAt).toLocaleString()}</td>
                  <td className="max-w-xs truncate py-3 text-rose-700">{run.errorMessage}</td>
                </tr>
              ))}
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-sm font-semibold text-slate-500">
                    No crawler runs yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
