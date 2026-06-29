import seed from "../../data/feedback.json";
import type { Feedback, TriageResult } from "./types";

// ponytail: in-memory store seeded from data/feedback.json. Persists for the
// dev-server lifetime; a restart resets it. Swap for SQLite/Prisma only if
// cross-restart persistence is ever needed — for this app it is not.
const feedback: Feedback[] = (seed as Feedback[]).map((f) => ({ ...f }));

export function listFeedback(): Feedback[] {
  return feedback;
}

export function getFeedback(id: string): Feedback | undefined {
  return feedback.find((f) => f.id === id);
}

/** Apply a triage result to an item and mark it triaged. Returns the updated item. */
export function applyTriage(id: string, result: TriageResult): Feedback | undefined {
  const item = feedback.find((f) => f.id === id);
  if (!item) return undefined;
  item.category = result.category;
  item.summary = result.summary;
  item.status = "triaged";
  return item;
}
