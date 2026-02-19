import Link from "next/link";
import { loadIssues, getIssueSummary } from "@/lib/data";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ThemesOverview } from "@/components/dashboard/themes-overview";
import { IssuesTable } from "@/components/dashboard/issues-table";

export default function DashboardPage() {
  const issues = loadIssues();
  const summary = getIssueSummary(issues);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8825A] flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-100">
                Claude Code Issues Dashboard
              </h1>
              <p className="text-[10px] text-zinc-500">
                1,000 unique issues (from 6,246 open) &middot; 7 themes &middot; Feb 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/analysis"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#E8825A] text-white hover:bg-[#d6743e] transition-colors"
            >
              Analysis Memo
            </Link>
            <a
              href="https://github.com/anthropics/claude-code/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-[#E8825A] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <SummaryCards {...summary} />

        <ThemesOverview />
        <IssuesTable issues={issues} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-[10px] text-zinc-600 text-center">
            Analysis powered by Claude &middot; Data source: anthropics/claude-code GitHub Issues
          </p>
        </div>
      </footer>
    </div>
  );
}
