import type { ComplianceCheck, Manuscript } from "./types";

const countWords = (value: string) => value.trim().match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu)?.length ?? 0;

function contains(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function check(
  id: string,
  category: string,
  requirement: string,
  status: ComplianceCheck["status"],
  evidence: string,
  suggestion: string,
  sourceUrl: string,
): ComplianceCheck {
  return { id, category, requirement, status, evidence, suggestion, sourceUrl };
}

export function extractWordLimit(guidelines: string): number | null {
  const amount = "(\\d{1,3}(?:,\\d{3})+|\\d{3,6})";
  const patterns = [
    new RegExp(`(?:maximum|max(?:imum)?|limit(?:ed)?\\s+to|not\\s+exceed(?:ing)?)\\D{0,24}${amount}\\s*words?`, "i"),
    new RegExp(`word\\s*(?:count|limit)\\D{0,12}${amount}`, "i"),
    new RegExp(`${amount}[-\\s]?word\\s+(?:limit|maximum)`, "i"),
  ];
  for (const pattern of patterns) {
    const match = guidelines.match(pattern);
    if (match) return Number(match[1].replaceAll(",", ""));
  }
  return null;
}

export function runComplianceChecks(manuscript: Manuscript): ComplianceCheck[] {
  const text = manuscript.manuscriptText.trim();
  const rules = manuscript.guideline.guidelineText.trim();
  const sourceUrl = manuscript.guideline.sourceUrl;
  const wordCount = countWords(text);
  const wordLimit = extractWordLimit(rules);
  const results: ComplianceCheck[] = [];

  results.push(check(
    "word-limit",
    "Length",
    wordLimit ? `Manuscript does not exceed ${wordLimit.toLocaleString()} words` : "Journal word limit",
    !wordLimit ? "not-checkable" : wordCount <= wordLimit ? "pass" : "missing",
    !wordLimit ? "No numeric word limit was recognised in the supplied guidelines." : `${wordCount.toLocaleString()} words detected.`,
    !wordLimit ? "Confirm the word limit against the official journal page." : `Reduce the manuscript by ${(wordCount - wordLimit).toLocaleString()} words or confirm what the journal excludes from its count.`,
    sourceUrl,
  ));

  const requirements = [
    {
      id: "abstract",
      category: "Structure",
      label: "Abstract",
      ruleTerms: ["abstract"],
      manuscriptTerms: ["abstract"],
      suggestion: "Add an abstract using the journal's required structure and length.",
    },
    {
      id: "keywords",
      category: "Metadata",
      label: "Keywords",
      ruleTerms: ["keyword", "key word"],
      manuscriptTerms: ["keywords", "key words"],
      suggestion: "Add the requested number of keywords and confirm any controlled vocabulary.",
    },
    {
      id: "data-availability",
      category: "Declarations",
      label: "Data availability statement",
      ruleTerms: ["data availability", "data sharing statement"],
      manuscriptTerms: ["data availability", "data sharing"],
      suggestion: "Add a data availability statement or a justified restriction statement.",
    },
    {
      id: "funding",
      category: "Declarations",
      label: "Funding statement",
      ruleTerms: ["funding statement", "funding information", "source of funding"],
      manuscriptTerms: ["funding", "financial support"],
      suggestion: "Add funder names and grant identifiers, or state that no external funding was received.",
    },
    {
      id: "conflicts",
      category: "Declarations",
      label: "Conflict-of-interest declaration",
      ruleTerms: ["conflict of interest", "competing interest"],
      manuscriptTerms: ["conflict of interest", "competing interest"],
      suggestion: "Add the journal's required declaration, including a no-conflict statement when applicable.",
    },
    {
      id: "author-contributions",
      category: "Authorship",
      label: "Author contribution statement",
      ruleTerms: ["author contribution", "contributorship", "credit taxonomy", "credit roles"],
      manuscriptTerms: ["author contribution", "contributorship", "credit taxonomy"],
      suggestion: "Add a contribution statement and reconcile it with the project's recorded CRediT roles.",
    },
    {
      id: "references",
      category: "References",
      label: "Reference list",
      ruleTerms: ["reference", "bibliography"],
      manuscriptTerms: ["references", "bibliography"],
      suggestion: "Add or identify the reference list and verify that every citation resolves.",
    },
  ];

  for (const requirement of requirements) {
    const requested = contains(rules, requirement.ruleTerms);
    const present = contains(text, requirement.manuscriptTerms)
      || (requirement.id === "keywords" && manuscript.keywords.length > 0);
    results.push(check(
      requirement.id,
      requirement.category,
      requirement.label,
      !requested ? "not-checkable" : present ? "pass" : "missing",
      !requested
        ? "This requirement was not recognised in the supplied guideline text."
        : present
          ? "A matching section or field was detected; its content still needs author review."
          : "No matching section or field was detected.",
      !requested ? "Confirm manually against the official source." : requirement.suggestion,
      sourceUrl,
    ));
  }

  results.push(check(
    "semantic-review",
    "Human review",
    "Discipline-specific and semantic requirements",
    "review",
    "Automated checks cannot determine scientific validity, novelty, ethical adequacy or acceptance readiness.",
    "Have the responsible author review the source and record approval before submission.",
    sourceUrl,
  ));

  return results;
}

export function complianceSummary(checks: ComplianceCheck[]) {
  const applicable = checks.filter((item) => item.status === "pass" || item.status === "missing");
  const passed = applicable.filter((item) => item.status === "pass").length;
  return {
    passed,
    missing: applicable.length - passed,
    review: checks.filter((item) => item.status === "review").length,
    notCheckable: checks.filter((item) => item.status === "not-checkable").length,
    score: applicable.length ? Math.round((passed / applicable.length) * 100) : 0,
  };
}
