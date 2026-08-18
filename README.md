# R-MANTRA

**Research MANuscript TRacker for Authors** — publication project management for researchers.

R-MANTRA treats each article, chapter or other research output as a project with work, people, dependencies, milestones, compliance evidence and submission cycles. Its pedalboard model keeps a dependable core while allowing specialist writing, reference and integrity tools to be connected as permission-labelled add-ons.

> **Project status:** public v0.2 foundation. It is suitable for personal workflow trials and transparent demos. It is not yet an authenticated multi-user system, a native DOCX/LaTeX editor, or a system of record for confidential peer review.

The Community edition is free for everyone. It does **not** require a `.edu` address, institutional affiliation or account.

## Why this project exists

Most manuscript systems begin from the journal or administrator's perspective. R-MANTRA begins with the author and research team:

- What is the next useful action for each paper?
- Which deadline is becoming risky?
- Where is work accumulating in the pipeline?
- What recent literature overlaps with the portfolio?
- Can the author leave with a clean copy of their own data?
- Who owns the next task, what is blocking it, and which milestone is at risk?
- Which journal requirement is missing, where is the evidence, and what action will resolve it?

## Included now

- Portfolio health summary and deadline signals
- Eight-stage author workflow from `Idea` to `Published`
- Editable target journal, next action, deadline and research terms
- Native task Kanban with assignments, priorities, dependencies and deadlines
- Milestones, contributor/CRediT-role records and threaded project discussions
- Source-backed local compliance preflight for pasted manuscript and guideline text
- Pass, missing, manual and human-review findings that can become project tasks
- Local browser storage with CSV interchange and full JSON workspace backups
- OpenAlex Research Radar for recently published or indexed works
- Optional server-side Notion page creation
- Permission-labelled add-on catalogue that distinguishes working, configured and planned modules
- Responsive, keyboard-friendly interface
- Vercel and Docker deployment paths
- Tests, linting, type checks and automated CI

## Important boundaries

- The compliance engine currently accepts pasted text or `.txt`, `.md` and `.tex` files. DOCX parsing, native visual writing and equation editing are roadmap modules.
- Automated findings are preparation aids. They do not determine scientific validity, ethical adequacy, plagiarism, authorship, acceptance or legal compliance.
- R-MANTRA does not include an AI-authorship detector. The roadmap favours an author-approved AI-use provenance ledger because detector scores can be misinterpreted.
- A credible similarity service requires a licensed corpus. The catalogue therefore describes a future opt-in connector rather than claiming a home-grown plagiarism detector.
- Planned Zotero, Overleaf and CoCalc cards are explicit roadmap contracts, not working integrations.

The Radar surfaces **discovery leads**, not claims that a confidential manuscript has been submitted. Coverage and indexing dates vary by source; users should verify original records before citing or changing a submission decision.

## Quick start

Requirements: Node.js 20.9 or newer.

```bash
git clone https://github.com/sayonpramanik/manuscript-tracker.git
cd manuscript-tracker
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No sign-up is required for the local Community workflow.

The core tracker works without environment variables. Add integrations only when needed.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENALEX_API_KEY` | No | Enables live Research Radar searches |
| `NOTION_API_KEY` | No | Server-side Notion connection token |
| `NOTION_DATA_SOURCE_ID` | No | Target Notion data source |
| `NEXT_PUBLIC_APP_URL` | No | Public deployment URL |

Never prefix private tokens with `NEXT_PUBLIC_`; that would expose them to the browser.

## Deploy

### Vercel

Import this GitHub repository in Vercel, keep the default Next.js settings, and add any optional environment variables. Every push to the production branch will deploy automatically.

### Docker

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

## Notion setup

Create a Notion data source with the required property names and share it with your integration. The complete mapping is documented in [docs/NOTION.md](docs/NOTION.md).

## Data and privacy model

- Manuscripts are stored in the browser's `localStorage` by default.
- JSON is the complete workspace backup for nested tasks, comments and compliance evidence; CSV remains the tabular interchange format.
- Notion and OpenAlex credentials stay in server-side environment variables.
- No analytics, advertising or tracking scripts are included.
- Clearing browser storage removes local data unless it has been exported.

Pasted manuscript text is capped in the current browser workspace to reduce accidental local-storage exhaustion. For collaborative or regulated use, add authentication, a database, access controls, audit logs and a backup policy before deployment.

## Add-ons and integrations

The current permission model and integration states are documented in [docs/ADDONS.md](docs/ADDONS.md). Any add-on that transmits unpublished text must remain off by default and disclose its data destination before activation.

## Free tier and commercialisation

The open core and self-hosted Community edition remain free. A proposed hosted Free tier is open to any email domain; future paid plans can fund secure cloud collaboration, multi-device sync, maintained premium connectors, lab administration and institutional governance. Data resale, paywalled exports and undisclosed AI training are outside the business model.

See [docs/COMMERCIALISATION.md](docs/COMMERCIALISATION.md) for the proposed tiers, revenue routes and non-negotiable safeguards. Prices and hosted limits are hypotheses for user validation, not active charges.

## Development

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Or run the complete gate:

```bash
npm run check
```

## Roadmap

- User-defined workflow stages, discipline packs and templates
- Authenticated database adapter for teams and multiple devices
- Native visual authoring with equations and reliable DOCX/LaTeX round trips
- Version-aware Zotero two-way sync and reference conflict resolution
- Overleaf and CoCalc project bridges
- DOI, ORCID, OSF, Zenodo and GitHub enrichment
- Calls-for-papers and journal-fit adapters with transparent provenance
- Scheduled Radar digests
- Bidirectional Notion sync and conflict handling
- Calendar integrations and co-author reminders
- Licensed similarity-service connectors and an AI-use provenance ledger
- Accessible drag-and-drop pipeline controls

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a feature.

## Licence

MIT © Sayon Pramanik. See [LICENSE](LICENSE).
