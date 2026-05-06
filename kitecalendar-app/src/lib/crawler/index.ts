import { enqueueCrawlCandidates } from "@/lib/crawler/duplicate";
import { officialCalendarSources } from "@/lib/crawler/sources/official-calendars";
import type { CrawlRunResult, CrawlSourceDefinition } from "@/lib/crawler/types";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const crawlerSources: CrawlSourceDefinition[] = [...officialCalendarSources];

export async function syncCrawlerSources() {
  if (!hasDatabaseUrl()) return crawlerSources;

  for (const source of crawlerSources) {
    const existing = await prisma.crawlSource.findUnique({ where: { id: source.id } });

    if (!existing) {
      await prisma.crawlSource.create({
        data: {
          id: source.id,
          name: source.name,
          baseUrl: source.baseUrl,
          sourceType: source.kind,
          crawlFrequency: source.crawlFrequency,
          parserType: source.parserType,
          confidence: source.confidence,
          termsNote: source.termsNote,
          isActive: true,
        },
      });
    }
  }

  return crawlerSources;
}

export async function runDiscoveryCrawl(sourceId?: string) {
  await syncCrawlerSources();
  const sources = await getRunnableSources(sourceId);
  const results: CrawlRunResult[] = [];

  for (const source of sources) {
    const runId = await startRun(source);
    if (source.robotsPolicy !== "checked-allow") {
      // Sources marked must-check do the actual robots lookup inside their fetch helper.
    }

    try {
      const candidates = await source.crawl();
      const queued = await enqueueCrawlCandidates(source, candidates);
      const duplicates = queued.filter((item) => item.reviewStatus === "duplicate").length;
      const result: CrawlRunResult = {
        source: source.name,
        sourceId: source.id,
        status: "success",
        found: candidates.length,
        queued: queued.length,
        duplicates,
      };
      await finishRun(runId, source, result);
      results.push(result);
    } catch (error) {
      const result: CrawlRunResult = {
        source: source.name,
        sourceId: source.id,
        status: "failed",
        found: 0,
        queued: 0,
        duplicates: 0,
        message: error instanceof Error ? error.message : "Unknown crawl error",
      };
      await finishRun(runId, source, result);
      results.push(result);
    }
  }

  return results;
}

async function getRunnableSources(sourceId?: string) {
  if (!hasDatabaseUrl()) return crawlerSources.filter((source) => !sourceId || source.id === sourceId);

  const records = await prisma.crawlSource.findMany({
    where: {
      ...(sourceId ? { id: sourceId } : undefined),
      isActive: true,
    },
  });
  const definitionById = new Map(crawlerSources.map((definition) => [definition.id, definition]));

  return records.map((record): CrawlSourceDefinition => {
    const definition = definitionById.get(record.id) ?? createDatabaseSourceDefinition(record);

    return {
      ...definition,
      name: record.name,
      baseUrl: record.baseUrl,
      kind: record.sourceType as CrawlSourceDefinition["kind"],
      crawlFrequency: record.crawlFrequency as CrawlSourceDefinition["crawlFrequency"],
      parserType: record.parserType as CrawlSourceDefinition["parserType"],
      confidence: record.confidence,
      termsNote: record.termsNote ?? definition.termsNote,
    };
  });
}

function createDatabaseSourceDefinition(record: {
  id: string;
  name: string;
  baseUrl: string;
  sourceType: string;
  crawlFrequency: string;
  parserType: string;
  confidence: number;
  termsNote: string | null;
}): CrawlSourceDefinition {
  return {
    id: record.id,
    name: record.name,
    baseUrl: record.baseUrl,
    kind: record.sourceType as CrawlSourceDefinition["kind"],
    robotsPolicy: "must-check",
    crawlFrequency: record.crawlFrequency as CrawlSourceDefinition["crawlFrequency"],
    parserType: record.parserType as CrawlSourceDefinition["parserType"],
    confidence: record.confidence,
    termsNote: record.termsNote ?? "Custom source added in admin. Crawl public pages only and review all candidates.",
    async crawl() {
      const { extractJsonLdEvents, extractTitleDateCandidates } = await import("@/lib/crawler/parsers");
      const { fetchPublicHtml } = await import("@/lib/crawler/robots");
      const { html } = await fetchPublicHtml(this.baseUrl);
      if (!html) return [];

      const defaults = {
        eventTypeSlug: "community-meetup",
        organizerName: this.name,
        brandNames: ["Other"],
      };
      const jsonLd = extractJsonLdEvents(html, this, defaults);
      if (jsonLd.length) return jsonLd;

      return extractTitleDateCandidates(html, this, defaults);
    },
  };
}

async function startRun(source: CrawlSourceDefinition) {
  if (!hasDatabaseUrl()) return undefined;
  const run = await prisma.crawlerRun.create({
    data: {
      sourceId: source.id,
      status: "running",
    },
  });
  return run.id;
}

async function finishRun(runId: string | undefined, source: CrawlSourceDefinition, result: CrawlRunResult) {
  if (!hasDatabaseUrl() || !runId) return;

  await prisma.crawlerRun.update({
    where: { id: runId },
    data: {
      status: result.status,
      finishedAt: new Date(),
      eventsFound: result.found,
      eventsQueued: result.queued,
      duplicates: result.duplicates,
      errorMessage: result.message,
      log: result as unknown as object,
    },
  });

  await prisma.crawlSource.update({
    where: { id: source.id },
    data: {
      lastCrawledAt: new Date(),
      robotsCheckedAt: new Date(),
    },
  });
}

/*
  Adding a real crawler:
  - Create a file in src/lib/crawler/sources.
  - Check robots.txt and public terms before fetching.
  - Fetch only public pages and use respectful rate limits.
  - Normalize found data into CrawlCandidate.
  - Add the source to crawlerSources above.
*/
