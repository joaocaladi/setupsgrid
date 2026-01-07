import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer, ProductCard } from "@/components";
import { getSetupById } from "@/lib/data";
import { formatPrice, calculateTotalPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { Play, ChevronLeft } from "lucide-react";

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
        {/* Hero Image - Full width */}
        <section className="relative">
          <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-[var(--background-tertiary)]">
            {setup.isVideo && setup.videoUrl ? (
              <video
                src={setup.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={setup.imagemUrl}
              />
            ) : (
              <>
                <Image
                  src={setup.imagemUrl}
                  alt={setup.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                {setup.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white rounded-full p-5 shadow-lg">
                      <Play className="h-8 w-8 text-[var(--text-primary)] fill-current" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Back button overlay */}
          <div className="absolute top-6 left-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2 back-button-overlay rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-text">
            {/* Categories */}
            {setup.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
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
            <h1 className="text-h1 text-[var(--text-primary)] mb-4">
              {setup.titulo}
            </h1>

            {/* Author and source */}
            {(setup.autor || setup.fonte) && (
              <p className="text-body-large text-[var(--text-secondary)] mb-8">
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
              <p className="text-body text-[var(--text-secondary)] mb-12 max-w-[720px]">
                {setup.descricao}
              </p>
            )}

            {/* Summary stats */}
            <div className="flex items-center gap-8 mb-16 pb-16 border-b border-[var(--border)]">
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
              <h2 className="text-h3 text-[var(--text-primary)] mb-8">
                Produtos do setup
              </h2>
              <div className="space-y-4">
                {setup.produtos.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            </div>

            {/* CTA - Apple style */}
            <div className="mt-20 pt-16 border-t border-[var(--border)] text-center">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
