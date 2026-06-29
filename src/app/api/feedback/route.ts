import { NextResponse } from "next/server";
import { listFeedback } from "@/lib/store";

// GET /api/feedback — returns the current feedback inbox.
// This is the existing pattern. The triage endpoint you build should mirror it.
export async function GET() {
  return NextResponse.json(listFeedback());
}
