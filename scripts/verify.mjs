#!/usr/bin/env node
// End-to-end baseline check for the FeedbackDesk starter.
//
//   pnpm verify                 # full check (assumes deps installed)
//   pnpm verify -- --clean      # wipe node_modules/.next and reinstall first (fresh-clone sim)
//   pnpm verify -- --allow-started   # don't fail if the triage feature is already built
//
// Pure Node built-ins so it runs the same on macOS, Linux, and Windows.
// Prints PASS/FAIL per check with a one-line fix; exits non-zero on any failure.

import { spawnSync, spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const allowStarted = argv.includes("--allow-started");
const doClean = argv.includes("--clean");

const results = [];
function check(name, ok, detail, fix) {
  results.push({ name, ok });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok && fix) console.log(`      → ${fix}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tail = (s, n = 25) => (s || "").split("\n").slice(-n).join("\n");
function pnpm(args) {
  // shell:true so Windows resolves pnpm.cmd; args here are simple tokens.
  return spawnSync("pnpm", args, { cwd: ROOT, shell: true, encoding: "utf8" });
}
function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.on("error", rej);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });
}

console.log("FeedbackDesk baseline verification\n");

// 1. Node version
const [maj, min] = process.versions.node.split(".").map(Number);
check(
  "Node >= 22.13",
  maj > 22 || (maj === 22 && min >= 13),
  `found v${process.versions.node}`,
  "use Node 22+ (run `nvm use`, see .nvmrc). Current pnpm needs it; older Node throws cryptic node:sqlite errors."
);

// 2. pnpm + build-script approval
const pv = pnpm(["-v"]);
check("pnpm available", pv.status === 0, pv.status === 0 ? `v${pv.stdout.trim()}` : "not found",
  "install pnpm: `npm i -g pnpm` or `corepack enable`.");
const wsPath = join(ROOT, "pnpm-workspace.yaml");
const ws = existsSync(wsPath) ? readFileSync(wsPath, "utf8") : "";
check("build-script approval present", /allowBuilds:/.test(ws) && /esbuild/.test(ws), undefined,
  "pnpm-workspace.yaml must set allowBuilds for esbuild/sharp/unrs-resolver/@tailwindcss/oxide, else pnpm install fails with ERR_PNPM_IGNORED_BUILDS.");

// optional clean + install
if (doClean) {
  rmSync(join(ROOT, "node_modules"), { recursive: true, force: true });
  rmSync(join(ROOT, ".next"), { recursive: true, force: true });
}
if (!existsSync(join(ROOT, "node_modules"))) {
  const i = pnpm(["install"]);
  const clean = i.status === 0 && !/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts/.test(i.stdout + i.stderr);
  check("pnpm install (clean)", clean, undefined, "see install output; check Node version and allowBuilds.");
  if (!clean) console.log(tail(i.stdout + i.stderr));
}

// 3. static gates
let buildOk = false;
for (const step of ["typecheck", "lint", "test", "build"]) {
  const r = pnpm([step]);
  const ok = r.status === 0;
  check(`pnpm ${step}`, ok, undefined, `run \`pnpm ${step}\` to see the error.`);
  if (step === "build") buildOk = ok;
  if (!ok) console.log(tail(r.stdout + r.stderr));
}

// 4. runtime smoke (needs a successful build)
if (buildOk) {
  const port = await freePort();
  const nextBin = join(ROOT, "node_modules", "next", "dist", "bin", "next");
  const srv = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: ROOT,
    stdio: "ignore",
  });
  try {
    const base = `http://127.0.0.1:${port}`;
    let up = false;
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(base + "/", { signal: AbortSignal.timeout(2000) });
        if (r.status) { up = true; break; }
      } catch {}
      await sleep(500);
    }
    check("dev server boots", up, `port ${port}`, "the production server did not start; check `pnpm build` output.");

    if (up) {
      const home = await fetch(base + "/");
      const html = await home.text();
      check("GET / returns 200", home.status === 200, `status ${home.status}`,
        "a 500 here usually means a browser API (localStorage/window/document) ran during SSR; keep it in an event handler or useEffect.");
      check("/ renders the inbox", html.includes("FeedbackDesk") && html.includes("Dana Whitfield"), undefined,
        "the seeded inbox did not render; check src/app/page.tsx and data/feedback.json.");

      const apiRes = await fetch(base + "/api/feedback");
      let arr = null;
      try { arr = await apiRes.json(); } catch {}
      check("GET /api/feedback returns 10 seed items", Array.isArray(arr) && arr.length === 10,
        Array.isArray(arr) ? `${arr.length} items` : "not an array",
        "check src/app/api/feedback/route.ts and the store seed.");
      const untriaged = Array.isArray(arr) && arr.every((x) => x.category == null && x.summary == null);
      check("baseline items are un-triaged", untriaged || allowStarted,
        untriaged ? undefined : "some items already have category/summary",
        "expected the un-triaged baseline; pass --allow-started if you intentionally built the feature.");
    }
  } finally {
    srv.kill("SIGTERM");
  }
} else {
  check("dev server boots", false, "skipped", "fix `pnpm build` first.");
}

// 5. baseline integrity (the challenge should be unstarted)
const routeExists = existsSync(join(ROOT, "src", "app", "api", "feedback", "[id]", "triage", "route.ts"));
check("challenge is unstarted (triage route absent)", !routeExists || allowStarted,
  routeExists ? "triage route present" : undefined,
  "this is the candidate baseline; pass --allow-started to validate a finished repo.");

// summary
const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length === 0) {
  console.log("✅ all checks passed — the baseline is healthy. Focus on the task.");
  process.exit(0);
} else {
  console.log(`❌ ${failed.length} check(s) failed: ${failed.map((f) => f.name).join(", ")}`);
  process.exit(1);
}
