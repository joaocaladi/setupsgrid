"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Settings } from "lucide-react";
import { AffiliateStatusBadge } from "./AffiliateStatusBadge";
import type { AffiliateConfig } from "@prisma/client";
import type { AffiliateFilterTab } from "@/lib/affiliate/types";

interface AffiliatesTableProps {
  configs: AffiliateConfig[];
  onUpdate?: () => void;
}

const statusTabs: Array<{ value: AffiliateFilterTab; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "pending", label: "Pendente Config" },
  { value: "inactive", label: "Inativos" },
];

export function AffiliatesTable({ configs }: AffiliatesTableProps) {
  const [activeTab, setActiveTab] = useState<AffiliateFilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConfigs = configs.filter((config) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && config.isActive) ||
      (activeTab === "pending" && !config.isActive && !config.affiliateCode) ||
      (activeTab === "inactive" && !config.isActive && config.affiliateCode);

    const matchesSearch =
      searchTerm === "" ||
      config.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.domains.some((d) =>
        d.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "parameter":
        return "Parâmetro";
      case "redirect":
        return "Redirect";
      case "replace":
        return "Replace";
      default:
        return type;
    }
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
            placeholder="Buscar loja..."
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
                  Loja
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Programa
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Tipo
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Produtos
                </th>
                <th className="text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-4 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredConfigs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[var(--text-secondary)]"
                  >
                    Nenhuma loja encontrada
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((config) => (
                  <tr
                    key={config.id}
                    className="hover:bg-[var(--background-tertiary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {config.storeName}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {config.domains.slice(0, 2).join(", ")}
                          {config.domains.length > 2 &&
                            ` +${config.domains.length - 2}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--text-primary)]">
                        {config.programName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--text-primary)]">
                        {getTypeLabel(config.affiliateType)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AffiliateStatusBadge
                        isActive={config.isActive}
                        hasCode={!!config.affiliateCode}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--text-primary)]">
                        {config.productCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {config.programUrl && (
                          <a
                            href={config.programUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
                            title="Abrir programa"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/affiliates/${config.storeKey}`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
                          title="Configurar"
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
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
        Mostrando {filteredConfigs.length} de {configs.length} lojas
      </p>
    </div>
  );
}
