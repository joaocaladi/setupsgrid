"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Link2 } from "lucide-react";
import {
  LinkStatsCards,
  LinksTable,
  LinkCheckHistoryModal,
} from "@/components/admin/links";
import {
  getLinkStats,
  getProductsWithLinks,
  type LinkStats,
  type ProductWithLinkInfo,
} from "./actions";

export default function LinksPage() {
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [products, setProducts] = useState<ProductWithLinkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [historyModalProduct, setHistoryModalProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [statsData, productsData] = await Promise.all([
        getLinkStats(),
        getProductsWithLinks(),
      ]);
      setStats(statsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBulkCheck = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/links/bulk-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 50 }),
      });
      const data = await response.json();
      if (data.success) {
        await loadData();
      }
    } catch (error) {
      console.error("Erro ao verificar links:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleShowHistory = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setHistoryModalProduct({ id: productId, name: product.nome });
    }
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
            Verificação de Links
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Gerencie e verifique os links de produtos do Gridiz
          </p>
        </div>
        <button
          onClick={handleBulkCheck}
          disabled={checking}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Verificando..." : "Verificar Todos"}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && <LinkStatsCards stats={stats} />}

      {/* Última verificação */}
      {stats?.lastCheck && (
        <p className="text-sm text-[var(--text-secondary)]">
          Última verificação:{" "}
          {new Date(stats.lastCheck).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {/* Table */}
      <LinksTable
        products={products}
        onProductCheck={loadData}
        onShowHistory={handleShowHistory}
      />

      {/* History Modal */}
      {historyModalProduct && (
        <LinkCheckHistoryModal
          productId={historyModalProduct.id}
          productName={historyModalProduct.name}
          isOpen={!!historyModalProduct}
          onClose={() => setHistoryModalProduct(null)}
        />
      )}
    </div>
  );
}
