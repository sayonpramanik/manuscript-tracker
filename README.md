# Manuscript Tracker

An author-centred, local-first workspace for moving scholarly manuscripts from first idea to publication.

Manuscript Tracker combines a calm portfolio dashboard, a submission pipeline, portable CSV backups, a recent-literature radar powered by OpenAlex, and an optional Notion sync. It is designed to be useful before an institution adopts it: the core workflow runs in one browser with no account or database.

> **Project status:** public MVP. The tracker is suitable for personal workflow trials. It is not yet a multi-user editorial system or a system of record for confidential peer review.

## Why this project exists

Most manuscript systems begin from the journal or administrator's perspective. This project begins with the author:

- What is the next useful action for each paper?
- Which deadline is becoming risky?
- Where is work accumulating in the pipeline?
- What recent literature overlaps with the portfolio?
- Can the author leave with a clean copy of their own data?

## Included in the MVP

- Portfolio health summary and deadline signals
- Eight-stage author workflow from `Idea` to `Published`
- Editable target journal, next action, deadline and research terms
- Local browser storage with CSV import/export
- OpenAlex Research Radar for recently published or indexed works
- Optional server-side Notion page creation
- Responsive, keyboard-friendly interface
- Vercel and Docker deployment paths
- Tests, linting, type checks and automated CI

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

Open `http://localhost:3000`.

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
- CSV is the portable backup and migration format.
- Notion and OpenAlex credentials stay in server-side environment variables.
- No analytics, advertising or tracking scripts are included.
- Clearing browser storage removes local data unless it has been exported.

For collaborative or regulated use, add authentication, a database, access controls, audit logs and a backup policy before deployment.

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

- User-defined workflow stages and templates
- Authenticated database adapter for teams and multiple devices
- DOI and ORCID enrichment
- Calls-for-papers and journal-fit adapters with transparent provenance
- Scheduled Radar digests
- Bidirectional Notion sync and conflict handling
- Calendar integrations and co-author reminders
- Accessible drag-and-drop pipeline controls

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a feature.

## Licence

MIT © Sayon Pramanik. See [LICENSE](LICENSE).
