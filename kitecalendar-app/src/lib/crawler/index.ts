import { enqueueCrawlCandidates } from "@/lib/crawler/duplicate";
import { brandCalendarCrawler } from "@/lib/crawler/sources/brand-calendar";
import { tourismEventsCrawler } from "@/lib/crawler/sources/tourism-events";
import type { CrawlSourceDefinition } from "@/lib/crawler/types";

export const crawlerSources: CrawlSourceDefinition[] = [brandCalendarCrawler, tourismEventsCrawler];

export async function runDiscoveryCrawl() {
  const results = [];

  for (const source of crawlerSources) {
    if (source.robotsPolicy !== "checked-allow") {
      results.push({ source: source.name, queued: 0, skipped: "robots.txt not checked" });
      continue;
    }

    const candidates = await source.crawl();
    const queued = await enqueueCrawlCandidates(source, candidates);
    results.push({ source: source.name, queued: queued.length });
  }

  return results;
}

/*
  Adding a real crawler:
  - Create a file in src/lib/crawler/sources.
  - Check robots.txt and public terms before fetching.
  - Fetch only public pages and use respectful rate limits.
  - Normalize found data into CrawlCandidate.
  - Add the source to crawlerSources above.
*/
