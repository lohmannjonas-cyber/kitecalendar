import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateReviewStatus } from "@/lib/repository";
import type { ReviewStatus } from "@/lib/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as { status?: ReviewStatus; reviewerNote?: string };
  if (!body.status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

  const submission = await updateReviewStatus(id, body.status, body.reviewerNote);
  return NextResponse.json({ submission });
}
