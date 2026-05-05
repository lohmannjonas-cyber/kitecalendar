import type { EventSubmission } from "@/lib/types";

export type CrawlCandidate = Omit<
  EventSubmission,
  "id" | "reviewStatus" | "createdAt" | "updatedAt" | "contactEmail" | "sourceType"
> & {
  sourceUrl: string;
  contactEmail?: string;
};

export type CrawlSourceDefinition = {
  id: string;
  name: string;
  baseUrl: string;
  kind: "brand" | "competition" | "school" | "tourism" | "event-platform";
  robotsPolicy: "must-check" | "checked-allow";
  crawlFrequency: "daily" | "weekly" | "monthly";
  parserType: "json-ld" | "html" | "manual-demo";
  confidence: number;
  termsNote: string;
  crawl(): Promise<CrawlCandidate[]>;
};

export type CrawlRunResult = {
  source: string;
  sourceId: string;
  status: "success" | "skipped" | "failed";
  found: number;
  queued: number;
  duplicates: number;
  robotsAllowed?: boolean;
  message?: string;
};
