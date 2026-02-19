import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Issue, RawIssue } from "./types";
import { classifyTheme, classifyPriority } from "./theme-classifier";

export function loadIssues(): Issue[] {
  const csvPath = path.join(process.cwd(), "data", "claude_code_unique_1k_issues.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const parsed = Papa.parse<RawIssue>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data.map((row) => {
    const theme = classifyTheme(row.title || "", row.ai_summary || "");
    const priority = classifyPriority(theme, row.title || "", row.ai_summary || "");

    return {
      number: parseInt(row.number, 10) || 0,
      title: row.title || "",
      state: (row.state === "closed" ? "closed" : "open") as "open" | "closed",
      createdAt: row.created_at || "",
      closedAt: row.closed_at || null,
      author: row.author || "",
      url: row.url || "",
      summary: row.ai_summary || "",
      theme,
      priority,
    };
  });
}

export function getIssueSummary(issues: Issue[]) {
  const total = issues.length;
  const p0 = issues.filter((i) => i.priority === "P0").length;
  const p1 = issues.filter((i) => i.priority === "P1").length;
  const p2 = issues.filter((i) => i.priority === "P2").length;
  const open = issues.filter((i) => i.state === "open").length;
  const closed = issues.filter((i) => i.state === "closed").length;

  return { total, p0, p1, p2, open, closed };
}
