import { notFound } from "next/navigation";
import { Header, Footer, SetupGrid } from "@/components";
import { getCategoriaBySlug } from "@/lib/data";
import type { SetupWithRelations } from "@/types";
import type { Metadata } from "next";
import type { LucideProps } from "lucide-react";
import {
  Sparkles,
  Monitor,
  Gamepad2,
  Briefcase,
  Palette,
  Moon,
  Sun,
  TreePine,
} from "lucide-react";

// Mapeamento de ícones por slug
const iconMap: Record<string, React.FC<LucideProps>> = {
  minimalista: Sparkles,
  moderno: Monitor,
  gamer: Gamepad2,
  trabalho: Briefcase,
  estiloso: Palette,
  escuro: Moon,
  claro: Sun,
  amadeirado: TreePine,
};

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

  const Icon = iconMap[slug] || Sparkles;

  // Transform setups to include required relations
  const setups: SetupWithRelations[] = categoria.setups;

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoriaAtiva={slug} />

      <main className="flex-1">
        {/* Category Header */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: categoria.cor
                    ? `${categoria.cor}20`
                    : "var(--accent-light)",
                }}
              >
                <Icon
                  className="h-8 w-8"
                  style={{ color: categoria.cor || "var(--accent)" }}
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">
                  {categoria.nome}
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  {setups.length} {setups.length === 1 ? "setup" : "setups"}
                </p>
              </div>
            </div>

            {categoria.descricao && (
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                {categoria.descricao}
              </p>
            )}
          </div>
        </section>

        {/* Setups Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-[1800px] mx-auto">
            <SetupGrid setups={setups} />

            {/* Load more button */}
            {setups.length >= 12 && (
              <div className="mt-12 text-center">
                <button className="btn-secondary">Carregar mais</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
