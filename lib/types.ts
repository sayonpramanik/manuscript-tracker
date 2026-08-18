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

export const TASK_STATUSES = ["Backlog", "Ready", "In progress", "Review", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type ProjectTask = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  milestone: string;
  dependsOn: string[];
  priority: "Low" | "Medium" | "High";
};

export type Milestone = {
  id: string;
  title: string;
  date: string;
  complete: boolean;
};

export type Collaborator = {
  id: string;
  name: string;
  role: string;
  creditRole: string;
};

export type ProjectComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  parentId?: string;
};

export type ComplianceStatus = "pass" | "missing" | "review" | "not-checkable";

export type ComplianceCheck = {
  id: string;
  category: string;
  requirement: string;
  status: ComplianceStatus;
  evidence: string;
  suggestion: string;
  sourceUrl: string;
};

export type GuidelineProfile = {
  sourceUrl: string;
  sourceLabel: string;
  retrievedAt: string;
  guidelineText: string;
};

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
  tasks: ProjectTask[];
  milestones: Milestone[];
  collaborators: Collaborator[];
  comments: ProjectComment[];
  guideline: GuidelineProfile;
  manuscriptText: string;
  complianceChecks: ComplianceCheck[];
  enabledAddons: string[];
};

export type AddonManifest = {
  id: string;
  name: string;
  category: "Writing" | "References" | "Discovery" | "Integrity" | "Workflow" | "Publishing";
  description: string;
  availability: "Included" | "Connector" | "Planned";
  permission: string;
  free: boolean;
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
