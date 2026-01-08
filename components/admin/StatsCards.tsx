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
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total de Produtos",
      value: totalProdutos,
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Setups em Destaque",
      value: setupsDestaque,
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1d1d1f]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#86868b]">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
