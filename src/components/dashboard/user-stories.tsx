"use client";

import { USER_STORIES, THEMES } from "@/lib/constants";
import { UserStory, ThemeId } from "@/lib/types";
import { MessageSquareQuote } from "lucide-react";

function getThemeColor(themeId: ThemeId): string {
  return THEMES.find((t) => t.id === themeId)?.color || "#6B7280";
}

function getThemeLabel(themeId: ThemeId): string {
  return THEMES.find((t) => t.id === themeId)?.label || "Other";
}

function StoryCard({ story }: { story: UserStory }) {
  const color = getThemeColor(story.theme);

  return (
    <div
      className="rounded-xl p-5 transition-all hover:scale-[1.01]"
      style={{
        background: `${color}0D`,
        border: `1px solid ${color}33`,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <MessageSquareQuote size={16} style={{ color }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-zinc-200 leading-relaxed">
          &ldquo;As <span className="font-semibold text-zinc-100">{story.persona}</span>, I need{" "}
          <span style={{ color }} className="font-semibold">
            {story.need}
          </span>{" "}
          so that {story.reason}.&rdquo;
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ color, background: `${color}22`, border: `1px solid ${color}33` }}
        >
          {getThemeLabel(story.theme)}
        </span>
        <span className="text-[10px] text-zinc-500">{story.issueCount} related issues</span>
      </div>
    </div>
  );
}

export function UserStories() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#E8825A] mb-1">Synthesized User Stories</h2>
      <p className="text-xs text-zinc-500 mb-4">
        Consolidated user needs derived from clustering 1,000 issues
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {USER_STORIES.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
