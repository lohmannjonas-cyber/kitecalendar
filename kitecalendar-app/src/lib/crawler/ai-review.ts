import type { CrawlCandidate, CrawlSourceDefinition } from "@/lib/crawler/types";

export type EventAiReview = {
  isKitesurfing: boolean;
  confidence: number;
  summary: string;
  reason: string;
};

export async function reviewCrawlCandidate(source: CrawlSourceDefinition, candidate: CrawlCandidate): Promise<EventAiReview> {
  if (process.env.OPENAI_API_KEY && process.env.AI_EVENT_REVIEW !== "off") {
    const aiReview = await reviewWithOpenAI(source, candidate).catch(() => undefined);
    if (aiReview) return aiReview;
  }

  return heuristicReview(source, candidate);
}

function heuristicReview(source: CrawlSourceDefinition, candidate: CrawlCandidate): EventAiReview {
  const text = [
    candidate.title,
    candidate.description,
    candidate.eventTypeSlug,
    candidate.organizerName,
    candidate.sourceUrl,
    source.name,
    source.baseUrl,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const positiveTerms = [
    "kite",
    "kitesurf",
    "kiteboard",
    "kiteboarding",
    "formula kite",
    "gka",
    "hydrofoil",
    "twintip",
    "big air",
    "freestyle kite",
    "wing foil",
    "duotone",
    "north kite",
    "core kite",
    "cabrinha",
    "f-one",
    "flysurfer",
    "slingshot",
  ];
  const negativeTerms = ["microsite", "sailing instructions", "notice board", "general tourism", "conference", "hotel", "restaurant"];
  const positives = positiveTerms.filter((term) => text.includes(term)).length;
  const negatives = negativeTerms.filter((term) => text.includes(term)).length;
  const confidence = Math.max(0, Math.min(100, positives * 22 - negatives * 20 + (source.kind === "competition" ? 15 : 0)));
  const isKitesurfing = confidence >= 45;

  return {
    isKitesurfing,
    confidence,
    summary: isKitesurfing
      ? summarizeCandidate(candidate)
      : `Skipped by relevance check: this looks too generic or not clearly related to kitesurfing.`,
    reason: isKitesurfing ? "Keyword relevance matched kite-specific terms." : "No strong kitesurfing signal was found.",
  };
}

async function reviewWithOpenAI(source: CrawlSourceDefinition, candidate: CrawlCandidate): Promise<EventAiReview | undefined> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_EVENT_REVIEW_MODEL ?? "gpt-5.2",
      instructions:
        "You review crawled event candidates for Kitecalendar.com. Return only compact JSON. Decide if the item is genuinely about kitesurfing, kiteboarding, Formula Kite, GKA, kite brand demo events, or kite training camps. Reject general sailing, generic tourism, microsites, shops, articles, unrelated windsurf events, or pages that are not actual events. Write a useful admin-facing event summary, not a request to verify it.",
      input: JSON.stringify({
        source: {
          name: source.name,
          kind: source.kind,
          url: source.baseUrl,
        },
        candidate,
        expectedJson: {
          isKitesurfing: "boolean",
          confidence: "0-100 number",
          summary: "one or two concise sentences describing what the event is, for an admin review card",
          reason: "short reason for the decision",
        },
      }),
      text: {
        format: {
          type: "json_schema",
          name: "kite_event_review",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["isKitesurfing", "confidence", "summary", "reason"],
            properties: {
              isKitesurfing: { type: "boolean" },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              summary: { type: "string" },
              reason: { type: "string" },
            },
          },
          strict: true,
        },
      },
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) return undefined;
  const data = (await response.json()) as { output_text?: string };
  if (!data.output_text) return undefined;
  const parsed = JSON.parse(data.output_text) as EventAiReview;
  if (typeof parsed.isKitesurfing !== "boolean" || typeof parsed.summary !== "string") return undefined;
  return {
    isKitesurfing: parsed.isKitesurfing,
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
    summary: parsed.summary,
    reason: parsed.reason,
  };
}

function summarizeCandidate(candidate: CrawlCandidate) {
  const location = [candidate.spotName, candidate.city, candidate.country].filter(Boolean).join(", ");
  const locationText = location && !location.toLowerCase().includes("unknown") ? ` in ${location}` : "";
  return `${candidate.title} is a ${candidate.eventTypeSlug.replace(/-/g, " ")} candidate${locationText}. Source details suggest it is related to kitesurfing; review the source URL before publishing.`;
}
