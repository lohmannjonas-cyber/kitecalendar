"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, createAdminSession, requireAdmin, verifyAdminCredentials } from "@/lib/auth";
import { runDiscoveryCrawl } from "@/lib/crawler";
import { deleteCrawlSource, updateCrawlSource, updateEvent, updateReviewStatus } from "@/lib/repository";
import type { ReviewStatus } from "@/lib/types";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const valid = await verifyAdminCredentials(email, password);

  if (!valid) {
    redirect("/admin?error=invalid");
  }

  await createAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function reviewAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ReviewStatus;
  const reviewerNote = String(formData.get("reviewerNote") ?? "");

  await updateReviewStatus(id, status, reviewerNote || undefined);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/crawled-events");
  revalidatePath("/events");
}

const eventEditorSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().min(20),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  country: z.string().min(2),
  region: z.string().optional(),
  city: z.string().min(2),
  spotName: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  eventTypeSlug: z.string(),
  organizerName: z.string().min(2),
  organizerWebsite: z.string().url().optional().or(z.literal("")),
  brandNames: z.array(z.string()).default([]),
});

export async function updateEventAction(formData: FormData) {
  await requireAdmin();

  const parsed = eventEditorSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    country: formData.get("country"),
    region: formData.get("region") || undefined,
    city: formData.get("city"),
    spotName: formData.get("spotName") || undefined,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    eventTypeSlug: formData.get("eventTypeSlug"),
    organizerName: formData.get("organizerName"),
    organizerWebsite: formData.get("organizerWebsite") || undefined,
    brandNames: formData.getAll("brandNames"),
  });

  await updateEvent({
    ...parsed,
    organizerWebsite: parsed.organizerWebsite || undefined,
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function runCrawlerAction(formData: FormData) {
  await requireAdmin();

  const sourceId = String(formData.get("sourceId") ?? "") || undefined;
  await runDiscoveryCrawl(sourceId);

  revalidatePath("/admin/sources");
  revalidatePath("/admin/crawled-events");
  revalidatePath("/admin");
}

const crawlSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  baseUrl: z.string().url(),
  sourceType: z.string().min(2),
  crawlFrequency: z.enum(["daily", "weekly", "monthly"]),
  parserType: z.enum(["json-ld", "html", "manual-demo"]),
  confidence: z.coerce.number().int().min(0).max(100),
  termsNote: z.string().optional(),
  isActive: z.boolean(),
});

export async function updateCrawlSourceAction(formData: FormData) {
  await requireAdmin();

  const parsed = crawlSourceSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    baseUrl: formData.get("baseUrl"),
    sourceType: formData.get("sourceType"),
    crawlFrequency: formData.get("crawlFrequency"),
    parserType: formData.get("parserType"),
    confidence: formData.get("confidence"),
    termsNote: formData.get("termsNote") || undefined,
    isActive: formData.get("isActive") === "on",
  });

  await updateCrawlSource(parsed);

  revalidatePath("/admin/sources");
  revalidatePath("/admin/crawled-events");
}

export async function deleteCrawlSourceAction(formData: FormData) {
  await requireAdmin();

  const id = z.string().min(1).parse(formData.get("id"));
  await deleteCrawlSource(id);

  revalidatePath("/admin/sources");
  revalidatePath("/admin/crawled-events");
  revalidatePath("/admin");
}
