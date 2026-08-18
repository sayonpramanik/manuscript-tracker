import type {
  Collaborator,
  GuidelineProfile,
  Manuscript,
  Milestone,
  ProjectTask,
} from "./types";

const emptyGuideline = (): GuidelineProfile => ({
  sourceUrl: "",
  sourceLabel: "",
  retrievedAt: "",
  guidelineText: "",
});

export function createProjectFields(
  manuscriptId: string,
  title: string,
  coauthors: string[] = [],
): Pick<
  Manuscript,
  | "tasks"
  | "milestones"
  | "collaborators"
  | "comments"
  | "guideline"
  | "manuscriptText"
  | "complianceChecks"
  | "enabledAddons"
> {
  const collaborators: Collaborator[] = coauthors.map((name, index) => ({
    id: `${manuscriptId}-collaborator-${index + 1}`,
    name,
    role: "Co-author",
    creditRole: "Writing – review & editing",
  }));
  const tasks: ProjectTask[] = [
    {
      id: `${manuscriptId}-task-scope`,
      title: `Confirm the contribution and scope of ${title || "the manuscript"}`,
      status: "Ready",
      assignee: "Lead author",
      dueDate: "",
      milestone: "Internal draft",
      dependsOn: [],
      priority: "High",
    },
    {
      id: `${manuscriptId}-task-guidelines`,
      title: "Capture the target journal's current author guidelines",
      status: "Backlog",
      assignee: "Lead author",
      dueDate: "",
      milestone: "Submission ready",
      dependsOn: [`${manuscriptId}-task-scope`],
      priority: "Medium",
    },
  ];
  const milestones: Milestone[] = [
    { id: `${manuscriptId}-milestone-draft`, title: "Internal draft", date: "", complete: false },
    { id: `${manuscriptId}-milestone-submit`, title: "Submission ready", date: "", complete: false },
  ];

  return {
    tasks,
    milestones,
    collaborators,
    comments: [],
    guideline: emptyGuideline(),
    manuscriptText: "",
    complianceChecks: [],
    enabledAddons: ["project-core", "local-compliance", "openalex-radar"],
  };
}

export function normalizeManuscript(value: Manuscript): Manuscript {
  const defaults = createProjectFields(value.id, value.shortTitle || value.title, value.coauthors ?? []);
  return {
    ...value,
    keywords: Array.isArray(value.keywords) ? value.keywords : [],
    coauthors: Array.isArray(value.coauthors) ? value.coauthors : [],
    tasks: Array.isArray(value.tasks) ? value.tasks : defaults.tasks,
    milestones: Array.isArray(value.milestones) ? value.milestones : defaults.milestones,
    collaborators: Array.isArray(value.collaborators) ? value.collaborators : defaults.collaborators,
    comments: Array.isArray(value.comments) ? value.comments : [],
    guideline: value.guideline && typeof value.guideline === "object" ? value.guideline : emptyGuideline(),
    manuscriptText: typeof value.manuscriptText === "string" ? value.manuscriptText : "",
    complianceChecks: Array.isArray(value.complianceChecks) ? value.complianceChecks : [],
    enabledAddons: Array.isArray(value.enabledAddons) ? value.enabledAddons : defaults.enabledAddons,
  };
}
