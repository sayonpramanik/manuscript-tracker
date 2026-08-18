"use client";

import { ADDONS } from "@/lib/addons";
import type { Manuscript } from "@/lib/types";

type Props = { selected?: Manuscript; onUpdate: (id: string, patch: Partial<Manuscript>) => void };

export default function AddonMarketplace({ selected, onUpdate }: Props) {
  function toggle(addonId: string) {
    if (!selected) return;
    const enabled = selected.enabledAddons.includes(addonId)
      ? selected.enabledAddons.filter((id) => id !== addonId)
      : [...selected.enabledAddons, addonId];
    onUpdate(selected.id, { enabledAddons: enabled });
  }

  return <div className="content addons-page">
    <div className="page-heading"><div><p className="eyebrow">BUILD YOUR RESEARCH WORKFLOW</p><h1>R‑MANTRA add-ons</h1><p>A publication-management pedalboard: keep the trusted core, then enable only the tools and data access your project needs.</p></div><span className="free-tier-badge">FREE FOR EVERYONE · NO .EDU REQUIRED</span></div>
    <section className="plan-banner"><div><span>COMMUNITY FREE</span><h2>Start without an institution</h2><p>The local-first core, project boards, portable backups and deterministic compliance checks remain available without an academic email address.</p></div><div><strong>Commercial path</strong><p>Hosted collaboration, secure cloud sync, premium connectors, lab administration and institutional governance can fund the free open core.</p><a href="https://github.com/sayonpramanik/manuscript-tracker/blob/main/docs/COMMERCIALISATION.md" target="_blank" rel="noreferrer">Read the sustainable model ↗</a></div></section>
    <div className="addon-grid">{ADDONS.map((addon) => {
      const enabled = selected?.enabledAddons.includes(addon.id) ?? false;
      return <article className="addon-card panel" key={addon.id}><header><span>{addon.category}</span><em className={addon.availability.toLowerCase()}>{addon.availability}</em></header><h2>{addon.name}</h2><p>{addon.description}</p><div className="permission-copy"><strong>Data permission</strong><span>{addon.permission}</span></div><footer><span>{addon.free ? "Community/free" : "Premium connector"}</span><button disabled={addon.availability === "Planned" || !selected} onClick={() => toggle(addon.id)}>{addon.availability === "Planned" ? "Roadmap" : enabled ? "Enabled" : "Enable"}</button></footer></article>;
    })}</div>
    <section className="developer-strip"><div><p className="eyebrow">OPEN EXTENSION CONTRACT</p><h2>Bring your own pedal</h2></div><p>Future add-ons will declare their permissions, network destinations, pricing and data retention before activation. Self-hosters will be able to approve private institutional modules without sending manuscripts to R‑MANTRA.</p></section>
  </div>;
}
