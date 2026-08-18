# Notion integration

The Notion integration is deliberately optional. Manuscript Tracker remains functional without it.

## 1. Create the target data source

Create a Notion database/data source with these exact property names and types:

| Property | Type | Required |
| --- | --- | --- |
| `Manuscript` | Title | Yes |
| `Stage` | Select | Yes |
| `Journal` | Rich text | Yes |
| `Next action` | Rich text | Yes |
| `Deadline` | Date | Yes |
| `Keywords` | Multi-select | Yes |
| `Tracker ID` | Rich text | Yes |

The `Stage` options should match:

`Idea`, `Drafting`, `Co-author review`, `Ready to submit`, `Submitted`, `Revision requested`, `Accepted`, `Published`.

## 2. Create and share a Notion integration

Create an internal integration in the Notion developer portal. Give it permission to insert content, then share the target data source with the integration.

## 3. Configure the server

Set these deployment environment variables:

```bash
NOTION_API_KEY=secret_...
NOTION_DATA_SOURCE_ID=...
```

Restart the application. The **Send to Notion** button creates a new page. It does not currently update or reconcile an existing Notion page.

## Security

The token is read only inside the Next.js route handler. Never move it into client code or use a `NEXT_PUBLIC_` variable. For a public multi-user deployment, replace the shared internal token with an OAuth integration and per-user authorization.
