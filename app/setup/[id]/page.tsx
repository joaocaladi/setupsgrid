import { notFound } from "next/navigation";
import Link from "next/link";
import { HeaderWrapper, Footer, ProductCard, SetupGallery, SetupGrid } from "@/components";
import { getSetupById, getRelatedSetups } from "@/lib/data";
import { formatPrice, calculateTotalPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const setup = await getSetupById(id);

  if (!setup) {
    return {
      title: "Setup não encontrado - Gridiz",
    };
  }

  return {
    title: `${setup.titulo} - Gridiz`,
    description:
      setup.descricao ||
      `Confira este setup incrível e descubra todos os produtos usados.`,
    openGraph: {
      images: [setup.imagemUrl],
    },
  };
}

export default async function SetupPage({ params }: PageProps) {
  const { id } = await params;
  const setup = await getSetupById(id);

  if (!setup) {
    notFound();
  }

  const totalPrice = calculateTotalPrice(setup.produtos);
  const productsWithPrice = setup.produtos.filter((p) => p.preco);

  const categoriaIds = setup.categorias.map((cat) => cat.id);
  const relatedSetups = await getRelatedSetups(setup.id, categoriaIds);

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

        {/* Main content - Two column layout */}
        <section className="container-wide pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left column - Image Gallery */}
            <div className="lg:w-1/2">
              <div className="lg:sticky lg:top-20">
                <SetupGallery
                  imagemPrincipal={setup.imagemUrl}
                  imagens={setup.imagens}
                  titulo={setup.titulo}
                  isVideo={setup.isVideo}
                  videoUrl={setup.videoUrl}
                  produtos={setup.produtos}
                />
              </div>
            </div>

            {/* Right column - Content */}
            <div className="lg:w-1/2">
              {/* Categories */}
              {setup.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {setup.categorias.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      className="badge-apple hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                    >
                      {cat.nome}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-h1 text-[var(--text-primary)] mb-3">
                {setup.titulo}
              </h1>

              {/* Author */}
              {setup.autor && (
                <p className="text-body-large text-[var(--text-secondary)] mb-6">
                  por {setup.autor}
                </p>
              )}

              {/* Description */}
              {setup.descricao && (
                <p className="text-body text-[var(--text-secondary)] mb-8">
                  {setup.descricao}
                </p>
              )}

              {/* Products section */}
              <div>
                <h2 className="text-h3 text-[var(--text-primary)] mb-6">
                  Produtos do setup
                </h2>
                <div className="space-y-4">
                  {setup.produtos.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} />
                  ))}
                </div>
              </div>

              {/* Summary stats */}
              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-[var(--border)]">
                <div>
                  <p className="text-h2 text-[var(--text-primary)]">
                    {setup.produtos.length}
                  </p>
                  <p className="text-caption">produtos</p>
                </div>
                {productsWithPrice.length > 0 && (
                  <div>
                    <p className="text-h2 text-[var(--text-primary)]">
                      {formatPrice(totalPrice)}
                    </p>
                    <p className="text-caption">valor estimado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Setups */}
        {relatedSetups.length > 0 && (
          <section className="container-wide pb-16">
            <SetupGrid setups={relatedSetups} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
