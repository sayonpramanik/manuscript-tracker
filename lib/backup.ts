import { normalizeManuscript } from "./project";
import type { Manuscript } from "./types";

export function toWorkspaceJson(manuscripts: Manuscript[]) {
  return JSON.stringify({ schema: "r-mantra-workspace", version: 2, exportedAt: new Date().toISOString(), manuscripts }, null, 2);
}

export function fromWorkspaceJson(value: string): Manuscript[] {
  const parsed = JSON.parse(value) as { schema?: string; manuscripts?: Manuscript[] };
  if (parsed.schema !== "r-mantra-workspace" || !Array.isArray(parsed.manuscripts)) {
    throw new Error("This is not an R-MANTRA workspace backup.");
  }
  return parsed.manuscripts.map(normalizeManuscript);
}
