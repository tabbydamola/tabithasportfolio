"use client";

import { useState } from "react";
import { Theme } from "@/lib/types";
import { THEMES } from "@/lib/constants";
import { Shield, Monitor, Cpu, Globe, Puzzle, Brain, KeyRound, ChevronDown } from "lucide-react";

const THEME_ICONS: Record<string, React.ElementType> = {
  "terminal-rendering": Monitor,
  "permissions-security": Shield,
  "memory-performance": Cpu,
  "cross-platform": Globe,
  "mcp-extensibility": Puzzle,
  "context-agents": Brain,
  "auth-billing": KeyRound,
};

const MAX_COUNT = Math.max(...THEMES.map((t) => t.estimatedCount));

function ThemeRow({ theme, isOpen, onToggle }: { theme: Theme; isOpen: boolean; onToggle: () => void }) {
  const Icon = THEME_ICONS[theme.id] || Monitor;
  const barWidth = (theme.estimatedCount / MAX_COUNT) * 100;

  return (
    <div
      className="group rounded-lg transition-colors hover:bg-zinc-800/30 cursor-pointer"
      onClick={onToggle}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Color dot + icon */}
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${theme.color}1A` }}
        >
          <Icon size={15} style={{ color: theme.color }} />
        </div>

        {/* Name + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-sm font-medium text-zinc-200 whitespace-nowrap">
              {theme.label}
            </span>
            <span
              className="text-[10px] font-semibold px-1.5 py-px rounded uppercase tracking-wide"
              style={{ color: theme.color, background: `${theme.color}1A` }}
            >
              {theme.priority}
            </span>
          </div>
          {/* Volume bar */}
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${barWidth}%`, background: theme.color }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-zinc-400 tabular-nums w-20 text-right">
            ~{theme.estimatedCount} issues
          </span>
          <span className="text-xs text-zinc-500 tabular-nums w-10 text-right">
            {theme.percentage}%
          </span>
          <ChevronDown
            size={14}
            className={`text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expandable detail */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-3 pl-16">
          <p className="text-xs text-zinc-400 leading-relaxed">{theme.description}</p>
          <span
            className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{
              color: theme.risk === "Critical" ? "#EF4444" : theme.risk === "High" ? "#EAB308" : "#3B82F6",
              background:
                theme.risk === "Critical"
                  ? "rgba(239,68,68,0.12)"
                  : theme.risk === "High"
                  ? "rgba(234,179,8,0.12)"
                  : "rgba(59,130,246,0.12)",
            }}
          >
            {theme.risk} Risk
          </span>
        </div>
      </div>
    </div>
  );
}

export function ThemesOverview() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#E8825A] mb-4">Themes</h2>
      <div className="rounded-xl border border-zinc-800 divide-y divide-zinc-800/60 overflow-hidden">
        {THEMES.map((theme) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            isOpen={openId === theme.id}
            onToggle={() => setOpenId(openId === theme.id ? null : theme.id)}
          />
        ))}
      </div>
    </section>
  );
}
