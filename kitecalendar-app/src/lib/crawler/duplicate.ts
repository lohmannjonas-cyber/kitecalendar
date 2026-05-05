import type { CrawlCandidate, CrawlSourceDefinition } from "@/lib/crawler/types";
import { createEventSubmission } from "@/lib/repository";

export async function enqueueCrawlCandidates(source: CrawlSourceDefinition, candidates: CrawlCandidate[]) {
  /*
    Each crawler must respect robots.txt, public terms, and access controls.
    This queue step never publishes events directly; candidates always move
    through admin review and duplicate detection first.
  */
  return Promise.all(
    candidates.map((candidate) =>
      createEventSubmission({
        ...candidate,
        contactEmail: candidate.contactEmail ?? "crawler@kitecalendar.com",
        sourceType: "crawled",
        crawledAt: new Date().toISOString(),
      }),
    ),
  );
}
