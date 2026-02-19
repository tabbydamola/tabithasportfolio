import { Theme, UserStory, TopIssue } from "./types";

export const THEMES: Theme[] = [
  {
    id: "terminal-rendering",
    label: "Terminal Rendering & UI",
    description:
      "Flickering, scrolling, text corruption, React infinite re-render loops, and layout breakage across terminal emulators and multiplexers.",
    risk: "Critical",
    priority: "P0",
    estimatedCount: 130,
    percentage: 13,
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  {
    id: "permissions-security",
    label: "Permissions & Security",
    description:
      "Permission allow/deny rules ignored, glob patterns broken, destructive commands executing without consent, CLAUDE.md directory traversal.",
    risk: "Critical",
    priority: "P0",
    estimatedCount: 75,
    percentage: 7.5,
    color: "#F97316",
    bgColor: "rgba(249,115,22,0.12)",
    borderColor: "rgba(249,115,22,0.3)",
  },
  {
    id: "memory-performance",
    label: "Memory & Performance",
    description:
      "Memory leaks (up to 36 GB), 537 GB disk space leaks, heap OOM crashes, Bun runtime crashes, and progressive degradation.",
    risk: "High",
    priority: "P1",
    estimatedCount: 90,
    percentage: 9,
    color: "#EAB308",
    bgColor: "rgba(234,179,8,0.12)",
    borderColor: "rgba(234,179,8,0.3)",
  },
  {
    id: "cross-platform",
    label: "Cross-Platform & VM",
    description:
      "Windows Bash tool broken (exit code 1), ARM64 crashes, Cowork VM networking failures, enterprise AD username issues. Windows is non-functional for most users.",
    risk: "Critical",
    priority: "P0",
    estimatedCount: 195,
    percentage: 19.5,
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
  },
  {
    id: "mcp-extensibility",
    label: "MCP & Extensibility",
    description:
      "MCP parameter double-stringification, orphaned server processes, plugin install 404s, hooks not firing, marketplace stale state.",
    risk: "High",
    priority: "P1",
    estimatedCount: 120,
    percentage: 12,
    color: "#8B5CF6",
    bgColor: "rgba(139,92,246,0.12)",
    borderColor: "rgba(139,92,246,0.3)",
  },
  {
    id: "context-agents",
    label: "Context, Agents & Model",
    description:
      "Premature context exhaustion, plans lost after compaction, subagent crashes (classifyHandoffIfNeeded), model hallucinations and instruction ignoring.",
    risk: "High",
    priority: "P1",
    estimatedCount: 140,
    percentage: 14,
    color: "#EC4899",
    bgColor: "rgba(236,72,153,0.12)",
    borderColor: "rgba(236,72,153,0.3)",
  },
  {
    id: "auth-billing",
    label: "Auth, Sessions & Billing",
    description:
      "sessions-index.json regression breaking /resume, hourly re-auth, OAuth failures, usage mismatches, incorrect billing charges.",
    risk: "High",
    priority: "P1",
    estimatedCount: 115,
    percentage: 11.5,
    color: "#14B8A6",
    bgColor: "rgba(20,184,166,0.12)",
    borderColor: "rgba(20,184,166,0.3)",
  },
];

export const OTHER_THEME: Theme = {
  id: "other",
  label: "Other / Uncategorized",
  description: "Issues that don't clearly map to a primary theme.",
  risk: "Medium",
  priority: "P2",
  estimatedCount: 135,
  percentage: 13.5,
  color: "#6B7280",
  bgColor: "rgba(107,114,128,0.12)",
  borderColor: "rgba(107,114,128,0.3)",
};

export const USER_STORIES: UserStory[] = [
  {
    id: 1,
    persona: "a developer using terminal multiplexers",
    need: "stable terminal rendering",
    reason:
      "I can read output, type input, and review diffs without flickering or scroll jitter",
    theme: "terminal-rendering",
    issueCount: 130,
  },
  {
    id: 2,
    persona: "a security-conscious engineer",
    need: "permission controls that actually work",
    reason:
      "I can trust that deny rules, glob patterns, and CLAUDE.md restrictions prevent unauthorized actions",
    theme: "permissions-security",
    issueCount: 75,
  },
  {
    id: 3,
    persona: "a power user running long coding sessions",
    need: "stable memory and CPU usage",
    reason:
      "my system doesn't freeze from 36+ GB memory leaks or 537 GB disk leaks",
    theme: "memory-performance",
    issueCount: 90,
  },
  {
    id: 4,
    persona: "a Windows / WSL developer",
    need: "first-class cross-platform and VM support",
    reason:
      "the Bash tool actually executes commands and Cowork VMs boot reliably on my platform",
    theme: "cross-platform",
    issueCount: 195,
  },
  {
    id: 5,
    persona: "a developer building MCP integrations",
    need: "reliable MCP servers, hooks, and plugins",
    reason:
      "servers connect, plugins install, hooks fire, and processes terminate cleanly",
    theme: "mcp-extensibility",
    issueCount: 120,
  },
  {
    id: 6,
    persona: "a user with long-running conversations",
    need: "reliable context, agents, and model behavior",
    reason:
      "plans survive compaction, subagents don't crash, and the model follows my instructions",
    theme: "context-agents",
    issueCount: 140,
  },
  {
    id: 7,
    persona: "a CI/CD pipeline operator",
    need: "persistent auth, sessions, and accurate billing",
    reason:
      "workflows don't break from expired tokens, /resume works, and usage charges are correct",
    theme: "auth-billing",
    issueCount: 115,
  },
];

export const TOP_ISSUES: TopIssue[] = [
  {
    rank: 1,
    issueNumbers: "#26913",
    theme: "permissions-security",
    rationale:
      "Agent executed destructive database command without user confirmation. Safety-critical — direct parallel to v1's #6608.",
  },
  {
    rank: 2,
    issueNumbers: "#26911",
    theme: "memory-performance",
    rationale:
      "Task .output files never cleaned — 537 GB from single session. Catastrophic disk leak. Straightforward fix.",
  },
  {
    rank: 3,
    issueNumbers: "#26481",
    theme: "cross-platform",
    rationale:
      "Bash tool exit 1 on Windows/MINGW (set -o onecmd injection). Root cause for 5-8 related Windows failures.",
  },
  {
    rank: 4,
    issueNumbers: "#26850",
    theme: "terminal-rendering",
    rationale:
      "Write tool creating .md file permanently crashes session renderer (infinite setState loop). Unrecoverable.",
  },
  {
    rank: 5,
    issueNumbers: "#26400 + #26245 + #24571",
    theme: "context-agents",
    rationale:
      "classifyHandoffIfNeeded is not defined — recurring subagent crash in 5+ issues. Likely a missing import.",
  },
  {
    rank: 6,
    issueNumbers: "#25685 + #25032 + #24729",
    theme: "auth-billing",
    rationale:
      "sessions-index.json stops updating, breaking --resume. Structural regression since v2.1.31.",
  },
  {
    rank: 7,
    issueNumbers: "#26805 + #26881",
    theme: "cross-platform",
    rationale:
      "Cowork: Responses not rendering until user types. Makes the feature appear completely broken.",
  },
  {
    rank: 8,
    issueNumbers: "#26912 + #26873",
    theme: "cross-platform",
    rationale:
      "Cowork Windows: VM boots but API unreachable (NAT/network failures). Blocks feature for most Windows users.",
  },
  {
    rank: 9,
    issueNumbers: "#24960 + #24583",
    theme: "memory-performance",
    rationale:
      "Kernel panic from 17-36 GB memory consumption. Causes hardware-level crashes. Safety issue.",
  },
  {
    rank: 10,
    issueNumbers: "#26951 + #26948",
    theme: "mcp-extensibility",
    rationale:
      "Plugin install fails with HTTP 404 from marketplace. Blocks plugin ecosystem adoption.",
  },
];

// Extract the PRIMARY (first) issue number from each TOP_ISSUES entry → exactly 10 highlights
export const TOP_ISSUE_MAP: Map<number, { rank: number; rationale: string }> = (() => {
  const map = new Map<number, { rank: number; rationale: string }>();
  for (const item of TOP_ISSUES) {
    const first = item.issueNumbers.match(/#(\d+)/);
    if (first) {
      map.set(parseInt(first[1], 10), { rank: item.rank, rationale: item.rationale });
    }
  }
  return map;
})();

export const PRIORITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  P0: { color: "#EF4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)" },
  P1: { color: "#EAB308", bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.4)" },
  P2: { color: "#3B82F6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)" },
};
