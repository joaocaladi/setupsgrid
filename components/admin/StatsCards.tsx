import { Monitor, Package, Star } from "lucide-react";

interface StatsCardsProps {
  totalSetups: number;
  totalProdutos: number;
  setupsDestaque: number;
}

export function StatsCards({
  totalSetups,
  totalProdutos,
  setupsDestaque,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total de Setups",
      value: totalSetups,
      icon: Monitor,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Total de Produtos",
      value: totalProdutos,
      icon: Package,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Setups em Destaque",
      value: setupsDestaque,
      icon: Star,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
