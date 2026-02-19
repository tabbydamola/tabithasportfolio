import { ThemeId, Priority } from "./types";

const THEME_KEYWORDS: Record<ThemeId, string[]> = {
  "terminal-rendering": [
    "flicker", "scroll", "render", "display", "blank screen", "cursor",
    "terminal", "ui", "tui", "layout", "text corrupt", "screen",
    "iterm", "tmux", "visual", "font", "spacing", "ink",
    "jitter", "blink", "garble", "artifact", "refresh", "redraw",
    "rendering", "vim mode", "input area", "chat history", "keystroke",
    "copy", "markdown output", "background color", "chalk",
    "react #185", "setstate loop", "re-render",
  ],
  "permissions-security": [
    "permission", "allow", "deny", "sandbox", "rm -rf", "security",
    "consent", "trust", "glob pattern", "settings.local", "allowlist",
    "denylist", "CLAUDE.md", "mandatory rule", "excludedCommands",
    ".env", "secret", "credential", "dangerous", "destructive",
    "directory traversal", "symlink attack",
  ],
  "memory-performance": [
    "memory leak", "heap", "oom", "out of memory", "ram", "cpu",
    "performance", "slow", "freeze", "crash", "hang", "unresponsive",
    "degrad", "100%", "busy-poll", "resource", "idle",
    "javascript heap", "sigkill", "kernel panic", "jetsam",
    "537 gb", "output files", "bun runtime", "bun crash",
  ],
  "cross-platform": [
    "windows", "wsl", "linux", "crlf", "line ending", "cmd.exe",
    "powershell", "mingw", "msys", "git bash", "nul device",
    "shift+enter", "platform", "hpc",
    "termux", "devcontainer", "arm64", "aarch64",
    "onecmd", "enterprise ad", "username contains",
    "cowork", "desktop vm", "hyper-v", "gvisor",
    "vm boot", "vm kernel", "vm crash", "vm network",
    "ghost nat", "plan9 mount", "sandbox vm",
    "container binar", "sigill",
  ],
  "mcp-extensibility": [
    "mcp server", "mcp tool", "model context protocol",
    "mcp connect", "mcp oauth", "orphan process",
    "tool not available", "tools not exposed",
    "dynamic client", "token refresh", "outputschema",
    "double-stringif", "parameter serializ",
    "hook", "plugin", "marketplace", "skill",
    "pretooluse", "posttooluse", "sessionstart",
    "plugin install", "plugin 404", "extension install",
    "enabledplugins", "plugin-dir", "lsp",
    "language server",
  ],
  "context-agents": [
    "compact", "compaction", "context low", "auto-compact",
    "conversation state", "tool_use", "tool_result",
    "erased", "forgotten", "lost context", "corrupt",
    "prompt is too long", "context window", "context exhaust",
    "plan lost", "plan resurface",
    "agent team", "subagent", "sub-agent", "teammate",
    "classifyhandoff", "inboxpoller", "sendmessage",
    "handoff", "multi-agent", "team lead",
    "sibling tool", "agent spawn",
    "hallucin", "model regress", "opus 4.6", "sonnet 4.6",
    "model quality", "wrong answer", "fabricat",
    "ignores instruction", "tool-use avoidance",
    "guesses instead", "exploration loop", "confabul",
    "sloppy work", "confident wrong",
  ],
  "auth-billing": [
    "auth", "login", "oauth", "re-auth", "401",
    "session-index", "sessions-index", "resume",
    "session lost", "session history", "workspace",
    "expire", "token expir",
    "rate limit", "usage limit", "billing", "quota",
    "limit reached", "usage metric", "5-hour",
    "weekly limit", "session limit", "overcharg",
    "usage discrepancy", "max plan", "pro plan",
    "fast burnout", "token consumption",
  ],
  other: [],
};

export function classifyTheme(title: string, summary: string): ThemeId {
  const text = `${title} ${summary}`.toLowerCase();
  let bestTheme: ThemeId = "other";
  let bestScore = 0;

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (theme === "other") continue;
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.includes(" ") ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTheme = theme as ThemeId;
    }
  }

  return bestTheme;
}

export function classifyPriority(theme: ThemeId, title: string, summary: string): Priority {
  const text = `${title} ${summary}`.toLowerCase();

  // P0 themes
  if (
    theme === "terminal-rendering" ||
    theme === "permissions-security" ||
    theme === "cross-platform"
  ) {
    return "P0";
  }

  const criticalSignals = [
    "crash", "data loss", "rm -rf", "security", "unusable",
    "show-stopper", "critical", "breaking", "blocker",
    "kernel panic", "sigkill", "destructive",
  ];
  if (criticalSignals.some((s) => text.includes(s))) {
    return "P0";
  }

  // P1 themes
  if (
    theme === "memory-performance" ||
    theme === "mcp-extensibility" ||
    theme === "context-agents" ||
    theme === "auth-billing"
  ) {
    return "P1";
  }

  const highSignals = [
    "bug", "fail", "error", "broken", "not work", "regression",
  ];
  if (highSignals.some((s) => text.includes(s))) {
    return "P1";
  }

  return "P2";
}
