"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Package, FileSpreadsheet, FileDown, X } from "lucide-react";
import {
  exportSubmissionsToXLSX,
  exportSubmissionsToCSV,
} from "@/lib/export-utils";
import { SubmissionStatusBadge } from "./SubmissionStatusBadge";
import type { SubmissionWithRelations } from "@/types";

interface SubmissionsTableProps {
  submissions: SubmissionWithRelations[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filter === "all" || sub.status === filter;
    const matchesSearch =
      search === "" ||
      sub.userName.toLowerCase().includes(search.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      (sub.title && sub.title.toLowerCase().includes(search.toLowerCase()));

    // Filtro por data
    const subDate = new Date(sub.createdAt);
    const matchesDateFrom = !dateFrom || subDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || subDate <= new Date(dateTo + "T23:59:59");

    return matchesFilter && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Funções de seleção
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  const getSubmissionsForExport = () => {
    if (selectedIds.size > 0) {
      return filteredSubmissions.filter((s) => selectedIds.has(s.id));
    }
    return filteredSubmissions;
  };

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tabs de status */}
        <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendentes" },
            { key: "approved", label: "Aprovados" },
            { key: "rejected", label: "Rejeitados" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? "bg-[var(--background)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">
                ({statusCounts[tab.key as keyof typeof statusCounts]})
              </span>
            </button>
          ))}
        </div>

        {/* Busca */}
        <input
          type="text"
          placeholder="Buscar por nome, email ou título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />

        {/* Filtro de data */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] text-sm"
            title="Data inicial"
          />
          <span className="text-[var(--text-secondary)] text-sm">até</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] text-sm"
            title="Data final"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Limpar datas"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botões de exportação */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSubmissionsToXLSX(getSubmissionsForExport())}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] transition-colors"
            title={
              selectedIds.size > 0
                ? `Exportar ${selectedIds.size} selecionados`
                : "Exportar todos filtrados"
            }
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">
              Excel{selectedIds.size > 0 && ` (${selectedIds.size})`}
            </span>
          </button>
          <button
            onClick={() => exportSubmissionsToCSV(getSubmissionsForExport())}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] transition-colors"
            title={
              selectedIds.size > 0
                ? `Exportar ${selectedIds.size} selecionados`
                : "Exportar todos filtrados"
            }
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">
              CSV{selectedIds.size > 0 && ` (${selectedIds.size})`}
            </span>
          </button>
        </div>
      </div>

      {/* Barra de seleção */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-lg">
          <span className="text-sm text-[var(--text-primary)]">
            {selectedIds.size} submissão(ões) selecionada(s)
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-[#0071e3] hover:underline"
          >
            Limpar seleção
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-[var(--background-secondary)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
            <p className="text-[var(--text-secondary)]">
              {search || filter !== "all"
                ? "Nenhuma submissão encontrada com esses filtros."
                : "Nenhuma submissão recebida ainda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--background)]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === filteredSubmissions.length &&
                        filteredSubmissions.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Setup
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Produtos
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Data
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-[var(--background)] transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(submission.id)}
                        onChange={() => toggleSelection(submission.id)}
                        className="w-4 h-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
                      />
                    </td>

                    {/* Thumbnail e título */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {submission.images[0] ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[var(--background)]">
                            <Image
                              src={submission.images[0].storagePath}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-[var(--background)] flex items-center justify-center">
                            <Package className="h-5 w-5 text-[var(--text-secondary)]" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/submissions/${submission.id}`}
                            className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 hover:text-[#0071e3] transition-colors"
                          >
                            {submission.title || "Sem título"}
                          </Link>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {submission.images.length} imagem
                            {submission.images.length !== 1 ? "ns" : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Usuário */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--text-primary)]">
                        {submission.userName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {submission.userEmail}
                      </p>
                    </td>

                    {/* Produtos */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[var(--text-primary)]">
                        {submission.products.length}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <SubmissionStatusBadge status={submission.status} size="sm" />
                    </td>

                    {/* Data */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--text-primary)]">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {new Date(submission.createdAt).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[#0071e3] hover:bg-[var(--background)] rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
