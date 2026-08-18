export const STAGES = [
  "Idea",
  "Drafting",
  "Co-author review",
  "Ready to submit",
  "Submitted",
  "Revision requested",
  "Accepted",
  "Published",
] as const;

export type Stage = (typeof STAGES)[number];

export type Manuscript = {
  id: string;
  title: string;
  shortTitle: string;
  stage: Stage;
  journal: string;
  nextAction: string;
  deadline: string;
  keywords: string[];
  coauthors: string[];
  updatedAt: string;
  notes: string;
  doi?: string;
};

export type RadarItem = {
  id: string;
  title: string;
  authors: string;
  publicationDate: string;
  venue: string;
  url: string;
  relevance: number;
  matchedTerms: string[];
  isOpenAccess: boolean;
  saved?: boolean;
};

export type PortfolioHealth = {
  active: number;
  approachingDeadlines: number;
  stalled: number;
  acceptedOrPublished: number;
};
