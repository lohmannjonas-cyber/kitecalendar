import { endOfMonth, endOfWeek, isAfter, isBefore, parseISO, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { BRANDS, EVENT_TYPES } from "@/lib/constants";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { sampleEvents, sampleSubmissions } from "@/lib/sample-data";
import type { EventFilters, EventSubmission, KiteEvent, ReviewStatus } from "@/lib/types";
import { distanceKm, slugify } from "@/lib/utils";
import { getForecastForEvent } from "@/lib/weather";

const WEEK_STARTS_ON = 1;

export async function listEvents(filters: EventFilters = {}) {
  const events = await getApprovedEvents();
  const enriched = await Promise.all(
    events.map(async (event) => ({
      ...event,
      forecast: await getForecastForEvent(event),
    })),
  );
  return applyEventFilters(enriched, filters).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function getFeaturedEvents() {
  const events = await listEvents();
  return events.filter((event) => event.featured).slice(0, 4);
}

export async function getEventBySlug(slug: string) {
  const events = await listEvents();
  return events.find((event) => event.slug === slug);
}

export async function getEventById(id: string) {
  const events = await listEvents();
  return events.find((event) => event.id === id);
}

export async function listReviewItems(sourceType?: "user_submitted" | "crawled") {
  if (!hasDatabaseUrl()) {
    return sampleSubmissions
      .filter((submission) => !sourceType || submission.sourceType === sourceType)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const submissions = await prisma.eventSubmission.findMany({
    where: sourceType ? { sourceType } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return submissions.map(mapSubmission);
}

export async function listCrawlSources() {
  const { crawlerSources } = await import("@/lib/crawler");

  if (!hasDatabaseUrl()) {
    return crawlerSources.map((source) => ({
      id: source.id,
      name: source.name,
      baseUrl: source.baseUrl,
      sourceType: source.kind,
      crawlFrequency: source.crawlFrequency,
      parserType: source.parserType,
      confidence: source.confidence,
      robotsCheckedAt: undefined,
      termsNote: source.termsNote,
      isActive: true,
      lastCrawledAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  try {
    const sources = await prisma.crawlSource.findMany({
      orderBy: [{ isActive: "desc" }, { confidence: "desc" }, { name: "asc" }],
    });

    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      baseUrl: source.baseUrl,
      sourceType: source.sourceType,
      crawlFrequency: source.crawlFrequency,
      parserType: source.parserType,
      confidence: source.confidence,
      robotsCheckedAt: source.robotsCheckedAt?.toISOString(),
      termsNote: source.termsNote ?? undefined,
      isActive: source.isActive,
      lastCrawledAt: source.lastCrawledAt?.toISOString(),
      createdAt: source.createdAt.toISOString(),
      updatedAt: source.updatedAt.toISOString(),
    }));
  } catch {
    return crawlerSources.map((source) => ({
      id: source.id,
      name: source.name,
      baseUrl: source.baseUrl,
      sourceType: source.kind,
      crawlFrequency: source.crawlFrequency,
      parserType: source.parserType,
      confidence: source.confidence,
      robotsCheckedAt: undefined,
      termsNote: source.termsNote,
      isActive: true,
      lastCrawledAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
}

export async function listCrawlerRuns(limit = 20) {
  if (!hasDatabaseUrl()) return [];

  try {
    const runs = await prisma.crawlerRun.findMany({
      include: { source: true },
      orderBy: { startedAt: "desc" },
      take: limit,
    });

    return runs.map((run) => ({
      id: run.id,
      sourceName: run.source.name,
      sourceId: run.sourceId,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      finishedAt: run.finishedAt?.toISOString(),
      eventsFound: run.eventsFound,
      eventsQueued: run.eventsQueued,
      duplicates: run.duplicates,
      errorMessage: run.errorMessage ?? undefined,
      robotsAllowed: run.robotsAllowed ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function updateCrawlSource(input: {
  id: string;
  name: string;
  baseUrl: string;
  sourceType: string;
  crawlFrequency: string;
  parserType: string;
  confidence: number;
  termsNote?: string;
  isActive: boolean;
}) {
  if (!hasDatabaseUrl()) return undefined;

  return prisma.crawlSource.update({
    where: { id: input.id },
    data: {
      name: input.name,
      baseUrl: input.baseUrl,
      sourceType: input.sourceType,
      crawlFrequency: input.crawlFrequency,
      parserType: input.parserType,
      confidence: input.confidence,
      termsNote: input.termsNote,
      isActive: input.isActive,
    },
  });
}

export async function createCrawlSource(input: {
  name: string;
  baseUrl: string;
  sourceType: string;
  crawlFrequency: string;
  parserType: string;
  confidence: number;
  termsNote?: string;
  isActive: boolean;
}) {
  if (!hasDatabaseUrl()) return undefined;

  return prisma.crawlSource.create({
    data: input,
  });
}

export async function deleteCrawlSource(id: string) {
  if (!hasDatabaseUrl()) return undefined;

  await prisma.event.updateMany({
    where: { crawlSourceId: id },
    data: { crawlSourceId: null },
  });

  await prisma.crawlerRun.deleteMany({ where: { sourceId: id } });
  return prisma.crawlSource.delete({ where: { id } });
}

export async function createEventSubmission(input: Omit<EventSubmission, "id" | "reviewStatus" | "createdAt" | "updatedAt">) {
  const duplicateOfId = await findDuplicateEventId(input);
  const reviewStatus: ReviewStatus = duplicateOfId ? "duplicate" : "pending";

  if (!hasDatabaseUrl()) {
    return {
      ...input,
      id: `sub-${slugify(input.title)}-${Date.now()}`,
      reviewStatus,
      duplicateOfId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const submission = await prisma.eventSubmission.create({
    data: {
      title: input.title,
      description: input.description,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      country: input.country,
      region: input.region,
      city: input.city,
      spotName: input.spotName,
      latitude: input.latitude,
      longitude: input.longitude,
      eventTypeSlug: input.eventTypeSlug,
      organizerName: input.organizerName,
      organizerWebsite: input.organizerWebsite,
      brandNames: input.brandNames,
      contactEmail: input.contactEmail,
      sourceUrl: input.sourceUrl,
      sourceType: input.sourceType,
      reviewStatus,
      duplicateOfId,
      crawledAt: input.crawledAt ? new Date(input.crawledAt) : undefined,
    },
  });

  return mapSubmission(submission);
}

export async function updateReviewStatus(id: string, reviewStatus: ReviewStatus, reviewerNote?: string) {
  if (!hasDatabaseUrl()) {
    const current = sampleSubmissions.find((submission) => submission.id === id);
    return current ? { ...current, reviewStatus, reviewerNote, updatedAt: new Date().toISOString() } : undefined;
  }

  const submission = await prisma.eventSubmission.update({
    where: { id },
    data: { reviewStatus, reviewerNote },
  });

  if (reviewStatus === "approved") {
    await publishSubmission(submission.id);
  }

  return mapSubmission(submission);
}

export async function updateEvent(input: {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string;
  region?: string;
  city: string;
  spotName?: string;
  latitude: number;
  longitude: number;
  eventTypeSlug: string;
  organizerName: string;
  organizerWebsite?: string;
  brandNames: string[];
}) {
  if (!hasDatabaseUrl()) {
    return getEventById(input.id);
  }

  const eventType = await prisma.eventType.findUnique({ where: { slug: input.eventTypeSlug } });
  if (!eventType) throw new Error(`Unknown event type: ${input.eventTypeSlug}`);

  const updated = await prisma.event.update({
    where: { id: input.id },
    data: {
      title: input.title,
      slug: `${slugify(input.title)}-${new Date(input.startDate).getFullYear()}`,
      description: input.description,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      country: input.country,
      region: input.region,
      city: input.city,
      spotName: input.spotName,
      latitude: input.latitude,
      longitude: input.longitude,
      eventTypeId: eventType.id,
      organizerName: input.organizerName,
      organizerWebsite: input.organizerWebsite,
    },
  });

  const brandRecords = await prisma.brand.findMany({ where: { name: { in: input.brandNames } } });
  await prisma.eventBrand.deleteMany({ where: { eventId: input.id } });
  await prisma.eventBrand.createMany({
    data: brandRecords.map((brand) => ({ eventId: input.id, brandId: brand.id })),
    skipDuplicates: true,
  });

  return updated;
}

export async function deleteEvent(id: string) {
  if (!hasDatabaseUrl()) return undefined;

  return prisma.event.delete({
    where: { id },
  });
}

export async function createAlertSubscription(input: {
  email: string;
  country?: string;
  brandNames: string[];
  minRating?: string;
}) {
  if (!hasDatabaseUrl()) {
    return {
      id: `alert-${Date.now()}`,
      ...input,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }

  return prisma.alertSubscription.create({
    data: input,
  });
}

export async function getAnalytics() {
  const events = await listEvents();
  const reviewItems = await listReviewItems();
  const now = new Date();
  const monthEnd = endOfMonth(now);
  const byCountry = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.country] = (acc[event.country] ?? 0) + 1;
    return acc;
  }, {});

  return {
    approvedEvents: events.length,
    pendingReview: reviewItems.filter((item) => item.reviewStatus === "pending").length,
    duplicateWarnings: reviewItems.filter((item) => item.reviewStatus === "duplicate").length,
    upcomingThisMonth: events.filter((event) => {
      const start = parseISO(event.startDate);
      return isAfter(start, now) && isBefore(start, monthEnd);
    }).length,
    byCountry: Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .map(([country, count]) => ({ country, count })),
  };
}

export function getBrands() {
  return BRANDS;
}

export function getEventTypes() {
  return EVENT_TYPES;
}

async function getApprovedEvents(): Promise<KiteEvent[]> {
  if (!hasDatabaseUrl()) {
    return sampleEvents.filter((event) => event.reviewStatus === "approved");
  }

  const events = await prisma.event.findMany({
    where: { reviewStatus: "approved" },
    include: {
      eventType: true,
      brands: { include: { brand: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    country: event.country,
    region: event.region ?? undefined,
    city: event.city,
    spotName: event.spotName ?? undefined,
    latitude: event.latitude,
    longitude: event.longitude,
    eventType: {
      id: event.eventType.id,
      slug: event.eventType.slug,
      name: event.eventType.name,
      color: event.eventType.color ?? "#0284c7",
    },
    organizerName: event.organizerName,
    organizerWebsite: event.organizerWebsite ?? undefined,
    sourceUrl: event.sourceUrl ?? undefined,
    sourceType: event.sourceType,
    reviewStatus: event.reviewStatus,
    brands: event.brands.map(({ brand }) => ({
      id: brand.id,
      name: brand.name,
      website: brand.website ?? undefined,
      color: brand.color ?? "#0ea5e9",
    })),
    featured: event.featured,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }));
}

function applyEventFilters(events: KiteEvent[], filters: EventFilters) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: WEEK_STARTS_ON });
  const weekEnd = endOfWeek(now, { weekStartsOn: WEEK_STARTS_ON });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const customStart = filters.start ? startOfDay(parseISO(filters.start)) : undefined;
  const customEnd = filters.end ? startOfDay(parseISO(filters.end)) : undefined;

  return events.filter((event) => {
    const searchable = [
      event.title,
      event.country,
      event.region,
      event.city,
      event.spotName,
      event.organizerName,
      event.eventType.name,
      ...event.brands.map((brand) => brand.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const start = parseISO(event.startDate);

    if (filters.q && !searchable.includes(filters.q.toLowerCase())) return false;
    if (filters.country?.length && !filters.country.includes(event.country)) return false;
    if (filters.region && event.region !== filters.region) return false;
    if (filters.city && event.city !== filters.city) return false;
    if (filters.eventType?.length && !filters.eventType.includes(event.eventType.slug)) return false;
    if (filters.brand && !event.brands.some((brand) => brand.id === filters.brand)) return false;

    if (filters.datePreset === "week" && (isBefore(start, weekStart) || isAfter(start, weekEnd))) return false;
    if (filters.datePreset === "month" && (isBefore(start, monthStart) || isAfter(start, monthEnd))) return false;
    if (filters.datePreset === "custom") {
      if (customStart && isBefore(start, customStart)) return false;
      if (customEnd && isAfter(start, customEnd)) return false;
    }

    if (filters.latitude && filters.longitude && filters.distanceKm) {
      const km = distanceKm(
        { latitude: filters.latitude, longitude: filters.longitude },
        { latitude: event.latitude, longitude: event.longitude },
      );
      if (km > filters.distanceKm) return false;
    }

    if (filters.minWind && (!event.forecast || event.forecast.averageKnots < filters.minWind)) return false;
    if (filters.windDirection && (!event.forecast || event.forecast.direction !== filters.windDirection)) return false;

    return true;
  });
}

async function findDuplicateEventId(input: Pick<EventSubmission, "title" | "startDate" | "city" | "spotName" | "sourceUrl">) {
  const events = await getApprovedEvents();
  const titleSlug = slugify(input.title);
  const startDay = input.startDate.slice(0, 10);

  return events.find((event) => {
    const sameSource = input.sourceUrl && event.sourceUrl === input.sourceUrl;
    const sameDate = event.startDate.slice(0, 10) === startDay;
    const samePlace = event.city.toLowerCase() === input.city.toLowerCase() || event.spotName === input.spotName;
    const similarTitle = slugify(event.title).includes(titleSlug) || titleSlug.includes(slugify(event.title));
    return Boolean(sameSource || (sameDate && samePlace && similarTitle));
  })?.id;
}

async function publishSubmission(id: string) {
  if (!hasDatabaseUrl()) return;

  const submission = await prisma.eventSubmission.findUnique({ where: { id } });
  if (!submission) return;

  const eventType = await prisma.eventType.findUnique({ where: { slug: submission.eventTypeSlug } });
  if (!eventType) return;

  const event = await prisma.event.create({
    data: {
      title: submission.title,
      slug: `${slugify(submission.title)}-${submission.startDate.getFullYear()}`,
      description: submission.description,
      startDate: submission.startDate,
      endDate: submission.endDate,
      country: submission.country,
      region: submission.region,
      city: submission.city,
      spotName: submission.spotName,
      latitude: submission.latitude ?? 0,
      longitude: submission.longitude ?? 0,
      eventTypeId: eventType.id,
      organizerName: submission.organizerName,
      organizerWebsite: submission.organizerWebsite,
      sourceUrl: submission.sourceUrl,
      sourceType: submission.sourceType,
      reviewStatus: "approved",
    },
  });

  const brandRecords = await prisma.brand.findMany({ where: { name: { in: submission.brandNames } } });
  await prisma.eventBrand.createMany({
    data: brandRecords.map((brand) => ({ eventId: event.id, brandId: brand.id })),
    skipDuplicates: true,
  });
}

function mapSubmission(submission: {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  country: string;
  region: string | null;
  city: string;
  spotName: string | null;
  latitude: number | null;
  longitude: number | null;
  eventTypeSlug: string;
  organizerName: string;
  organizerWebsite: string | null;
  brandNames: string[];
  contactEmail: string;
  sourceUrl: string | null;
  sourceType: "user_submitted" | "crawled" | "admin_created";
  reviewStatus: "pending" | "approved" | "rejected" | "duplicate";
  duplicateOfId: string | null;
  reviewerNote: string | null;
  crawledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): EventSubmission {
  return {
    id: submission.id,
    title: submission.title,
    description: submission.description,
    startDate: submission.startDate.toISOString(),
    endDate: submission.endDate.toISOString(),
    country: submission.country,
    region: submission.region ?? undefined,
    city: submission.city,
    spotName: submission.spotName ?? undefined,
    latitude: submission.latitude ?? undefined,
    longitude: submission.longitude ?? undefined,
    eventTypeSlug: submission.eventTypeSlug,
    organizerName: submission.organizerName,
    organizerWebsite: submission.organizerWebsite ?? undefined,
    brandNames: submission.brandNames,
    contactEmail: submission.contactEmail,
    sourceUrl: submission.sourceUrl ?? undefined,
    sourceType: submission.sourceType,
    reviewStatus: submission.reviewStatus,
    duplicateOfId: submission.duplicateOfId ?? undefined,
    reviewerNote: submission.reviewerNote ?? undefined,
    crawledAt: submission.crawledAt?.toISOString(),
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  };
}
