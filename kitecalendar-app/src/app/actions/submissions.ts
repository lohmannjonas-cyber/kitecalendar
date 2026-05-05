"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createEventSubmission } from "@/lib/repository";

const submissionSchema = z.object({
  title: z.string().min(3),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  country: z.string().min(2),
  region: z.string().optional(),
  city: z.string().min(2),
  spotName: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  eventTypeSlug: z.string().min(2),
  organizerName: z.string().min(2),
  organizerWebsite: z.string().url().optional().or(z.literal("")),
  brandNames: z.union([z.array(z.string()), z.string()]).optional(),
  description: z.string().min(20),
  contactEmail: z.string().email(),
});

export async function submitEventAction(formData: FormData) {
  const parsed = submissionSchema.parse({
    title: formData.get("title"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    country: formData.get("country"),
    region: formData.get("region") || undefined,
    city: formData.get("city"),
    spotName: formData.get("spotName") || undefined,
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
    eventTypeSlug: formData.get("eventTypeSlug"),
    organizerName: formData.get("organizerName"),
    organizerWebsite: formData.get("organizerWebsite") || undefined,
    brandNames: formData.getAll("brandNames"),
    description: formData.get("description"),
    contactEmail: formData.get("contactEmail"),
  });

  await createEventSubmission({
    ...parsed,
    organizerWebsite: parsed.organizerWebsite || undefined,
    brandNames: Array.isArray(parsed.brandNames) ? parsed.brandNames : parsed.brandNames ? [parsed.brandNames] : [],
    sourceType: "user_submitted",
  });

  redirect("/submit-event?success=1");
}
