"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAlertSubscription } from "@/lib/repository";

const alertSchema = z.object({
  email: z.string().email(),
  country: z.string().optional(),
  brandNames: z.array(z.string()).default([]),
  minRating: z.string().optional(),
});

export async function subscribeAlertAction(formData: FormData) {
  const parsed = alertSchema.parse({
    email: formData.get("email"),
    country: formData.get("country") || undefined,
    brandNames: formData.getAll("brandNames"),
    minRating: formData.get("minRating") || undefined,
  });

  await createAlertSubscription(parsed);
  redirect("/events?alert=1");
}
