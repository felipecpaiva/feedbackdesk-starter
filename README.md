# FeedbackDesk — pairing exercise

Welcome, and thanks for interviewing with **TribalScale**. This is a small, runnable
full-stack app you will extend live with your interviewer. There are no trick
questions and nothing to prepare. Get it running, have a look around, and we will
build a feature together.

Take your time reading this. It is meant to get you comfortable before the session,
not to test you.

---

## What this project is

**FeedbackDesk** is a small internal tool a support team would use to review
incoming customer feedback. Think of a shared inbox: each item is a message from a
customer (a bug report, a feature idea, some praise, a complaint).

The inbox already works. It lists feedback and shows, for each item, a slot for a
**category** and a **summary** that are currently empty. The job in this exercise is
to fill those in automatically with AI. That part is intentionally missing, and
building it is the exercise.

This is a deliberately tiny app so you can hold all of it in your head in a few
minutes. It is not a trick or a maze.

## Tech stack

- **Next.js 15** (App Router) — the React framework, handles pages and API routes
- **React 19** + **TypeScript** — UI and types
- **Tailwind CSS** — styling (utility classes)
- **Vitest** — tests
- Data lives in a small in-memory store seeded from a JSON file. No database, no
  Docker, nothing to install beyond `pnpm`.

If you have not used Next.js App Router before, that is completely fine. The pieces
you need are small and pointed out below, and you can lean on your AI assistant.

## Quick start

**Prerequisites:** Node 22+ and `pnpm` (`npm install -g pnpm` if you do not have it).
Current pnpm (v11) needs Node 22.13 or newer.

```bash
pnpm install
pnpm dev          # then open http://localhost:3000
```

You should see an inbox of about 10 feedback items, each showing the customer, the
message, and empty **category** and **summary** slots. The app runs out of the box,
**no API key needed yet** (it uses a built-in mock so nothing is blocked).

Other scripts you can run any time:

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Start the dev server with hot reload |
| `pnpm test` | Run the Vitest tests |
| `pnpm lint` | Lint the code |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm build` | Production build (catches type + build errors) |

## Project structure

A quick map so you know where things live. You do not need to touch most of it.

| Path | What it is |
|------|------------|
| `src/app/page.tsx` | The inbox page that lists feedback |
| `src/app/api/feedback/route.ts` | An existing API route that returns the feedback list |
| `src/components/feedback-row.tsx` | One row in the inbox (where the button will go) |
| `src/lib/llm.ts` | The `triage()` function you will wire to an AI provider |
| `src/lib/store.ts` | The in-memory data store (`listFeedback`, `getFeedback`, `applyTriage`) |
| `src/lib/types.ts` | Shared types: `Feedback`, the `CATEGORIES` list, `TriageResult` |
| `data/feedback.json` | The seed data the store loads |

Open these files and read them before you start. They are short, and the comments
point you at what matters.

---

## Your task

Add **AI triage** to the inbox:

1. **Wire an AI provider of your choice** into the `triage()` function in
   [`src/lib/llm.ts`](src/lib/llm.ts) (look for `TODO(candidate)`). It should
   take a feedback message and return:
   - a **category**, one of `bug | feature-request | praise | complaint`
   - a **one-line summary**
2. **Add a server endpoint** that triages a single feedback item by id and
   saves the result (use [`applyTriage()`](src/lib/store.ts)). Mirror the
   existing [`GET /api/feedback`](src/app/api/feedback/route.ts) pattern. A
   Route Handler or a Server Action are both fine.
3. **Add a "Triage with AI" button** to each row in
   [`src/components/feedback-row.tsx`](src/components/feedback-row.tsx). On
   click: show a loading state, call your endpoint, then render the returned
   category badge + summary (and handle the error path).

A suggested order if you are not sure where to begin: get the app running, read the
files above, then pick whichever of the three steps you feel most comfortable
starting with. There is no single "right" path through it.

### Bring your own AI provider

We do not ship a key. Use whatever you are comfortable with: **Claude, OpenAI,
Gemini, or a local model.** Install its SDK (for example `pnpm add @anthropic-ai/sdk`
or `pnpm add openai`), copy `.env.local.example` to `.env.local`, and put your key
there. `.env.local` is gitignored, so **do not commit your key.**

> No provider handy, or it is not cooperating? The built-in mock keeps the app
> fully working, so you can still build the endpoint and the UI and we will talk
> through the provider wiring. Wiring a real one is a bonus, not a blocker.

### What we care about

Working software, sensible reuse of what is already here, keeping the AI call on
the server, validating what the model returns, and a tidy happy + error path.
**Use your AI coding assistant openly:** Copilot, Claude, Cursor, whatever you use
day to day. We are interested in *how* you work with it, not whether you use it.

---

## Tips for the session

- **Think out loud.** We care more about how you reason than about a perfect diff.
- **Use your AI assistant freely**, and tell us how you are checking what it gives
  back. That is a plus, not a minus.
- **Commit in small steps** so it is easy to follow your progress.
- **Ask questions.** Pairing is collaborative; we are on your side.
- **The mock is your friend.** If your provider misbehaves, fall back to it and keep
  moving.
- **You do not have to finish.** Getting partway with clear thinking is a strong
  result.

## Troubleshooting / FAQ

- **Do I need an API key to start?** No. The app runs on a mock with no key.
- **Where does my key go?** In `.env.local` (copy from `.env.local.example`). It is
  gitignored. Never commit it, and never expose it to the browser.
- **Which provider should I use?** Any one you like. There is no preferred answer.
- **Port 3000 is in use.** Run `pnpm dev -- -p 3001` (or free the port).
- **`pnpm` not found.** Install it with `npm install -g pnpm`, or use `corepack enable`.
- **Install or build looks odd.** Make sure you are on Node 22+ (`node -v`). Current
  pnpm requires it.
- **I cannot push my branch.** Use the per-candidate repo URL your interviewer
  shares with you, not a clone of the public template. See "Submitting" below.

---

## Submitting

Your interviewer will share a repo URL that you already have push access to.
**Clone it, do not fork it.** Cloning lets you push a branch and open a PR in the
same repo, ideally before we wrap up so we can look at it together.

```bash
git clone <the-repo-url-your-interviewer-shares>
cd <the-folder-it-creates>
git checkout -b ai-triage
pnpm install && pnpm dev          # build the feature
git add -A && git commit -m "Add AI triage"
git push -u origin ai-triage
# then open a PR from the ai-triage branch on GitHub
```

Aim to push and open the PR before the session ends. If you run out of time,
push whatever you have. We care about the thinking, not a perfect diff. See you
in the session.
