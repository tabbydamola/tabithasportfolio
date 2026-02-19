"use client";

import { useState, useMemo } from "react";
import { Issue, ThemeId, Priority } from "@/lib/types";
import { THEMES, OTHER_THEME, PRIORITY_COLORS, TOP_ISSUE_MAP } from "@/lib/constants";
import { Search, ArrowUpDown, ExternalLink, Flame } from "lucide-react";

const ALL_THEMES = [...THEMES, OTHER_THEME];

type SortField = "number" | "title" | "theme" | "priority" | "state" | "createdAt";
type SortDir = "asc" | "desc";

const PRIORITY_ORDER: Record<Priority, number> = { P0: 0, P1: 1, P2: 2 };

interface IssuesTableProps {
  issues: Issue[];
}

function ThemeBadge({ themeId }: { themeId: ThemeId }) {
  const theme = ALL_THEMES.find((t) => t.id === themeId) || OTHER_THEME;
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        color: theme.color,
        background: `${theme.color}22`,
        border: `1px solid ${theme.color}33`,
      }}
    >
      {theme.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const style = PRIORITY_COLORS[priority];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap"
      style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
    >
      {priority}
    </span>
  );
}

function StateBadge({ state }: { state: "open" | "closed" }) {
  const isOpen = state === "open";
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{
        color: isOpen ? "#22C55E" : "#6B7280",
        background: isOpen ? "rgba(34,197,94,0.15)" : "rgba(107,114,128,0.15)",
        border: `1px solid ${isOpen ? "rgba(34,197,94,0.3)" : "rgba(107,114,128,0.3)"}`,
      }}
    >
      {state}
    </span>
  );
}

const PAGE_SIZE = 25;

export function IssuesTable({ issues }: IssuesTableProps) {
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<ThemeId | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [stateFilter, setStateFilter] = useState<"open" | "closed" | "all">("all");
  const [sortField, setSortField] = useState<SortField>("number");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const hasActiveFilters = search || themeFilter !== "all" || priorityFilter !== "all" || stateFilter !== "all";

  const filtered = useMemo(() => {
    let result = issues;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.author.toLowerCase().includes(q) ||
          String(i.number).includes(q)
      );
    }

    if (themeFilter !== "all") {
      result = result.filter((i) => i.theme === themeFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((i) => i.priority === priorityFilter);
    }

    if (stateFilter !== "all") {
      result = result.filter((i) => i.state === stateFilter);
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "number":
          cmp = a.number - b.number;
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "theme":
          cmp = a.theme.localeCompare(b.theme);
          break;
        case "priority":
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          break;
        case "state":
          cmp = a.state.localeCompare(b.state);
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    // Pin top issues to top when no active filters/search
    if (!hasActiveFilters) {
      const topIssues: Issue[] = [];
      const rest: Issue[] = [];
      for (const issue of sorted) {
        if (TOP_ISSUE_MAP.has(issue.number)) {
          topIssues.push(issue);
        } else {
          rest.push(issue);
        }
      }
      // Sort pinned by rank
      topIssues.sort((a, b) => {
        const ra = TOP_ISSUE_MAP.get(a.number)?.rank ?? 99;
        const rb = TOP_ISSUE_MAP.get(b.number)?.rank ?? 99;
        return ra - rb;
      });
      return [...topIssues, ...rest];
    }

    return sorted;
  }, [issues, search, themeFilter, priorityFilter, stateFilter, sortField, sortDir, hasActiveFilters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageIssues = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#E8825A] mb-1">All Issues</h2>
      <p className="text-xs text-zinc-500 mb-4">
        Top priority issues are pinned and highlighted
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#E8825A]/50 transition-colors"
          />
        </div>

        <select
          value={themeFilter}
          onChange={(e) => {
            setThemeFilter(e.target.value as ThemeId | "all");
            setPage(0);
          }}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#E8825A]/50"
        >
          <option value="all">All Themes</option>
          {ALL_THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value as Priority | "all");
            setPage(0);
          }}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#E8825A]/50"
        >
          <option value="all">All Priorities</option>
          <option value="P0">P0 — Critical</option>
          <option value="P1">P1 — High</option>
          <option value="P2">P2 — Medium</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value as "open" | "closed" | "all");
            setPage(0);
          }}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#E8825A]/50"
        >
          <option value="all">All States</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <span className="self-center text-xs text-zinc-500">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/80 text-zinc-400 text-xs">
              {(
                [
                  ["number", "#", "w-16"],
                  ["title", "Title", ""],
                  ["theme", "Theme", "w-44"],
                  ["priority", "Priority", "w-24"],
                  ["state", "State", "w-20"],
                  ["createdAt", "Created", "w-28"],
                ] as [SortField, string, string][]
              ).map(([field, label, width]) => (
                <th
                  key={field}
                  className={`text-left px-4 py-3 font-semibold cursor-pointer hover:text-zinc-200 transition-colors select-none ${width}`}
                  onClick={() => toggleSort(field)}
                >
                  <span className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown size={10} className={sortField === field ? "text-[#E8825A]" : ""} />
                  </span>
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {pageIssues.map((issue, idx) => {
              const topInfo = TOP_ISSUE_MAP.get(issue.number);
              const isTop = !!topInfo;
              // Show divider after last pinned issue on page 1
              const nextIssue = pageIssues[idx + 1];
              const showDivider =
                isTop && nextIssue && !TOP_ISSUE_MAP.has(nextIssue.number) && !hasActiveFilters;

              return (
                <tr
                  key={issue.number}
                  className={`border-t transition-colors ${
                    isTop
                      ? "bg-[#E8825A]/[0.06] border-[#E8825A]/10 hover:bg-[#E8825A]/[0.10]"
                      : "border-zinc-800/60 hover:bg-zinc-800/30"
                  } ${showDivider ? "border-b-2 border-b-[#E8825A]/20" : ""}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {isTop && (
                        <Flame size={10} className="text-[#E8825A] shrink-0" />
                      )}
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-zinc-400 hover:text-[#E8825A] transition-colors"
                      >
                        {issue.number}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <p className="text-xs text-zinc-200 line-clamp-1 group-hover:text-[#E8825A] transition-colors">
                        {issue.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                        {isTop && topInfo ? topInfo.rationale : issue.summary}
                      </p>
                    </a>
                  </td>
                  <td className="px-4 py-2.5">
                    <ThemeBadge themeId={issue.theme} />
                  </td>
                  <td className="px-4 py-2.5">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StateBadge state={issue.state} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-zinc-400">{issue.createdAt}</td>
                  <td className="px-4 py-2.5">
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-[#E8825A] transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-zinc-500">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-zinc-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-zinc-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
