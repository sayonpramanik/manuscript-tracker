import { describe, expect, it } from "vitest";
import { calculatePortfolioHealth, daysUntil, scoreRelevance } from "./insights";
import type { Manuscript } from "./types";

const base: Manuscript = {
  id: "one",
  title: "Paper",
  shortTitle: "Paper",
  stage: "Drafting",
  journal: "",
  nextAction: "Revise",
  deadline: "2026-08-28",
  keywords: ["urban networks"],
  coauthors: [],
  updatedAt: "2026-08-17T12:00:00Z",
  notes: "",
};

describe("portfolio insights", () => {
  it("counts active work and approaching deadlines", () => {
    const result = calculatePortfolioHealth([base], new Date("2026-08-18T12:00:00Z"));
    expect(result.active).toBe(1);
    expect(result.approachingDeadlines).toBe(1);
    expect(result.stalled).toBe(0);
  });

  it("handles invalid or missing deadlines", () => {
    expect(daysUntil("", new Date("2026-08-18"))).toBeNull();
    expect(daysUntil("not-a-date", new Date("2026-08-18"))).toBeNull();
  });

  it("scores transparent keyword matches", () => {
    const result = scoreRelevance("GeoAI for urban networks", ["GeoAI", "urban networks", "walking"]);
    expect(result.matchedTerms).toEqual(["GeoAI", "urban networks"]);
    expect(result.relevance).toBe(83);
  });
});
