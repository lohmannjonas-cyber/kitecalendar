import type { CrawlCandidate, CrawlSourceDefinition } from "@/lib/crawler/types";

type ParserDefaults = {
  eventTypeSlug: string;
  organizerName: string;
  country?: string;
  region?: string;
  city?: string;
  spotName?: string;
  latitude?: number;
  longitude?: number;
  brandNames?: string[];
};

export function extractJsonLdEvents(html: string, source: CrawlSourceDefinition, defaults: ParserDefaults): CrawlCandidate[] {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const candidates: CrawlCandidate[] = [];

  for (const match of scripts) {
    const raw = decodeHtml(match[1].trim());
    const parsed = safeJson(raw);
    for (const item of flattenJsonLd(parsed)) {
      if (!isEventNode(item)) continue;
      const title = stringValue(item.name);
      const startDate = stringValue(item.startDate);
      if (!title || !startDate) continue;

      const endDate = stringValue(item.endDate) ?? startDate;
      const location = item.location && typeof item.location === "object" ? (item.location as Record<string, unknown>) : {};
      const address = location.address && typeof location.address === "object" ? (location.address as Record<string, unknown>) : {};
      const geo = location.geo && typeof location.geo === "object" ? (location.geo as Record<string, unknown>) : {};
      const sourceUrl = stringValue(item.url) ?? source.baseUrl;

      candidates.push({
        title,
        description: stringValue(item.description) ?? `Candidate discovered from ${source.name}. Verify details before publishing.`,
        startDate: toIso(startDate),
        endDate: toIso(endDate),
        country: stringValue(address.addressCountry) ?? defaults.country ?? "Unknown",
        region: stringValue(address.addressRegion) ?? defaults.region,
        city: stringValue(address.addressLocality) ?? defaults.city ?? "Unknown",
        spotName: stringValue(location.name) ?? defaults.spotName,
        latitude: numberValue(geo.latitude) ?? defaults.latitude,
        longitude: numberValue(geo.longitude) ?? defaults.longitude,
        eventTypeSlug: defaults.eventTypeSlug,
        organizerName: defaults.organizerName,
        organizerWebsite: source.baseUrl,
        brandNames: defaults.brandNames ?? ["Other"],
        sourceUrl,
      });
    }
  }

  return candidates;
}

export function extractTitleDateCandidates(html: string, source: CrawlSourceDefinition, defaults: ParserDefaults): CrawlCandidate[] {
  const text = decodeHtml(stripTags(html)).replace(/\s+/g, " ");
  const currentYear = new Date().getUTCFullYear();
  const datePatterns = [
    /([A-Z][A-Za-z0-9 '&|.-]{8,90}?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:\s*[-]\s*(?:\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}))?,?\s+20\d{2})/gi,
    /([A-Z][A-Za-z0-9 '&|.-]{8,90}?)\s+(\d{1,2}\.?\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Januar|Februar|Marz|Mai|Juni|Juli|Oktober|Dezember)[a-z]*\.?(?:\s*[-]\s*\d{1,2}\.?\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Januar|Februar|Marz|Mai|Juni|Juli|Oktober|Dezember)[a-z]*\.?)?)?,?\s+20\d{2})/gi,
    /([A-Z][A-Za-z0-9 '&|.-]{8,90}?)\s+(\d{1,2}[./]\d{1,2}[./]20\d{2}(?:\s*[-]\s*\d{1,2}[./]\d{1,2}[./]20\d{2})?)/gi,
  ];
  const matches = datePatterns.flatMap((pattern) => [...text.matchAll(pattern)]).slice(0, 12);

  return matches
    .map((match) => {
      const title = cleanupTitle(match[1]);
      const dates = parseDateRange(match[2], currentYear);
      if (!title || !dates) return undefined;

      return {
        title,
        description: `Candidate discovered from ${source.name}. Verify title, dates, location, and organizer before publishing.`,
        startDate: dates.startDate,
        endDate: dates.endDate,
        country: defaults.country ?? "Unknown",
        region: defaults.region,
        city: defaults.city ?? "Unknown",
        spotName: defaults.spotName,
        latitude: defaults.latitude,
        longitude: defaults.longitude,
        eventTypeSlug: defaults.eventTypeSlug,
        organizerName: defaults.organizerName,
        organizerWebsite: source.baseUrl,
        brandNames: defaults.brandNames ?? ["Other"],
        sourceUrl: source.baseUrl,
      } satisfies CrawlCandidate;
    })
    .filter(Boolean) as CrawlCandidate[];
}

export function extractEventLikeLinks(html: string, baseUrl: string, limit = 6) {
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      try {
        const url = new URL(decodeHtml(match[1]), baseUrl);
        const label = decodeHtml(stripTags(match[2])).replace(/\s+/g, " ").trim();
        return { url: url.toString(), label };
      } catch {
        return undefined;
      }
    })
    .filter((link): link is { url: string; label: string } => Boolean(link));

  const keywords = /(event|events|calendar|agenda|competition|competitions|world-cup|worldcup|veranstaltung|termine|kalender|camp|demo)/i;
  const seen = new Set<string>();
  return links
    .filter((link) => keywords.test(link.url) || keywords.test(link.label))
    .filter((link) => {
      if (seen.has(link.url)) return false;
      seen.add(link.url);
      return true;
    })
    .slice(0, limit)
    .map((link) => link.url);
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function flattenJsonLd(value: unknown): Record<string, unknown>[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (typeof value !== "object") return [];
  const object = value as Record<string, unknown>;
  const graph = object["@graph"];
  return [object, ...flattenJsonLd(graph)];
}

function isEventNode(value: Record<string, unknown>) {
  const type = value["@type"];
  if (Array.isArray(type)) return type.some((item) => String(item).toLowerCase() === "event");
  return String(type).toLowerCase() === "event";
}

function stringValue(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}

function numberValue(value: unknown) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toIso(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function stripTags(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, " ");
}

function cleanupTitle(value: string) {
  return value.replace(/\b(events?|calendar|agenda|schedule)\b/gi, "").replace(/\s+/g, " ").trim();
}

function parseDateRange(value: string, fallbackYear: number) {
  const normalized = value.replace(/Sept/i, "Sep").replace(/\u2013/g, "-");
  const numeric = parseNumericDateRange(normalized);
  if (numeric) return numeric;

  const yearMatch = normalized.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : fallbackYear;
  const clean = normalized.replace(/,?\s*20\d{2}/, "");
  const [startRaw, endRaw] = clean.split(/\s*-\s*/);
  const start = new Date(`${startRaw} ${year} UTC`);
  if (Number.isNaN(start.getTime())) return undefined;
  const endCandidate = endRaw
    ? new Date(`${endRaw.match(/[A-Za-z]/) ? endRaw : `${startRaw.split(/\s+/)[0]} ${endRaw}`} ${year} UTC`)
    : start;
  const end = Number.isNaN(endCandidate.getTime()) ? start : endCandidate;
  end.setUTCHours(18, 0, 0, 0);
  start.setUTCHours(10, 0, 0, 0);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

function parseNumericDateRange(value: string) {
  const parts = value.match(/\d{1,2}[./]\d{1,2}[./]20\d{2}/g);
  if (!parts?.length) return undefined;
  const start = parseNumericDate(parts[0]);
  const end = parseNumericDate(parts[1] ?? parts[0]);
  if (!start || !end) return undefined;
  start.setUTCHours(10, 0, 0, 0);
  end.setUTCHours(18, 0, 0, 0);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

function parseNumericDate(value: string) {
  const match = value.match(/(\d{1,2})[./](\d{1,2})[./](20\d{2})/);
  if (!match) return undefined;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  return Number.isNaN(date.getTime()) ? undefined : date;
}
