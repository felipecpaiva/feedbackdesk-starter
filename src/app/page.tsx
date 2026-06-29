import { listFeedback } from "@/lib/store";
import { FeedbackRow } from "@/components/feedback-row";

export default function Home() {
  const items = listFeedback();
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">FeedbackDesk</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Incoming customer feedback. Triage each item into a category and a
          one-line summary.
        </p>
      </header>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <FeedbackRow item={item} />
          </li>
        ))}
      </ul>
    </main>
  );
}
