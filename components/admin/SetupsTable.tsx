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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] placeholder:text-[#86868b]"
          />
        </div>
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] bg-white"
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
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#f5f5f7]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Setup
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Categorias
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Produtos
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Destaque
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredSetups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[#86868b]"
                  >
                    Nenhum setup encontrado
                  </td>
                </tr>
              ) : (
                filteredSetups.map((setup) => (
                  <tr
                    key={setup.id}
                    className="hover:bg-[#f5f5f7] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                          {setup.imagemUrl ? (
                            <Image
                              src={setup.imagemUrl}
                              alt={setup.titulo}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#86868b]">
                              ?
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#1d1d1f] line-clamp-1">
                            {setup.titulo}
                          </p>
                          {setup.autor && (
                            <p className="text-sm text-[#86868b]">
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
                            className="px-2 py-1 text-xs font-medium bg-[#f5f5f7] text-[#1d1d1f] rounded-md"
                          >
                            {cat.nome}
                          </span>
                        ))}
                        {setup.categorias.length > 2 && (
                          <span className="px-2 py-1 text-xs font-medium bg-[#f5f5f7] text-[#86868b] rounded-md">
                            +{setup.categorias.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[#1d1d1f]">
                        {setup.produtos.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {setup.destaque ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded-md">
                          Sim
                        </span>
                      ) : (
                        <span className="text-sm text-[#86868b]">Não</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/setups/${setup.id}`}
                          className="p-2 text-[#86868b] hover:text-[#0071e3] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(setup)}
                          disabled={deletingId === setup.id}
                          className="p-2 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
              Excluir setup?
            </h3>
            <p className="text-[#86868b] mb-6">
              Tem certeza que deseja excluir &quot;{setupToDelete.titulo}&quot;? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
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
