import { describe, expect, it } from "vitest";
import { fromWorkspaceJson, toWorkspaceJson } from "./backup";
import { seedManuscripts } from "./seed";

describe("full workspace backup", () => {
  it("round-trips project tasks and compliance data", () => {
    const source = [{ ...seedManuscripts[0], complianceChecks: [{ id: "one", category: "Test", requirement: "Present", status: "pass" as const, evidence: "Found", suggestion: "None", sourceUrl: "https://example.org" }] }];
    const [restored] = fromWorkspaceJson(toWorkspaceJson(source));
    expect(restored.tasks.length).toBeGreaterThan(0);
    expect(restored.complianceChecks[0].status).toBe("pass");
  });

  it("rejects unrelated JSON", () => {
    expect(() => fromWorkspaceJson('{"items":[]}')).toThrow("not an R-MANTRA");
  });
});
