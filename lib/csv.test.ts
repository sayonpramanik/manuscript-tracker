import { describe, expect, it } from "vitest";
import { fromCsv, toCsv } from "./csv";
import type { Manuscript } from "./types";

describe("CSV portability", () => {
  it("round-trips commas, quotes and arrays", () => {
    const manuscript: Manuscript = {
      id: "paper-1",
      title: 'Maps, movement and "meaning"',
      shortTitle: "Maps and movement",
      stage: "Submitted",
      journal: "Urban Studies",
      nextAction: "Wait for editor",
      deadline: "2026-09-01",
      keywords: ["maps", "movement"],
      coauthors: ["Author One", "Author Two"],
      updatedAt: "2026-08-18T10:00:00Z",
      notes: "Portable record",
    };

    const [result] = fromCsv(toCsv([manuscript]));
    expect(result.title).toBe(manuscript.title);
    expect(result.keywords).toEqual(manuscript.keywords);
    expect(result.coauthors).toEqual(manuscript.coauthors);
    expect(result.stage).toBe("Submitted");
  });
});
