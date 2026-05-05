import { enqueueCrawlCandidates } from "@/lib/crawler/duplicate";
import { officialCalendarSources } from "@/lib/crawler/sources/official-calendars";
import type { CrawlRunResult, CrawlSourceDefinition } from "@/lib/crawler/types";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const crawlerSources: CrawlSourceDefinition[] = [...officialCalendarSources];

export async function syncCrawlerSources() {
  if (!hasDatabaseUrl()) return crawlerSources;

  await Promise.all(
    crawlerSources.map((source) =>
      prisma.crawlSource.upsert({
        where: { baseUrl: source.baseUrl },
        update: {
          name: source.name,
          sourceType: source.kind,
          crawlFrequency: source.crawlFrequency,
          parserType: source.parserType,
          confidence: source.confidence,
          termsNote: source.termsNote,
          isActive: true,
        },
        create: {
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
      }),
    ),
  );

  await prisma.crawlSource.updateMany({
    where: {
      baseUrl: { notIn: crawlerSources.map((source) => source.baseUrl) },
    },
    data: { isActive: false },
  });

  return crawlerSources;
}

export async function runDiscoveryCrawl(sourceId?: string) {
  await syncCrawlerSources();
  const sources = crawlerSources.filter((source) => !sourceId || source.id === sourceId);
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
