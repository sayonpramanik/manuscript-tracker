import { NextRequest, NextResponse } from "next/server";
import { STAGES, type Manuscript, type Stage } from "@/lib/types";

const NOTION_VERSION = "2026-03-11";

function isManuscript(value: unknown): value is Manuscript {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Manuscript>;
  return Boolean(item.id && item.title && item.stage && STAGES.includes(item.stage as Stage));
}

export async function POST(request: NextRequest) {
  const token = process.env.NOTION_API_KEY;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  if (!token || !dataSourceId) {
    return NextResponse.json(
      { message: "Notion is optional. Configure NOTION_API_KEY and NOTION_DATA_SOURCE_ID on the server to enable sync." },
      { status: 503 },
    );
  }

  const manuscript: unknown = await request.json().catch(() => null);
  if (!isManuscript(manuscript)) {
    return NextResponse.json({ message: "The manuscript payload is incomplete or invalid." }, { status: 400 });
  }

  const properties: Record<string, unknown> = {
    Manuscript: { title: [{ text: { content: manuscript.title.slice(0, 2000) } }] },
    Stage: { select: { name: manuscript.stage } },
    Journal: { rich_text: [{ text: { content: manuscript.journal.slice(0, 2000) } }] },
    "Next action": { rich_text: [{ text: { content: manuscript.nextAction.slice(0, 2000) } }] },
    Keywords: { multi_select: manuscript.keywords.slice(0, 20).map((name) => ({ name: name.slice(0, 100) })) },
    "Tracker ID": { rich_text: [{ text: { content: manuscript.id } }] },
  };
  if (manuscript.deadline) properties.Deadline = { date: { start: manuscript.deadline } };

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({ parent: { data_source_id: dataSourceId }, properties }),
    });
    const payload = await response.json();
    if (!response.ok) {
      const detail = typeof payload?.message === "string" ? payload.message : "Check the Notion data-source schema and connection permissions.";
      return NextResponse.json({ message: `Notion rejected the sync: ${detail}` }, { status: 502 });
    }
    return NextResponse.json({ id: payload.id, url: payload.url });
  } catch {
    return NextResponse.json({ message: "Notion could not be reached. Try again later." }, { status: 502 });
  }
}
