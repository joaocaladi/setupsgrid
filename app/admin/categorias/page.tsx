"use client";

import { useEffect, useState } from "react";
import { Pencil, X, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getCategoriasWithGrupos, updateCategoria } from "../actions";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  descricao: string | null;
  grupoId: string | null;
  _count: {
    setups: number;
  };
}

interface GrupoCategoria {
  id: string;
  nome: string;
  slug: string;
  categorias: Categoria[];
}

export default function CategoriasPage() {
  const [grupos, setGrupos] = useState<GrupoCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedGrupos, setExpandedGrupos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategorias();
  }, []);

  async function loadCategorias() {
    try {
      const data = await getCategoriasWithGrupos();
      setGrupos(data as GrupoCategoria[]);
      // Expandir todos os grupos por padrão
      setExpandedGrupos(new Set(data.map((g: GrupoCategoria) => g.id)));
    } catch {
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }

  function toggleGrupo(grupoId: string) {
    setExpandedGrupos((prev) => {
      const next = new Set(prev);
      if (next.has(grupoId)) {
        next.delete(grupoId);
      } else {
        next.add(grupoId);
      }
      return next;
    });
  }

  async function handleSave() {
    if (!editingCategoria) return;

    setSaving(true);
    try {
      const result = await updateCategoria(editingCategoria.id, {
        nome: editingCategoria.nome,
        slug: editingCategoria.slug,
        icone: editingCategoria.icone || undefined,
        descricao: editingCategoria.descricao || undefined,
      });

      if (result.success) {
        toast.success("Categoria atualizada!");
        // Recarregar para refletir as mudanças
        await loadCategorias();
        setEditingCategoria(null);
      } else {
        toast.error(result.error || "Erro ao atualizar");
      }
    } catch {
      toast.error("Erro ao atualizar categoria");
    } finally {
      setSaving(false);
    }
  }

  const totalCategorias = grupos.reduce(
    (acc, grupo) => acc + grupo.categorias.length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#0071e3]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Categorias
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          {grupos.length} grupos, {totalCategorias} categorias
        </p>
      </div>

      {/* Groups and Categories */}
      <div className="space-y-4">
        {grupos.map((grupo) => (
          <div
            key={grupo.id}
            className="bg-[var(--background-secondary)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGrupo(grupo.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--background)] transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedGrupos.has(grupo.id) ? (
                  <ChevronDown className="h-5 w-5 text-[var(--text-secondary)]" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-[var(--text-secondary)]" />
                )}
                <span className="font-semibold text-[var(--text-primary)]">
                  {grupo.nome}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  ({grupo.categorias.length} categorias)
                </span>
              </div>
            </button>

            {/* Categories Table */}
            {expandedGrupos.has(grupo.id) && grupo.categorias.length > 0 && (
              <div className="border-t border-[var(--border)]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--background)]">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        Setups
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {grupo.categorias.map((categoria) => (
                      <tr
                        key={categoria.id}
                        className="hover:bg-[var(--background)] transition-colors"
                      >
                        <td className="px-6 py-3">
                          <span className="text-sm text-[var(--text-primary)]">
                            {categoria.nome}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <code className="text-xs text-[var(--text-secondary)] bg-[var(--background)] px-2 py-1 rounded">
                            {categoria.slug}
                          </code>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm text-[var(--text-primary)]">
                            {categoria._count.setups}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => setEditingCategoria(categoria)}
                              className="p-2 text-[var(--text-secondary)] hover:text-[#0071e3] hover:bg-[var(--background)] rounded-lg transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCategoria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditingCategoria(null)}
          />
          <div className="relative bg-[var(--background-secondary)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Editar Categoria
              </h3>
              <button
                onClick={() => setEditingCategoria(null)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Nome
                </label>
                <input
                  type="text"
                  value={editingCategoria.nome}
                  onChange={(e) =>
                    setEditingCategoria({
                      ...editingCategoria,
                      nome: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategoria.slug}
                  onChange={(e) =>
                    setEditingCategoria({
                      ...editingCategoria,
                      slug: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={editingCategoria.descricao || ""}
                  onChange={(e) =>
                    setEditingCategoria({
                      ...editingCategoria,
                      descricao: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setEditingCategoria(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ED] rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
