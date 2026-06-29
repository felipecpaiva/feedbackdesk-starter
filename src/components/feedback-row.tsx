"use client";

import type { Feedback } from "@/lib/types";

const CATEGORY_STYLES: Record<string, string> = {
  bug: "bg-red-500/15 text-red-300 ring-red-500/30",
  "feature-request": "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  praise: "bg-green-500/15 text-green-300 ring-green-500/30",
  complaint: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
};

export function FeedbackRow({ item }: { item: Feedback }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-200">{item.customer}</p>
          <p className="mt-1 text-sm text-neutral-400">{item.message}</p>
        </div>
        {/*
          TODO(candidate): add a "Triage with AI" button here.
          On click it should call the triage endpoint you build, show a loading
          state, then fill in the category badge + summary slots below (and
          handle the error path).
        */}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {item.category ? (
          <span
            className={`rounded-full px-2 py-0.5 ring-1 ring-inset ${
              CATEGORY_STYLES[item.category] ?? "bg-neutral-700 text-neutral-200"
            }`}
          >
            {item.category}
          </span>
        ) : (
          <span className="text-neutral-600">category: —</span>
        )}
        {item.summary ? (
          <span className="text-neutral-300">{item.summary}</span>
        ) : (
          <span className="text-neutral-600">summary: —</span>
        )}
      </div>
    </div>
  );
}
