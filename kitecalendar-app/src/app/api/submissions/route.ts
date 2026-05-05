import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createEventSubmission, listReviewItems } from "@/lib/repository";

const submissionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  startDate: z.string(),
  endDate: z.string(),
  country: z.string().min(2),
  region: z.string().optional(),
  city: z.string().min(2),
  spotName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  eventTypeSlug: z.string(),
  organizerName: z.string(),
  organizerWebsite: z.string().optional(),
  brandNames: z.array(z.string()).default([]),
  contactEmail: z.string().email(),
  sourceUrl: z.string().optional(),
  sourceType: z.enum(["user_submitted", "crawled", "admin_created"]).default("user_submitted"),
});

export async function GET() {
  return NextResponse.json({ submissions: await listReviewItems() });
}

export async function POST(request: NextRequest) {
  const payload = submissionSchema.parse(await request.json());
  const submission = await createEventSubmission(payload);
  return NextResponse.json({ submission }, { status: 201 });
}
