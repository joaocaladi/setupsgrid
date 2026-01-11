import { notFound } from "next/navigation";
import Link from "next/link";
import { HeaderWrapper, Footer, SetupGrid } from "@/components";
import { getGrupoBySlug } from "@/lib/data";
import type { SetupWithRelations } from "@/types";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grupo = await getGrupoBySlug(slug);

  if (!grupo) {
    return {
      title: "Grupo não encontrado - Gridiz",
    };
  }

  return {
    title: `${grupo.nome} - Gridiz`,
    description: `Explore setups de ${grupo.nome.toLowerCase()}. Encontre inspiração para o seu workspace.`,
  };
}

export default async function GrupoPage({ params }: PageProps) {
  const { slug } = await params;
  const grupo = await getGrupoBySlug(slug);

  if (!grupo) {
    notFound();
  }

  // Collect all unique setups from all categories in this group
  const setupsMap = new Map<string, SetupWithRelations>();
  grupo.categorias.forEach((categoria) => {
    categoria.setups.forEach((setup) => {
      if (!setupsMap.has(setup.id)) {
        setupsMap.set(setup.id, setup as SetupWithRelations);
      }
    });
  });
  const setups = Array.from(setupsMap.values());

  // Sort by destaque and createdAt
  setups.sort((a, b) => {
    if (a.destaque !== b.destaque) {
      return b.destaque ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />

      <main className="flex-1">
        {/* Group Header */}
        <section className="section-padding">
          <div className="container-text">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-8">
              <Link
                href="/"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Todos
              </Link>
              <ChevronLeft className="h-3 w-3 text-[var(--text-tertiary)] rotate-180" />
              <Link
                href="/categorias"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Categorias
              </Link>
              <ChevronLeft className="h-3 w-3 text-[var(--text-tertiary)] rotate-180" />
              <span className="text-[var(--text-primary)]">{grupo.nome}</span>
            </div>

            {/* Title */}
            <h1 className="text-display text-[var(--text-primary)] mb-4">
              {grupo.nome}.
            </h1>

            {/* Description */}
            <p className="text-body-large text-[var(--text-secondary)] max-w-[680px]">
              Explore nossa seleção de setups de {grupo.nome.toLowerCase()} e
              encontre inspiração para o seu workspace.
            </p>
          </div>
        </section>

        {/* Categories in this group */}
        <section className="pb-12">
          <div className="container-wide">
            <h2 className="text-h3 text-[var(--text-primary)] mb-6">
              Categorias
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {grupo.categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/categoria/${categoria.slug}`}
                  className="group px-4 py-3 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)] transition-all"
                >
                  <p className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {categoria.nome}
                  </p>
                  {categoria._count && categoria._count.setups > 0 && (
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {categoria._count.setups}{" "}
                      {categoria._count.setups === 1 ? "setup" : "setups"}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Setups Grid */}
        <section className="pb-20 md:pb-32">
          <div className="container-wide">
            {/* Section header */}
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-h3 text-[var(--text-primary)]">
                Setups
              </h2>
              <span className="text-caption">
                {setups.length} {setups.length === 1 ? "setup" : "setups"}
              </span>
            </div>

            {/* Grid */}
            {setups.length > 0 ? (
              <SetupGrid setups={setups} />
            ) : (
              <div className="text-center py-20">
                <p className="text-body text-[var(--text-secondary)]">
                  Nenhum setup encontrado neste grupo.
                </p>
                <Link href="/" className="btn-primary mt-6 inline-block">
                  Ver todos os setups
                </Link>
              </div>
            )}

            {/* Load more button */}
            {setups.length >= 12 && (
              <div className="mt-16 text-center">
                <button className="link-arrow">Ver mais setups</button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-[var(--background-tertiary)]">
          <div className="container-text text-center">
            <h2 className="text-h2 text-[var(--text-primary)] mb-4">
              Explore outras categorias.
            </h2>
            <p className="text-body-large text-[var(--text-secondary)] mb-8 max-w-[600px] mx-auto">
              Descubra mais estilos e encontre o setup perfeito para você.
            </p>
            <Link href="/categorias" className="btn-primary">
              Ver todas as categorias
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
