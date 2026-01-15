"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  AffiliateStatsCards,
  AffiliatesTable,
} from "@/components/admin/affiliates";
import {
  getAffiliateStats,
  getAffiliateConfigs,
  updateAffiliateProductCounts,
} from "./actions";
import type { AffiliateStats } from "@/lib/affiliate/types";
import type { AffiliateConfig } from "@prisma/client";

export default function AffiliatesPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [configs, setConfigs] = useState<AffiliateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(async () => {
    try {
      const [statsData, configsData] = await Promise.all([
        getAffiliateStats(),
        getAffiliateConfigs(),
      ]);
      setStats(statsData);
      setConfigs(configsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReprocess = async () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/affiliates/reprocess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        if (data.success) {
          toast.success(
            `Reprocessado: ${data.data.updated} de ${data.data.processed} produtos`
          );
          await updateAffiliateProductCounts();
          await loadData();
        } else {
          toast.error(data.error || "Erro ao reprocessar");
        }
      } catch {
        toast.error("Erro ao reprocessar links");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            Links Afiliados
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Gerencie as configurações de links afiliados por loja
          </p>
        </div>
        <button
          onClick={handleReprocess}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
          />
          {isPending ? "Reprocessando..." : "Reprocessar Links"}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && <AffiliateStatsCards stats={stats} />}

      {/* Table */}
      <AffiliatesTable configs={configs} onUpdate={loadData} />
    </div>
  );
}
