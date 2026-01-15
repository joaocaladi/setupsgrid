"use client";

import { Link2, CheckCircle, Clock, Package } from "lucide-react";
import type { AffiliateStats } from "@/lib/affiliate/types";

interface AffiliateStatsCardsProps {
  stats: AffiliateStats;
}

export function AffiliateStatsCards({ stats }: AffiliateStatsCardsProps) {
  const cards = [
    {
      label: "Total de Lojas",
      value: stats.total,
      icon: Link2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Ativos",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pendente Config",
      value: stats.pendingConfig,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Produtos c/ Afiliado",
      value: stats.totalProductsWithAffiliate,
      icon: Package,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
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
                <p className="text-sm text-[var(--text-secondary)]">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">
                  {card.value}
                </p>
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
