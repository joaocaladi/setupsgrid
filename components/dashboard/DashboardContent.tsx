"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile, Setup, Categoria, SetupStatus } from "@prisma/client";
import { deleteUserSetup } from "@/app/dashboard/actions";

type SetupWithCategories = Setup & {
  categorias: Categoria[];
};

type ProfileWithSetups = Profile & {
  setups: SetupWithCategories[];
};

interface DashboardContentProps {
  profile: ProfileWithSetups;
}

function getStatusBadge(status: SetupStatus) {
  switch (status) {
    case "draft":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
          Rascunho
        </span>
      );
    case "published":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
          Publicado
        </span>
      );
    case "archived":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-500/10 text-gray-500">
          Arquivado
        </span>
      );
    default:
      return null;
  }
}

export function DashboardContent({ profile }: DashboardContentProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalViews = profile.setups.reduce(
    (acc, setup) => acc + setup.visualizacoes,
    0
  );

  const publishedCount = profile.setups.filter(s => s.status === "published").length;
  const draftCount = profile.setups.filter(s => s.status === "draft").length;

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteUserSetup(id);

    if (result.success) {
      toast.success("Setup excluído com sucesso");
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao excluir setup");
    }

    setDeletingId(null);
  }

  return (
    <div className="container-wide py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gerencie seus setups e acompanhe o desempenho
          </p>
        </div>
        <Link
          href="/setup/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0071e3] text-white font-medium hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo Setup
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Total</p>
          <p className="text-3xl font-semibold text-[var(--text-primary)] mt-1">
            {profile.setups.length}
          </p>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Publicados</p>
          <p className="text-3xl font-semibold text-green-500 mt-1">
            {publishedCount}
          </p>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Rascunhos</p>
          <p className="text-3xl font-semibold text-amber-500 mt-1">
            {draftCount}
          </p>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Visualizações</p>
          <p className="text-3xl font-semibold text-[var(--text-primary)] mt-1">
            {totalViews.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Setups List */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Meus Setups
        </h2>

        {profile.setups.length === 0 ? (
          <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-8 text-center">
            <p className="text-[var(--text-secondary)] mb-4">
              Você ainda não publicou nenhum setup.
            </p>
            <Link
              href="/setup/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071e3] text-white font-medium hover:bg-[#0077ED] transition-colors"
            >
              <Plus className="h-5 w-5" />
              Criar primeiro setup
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.setups.map((setup) => (
              <div
                key={setup.id}
                className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="relative w-full sm:w-40 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={setup.imagemUrl}
                    alt={setup.titulo}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[var(--text-primary)] truncate">
                      {setup.titulo}
                    </h3>
                    {getStatusBadge(setup.status)}
                  </div>
                  {setup.categorias.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {setup.categorias.slice(0, 3).map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs px-2 py-1 rounded-full bg-[var(--background-tertiary)] text-[var(--text-secondary)]"
                        >
                          {cat.nome}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {setup.visualizacoes.toLocaleString("pt-BR")}
                    </span>
                    <span>
                      {new Date(setup.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  {setup.status === "published" && (
                    <Link
                      href={`/setup/${setup.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sm:hidden">Ver</span>
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/setup/${setup.id}/edit`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sm:hidden">Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(setup.id, setup.titulo)}
                    disabled={deletingId === setup.id}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sm:hidden">Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
