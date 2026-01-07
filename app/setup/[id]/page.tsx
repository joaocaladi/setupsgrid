import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer, ProductCard, CategoryBadge } from "@/components";
import { getSetupById } from "@/lib/data";
import { formatPrice, calculateTotalPrice } from "@/lib/utils";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Package,
  DollarSign,
  Play,
} from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back navigation */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para setups
          </Link>
        </div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left column - Image/Video */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--card)]">
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
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {setup.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="h-8 w-8 text-black fill-black" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" />
                  Curtir
                </button>
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Salvar
                </button>
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Right column - Info */}
            <div className="space-y-6">
              {/* Categories */}
              {setup.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {setup.categorias.map((cat) => (
                    <CategoryBadge
                      key={cat.id}
                      nome={cat.nome}
                      slug={cat.slug}
                      cor={cat.cor}
                      size="md"
                    />
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">
                {setup.titulo}
              </h1>

              {/* Author and source */}
              {(setup.autor || setup.fonte) && (
                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                  {setup.autor && <span>por {setup.autor}</span>}
                  {setup.fonte && setup.fonteUrl && (
                    <a
                      href={setup.fonteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      {setup.fonte}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {setup.fonte && !setup.fonteUrl && (
                    <span>{setup.fonte}</span>
                  )}
                </div>
              )}

              {/* Description */}
              {setup.descricao && (
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {setup.descricao}
                </p>
              )}

              {/* Summary card */}
              <div className="p-5 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                <h3 className="font-medium mb-4">Resumo do Setup</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--background)]">
                      <Package className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">
                        {setup.produtos.length}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        produtos
                      </p>
                    </div>
                  </div>
                  {productsWithPrice.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[var(--background)]">
                        <DollarSign className="h-5 w-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">
                          {formatPrice(totalPrice)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          valor estimado
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products list */}
              <div>
                <h3 className="font-medium mb-4">
                  Produtos ({setup.produtos.length})
                </h3>
                <div className="space-y-3">
                  {setup.produtos.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/5 rounded-xl border border-[var(--accent)]/20">
                <h3 className="font-medium mb-2">Gostou deste setup?</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Salve para consultar depois ou compartilhe com seus amigos!
                </p>
                <div className="flex gap-3">
                  <button className="btn-primary flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Salvar Setup
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
