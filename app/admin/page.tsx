import Link from "next/link";
import { Plus } from "lucide-react";
import { StatsCards } from "@/components/admin/StatsCards";
import { SetupsTable } from "@/components/admin/SetupsTable";
import { getAdminSetups, getAdminStats, getCategorias } from "./actions";

export default async function AdminDashboard() {
  const [setups, stats, categorias] = await Promise.all([
    getAdminSetups(),
    getAdminStats(),
    getCategorias(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gerencie os setups do Gridiz
          </p>
        </div>
        <Link
          href="/admin/setups/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Setup
        </Link>
      </div>

      {/* Stats */}
      <StatsCards
        totalSetups={stats.totalSetups}
        totalProdutos={stats.totalProdutos}
        setupsDestaque={stats.setupsDestaque}
      />

      {/* Setups Table */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Todos os Setups
        </h2>
        <SetupsTable setups={setups} categorias={categorias} />
      </div>
    </div>
  );
}
