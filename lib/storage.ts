import type { Manuscript } from "./types";

export const STORAGE_KEY = "manuscript-tracker:v1";

export function loadManuscripts(fallback: Manuscript[]): Manuscript[] {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveManuscripts(manuscripts: Manuscript[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(manuscripts));
  }
}
