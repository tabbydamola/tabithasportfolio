"use client";

import { PRIORITY_COLORS } from "@/lib/constants";
import { AlertTriangle, CheckCircle, CircleDot, Layers } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  p0: number;
  p1: number;
  p2: number;
  open: number;
  closed: number;
}

export function SummaryCards({ total, p0, p1, p2, open, closed }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Issues",
      value: total,
      icon: Layers,
      color: "#E8825A",
      bg: "rgba(232,130,90,0.12)",
      border: "rgba(232,130,90,0.3)",
    },
    {
      label: "P0 — Critical",
      value: p0,
      icon: AlertTriangle,
      ...PRIORITY_COLORS.P0,
    },
    {
      label: "P1 — High",
      value: p1,
      icon: CircleDot,
      ...PRIORITY_COLORS.P1,
    },
    {
      label: "P2 — Medium",
      value: p2,
      icon: CheckCircle,
      ...PRIORITY_COLORS.P2,
    },
    {
      label: "Open",
      value: open,
      icon: CircleDot,
      color: "#22C55E",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.3)",
    },
    {
      label: "Closed",
      value: closed,
      icon: CheckCircle,
      color: "#6B7280",
      bg: "rgba(107,114,128,0.12)",
      border: "rgba(107,114,128,0.3)",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#E8825A] mb-4">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4 transition-all hover:scale-[1.02]"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} style={{ color: card.color }} />
              <span className="text-xs text-zinc-400 font-medium">{card.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>
              {card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
