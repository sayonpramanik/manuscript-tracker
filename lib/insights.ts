import type { Manuscript, PortfolioHealth, RadarItem } from "./types";

const DAY_MS = 86_400_000;

export function daysUntil(date: string, today = new Date()): number | null {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  const anchor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (Number.isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - anchor.getTime()) / DAY_MS);
}

export function calculatePortfolioHealth(
  manuscripts: Manuscript[],
  today = new Date(),
): PortfolioHealth {
  const complete = new Set(["Accepted", "Published"]);
  return {
    active: manuscripts.filter((item) => !complete.has(item.stage)).length,
    approachingDeadlines: manuscripts.filter((item) => {
      const days = daysUntil(item.deadline, today);
      return days !== null && days >= 0 && days <= 14;
    }).length,
    stalled: manuscripts.filter((item) => {
      const changed = new Date(item.updatedAt).getTime();
      return !complete.has(item.stage) && today.getTime() - changed > DAY_MS * 21;
    }).length,
    acceptedOrPublished: manuscripts.filter((item) => complete.has(item.stage)).length,
  };
}

export function scoreRelevance(title: string, keywords: string[]): Pick<RadarItem, "relevance" | "matchedTerms"> {
  const normalized = title.toLowerCase();
  const matchedTerms = keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const relevance = Math.min(99, 55 + matchedTerms.length * 14);
  return { relevance, matchedTerms };
}
