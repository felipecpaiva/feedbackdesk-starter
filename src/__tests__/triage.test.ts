import { describe, it, expect } from "vitest";
import { triage, coerceTriage } from "@/lib/llm";
import { CATEGORIES } from "@/lib/types";

// Contract the triage feature must satisfy regardless of which provider is
// wired in. This test passes against the mock and must KEEP passing once a
// real provider replaces it.
describe("triage()", () => {
  it("returns a valid category and a non-empty summary", async () => {
    const result = await triage("The export button does nothing on Safari.");
    expect(CATEGORIES).toContain(result.category);
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(0);
  });
});

describe("coerceTriage()", () => {
  it("accepts a valid object", () => {
    expect(coerceTriage({ category: "bug", summary: "x" })).toEqual({
      category: "bug",
      summary: "x",
    });
  });

  it("rejects an out-of-set category", () => {
    expect(() => coerceTriage({ category: "spam", summary: "x" })).toThrow();
  });

  it("rejects an empty summary", () => {
    expect(() => coerceTriage({ category: "bug", summary: "" })).toThrow();
  });
});
