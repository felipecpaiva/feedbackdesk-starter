import { CATEGORIES, type Category, type TriageResult } from "./types";

/**
 * Triage a piece of customer feedback into a category + one-line summary.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  👋 THIS IS THE ASSIGNMENT SEAM.
 *
 *  Right now this returns a MOCK so the app runs with zero configuration.
 *  Your job: replace the mock body with a real call to an AI provider of YOUR
 *  choice (Claude, OpenAI, Gemini, a local model — whatever you prefer).
 *
 *  Rules:
 *    - This file runs on the SERVER only. Keep it that way: never call a
 *      provider from a `"use client"` component, and never expose the key to
 *      the browser (no NEXT_PUBLIC_* for secrets).
 *    - Read your key from `.env.local` (already gitignored). Do NOT commit it.
 *    - The provider's reply is untrusted: constrain it to the four CATEGORIES
 *      and validate the shape before returning. `coerceTriage()` below helps.
 *    - Install whatever SDK you want, e.g. `pnpm add @anthropic-ai/sdk` or
 *      `pnpm add openai`. None is bundled on purpose.
 * ─────────────────────────────────────────────────────────────────────────
 */
export async function triage(message: string): Promise<TriageResult> {
  // TODO(candidate): wire your AI provider here, then delete mockTriage().
  return mockTriage(message);
}

/**
 * Deterministic stand-in so the app works before a provider is wired.
 * Naive keyword heuristic — good enough to render the UI, not a real model.
 */
export function mockTriage(message: string): TriageResult {
  const text = message.toLowerCase();
  let category: Category = "feature-request";
  if (/(crash|broken|error|does nothing|bug|ignored|logs me out)/.test(text)) {
    category = "bug";
  } else if (/(charged twice|unacceptable|frustrating|terrible|angry|refund)/.test(text)) {
    category = "complaint";
  } else if (/(love|fantastic|great|smooth|kudos|amazing|excellent)/.test(text)) {
    category = "praise";
  }
  const summary =
    message.length > 80 ? message.slice(0, 77).trimEnd() + "…" : message;
  return { category, summary: `[mock] ${summary}` };
}

/**
 * Validate/normalise an untrusted triage object (e.g. parsed from a model
 * response). Throws if it cannot be coerced into a valid TriageResult.
 */
export function coerceTriage(value: unknown): TriageResult {
  if (typeof value !== "object" || value === null) {
    throw new Error("triage result is not an object");
  }
  const { category, summary } = value as Record<string, unknown>;
  if (!CATEGORIES.includes(category as Category)) {
    throw new Error(`category must be one of ${CATEGORIES.join(", ")}`);
  }
  if (typeof summary !== "string" || summary.trim() === "") {
    throw new Error("summary must be a non-empty string");
  }
  return { category: category as Category, summary };
}
