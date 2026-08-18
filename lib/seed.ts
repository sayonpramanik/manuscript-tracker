import type { Manuscript, RadarItem } from "./types";

const now = new Date();
const isoOffset = (days: number) => {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

export const seedManuscripts: Manuscript[] = [
  {
    id: "demo-spatial-intelligibility",
    title: "Spatial intelligibility and pedestrian movement in complex urban networks",
    shortTitle: "Spatial intelligibility",
    stage: "Drafting",
    journal: "Journal to be selected",
    nextAction: "Complete the methods diagram and circulate it to co-authors",
    deadline: isoOffset(12),
    keywords: ["space syntax", "pedestrian movement", "urban networks"],
    coauthors: ["Co-author A"],
    updatedAt: new Date().toISOString(),
    notes: "Demo record — edit or remove it to begin your own portfolio.",
  },
  {
    id: "demo-spatial-culture",
    title: "Mapping spatial culture through processional routes",
    shortTitle: "Spatial culture",
    stage: "Co-author review",
    journal: "Urban Studies",
    nextAction: "Resolve comments in the discussion section",
    deadline: isoOffset(5),
    keywords: ["spatial culture", "processions", "Kolkata"],
    coauthors: ["Co-author B", "Co-author C"],
    updatedAt: new Date().toISOString(),
    notes: "Demo record.",
  },
  {
    id: "demo-geoai",
    title: "GeoAI methods for interpreting historical street networks",
    shortTitle: "GeoAI methods",
    stage: "Idea",
    journal: "",
    nextAction: "Write a one-page contribution statement",
    deadline: "",
    keywords: ["GeoAI", "historical maps", "urban morphology"],
    coauthors: [],
    updatedAt: new Date().toISOString(),
    notes: "Demo record.",
  },
];

export const seedRadar: RadarItem[] = [
  {
    id: "demo-radar-1",
    title: "New work matching your research terms will appear here",
    authors: "OpenAlex Research Radar",
    publicationDate: isoOffset(-2),
    venue: "Demonstration",
    url: "https://openalex.org/",
    relevance: 92,
    matchedTerms: ["space syntax", "urban networks"],
    isOpenAccess: true,
  },
  {
    id: "demo-radar-2",
    title: "Configure an OpenAlex API key to refresh this feed",
    authors: "Deployment note",
    publicationDate: isoOffset(-5),
    venue: "Demonstration",
    url: "https://developers.openalex.org/quickstart",
    relevance: 84,
    matchedTerms: ["GeoAI"],
    isOpenAccess: true,
  },
];
