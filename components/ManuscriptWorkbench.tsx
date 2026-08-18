"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { fromCsv, toCsv } from "@/lib/csv";
import { calculatePortfolioHealth, daysUntil } from "@/lib/insights";
import { seedManuscripts, seedRadar } from "@/lib/seed";
import { loadManuscripts, saveManuscripts } from "@/lib/storage";
import { STAGES, type Manuscript, type RadarItem, type Stage } from "@/lib/types";

type View = "portfolio" | "pipeline" | "radar";
type Notice = { type: "success" | "error"; message: string } | null;

const stageTone: Record<Stage, string> = {
  Idea: "slate",
  Drafting: "blue",
  "Co-author review": "violet",
  "Ready to submit": "amber",
  Submitted: "cyan",
  "Revision requested": "coral",
  Accepted: "green",
  Published: "forest",
};

function Icon({ name }: { name: "grid" | "flow" | "radar" | "plus" | "download" | "settings" | "arrow" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    flow: <><path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><path d="M18 21V9"/><circle cx="18" cy="6" r="3"/><path d="M9 6h6M9 18h6"/></>,
    radar: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 6-6"/><circle cx="12" cy="12" r="1"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 18v2h16v-2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const emptyDraft = (): Manuscript => ({
  id: "",
  title: "",
  shortTitle: "",
  stage: "Idea",
  journal: "",
  nextAction: "",
  deadline: "",
  keywords: [],
  coauthors: [],
  updatedAt: new Date().toISOString(),
  notes: "",
});

export default function ManuscriptWorkbench() {
  const [view, setView] = useState<View>("portfolio");
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(seedManuscripts);
  const [radar, setRadar] = useState<RadarItem[]>(seedRadar);
  const [selectedId, setSelectedId] = useState(seedManuscripts[0].id);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Manuscript>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Local-first data loads only after hydration to keep server HTML deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setManuscripts(loadManuscripts(seedManuscripts));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveManuscripts(manuscripts);
  }, [hydrated, manuscripts]);

  const selected = manuscripts.find((item) => item.id === selectedId) ?? manuscripts[0];
  const health = useMemo(() => calculatePortfolioHealth(manuscripts), [manuscripts]);
  const portfolioKeywords = useMemo(
    () => Array.from(new Set(manuscripts.flatMap((item) => item.keywords))).slice(0, 8),
    [manuscripts],
  );
  const visible = useMemo(() => {
    const normalized = query.toLowerCase();
    return manuscripts.filter((item) => {
      const matchesStage = stageFilter === "All" || item.stage === stageFilter;
      const matchesQuery = !normalized || [item.title, item.journal, item.nextAction, ...item.keywords]
        .join(" ").toLowerCase().includes(normalized);
      return matchesStage && matchesQuery;
    });
  }, [manuscripts, query, stageFilter]);

  function updateManuscript(id: string, patch: Partial<Manuscript>) {
    setManuscripts((items) => items.map((item) => item.id === id
      ? { ...item, ...patch, updatedAt: new Date().toISOString() }
      : item));
  }

  function createManuscript(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const item = {
      ...draft,
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      shortTitle: draft.shortTitle.trim() || draft.title.trim().slice(0, 42),
      updatedAt: new Date().toISOString(),
    };
    setManuscripts((items) => [item, ...items]);
    setSelectedId(item.id);
    setDraft(emptyDraft());
    setShowCreate(false);
    setNotice({ type: "success", message: "Manuscript added to your portfolio." });
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    download("manuscripts.csv", toCsv(manuscripts), "text/csv;charset=utf-8");
    setNotice({ type: "success", message: "Portable CSV backup downloaded." });
  }

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = fromCsv(await file.text());
      setManuscripts(imported);
      if (imported[0]) setSelectedId(imported[0].id);
      setNotice({ type: "success", message: `${imported.length} manuscripts imported.` });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Import failed." });
    } finally {
      event.target.value = "";
    }
  }

  async function refreshRadar() {
    if (!portfolioKeywords.length) {
      setNotice({ type: "error", message: "Add keywords to a manuscript before refreshing Radar." });
      return;
    }
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/discover?keywords=${encodeURIComponent(portfolioKeywords.join(","))}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Research Radar could not refresh.");
      setRadar(payload.items);
      setNotice({ type: "success", message: `${payload.items.length} recent works matched.` });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Research Radar could not refresh." });
    } finally {
      setIsRefreshing(false);
    }
  }

  async function syncToNotion(item: Manuscript) {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/integrations/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Notion sync failed.");
      setNotice({ type: "success", message: "Manuscript copied to your Notion data source." });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Notion sync failed." });
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-label="Manuscript Tracker home">
          <span>MT</span>
          <div><strong>Manuscript</strong><small>TRACKER</small></div>
        </div>
        <nav aria-label="Primary navigation">
          <button className={view === "portfolio" ? "active" : ""} onClick={() => setView("portfolio")}><Icon name="grid"/><span>Portfolio</span></button>
          <button className={view === "pipeline" ? "active" : ""} onClick={() => setView("pipeline")}><Icon name="flow"/><span>Pipeline</span></button>
          <button className={view === "radar" ? "active" : ""} onClick={() => setView("radar")}><Icon name="radar"/><span>Research Radar</span><em>{radar.length}</em></button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="privacy-note"><span>●</span><div><strong>Local-first</strong><small>Your portfolio stays in this browser until you export or sync it.</small></div></div>
        <button className="sidebar-link" onClick={() => setView("portfolio")}><Icon name="settings"/><span>Workflow settings</span></button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand">MT</div>
          <label className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search manuscripts, journals or keywords" />
          </label>
          <input ref={importRef} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={importCsv} />
          <button className="quiet-button" onClick={() => importRef.current?.click()}>Import</button>
          <button className="quiet-button" onClick={exportCsv}><Icon name="download"/> Export</button>
          <button className="primary-button" onClick={() => setShowCreate(true)}><Icon name="plus"/> New manuscript</button>
        </header>

        {notice && <div className={`notice ${notice.type}`} role="status"><span>{notice.message}</span><button aria-label="Dismiss" onClick={() => setNotice(null)}>×</button></div>}

        {view === "portfolio" && (
          <div className="content">
            <div className="page-heading">
              <div><p className="eyebrow">AUTHOR WORKSPACE</p><h1>Your manuscript portfolio</h1><p>Keep every paper moving—from first question to published record.</p></div>
              <div className="date-chip">{new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date())}</div>
            </div>

            <div className="metric-grid">
              <article><span className="metric-kicker blue">Active</span><strong>{health.active}</strong><small>manuscripts in progress</small></article>
              <article><span className="metric-kicker amber">Next 14 days</span><strong>{health.approachingDeadlines}</strong><small>deadlines approaching</small></article>
              <article><span className="metric-kicker coral">Needs attention</span><strong>{health.stalled}</strong><small>inactive for 21+ days</small></article>
              <article><span className="metric-kicker green">Research record</span><strong>{health.acceptedOrPublished}</strong><small>accepted or published</small></article>
            </div>

            <div className="portfolio-layout">
              <section className="panel manuscripts-panel">
                <div className="panel-heading"><div><h2>Manuscripts</h2><p>{visible.length} visible records</p></div><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as Stage | "All")}><option>All</option>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></div>
                <div className="manuscript-list">
                  {visible.map((item) => {
                    const due = daysUntil(item.deadline);
                    return <button key={item.id} className={`manuscript-row ${selected?.id === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                      <span className={`stage-dot ${stageTone[item.stage]}`} />
                      <span className="row-main"><strong>{item.shortTitle}</strong><small>{item.journal || "Journal not selected"}</small></span>
                      <span className={`stage-pill ${stageTone[item.stage]}`}>{item.stage}</span>
                      <span className={`deadline ${due !== null && due <= 7 ? "urgent" : ""}`}>{due === null ? "No deadline" : due < 0 ? `${Math.abs(due)}d overdue` : due === 0 ? "Due today" : `${due}d`}</span>
                      <Icon name="arrow"/>
                    </button>;
                  })}
                  {!visible.length && <div className="empty-state"><strong>No matching manuscripts</strong><span>Change the filters or add a manuscript.</span></div>}
                </div>
              </section>

              {selected && <aside className="panel detail-panel">
                <div className="detail-top"><span className={`stage-pill ${stageTone[selected.stage]}`}>{selected.stage}</span><small>Updated {new Date(selected.updatedAt).toLocaleDateString("en-GB")}</small></div>
                <h2>{selected.title}</h2>
                <label>Stage<select value={selected.stage} onChange={(event) => updateManuscript(selected.id, { stage: event.target.value as Stage })}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                <label>Target journal<input value={selected.journal} placeholder="Add target journal" onChange={(event) => updateManuscript(selected.id, { journal: event.target.value })}/></label>
                <label>Next action<textarea value={selected.nextAction} rows={3} onChange={(event) => updateManuscript(selected.id, { nextAction: event.target.value })}/></label>
                <label>Deadline<input type="date" value={selected.deadline} onChange={(event) => updateManuscript(selected.id, { deadline: event.target.value })}/></label>
                <div className="keyword-list">{selected.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                <button className="notion-button" disabled={isSyncing} onClick={() => syncToNotion(selected)}><span>N</span>{isSyncing ? "Syncing…" : "Send to Notion"}</button>
              </aside>}
            </div>
          </div>
        )}

        {view === "pipeline" && (
          <div className="content">
            <div className="page-heading"><div><p className="eyebrow">EDITORIAL FLOW</p><h1>Submission pipeline</h1><p>See where work accumulates and choose the next useful action.</p></div></div>
            <div className="pipeline-board">
              {STAGES.map((stage) => {
                const items = visible.filter((item) => item.stage === stage);
                return <section className="pipeline-column" key={stage}><header><span className={`stage-dot ${stageTone[stage]}`}/><strong>{stage}</strong><em>{items.length}</em></header><div>{items.map((item) => <button key={item.id} onClick={() => {setSelectedId(item.id); setView("portfolio");}}><strong>{item.shortTitle}</strong><span>{item.nextAction || "Define the next action"}</span><small>{item.deadline || "No deadline"}</small></button>)}</div></section>;
              })}
            </div>
          </div>
        )}

        {view === "radar" && (
          <div className="content radar-page">
            <div className="page-heading"><div><p className="eyebrow">DISCOVERY, NOT DECISION</p><h1>Research Radar</h1><p>Recent publications and preprints matching the language of your portfolio.</p></div><button className="primary-button" onClick={refreshRadar} disabled={isRefreshing}><Icon name="radar"/>{isRefreshing ? "Searching…" : "Refresh from OpenAlex"}</button></div>
            <div className="radar-intro"><div><strong>Your current signal</strong><div className="keyword-list">{portfolioKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div><p>Suggestions are discovery leads. Read and verify the original record before citing or changing a submission strategy.</p></div>
            <section className="panel radar-list">
              {radar.map((item) => <article key={item.id}>
                <div className="relevance-ring"><strong>{item.relevance}</strong><small>MATCH</small></div>
                <div className="radar-copy"><div className="radar-meta"><span>{item.publicationDate}</span><span>{item.venue}</span>{item.isOpenAccess && <span className="oa">OPEN ACCESS</span>}</div><h2>{item.title}</h2><p>{item.authors}</p><div className="keyword-list">{item.matchedTerms.map((term) => <span key={term}>{term}</span>)}</div></div>
                <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`}><Icon name="arrow"/></a>
              </article>)}
            </section>
          </div>
        )}
      </section>

      {showCreate && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowCreate(false)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2 id="new-title">Add a manuscript</h2></div><button aria-label="Close" onClick={() => setShowCreate(false)}>×</button></div>
          <form onSubmit={createManuscript}>
            <label>Full title<input autoFocus required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })}/></label>
            <div className="form-grid"><label>Short title<input value={draft.shortTitle} onChange={(event) => setDraft({ ...draft, shortTitle: event.target.value })}/></label><label>Stage<select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value as Stage })}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label></div>
            <label>Target journal<input value={draft.journal} onChange={(event) => setDraft({ ...draft, journal: event.target.value })}/></label>
            <label>Next action<textarea rows={3} value={draft.nextAction} onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })}/></label>
            <div className="form-grid"><label>Deadline<input type="date" value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}/></label><label>Keywords, comma separated<input value={draft.keywords.join(", ")} onChange={(event) => setDraft({ ...draft, keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}/></label></div>
            <div className="modal-actions"><button type="button" className="quiet-button" onClick={() => setShowCreate(false)}>Cancel</button><button className="primary-button" type="submit">Add to portfolio</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}
