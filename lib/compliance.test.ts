import { describe, expect, it } from "vitest";
import { complianceSummary, extractWordLimit, runComplianceChecks } from "./compliance";
import { createProjectFields } from "./project";
import type { Manuscript } from "./types";

const manuscript = (manuscriptText: string, guidelineText: string): Manuscript => ({
  id: "paper-1",
  title: "A research article",
  shortTitle: "Research article",
  stage: "Drafting",
  journal: "Test Journal",
  nextAction: "Run preflight",
  deadline: "",
  keywords: ["research"],
  coauthors: [],
  updatedAt: "2026-08-18T10:00:00Z",
  notes: "",
  ...createProjectFields("paper-1", "Research article"),
  manuscriptText,
  guideline: {
    sourceUrl: "https://example.org/guidelines",
    sourceLabel: "Author guidelines",
    retrievedAt: "2026-08-18T10:00:00Z",
    guidelineText,
  },
});

describe("source-backed compliance", () => {
  it("extracts common journal word-limit wording", () => {
    expect(extractWordLimit("The maximum length is 6,000 words")).toBe(6000);
    expect(extractWordLimit("Word limit: 4500")) .toBe(4500);
  });

  it("flags requested declarations that are missing", () => {
    const checks = runComplianceChecks(manuscript(
      "Abstract\nA short abstract.\nKeywords\nresearch\nReferences\nOne reference.",
      "Maximum 1000 words. Include an abstract, keywords, funding statement and conflict of interest declaration.",
    ));
    expect(checks.find((item) => item.id === "abstract")?.status).toBe("pass");
    expect(checks.find((item) => item.id === "funding")?.status).toBe("missing");
    expect(checks.find((item) => item.id === "conflicts")?.sourceUrl).toBe("https://example.org/guidelines");
    expect(complianceSummary(checks).missing).toBeGreaterThan(0);
  });

  it("keeps unrecognised requirements in manual review", () => {
    const checks = runComplianceChecks(manuscript("A manuscript", "Follow the journal house style."));
    expect(checks.find((item) => item.id === "word-limit")?.status).toBe("not-checkable");
    expect(checks.find((item) => item.id === "semantic-review")?.status).toBe("review");
  });
});
