import type { CrawlCandidate, CrawlSourceDefinition } from "@/lib/crawler/types";
import { reviewCrawlCandidate } from "@/lib/crawler/ai-review";
import { createEventSubmission } from "@/lib/repository";

export async function enqueueCrawlCandidates(source: CrawlSourceDefinition, candidates: CrawlCandidate[]) {
  /*
    Each crawler must respect robots.txt, public terms, and access controls.
    This queue step never publishes events directly; candidates always move
    through admin review and duplicate detection first.
  */
  const queued = [];

  for (const candidate of candidates) {
    const review = await reviewCrawlCandidate(source, candidate);
    if (!review.isKitesurfing || review.confidence < 55) continue;

    queued.push(
      await createEventSubmission({
        ...candidate,
        description: `AI summary: ${review.summary}\n\nAI relevance: ${review.confidence}% - ${review.reason}`,
        contactEmail: candidate.contactEmail ?? "crawler@kitecalendar.com",
        sourceType: "crawled",
        crawledAt: new Date().toISOString(),
      }),
    );
  }

  return queued;
}
