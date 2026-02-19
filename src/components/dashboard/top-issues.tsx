"use client";

import { TOP_ISSUES, THEMES } from "@/lib/constants";
import { ThemeId } from "@/lib/types";

function getTheme(id: ThemeId) {
  return THEMES.find((t) => t.id === id);
}

export function TopIssues() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#E8825A] mb-1">Top 10 Priority Issues</h2>
      <p className="text-xs text-zinc-500 mb-4">
        Ranked by severity, breadth, structural impact, and strategic alignment
      </p>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/80 text-zinc-400 text-xs">
              <th className="text-left px-4 py-3 font-semibold w-12">#</th>
              <th className="text-left px-4 py-3 font-semibold w-48">Issues</th>
              <th className="text-left px-4 py-3 font-semibold w-40">Theme</th>
              <th className="text-left px-4 py-3 font-semibold">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {TOP_ISSUES.map((item) => {
              const theme = getTheme(item.theme);
              return (
                <tr
                  key={item.rank}
                  className="border-t border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background: item.rank <= 2
                          ? "rgba(239,68,68,0.2)"
                          : item.rank <= 5
                          ? "rgba(234,179,8,0.2)"
                          : "rgba(59,130,246,0.2)",
                        color: item.rank <= 2
                          ? "#EF4444"
                          : item.rank <= 5
                          ? "#EAB308"
                          : "#3B82F6",
                      }}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                    {item.issueNumbers}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        color: theme?.color,
                        background: `${theme?.color}22`,
                        border: `1px solid ${theme?.color}33`,
                      }}
                    >
                      {theme?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400 leading-relaxed">
                    {item.rationale}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
