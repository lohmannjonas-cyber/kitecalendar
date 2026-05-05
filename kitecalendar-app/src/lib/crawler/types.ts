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
  termsNote: string;
  crawl(): Promise<CrawlCandidate[]>;
};
