# Architecture

## Current v0.2 foundation

```text
Browser
  ├─ React author workspace
  │   ├─ portfolio and publication pipeline
  │   ├─ tasks, dependencies, milestones and discussions
  │   ├─ local deterministic compliance preflight
  │   └─ permission-labelled add-on catalogue
  ├─ localStorage R-MANTRA workspace
  ├─ full JSON backup/restore
  └─ CSV portfolio interchange
        │
        ├─ GET /api/discover ─────────> OpenAlex
        └─ POST /api/integrations/notion ──> Notion
```

The browser is the primary store. Server routes are thin adapters that keep third-party credentials out of client bundles.

## Design boundaries

- `lib/types.ts` is the workflow contract.
- `lib/csv.ts` owns portable data interchange.
- `lib/insights.ts` contains deterministic portfolio and relevance calculations.
- `lib/compliance.ts` contains local, source-linked checks that remain distinguishable from human judgement.
- `lib/addons.ts` is the presentational manifest; planned cards are not executable integrations.
- `lib/project.ts` migrates v0.1 browser records into the expanded project contract.
- API routes validate inputs and expose only narrowly scoped third-party operations.
- The UI treats discovery records as suggestions, never as verified evidence.
- External transmission is opt-in. The client must not infer that an enabled catalogue card is a configured server connection.

## Production evolution

A collaborative deployment should introduce an authenticated persistence adapter behind the same manuscript contract. Recommended additions are row-level authorization, encryption in transit and at rest, an audit trail, backup/restore tests, retention controls and institution-specific data governance review.
