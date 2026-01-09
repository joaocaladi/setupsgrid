import { HeaderWrapper, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getGruposWithCategorias } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias - SetupsGrid",
  description:
    "Explore todas as categorias de setups do SetupsGrid. Encontre inspiração por profissão, configuração, estética, ambiente e muito mais.",
};

export default async function CategoriasPage() {
  const grupos = await getGruposWithCategorias();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />

      <main className="flex-1">
        {/* Back button */}
        <div className="container-wide pt-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container-text">
            <h1 className="text-display text-[var(--text-primary)] mb-4">
              Categorias.
            </h1>
            <p className="text-body-large text-[var(--text-secondary)]">
              Explore setups por profissão, configuração, estética, ambiente e
              muito mais.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="pb-20 md:pb-32">
          <div className="container-wide">
            <div className="space-y-16">
              {grupos.map((grupo) => (
                <div key={grupo.id}>
                  <h2 className="text-h2 text-[var(--text-primary)] mb-6">
                    {grupo.nome}
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
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
