import { NextRequest, NextResponse } from "next/server";
import { scoreRelevance } from "@/lib/insights";
import type { RadarItem } from "@/lib/types";

type OpenAlexWork = {
  id: string;
  display_name?: string;
  title?: string;
  publication_date?: string;
  authorships?: Array<{ author?: { display_name?: string } }>;
  primary_location?: {
    landing_page_url?: string;
    source?: { display_name?: string };
  };
  best_oa_location?: { landing_page_url?: string } | null;
  open_access?: { is_oa?: boolean };
};

function dateMonthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENALEX_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "Add OPENALEX_API_KEY to the deployment environment to enable live Research Radar results." },
      { status: 503 },
    );
  }

  const keywords = (request.nextUrl.searchParams.get("keywords") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!keywords.length) {
    return NextResponse.json({ message: "At least one research keyword is required." }, { status: 400 });
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    search: keywords.join(" OR "),
    filter: `from_publication_date:${dateMonthsAgo(12)}`,
    sort: "publication_date:desc,relevance_score:desc",
    per_page: "20",
    select: "id,display_name,title,publication_date,authorships,primary_location,best_oa_location,open_access",
  });

  try {
    const response = await fetch(`https://api.openalex.org/works?${params}`, {
      headers: { "User-Agent": "ManuscriptTracker/0.1 (open-source research workflow)" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return NextResponse.json({ message: `OpenAlex returned ${response.status}. Check the configured API key.` }, { status: 502 });
    }
    const payload = await response.json() as { results?: OpenAlexWork[] };
    const items: RadarItem[] = (payload.results ?? []).map((work) => {
      const title = work.display_name || work.title || "Untitled work";
      const match = scoreRelevance(title, keywords);
      return {
        id: work.id,
        title,
        authors: work.authorships?.slice(0, 4).map((entry) => entry.author?.display_name).filter(Boolean).join(", ") || "Authors unavailable",
        publicationDate: work.publication_date || "Date unavailable",
        venue: work.primary_location?.source?.display_name || "Source unavailable",
        url: work.best_oa_location?.landing_page_url || work.primary_location?.landing_page_url || work.id,
        relevance: match.relevance,
        matchedTerms: match.matchedTerms,
        isOpenAccess: Boolean(work.open_access?.is_oa),
      };
    });
    return NextResponse.json({ items, source: "OpenAlex", generatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ message: "OpenAlex could not be reached. Try again later." }, { status: 502 });
  }
}
