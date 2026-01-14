"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  RefreshCw,
  MoreHorizontal,
  Search,
  Clock,
} from "lucide-react";
import { LinkStatusBadge } from "./LinkStatusBadge";
import { checkProductLink } from "@/app/admin/links/actions";
import type { ProductWithLinkInfo } from "@/app/admin/links/actions";
import type { LinkStatus } from "@prisma/client";

interface LinksTableProps {
  products: ProductWithLinkInfo[];
  onProductCheck?: (productId: string) => void;
  onShowHistory?: (productId: string) => void;
}

const statusTabs: Array<{ value: LinkStatus | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "broken", label: "Quebrados" },
  { value: "unknown", label: "Não verificados" },
];

export function LinksTable({
  products,
  onProductCheck,
  onShowHistory,
}: LinksTableProps) {
  const [isPending, startTransition] = useTransition();
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LinkStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheck = async (productId: string) => {
    setCheckingId(productId);
    startTransition(async () => {
      await checkProductLink(productId);
      setCheckingId(null);
      onProductCheck?.(productId);
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesTab = activeTab === "all" || product.linkStatus === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.loja?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs e busca */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-1 bg-[var(--background-secondary)] p-1 rounded-lg">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.value
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Produto
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Loja
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Última verificação
                </th>
                <th className="text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[var(--text-secondary)]"
                  >
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[var(--background-tertiary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[var(--background)] flex-shrink-0 overflow-hidden">
                          {product.imagemUrl ? (
                            <Image
                              src={product.imagemUrl}
                              alt={product.nome}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-lg">
                              📦
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">
                            {product.nome}
                          </p>
                          <Link
                            href={`/setup/${product.setup.id}`}
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] truncate block max-w-[200px]"
                          >
                            {product.setup.titulo}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--text-primary)]">
                        {product.loja || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <LinkStatusBadge status={product.linkStatus} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(product.linkLastCheckedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {product.linkCompra && (
                          <a
                            href={product.linkCompra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
                            title="Abrir link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleCheck(product.id)}
                          disabled={isPending && checkingId === product.id}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors disabled:opacity-50"
                          title="Verificar agora"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              isPending && checkingId === product.id
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onShowHistory?.(product.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
                          title="Ver histórico"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm text-[var(--text-secondary)]">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </p>
    </div>
  );
}
