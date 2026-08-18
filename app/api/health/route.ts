import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    integrations: {
      openAlex: Boolean(process.env.OPENALEX_API_KEY),
      notion: Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATA_SOURCE_ID),
    },
  });
}
