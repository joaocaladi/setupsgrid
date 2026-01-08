import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer, ProductCard, SetupGallery } from "@/components";
import { getSetupById } from "@/lib/data";
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
      title: "Setup não encontrado - SetupsGrid",
    };
  }

  return {
    title: `${setup.titulo} - SetupsGrid`,
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

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

              {/* Author and source */}
              {(setup.autor || setup.fonte) && (
                <p className="text-body-large text-[var(--text-secondary)] mb-6">
                  {setup.autor && <>por {setup.autor}</>}
                  {setup.autor && setup.fonte && " · "}
                  {setup.fonte && setup.fonteUrl ? (
                    <a
                      href={setup.fonteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      {setup.fonte}
                    </a>
                  ) : (
                    setup.fonte
                  )}
                </p>
              )}

              {/* Description */}
              {setup.descricao && (
                <p className="text-body text-[var(--text-secondary)] mb-8">
                  {setup.descricao}
                </p>
              )}

              {/* Summary stats */}
              <div className="flex items-center gap-8 mb-8 pb-8 border-b border-[var(--border)]">
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
            </div>
          </div>
        </section>

        {/* CTA Section - Full width */}
        <section className="section-padding bg-[var(--background-tertiary)]">
          <div className="container-text text-center">
            <h3 className="text-h3 text-[var(--text-primary)] mb-3">
              Gostou deste setup?
            </h3>
            <p className="text-body text-[var(--text-secondary)] mb-8">
              Explore mais setups e encontre inspiração para o seu workspace.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/" className="btn-primary">
                Explorar mais setups
              </Link>
              <button className="btn-outline">
                Compartilhar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
