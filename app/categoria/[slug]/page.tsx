import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer, SetupGrid } from "@/components";
import { getCategoriaBySlug } from "@/lib/data";
import type { SetupWithRelations } from "@/types";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaBySlug(slug);

  if (!categoria) {
    return {
      title: "Categoria não encontrada - SetupsGrid",
    };
  }

  return {
    title: `${categoria.nome} - SetupsGrid`,
    description:
      categoria.descricao ||
      `Explore setups ${categoria.nome.toLowerCase()} para inspirar seu workspace.`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const categoria = await getCategoriaBySlug(slug);

  if (!categoria) {
    notFound();
  }

  const setups: SetupWithRelations[] = categoria.setups;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header categoriaAtiva={slug} />

      <main className="flex-1">
        {/* Category Header - Apple style */}
        <section className="section-padding">
          <div className="container-text">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline text-sm mb-8"
            >
              <ChevronLeft className="h-4 w-4" />
              Todos os setups
            </Link>

            {/* Title */}
            <h1 className="text-display text-[var(--text-primary)] mb-4">
              {categoria.nome}.
            </h1>

            {/* Description */}
            {categoria.descricao ? (
              <p className="text-body-large text-[var(--text-secondary)] max-w-[680px]">
                {categoria.descricao}
              </p>
            ) : (
              <p className="text-body-large text-[var(--text-secondary)] max-w-[680px]">
                Explore nossa seleção de setups {categoria.nome.toLowerCase()} e encontre
                inspiração para o seu workspace.
              </p>
            )}
          </div>
        </section>

        {/* Setups Grid */}
        <section className="pb-20 md:pb-32">
          <div className="container-wide">
            {/* Section header */}
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-h3 text-[var(--text-primary)]">
                Setups {categoria.nome.toLowerCase()}
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
                  Nenhum setup encontrado nesta categoria.
                </p>
                <Link href="/" className="btn-primary mt-6 inline-block">
                  Ver todos os setups
                </Link>
              </div>
            )}

            {/* Load more button - Apple style */}
            {setups.length >= 12 && (
              <div className="mt-16 text-center">
                <button className="link-arrow">
                  Ver mais setups
                </button>
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
            <Link href="/" className="btn-primary">
              Ver todas as categorias
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
