import type { Manuscript, Stage } from "./types";
import { STAGES } from "./types";
import { createProjectFields } from "./project";

const HEADERS = [
  "id",
  "title",
  "shortTitle",
  "stage",
  "journal",
  "nextAction",
  "deadline",
  "keywords",
  "coauthors",
  "updatedAt",
  "notes",
  "doi",
];

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function toCsv(manuscripts: Manuscript[]) {
  const rows = manuscripts.map((item) =>
    HEADERS.map((header) => {
      const value = item[header as keyof Manuscript];
      return quote(Array.isArray(value) ? value.join(" | ") : String(value ?? ""));
    }).join(","),
  );
  return [HEADERS.join(","), ...rows].join("\n");
}

function parseRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  row.push(value);
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function fromCsv(csv: string): Manuscript[] {
  const [headers, ...rows] = parseRows(csv.trim());
  if (!headers || !headers.includes("title")) throw new Error("CSV must include a title column.");
  return rows.map((row, index) => {
    const record = Object.fromEntries(headers.map((header, cell) => [header, row[cell] ?? ""]));
    const stage = STAGES.includes(record.stage as Stage) ? (record.stage as Stage) : "Idea";
    const id = record.id || `imported-${Date.now()}-${index}`;
    return {
      id,
      title: record.title,
      shortTitle: record.shortTitle || record.title.slice(0, 42),
      stage,
      journal: record.journal || "",
      nextAction: record.nextAction || "",
      deadline: record.deadline || "",
      keywords: record.keywords ? record.keywords.split(" | ").filter(Boolean) : [],
      coauthors: record.coauthors ? record.coauthors.split(" | ").filter(Boolean) : [],
      updatedAt: record.updatedAt || new Date().toISOString(),
      notes: record.notes || "",
      doi: record.doi || undefined,
      ...createProjectFields(id, record.shortTitle || record.title, record.coauthors ? record.coauthors.split(" | ").filter(Boolean) : []),
    };
  });
}
