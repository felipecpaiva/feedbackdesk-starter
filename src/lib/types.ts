export const CATEGORIES = [
  "bug",
  "feature-request",
  "praise",
  "complaint",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Feedback = {
  id: string;
  customer: string;
  message: string;
  createdAt: string;
  status: "new" | "triaged";
  // Filled in by the AI-triage feature you will build.
  category?: Category;
  summary?: string;
};

/** The shape an AI triage call must return. */
export type TriageResult = {
  category: Category;
  summary: string;
};
