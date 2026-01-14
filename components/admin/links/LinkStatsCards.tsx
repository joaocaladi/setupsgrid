"use client";

import { Link2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { LinkStats } from "@/app/admin/links/actions";

interface LinkStatsCardsProps {
  stats: LinkStats;
}

export function LinkStatsCards({ stats }: LinkStatsCardsProps) {
  const cards = [
    {
      label: "Total com Link",
      value: stats.total,
      icon: Link2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Links Ativos",
      value: stats.active,
      percentage: stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : "0",
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Links Quebrados",
      value: stats.broken,
      percentage: stats.total > 0 ? ((stats.broken / stats.total) * 100).toFixed(1) : "0",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Não Verificados",
      value: stats.unknown,
      percentage: stats.total > 0 ? ((stats.unknown / stats.total) * 100).toFixed(1) : "0",
      icon: HelpCircle,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-[var(--background-secondary)] rounded-xl p-5 border border-[var(--border)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{card.label}</p>
                <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">
                  {card.value}
                </p>
                {card.percentage && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {card.percentage}%
                  </p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
