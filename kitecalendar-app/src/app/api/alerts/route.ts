import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAlertSubscription } from "@/lib/repository";

const alertSchema = z.object({
  email: z.string().email(),
  country: z.string().optional(),
  brandNames: z.array(z.string()).default([]),
  minRating: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const payload = alertSchema.parse(await request.json());
  const subscription = await createAlertSubscription(payload);
  return NextResponse.json({ subscription }, { status: 201 });
}
