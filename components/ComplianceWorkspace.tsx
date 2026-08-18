"use client";

import { ChangeEvent } from "react";
import { complianceSummary, runComplianceChecks } from "@/lib/compliance";
import type { Manuscript, ProjectTask } from "@/lib/types";

type Props = {
  manuscripts: Manuscript[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Manuscript>) => void;
};

const statusLabel = { pass: "Pass", missing: "Missing", review: "Review", "not-checkable": "Manual" };

export default function ComplianceWorkspace({ manuscripts, selectedId, onSelect, onUpdate }: Props) {
  const selected = manuscripts.find((item) => item.id === selectedId) ?? manuscripts[0];
  if (!selected) return null;
  const summary = complianceSummary(selected.complianceChecks);

  async function loadManuscript(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onUpdate(selected.id, { manuscriptText: (await file.text()).slice(0, 250_000) });
    event.target.value = "";
  }

  function runCheck() {
    onUpdate(selected.id, {
      guideline: { ...selected.guideline, retrievedAt: new Date().toISOString() },
      complianceChecks: runComplianceChecks(selected),
    });
  }

  function createTask(requirement: string, suggestion: string) {
    const task: ProjectTask = {
      id: crypto.randomUUID(), title: `Compliance: ${requirement}`, status: "Ready", assignee: "Lead author", dueDate: selected.deadline,
      milestone: "Submission ready", dependsOn: [], priority: "High",
    };
    onUpdate(selected.id, { tasks: [...selected.tasks, task], nextAction: suggestion });
  }

  return <div className="content compliance-page">
    <div className="page-heading"><div><p className="eyebrow">SOURCE-BACKED PREFLIGHT</p><h1>Journal compliance</h1><p>Compare a local manuscript text with captured journal or call requirements. Results are preparation aids—not acceptance guarantees.</p></div><button className="primary-button" onClick={runCheck}>Run compliance check</button></div>

    <div className="compliance-grid">
      <section className="panel compliance-inputs">
        <div className="panel-heading"><div><h2>Check setup</h2><p>Kept in this browser unless you explicitly connect another service</p></div></div>
        <label>Project<select value={selected.id} onChange={(event) => onSelect(event.target.value)}>{manuscripts.map((item) => <option value={item.id} key={item.id}>{item.shortTitle}</option>)}</select></label>
        <label>Official guideline or call URL<input type="url" value={selected.guideline.sourceUrl} placeholder="https://journal.example/author-guidelines" onChange={(event) => onUpdate(selected.id, { guideline: { ...selected.guideline, sourceUrl: event.target.value } })} /></label>
        <label>Source label<input value={selected.guideline.sourceLabel} placeholder="Journal author guidelines" onChange={(event) => onUpdate(selected.id, { guideline: { ...selected.guideline, sourceLabel: event.target.value } })} /></label>
        <label>Paste relevant requirements<textarea rows={8} value={selected.guideline.guidelineText} placeholder="Paste the official word limit, abstract, figure, declaration and submission requirements…" onChange={(event) => onUpdate(selected.id, { guideline: { ...selected.guideline, guidelineText: event.target.value } })} /></label>
        <label>Manuscript text<textarea rows={12} value={selected.manuscriptText} placeholder="Paste plain text or LaTeX source here, or import a .txt, .md or .tex file…" onChange={(event) => onUpdate(selected.id, { manuscriptText: event.target.value.slice(0, 250_000) })} /></label>
        <div className="file-row"><label className="quiet-button">Import text<input className="visually-hidden" type="file" accept=".txt,.md,.tex,text/plain,text/markdown" onChange={loadManuscript} /></label><small>DOCX parsing and in-editor equation checks are planned add-ons. Current checks inspect text locally.</small></div>
      </section>

      <section className="panel compliance-report">
        <div className="compliance-score"><div><strong>{summary.score}%</strong><span>deterministic checks passed</span></div><div><b>{summary.missing}</b><span>missing</span></div><div><b>{summary.review}</b><span>review</span></div><div><b>{summary.notCheckable}</b><span>manual</span></div></div>
        {!selected.complianceChecks.length ? <div className="empty-compliance"><strong>No report yet</strong><p>Add the source requirements and manuscript text, then run the check.</p></div> : <div className="check-list">{selected.complianceChecks.map((item) => <article key={item.id} className={item.status}>
          <div className="check-top"><span>{statusLabel[item.status]}</span><small>{item.category}</small></div><h2>{item.requirement}</h2><p>{item.evidence}</p><div className="suggestion"><strong>Suggested response</strong><p>{item.suggestion}</p></div><footer>{item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">Official source ↗</a> : <span>Source URL not recorded</span>}{item.status === "missing" && <button onClick={() => createTask(item.requirement, item.suggestion)}>Create task</button>}</footer>
        </article>)}</div>}
      </section>
    </div>
  </div>;
}
