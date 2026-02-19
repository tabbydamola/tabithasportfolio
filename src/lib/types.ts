export interface RawIssue {
  number: string;
  title: string;
  state: string;
  created_at: string;
  closed_at: string;
  author: string;
  url: string;
  ai_summary: string;
}

export interface Issue {
  number: number;
  title: string;
  state: "open" | "closed";
  createdAt: string;
  closedAt: string | null;
  author: string;
  url: string;
  summary: string;
  theme: ThemeId;
  priority: Priority;
}

export type ThemeId =
  | "terminal-rendering"
  | "permissions-security"
  | "memory-performance"
  | "cross-platform"
  | "mcp-extensibility"
  | "context-agents"
  | "auth-billing"
  | "other";

export type Priority = "P0" | "P1" | "P2";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  risk: "Critical" | "High" | "Medium-High" | "Medium";
  priority: Priority;
  estimatedCount: number;
  percentage: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface UserStory {
  id: number;
  persona: string;
  need: string;
  reason: string;
  theme: ThemeId;
  issueCount: number;
}

export interface TopIssue {
  rank: number;
  issueNumbers: string;
  theme: ThemeId;
  rationale: string;
}
