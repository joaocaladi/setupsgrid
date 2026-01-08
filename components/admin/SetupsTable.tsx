"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSetup } from "@/app/admin/actions";
import type { SetupWithRelations } from "@/types";
import type { Categoria } from "@prisma/client";

interface SetupsTableProps {
  setups: SetupWithRelations[];
  categorias: Categoria[];
}

export function SetupsTable({ setups: initialSetups, categorias }: SetupsTableProps) {
  const [setups, setSetups] = useState(initialSetups);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setupToDelete, setSetupToDelete] = useState<SetupWithRelations | null>(null);

  // Filtrar setups
  const filteredSetups = setups.filter((setup) => {
    const matchesSearch = setup.titulo
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategoria =
      !categoriaFilter ||
      setup.categorias.some((c) => c.id === categoriaFilter);
    return matchesSearch && matchesCategoria;
  });

  async function handleDelete() {
    if (!setupToDelete) return;

    setDeletingId(setupToDelete.id);
    setShowDeleteModal(false);

    try {
      const result = await deleteSetup(setupToDelete.id);

      if (result.success) {
        setSetups((prev) => prev.filter((s) => s.id !== setupToDelete.id));
        toast.success("Setup excluído com sucesso!");
      } else {
        toast.error(result.error || "Erro ao excluir setup");
      }
    } catch {
      toast.error("Erro ao excluir setup");
    } finally {
      setDeletingId(null);
      setSetupToDelete(null);
    }
  }

  function confirmDelete(setup: SetupWithRelations) {
    setSetupToDelete(setup);
    setShowDeleteModal(true);
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] bg-[var(--background)]"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--background-secondary)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Setup
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Categorias
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Produtos
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Destaque
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredSetups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[var(--text-secondary)]"
                  >
                    Nenhum setup encontrado
                  </td>
                </tr>
              ) : (
                filteredSetups.map((setup) => (
                  <tr
                    key={setup.id}
                    className="hover:bg-[var(--background)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--background)] flex-shrink-0">
                          {setup.imagemUrl ? (
                            <Image
                              src={setup.imagemUrl}
                              alt={setup.titulo}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                              ?
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)] line-clamp-1">
                            {setup.titulo}
                          </p>
                          {setup.autor && (
                            <p className="text-sm text-[var(--text-secondary)]">
                              por {setup.autor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {setup.categorias.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-1 text-xs font-medium bg-[var(--background)] text-[var(--text-primary)] rounded-md"
                          >
                            {cat.nome}
                          </span>
                        ))}
                        {setup.categorias.length > 2 && (
                          <span className="px-2 py-1 text-xs font-medium bg-[var(--background)] text-[var(--text-secondary)] rounded-md">
                            +{setup.categorias.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[var(--text-primary)]">
                        {setup.produtos.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {setup.destaque ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-md">
                          Sim
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--text-secondary)]">Não</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/setups/${setup.id}`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[#0071e3] hover:bg-[var(--background)] rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(setup)}
                          disabled={deletingId === setup.id}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === setup.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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

      {/* Delete Modal */}
      {showDeleteModal && setupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-[var(--background-secondary)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Excluir setup?
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Tem certeza que deseja excluir &quot;{setupToDelete.titulo}&quot;? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
