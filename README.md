# FeedbackDesk — pairing exercise

Welcome, and thanks for interviewing with **TribalScale**. This is a small, runnable
full-stack app you'll extend live with your interviewer. There are no trick
questions and nothing to prepare — clone it, get it running, and we'll build a
feature together.

**FeedbackDesk** is an internal tool where a support team reviews incoming
customer feedback. The inbox already works. What's missing is the AI part —
that's what you'll add.

---

## Setup (≈2 minutes)

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

You should see an inbox of ~10 feedback items, each with an empty
**category** and **summary**. The app runs out of the box — no API key needed
yet (it uses a built-in mock).

Useful scripts: `pnpm test` · `pnpm lint` · `pnpm typecheck` · `pnpm build`.

---

## Your task

Add **AI triage** to the inbox:

1. **Wire an AI provider of your choice** into the `triage()` function in
   [`src/lib/llm.ts`](src/lib/llm.ts) (look for `TODO(candidate)`). It should
   take a feedback message and return:
   - a **category** — one of `bug | feature-request | praise | complaint`
   - a **one-line summary**
2. **Add a server endpoint** that triages a single feedback item by id and
   saves the result (use [`applyTriage()`](src/lib/store.ts)). Mirror the
   existing [`GET /api/feedback`](src/app/api/feedback/route.ts) pattern — a
   Route Handler or a Server Action are both fine.
3. **Add a "Triage with AI" button** to each row in
   [`src/components/feedback-row.tsx`](src/components/feedback-row.tsx). On
   click: show a loading state, call your endpoint, then render the returned
   category badge + summary (and handle the error path).

### Bring your own AI provider

We don't ship a key. Use whatever you're comfortable with — **Claude, OpenAI,
Gemini, or a local model**. Install its SDK (e.g. `pnpm add @anthropic-ai/sdk`
or `pnpm add openai`), copy `.env.local.example` to `.env.local`, and put your
key there. `.env.local` is gitignored — **don't commit your key.**

> No provider handy, or it's not cooperating? The built-in mock keeps the app
> fully working, so you can still build the endpoint and the UI and we'll talk
> through the provider wiring. Wiring a real one is a bonus, not a blocker.

### What we care about

Working software, sensible reuse of what's already here, keeping the AI call on
the server, validating what the model returns, and a tidy happy + error path.
**Use your AI coding assistant openly** — Copilot, Claude, Cursor, whatever you
use day to day. We're interested in *how* you work with it, not whether you
use it.

---

## Submitting

When you're done (or time's up), push your work and open a PR **on your own
fork** of this repo, then share the link:

```bash
# after clicking "Fork" on GitHub
git checkout -b ai-triage
git add -A && git commit -m "Add AI triage"
git push -u origin ai-triage
# open the PR against your fork's main
```

That's it — see you in the session. 🎯
