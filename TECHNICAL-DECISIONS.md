# Technical Decisions

A plain-language guide to every technical choice in this portfolio project, written so that anyone, regardless of engineering background, can understand *why* each decision was made and *how* Claude Code was used to build it.

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Detailed Decision Walkthrough](#3-detailed-decision-walkthrough)
4. [How the 7 Themes Were Prioritized](#4-how-the-7-themes-were-prioritized)
5. [How Theme Priorities Are Enforced in Code](#5-how-theme-priorities-are-enforced-in-code)
6. [Project Structure](#6-project-structure)

---

## 1. What This Project Is

This is a portfolio piece that demonstrates product management skills through a real-world exercise: analyzing 6,246 open GitHub issues from Anthropic's Claude Code repository, deduplicating them down to 1,000 unique reports, classifying them into 7 themes, and presenting the results in two forms:

- **An interactive dashboard** (`/`) where you can filter, sort, and search all 1,000 issues
- **A written analysis memo** (`/analysis`) that explains what the data means and what to do about it

The project is built as a Next.js web application and deployed on Vercel. I am not an engineer; I built this by leveraging Claude Code as my development tool. I described what I wanted at each stage, Claude Code recommended the technologies and wrote the code, and I directed the process through iterative prompting: reviewing output, requesting changes, and making the product and design decisions throughout. The analysis, prioritization framework, theme definitions, and editorial content are entirely my own work. The technical implementation is the result of that collaboration.

---

## 2. Tech Stack at a Glance

| Technology | What It Does | Version |
|---|---|---|
| **Next.js** | The web framework that runs the site | 16.1.6 |
| **React** | The library for building the user interface | 19.2.3 |
| **TypeScript** | Adds type safety to JavaScript | 5.x |
| **Tailwind CSS** | A utility-based styling system | 4.2.0 |
| **PapaParse** | Reads and parses CSV files | 5.5.3 |
| **Lucide React** | Provides the icons used throughout the UI | 0.575.0 |
| **clsx + tailwind-merge** | Helpers for combining CSS class names cleanly | 2.1.1 / 3.5.0 |
| **Playwright** | Generates a PDF of the analysis memo using a headless browser | 1.58.2 |
| **Vercel** | Hosts and deploys the live site | N/A |

---

## 3. Detailed Decision Walkthrough

The tech stack was not something I selected from prior experience. I described what I wanted to build (an interactive dashboard with filtering, sorting, and a long-form analysis page), and Claude Code recommended these technologies as the standard modern stack for this type of project. Below is what each technology does and why it made sense, which I now understand well enough to explain and defend.

### Why Next.js

Next.js is a framework built on top of React that handles routing (turning URLs like `/analysis` into pages), server-side rendering, and performance optimization out of the box. Claude Code recommended it because the alternative would be building all of that from scratch or stitching together several smaller libraries.

For this project, the key benefit is **Server Components**, a feature that lets certain parts of the app run only on the server, never in the user's browser. The CSV data (1,000 issues) is read from disk using Node.js file system APIs, which only work on a server. Next.js makes this seamless: the homepage reads the CSV, classifies every issue, and sends the finished HTML to the browser. The user never downloads the raw CSV.

### Why React

React is the most widely used library for building interactive user interfaces. It comes bundled with Next.js, so choosing Next.js meant choosing React. It uses a component model: each piece of the UI (a card, a table, a filter dropdown) is a self-contained building block that manages its own state and appearance.

This project has five dashboard components and one long-form content page. React makes it straightforward to compose these from smaller pieces and update them efficiently when the user interacts (filtering, sorting, searching, expanding sections).

### Why TypeScript

TypeScript is JavaScript with a type system added on top. Claude Code scaffolded the project with TypeScript enabled because of how data flows through the app: raw CSV rows become classified issue objects, which get passed to components that expect specific fields. TypeScript ensures every step in this chain agrees on the shape of the data. If a field name is misspelled or a new theme is added without updating the type definitions, the code won't compile, catching errors before they reach users.

### Why Tailwind CSS v4

Tailwind CSS is a styling approach where instead of writing separate CSS files, you apply small utility classes directly in the HTML. Claude Code set this up as part of the standard Next.js scaffolding.

**Version 4** uses a CSS-first configuration model: all theme customization happens in a standard CSS file (`globals.css`) rather than a separate JavaScript config file. The project's entire theme is defined in 14 lines of CSS. There is no `tailwind.config.js` file; Tailwind v4 does not need one.

### Why Dark Theme

I chose a dark theme because the dashboard presents dense data: tables, metrics, color-coded priority badges, volume bars. Dark backgrounds with light text reduce visual fatigue when scanning large amounts of information. It also matches the aesthetic of developer tools (terminals, code editors, GitHub's dark mode), which is appropriate for a project analyzing a developer tool's issue backlog.

The color palette uses zinc-scale grays with a warm terracotta accent (`#E8825A`) for interactive elements. Priority levels use an intuitive traffic-light system: red for P0 (Critical), yellow for P1 (High), and blue for P2 (Medium).

### Why PapaParse and CSV Over a Database

The dataset is 1,000 rows with 8 columns. It does not change at runtime; no one is adding or editing issues through the dashboard. This makes a database unnecessary overhead. A CSV file is:

- **Human-readable**: you can open it in any text editor or spreadsheet app and see exactly what data the dashboard is using
- **Version-controlled**: it lives in the `data/` folder alongside the code, so every change is tracked in Git
- **Zero infrastructure**: no database server to set up, maintain, or pay for

PapaParse is the standard library for parsing CSV in JavaScript. Claude Code selected it when I asked for CSV support. The parsing happens server-side so the raw CSV never reaches the user's browser.

### Why Keyword-Based Classification

Each of the 1,000 issues is assigned to one of 7 themes (or "Other") using keyword matching. I directed Claude Code to build this classifier rather than using a machine learning model, for three reasons I can defend:

1. **Transparency**: anyone can read the keyword lists and understand exactly why an issue was classified a certain way. ML models are black boxes.
2. **Reproducibility**: running the classifier twice on the same data gives the same result. LLMs can give different answers each time.
3. **Simplicity**: the keyword lists were developed from the data itself (bottom-up clustering), so they already capture the natural language patterns in the issue titles.

The classifier works by scoring each issue's text against each theme's keyword list. Multi-word phrases score higher than single words because they are more specific. The estimated accuracy is plus or minus 15%, which is acknowledged in the analysis memo.

### Why Lucide React Icons

Lucide is an open-source icon library that Claude Code selected as part of the project setup. It provides clean, consistent SVG icons as React components and is the icon library used by the shadcn/ui ecosystem, which is widely adopted in Next.js projects.

### Why Server Components + Client Components

Next.js lets you choose whether each component runs on the server or in the browser. Claude Code structured the project to use both, and once it was explained to me, the split made intuitive sense:

- **Server Components** handle data loading and static content: they read the CSV, classify issues, and render the analysis memo. This work happens on the server so users never download the raw data.
- **Client Components** handle interactivity: search, filtering, sorting, pagination, and expandable sections. These run in the browser because they need to respond to user input.

The homepage *must* be a server component because it reads a file from disk, something browsers cannot do.

### Why Playwright for PDF Generation

The analysis memo is a long-form document that someone might want to read offline or share as a file. I asked Claude Code to set up a way to export it as a PDF, and it built a script (`generate-pdf.mjs`) that opens the live web page in a headless (invisible) Firefox browser and prints it to PDF. This ensures the PDF looks identical to the web page: same fonts, colors, layout.

Firefox was used instead of Chrome because its PDF engine handled the dark background and custom fonts more reliably for this layout. Claude Code initially tried Puppeteer (a Chrome-based tool) but switched to Playwright with Firefox when the output quality was better.

### Why Static Data in Constants

The file `src/lib/constants.ts` contains data that I authored, not data from the CSV:

- **Theme definitions**: the 7 themes with their descriptions, colors, and priority levels
- **User stories**: 7 "As a [persona], I need [feature] so that [benefit]" statements
- **Top 10 issues**: a manually curated, ranked list with rationale for each ranking
- **Priority color schemes**: the red/yellow/blue color codes for P0/P1/P2

This data is kept separate because it represents **editorial judgment**, not raw data. The theme descriptions, user stories, and top 10 rankings are the product of my analysis. They should not change just because the CSV is updated.

### Why Two CSV Files

The `data/` folder contains two CSV files:

1. **`claude_code_unique_1k_issues.csv`**: the primary dataset. 1,000 deduplicated issues used by the dashboard.
2. **`claude_code_issues.csv`**: the full, unfiltered dataset of ~6,246 issues. This is the raw source data before deduplication.

Only the first file is actually loaded by the application (`src/lib/data.ts` line 8). The full dataset is kept in the repository for transparency and reproducibility; anyone who wants to verify the deduplication process or run their own analysis can start from the same raw data. It is an audit trail, not an active data source.

### Why Vercel for Hosting

When I asked Claude Code how to deploy the site, it recommended Vercel, the company that builds Next.js. Their hosting platform is purpose-built for Next.js applications:

- **Zero configuration**: push code to GitHub, and Vercel builds and deploys it automatically
- **Server Components work out of the box**: the CSV parsing and classification happen on Vercel's servers, not in the user's browser
- **Free tier**: more than sufficient for a portfolio project

### Why Some Dependencies Are Unused

Three packages are installed but not used anywhere in the code. This is a normal artifact of iterative development with Claude Code; some tools were tried and replaced, others were included during scaffolding and never needed:

| Package | Why It's There | Why It's Unused |
|---|---|---|
| **Puppeteer** | Claude Code's first attempt at PDF generation | Replaced by Playwright when Firefox produced better output. Never removed from `package.json`. |
| **Recharts** | A charting library for bar/pie charts | The dashboard ended up using CSS-based volume bars instead. Likely planned for visualizations that were replaced by a simpler approach. |
| **class-variance-authority (CVA)** | A utility for component variants, part of the shadcn/ui ecosystem | Included during project scaffolding but never needed. No component variants were required. |

These could be removed from `package.json` without any effect on the application. They were left in place because removing them is a cleanup task, not a functional concern.

---

## 4. How the 7 Themes Were Prioritized

This is one of the most important decisions in the project, and it deserves a detailed explanation, especially because **the theme with the highest issue count is not the highest priority**.

### The Framework: Impact x Frequency x Risk

Every theme and every individual issue was evaluated on three dimensions:

| Dimension | What It Measures | Example |
|---|---|---|
| **Impact** | How severe is the consequence when this issue occurs? | A permission bypass that deletes a database is maximum impact regardless of how often it happens. |
| **Frequency** | How many users are affected, and how often? | A bug that breaks the Bash tool for all Windows users is high frequency across an entire platform. |
| **Risk** | How likely is this to escalate into something worse if left unfixed? | A runaway agent that ignores user commands is a precursor to loss-of-control scenarios. |

A theme's priority is determined by combining all three dimensions, **not by issue count alone**. Volume (how many issues exist under a theme) is one input to the Frequency dimension, but it can be outweighed by the other two.

### Why Issue Count Does Not Equal Priority

Here are the 7 themes sorted by issue count:

| Theme | Est. Issues | % of Total | Priority |
|---|---|---|---|
| Cross-Platform & VM | ~195 | 19.5% | **P0** |
| Context, Agents & Model | ~140 | 14% | P1 |
| Terminal Rendering & UI | ~130 | 13% | **P0** |
| MCP & Extensibility | ~120 | 12% | P1 |
| Auth, Sessions & Billing | ~115 | 11.5% | P1 |
| Memory & Performance | ~90 | 9% | P1 |
| **Permissions & Security** | **~75** | **7.5%** | **P0** |

Notice:
- **Cross-Platform & VM** has the most issues (195) and is P0. Here, volume and priority happen to align: the Bash tool is completely broken on Windows, locking out an entire platform.
- **Permissions & Security** has the *fewest* issues of any theme (75, just 7.5%) but is also P0. This is where the framework's strength shows.

### P0 Themes Explained

**P0 means "fix this before anything else."** Three themes are P0:

#### 1. Cross-Platform & VM (~195 issues, 19.5%)
- **Impact**: High. The Bash tool literally does not work on Windows. Users cannot execute any commands.
- **Frequency**: Very high. Affects every Windows, WSL, and enterprise AD user.
- **Risk**: Moderate. Unlikely to escalate, but locks out a large user segment entirely.
- **Why P0**: Pure breadth. Nearly 1 in 5 issues trace back to platform compatibility. A developer tool that does not work on Windows is not a cross-platform tool.

#### 2. Terminal Rendering & UI (~130 issues, 13%)
- **Impact**: High. Infinite `setState` loops crash sessions unrecoverably. Flickering and scroll corruption make the tool unusable.
- **Frequency**: High. Rendering bugs affect all users across all platforms, though severity varies by terminal emulator.
- **Risk**: Moderate. A crashed session means lost work, but the damage is bounded to that session.
- **Why P0**: When the user cannot see what the tool is doing, they cannot use it safely. Rendering failures also undermine trust ("is this thing working or not?").

#### 3. Permissions & Security (~75 issues, 7.5%), *lowest count, still P0*
- **Impact**: **Maximum**. An agent executing a destructive database command without consent (issue #26913) is a safety failure, not just a bug. CLAUDE.md directory traversal (issue #26944) is a potential data exfiltration vector.
- **Frequency**: Low in raw numbers, but any single occurrence can cause irreversible damage.
- **Risk**: **Maximum**. Claude Code is an AI agent with direct access to users' filesystems, codebases, and command lines. When the permission system fails, there is no second line of defense. This is the category most directly connected to Anthropic's Responsible Scaling Policy.
- **Why P0 despite the low count**: A single permission bypass that deletes a production database outweighs a hundred UI flickering bugs. The Impact and Risk dimensions are so high that they override the low Frequency score. For a company whose mission centers on AI safety, any issue where the agent takes an unauthorized destructive action is automatically the highest priority.

### P1 Themes Explained

**P1 means "important, fix soon, but not before P0 issues."** Four themes are P1:

#### 4. Context, Agents & Model (~140 issues, 14%)
- Plans lost after context compaction, subagent crashes, model hallucinations. Frustrating and workflow-disrupting, but recoverable. No data loss or safety risk in most cases.

#### 5. MCP & Extensibility (~120 issues, 12%)
- Plugin installs fail with 404s, MCP servers double-stringify parameters, hooks don't fire. Blocks ecosystem adoption but does not cause harm to existing workflows.

#### 6. Auth, Sessions & Billing (~115 issues, 11.5%)
- Hourly re-authentication, broken `/resume`, usage billing discrepancies. Painful for power users and CI/CD pipelines, but workarounds exist (re-login, start new sessions).

#### 7. Memory & Performance (~90 issues, 9%)
- 36 GB memory leaks, 537 GB disk leaks, kernel panics. These *sound* like they should be P0, and individual issues within this theme *can* be elevated to P0 (see below). But the theme as a whole stays P1 because most memory/performance issues degrade gradually and can be mitigated by restarting sessions. The catastrophic cases (kernel panics from 17 GB RAM consumption) are elevated to P0 individually through the critical-signal escalation system.

### The Other / Uncategorized Bucket (P2)

About 135 issues (~13.5%) do not clearly map to any of the 7 themes. These are classified as P2 (Medium priority) by default. They include edge cases, one-off bugs, and feature requests that do not cluster into a pattern.

---

## 5. How Theme Priorities Are Enforced in Code

The priority system operates at two levels:

### Level 1: Theme-Level Defaults

Each theme has a hardcoded priority in `src/lib/constants.ts`:

```
P0 themes: terminal-rendering, permissions-security, cross-platform
P1 themes: context-agents, mcp-extensibility, auth-billing, memory-performance
P2 default: other
```

### Level 2: Per-Issue Escalation

The `classifyPriority()` function in `src/lib/theme-classifier.ts` can **promote** an individual issue above its theme's default priority based on signal words in the issue text:

**Critical signals → automatically P0** (regardless of theme):
`crash`, `data loss`, `rm -rf`, `security`, `unusable`, `show-stopper`, `critical`, `breaking`, `blocker`, `kernel panic`, `sigkill`, `destructive`

**High signals → automatically P1** (if not already P0):
`bug`, `fail`, `error`, `broken`, `not work`, `regression`

This means:
- A Memory & Performance issue (theme default P1) that mentions "kernel panic" gets elevated to P0
- An MCP & Extensibility issue (theme default P1) that mentions "crash" gets elevated to P0
- An "Other" issue (theme default P2) that mentions "bug" or "error" gets elevated to P1

The escalation is one-directional: issues can be promoted but never demoted below their theme default.

### The Classification Waterfall

When an issue is processed, the priority is determined in this order:

1. Is the issue's theme P0? → assign P0
2. Does the issue text contain any critical signal word? → assign P0
3. Is the issue's theme P1? → assign P1
4. Does the issue text contain any high signal word? → assign P1
5. None of the above → assign P2

This runs for every one of the 1,000 issues at page load time, server-side.

---

## 6. Project Structure

```
tabithasportfolio/
│
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
├── next.config.ts                        # Next.js configuration (default)
├── postcss.config.mjs                    # PostCSS with Tailwind v4 plugin
├── eslint.config.mjs                     # Linting rules
├── generate-pdf.mjs                      # Script: renders /analysis as a PDF using Firefox
│
├── data/
│   ├── claude_code_unique_1k_issues.csv  # PRIMARY: 1,000 deduplicated issues (used by the app)
│   └── claude_code_issues.csv            # ARCHIVE: full 6,246 issues (kept for reproducibility)
│
├── public/                               # Static assets served as-is (favicons, SVGs)
│
└── src/
    ├── app/
    │   ├── globals.css                   # Tailwind v4 theme: colors, fonts, scrollbar styling
    │   ├── layout.tsx                    # Root layout: HTML shell, Geist fonts, metadata
    │   ├── page.tsx                      # Dashboard homepage: reads CSV, renders components
    │   └── analysis/
    │       └── page.tsx                  # Analysis memo: 9-section long-form write-up
    │
    ├── components/
    │   └── dashboard/
    │       ├── summary-cards.tsx          # 6 metric cards (total, P0, P1, P2, open, closed)
    │       ├── themes-overview.tsx        # Expandable theme rows with volume bars
    │       ├── issues-table.tsx           # Full table with search, filters, sort, pagination
    │       ├── top-issues.tsx             # Top 10 ranked issues (not currently rendered)
    │       └── user-stories.tsx           # User story cards (not currently rendered)
    │
    └── lib/
        ├── types.ts                      # TypeScript interfaces: Issue, Theme, Priority, etc.
        ├── data.ts                       # CSV loading + parsing (server-only, uses Node.js fs)
        ├── theme-classifier.ts           # Keyword-based theme + priority classification
        ├── constants.ts                  # Theme definitions, user stories, top 10, colors
        └── utils.ts                      # cn() utility: merges Tailwind classes cleanly
```

### How the pieces connect

```
CSV file (data/)
    ↓  read by fs.readFileSync()
data.ts (server-side)
    ↓  parsed by PapaParse
theme-classifier.ts
    ↓  classifyTheme() + classifyPriority()
page.tsx (server component)
    ↓  passes classified Issue[] as props
Dashboard components (client components)
    ↓  render interactive UI in the browser
User sees the dashboard
```

The constants file (`constants.ts`) feeds the theme overview and top issues components directly. It is editorial content, not derived from the CSV.
