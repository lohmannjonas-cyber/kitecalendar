import { Play, Save, ShieldCheck, TimerReset, Trash2 } from "lucide-react";
import { deleteCrawlSourceAction, runCrawlerAction, updateCrawlSourceAction } from "@/app/admin/actions";

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
              <div className="grid gap-4">
                <form action={updateCrawlSourceAction} className="grid gap-3">
                  <input type="hidden" name="id" value={source.id} />
                  <div className="grid gap-3 lg:grid-cols-[1.2fr_2fr]">
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Name
                      <input
                        name="name"
                        defaultValue={source.name}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      URL
                      <input
                        name="baseUrl"
                        type="url"
                        defaultValue={source.baseUrl}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Type
                      <select
                        name="sourceType"
                        defaultValue={source.sourceType}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      >
                        <option value="competition">Competition</option>
                        <option value="brand">Brand</option>
                        <option value="school">School</option>
                        <option value="tourism">Tourism</option>
                        <option value="event-platform">Event platform</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Frequency
                      <select
                        name="crawlFrequency"
                        defaultValue={source.crawlFrequency}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Parser
                      <select
                        name="parserType"
                        defaultValue={source.parserType}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      >
                        <option value="json-ld">JSON-LD</option>
                        <option value="html">HTML</option>
                        <option value="manual-demo">Manual</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Confidence
                      <input
                        name="confidence"
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={source.confidence}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900"
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                    Notes
                    <textarea
                      name="termsNote"
                      defaultValue={source.termsNote}
                      rows={2}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case leading-6 text-slate-700"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      <label className="inline-flex items-center gap-2 rounded-md bg-white px-2 py-1">
                        <input name="isActive" type="checkbox" defaultChecked={source.isActive} className="size-4 accent-sky-600" />
                        Active
                      </label>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1">
                        <TimerReset className="size-3.5" aria-hidden="true" />
                        {source.crawlFrequency}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1">
                        <ShieldCheck className="size-3.5" aria-hidden="true" />
                        robots {source.robotsCheckedAt ? "checked" : "pending"}
                      </span>
                      <span className="rounded-md bg-white px-2 py-1">
                        last crawl {source.lastCrawledAt ? new Date(source.lastCrawledAt).toLocaleString() : "never"}
                      </span>
                    </div>

                    <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-black text-white hover:bg-slate-800">
                      <Save className="size-4" aria-hidden="true" />
                      Save source
                    </button>
                  </div>
                </form>

                <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold text-slate-500">Deleting removes this source and its run history. Existing events stay public.</p>
                  <div className="flex gap-2">
                    <form action={deleteCrawlSourceAction}>
                      <input type="hidden" name="id" value={source.id} />
                      <button className="inline-flex h-10 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-black text-rose-700 hover:bg-rose-50">
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </button>
                    </form>
                    <form action={runCrawlerAction}>
                      <input type="hidden" name="sourceId" value={source.id} />
                      <button className="inline-flex h-10 items-center gap-2 rounded-md border border-sky-200 bg-white px-3 text-sm font-black text-sky-700 hover:bg-sky-50">
                        <Play className="size-4" aria-hidden="true" />
                        Run
                      </button>
                    </form>
                  </div>
                </div>
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
