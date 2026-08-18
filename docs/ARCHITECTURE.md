# Architecture

## Current MVP

```text
Browser
  ├─ React author workspace
  ├─ localStorage manuscript portfolio
  └─ CSV import/export
        │
        ├─ GET /api/discover ─────────> OpenAlex
        └─ POST /api/integrations/notion ──> Notion
```

The browser is the primary store. Server routes are thin adapters that keep third-party credentials out of client bundles.

## Design boundaries

- `lib/types.ts` is the workflow contract.
- `lib/csv.ts` owns portable data interchange.
- `lib/insights.ts` contains deterministic portfolio and relevance calculations.
- API routes validate inputs and expose only narrowly scoped third-party operations.
- The UI treats discovery records as suggestions, never as verified evidence.

## Production evolution

A collaborative deployment should introduce an authenticated persistence adapter behind the same manuscript contract. Recommended additions are row-level authorization, encryption in transit and at rest, an audit trail, backup/restore tests, retention controls and institution-specific data governance review.
