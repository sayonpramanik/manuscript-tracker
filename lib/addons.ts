import type { AddonManifest } from "./types";

export const ADDONS: AddonManifest[] = [
  { id: "project-core", name: "Publication Project Core", category: "Workflow", description: "Tasks, milestones, dependencies, assignments, comments and portfolio metrics.", availability: "Included", permission: "Reads and writes local project records", free: true },
  { id: "local-compliance", name: "Source-backed Compliance", category: "Publishing", description: "Local deterministic checks against pasted journal or call requirements.", availability: "Included", permission: "Reads the selected manuscript and guideline text in this browser", free: true },
  { id: "openalex-radar", name: "OpenAlex Research Radar", category: "Discovery", description: "Find recent literature matching portfolio terms with transparent source links.", availability: "Included", permission: "Sends keywords to OpenAlex when refreshed", free: true },
  { id: "notion", name: "Notion Export", category: "Workflow", description: "Send a manuscript project record to a configured Notion data source.", availability: "Connector", permission: "Sends the selected project to your configured Notion workspace", free: true },
  { id: "zotero", name: "Zotero Two-way Sync", category: "References", description: "Planned version-aware library and collection synchronisation with conflict review.", availability: "Planned", permission: "Would read and write only authorised Zotero libraries", free: true },
  { id: "overleaf", name: "Overleaf Link", category: "Writing", description: "Planned manuscript status, version and collaborator bridge without replacing Overleaf.", availability: "Planned", permission: "Would access only linked projects", free: false },
  { id: "cocalc", name: "CoCalc Workspace", category: "Writing", description: "Planned bridge for computational files, notebooks and LaTeX projects.", availability: "Planned", permission: "Would access only linked CoCalc projects", free: false },
  { id: "similarity", name: "Licensed Similarity Check", category: "Integrity", description: "Planned connector for institutional iThenticate or another licensed similarity service.", availability: "Planned", permission: "Would send a manuscript only after explicit approval", free: false },
  { id: "ai-ledger", name: "AI-use Provenance Ledger", category: "Integrity", description: "Planned record of assisted actions and journal-specific disclosure preparation—not an accusation detector.", availability: "Planned", permission: "Would store author-approved provenance records", free: true },
];
