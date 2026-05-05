import { extractJsonLdEvents, extractTitleDateCandidates } from "@/lib/crawler/parsers";
import { fetchPublicHtml } from "@/lib/crawler/robots";
import type { CrawlSourceDefinition } from "@/lib/crawler/types";

function officialCalendarSource(
  definition: Omit<CrawlSourceDefinition, "crawl" | "robotsPolicy" | "parserType" | "confidence" | "crawlFrequency"> & {
    defaults: Parameters<typeof extractJsonLdEvents>[2];
    parserType?: "json-ld" | "html";
    confidence?: number;
    crawlFrequency?: "daily" | "weekly" | "monthly";
  },
): CrawlSourceDefinition {
  return {
    ...definition,
    robotsPolicy: "must-check",
    parserType: definition.parserType ?? "json-ld",
    confidence: definition.confidence ?? 80,
    crawlFrequency: definition.crawlFrequency ?? "daily",
    async crawl() {
      const { html } = await fetchPublicHtml(definition.baseUrl);
      if (!html) return [];

      const jsonLd = extractJsonLdEvents(html, this, definition.defaults);
      if (jsonLd.length) return jsonLd;

      return extractTitleDateCandidates(html, this, definition.defaults);
    },
  };
}

export const officialCalendarSources: CrawlSourceDefinition[] = [
  officialCalendarSource({
    id: "gka-kite-world-tour",
    name: "GKA Kite World Tour",
    baseUrl: "https://www.gkakiteworldtour.com/events/",
    kind: "competition",
    termsNote: "Official public competition calendar. Crawl public pages only; do not bypass access controls.",
    defaults: {
      eventTypeSlug: "competition",
      organizerName: "GKA Kite World Tour",
      brandNames: ["Other"],
    },
    confidence: 92,
  }),
  officialCalendarSource({
    id: "formula-kite-calendar",
    name: "Formula Kite",
    baseUrl: "https://www.formulakite.org/",
    kind: "competition",
    termsNote: "Official public class calendar. Verify extracted dates and locations in review.",
    defaults: {
      eventTypeSlug: "race",
      organizerName: "Formula Kite",
      brandNames: ["Other"],
    },
    confidence: 86,
    crawlFrequency: "weekly",
  }),
  officialCalendarSource({
    id: "kitesurf-masters",
    name: "Kitesurf Masters",
    baseUrl: "https://www.kitesurf-masters.de/",
    kind: "competition",
    termsNote: "Official public event site. Verify partner and schedule details in review.",
    defaults: {
      eventTypeSlug: "competition",
      organizerName: "California Kitesurf Masters",
      country: "Germany",
      brandNames: ["Other"],
    },
    confidence: 82,
    crawlFrequency: "weekly",
  }),
  officialCalendarSource({
    id: "lets-kite-agenda",
    name: "Let's Kite Agenda",
    baseUrl: "https://letskite.ch/en/agenda",
    kind: "event-platform",
    termsNote: "Public agenda source. Use as discovery only; all candidates stay pending admin review.",
    defaults: {
      eventTypeSlug: "festival",
      organizerName: "Let's Kite listed organizer",
      brandNames: ["Other"],
    },
    confidence: 72,
    crawlFrequency: "weekly",
  }),
];
