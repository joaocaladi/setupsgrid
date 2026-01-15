import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HeaderWrapper, Footer } from "@/components";
import { UserSetupForm } from "@/components/setup";
import { getCategorias, getUserSetupForEdit } from "@/app/dashboard/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Editar Setup - Gridiz",
};

export default async function EditSetupPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    redirect(`/login?redirect=/dashboard/setup/${id}/edit`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/setup/${id}/edit`);
  }

  const [setup, categorias] = await Promise.all([
    getUserSetupForEdit(id),
    getCategorias(),
  ]);

  if (!setup) {
    notFound();
  }

  // Convert to form format
  const initialData = {
    id: setup.id,
    titulo: setup.titulo,
    descricao: setup.descricao,
    imagemUrl: setup.imagemUrl,
    imagens: setup.imagens || [],
    videoUrl: setup.videoUrl,
    isVideo: setup.isVideo,
    autor: setup.autor,
    fonte: setup.fonte,
    fonteUrl: setup.fonteUrl,
    status: setup.status,
    categoriaIds: setup.categorias.map((c) => c.id),
    produtos: setup.produtos.map((p) => ({
      nome: p.nome,
      descricao: p.descricao,
      categoria: p.categoria,
      imagemUrl: p.imagemUrl,
      preco: p.preco,
      moeda: p.moeda,
      linkCompra: p.linkCompra,
      loja: p.loja,
      destaque: p.destaque,
      ordem: p.ordem,
      hotspotX: p.hotspotX,
      hotspotY: p.hotspotY,
      hotspotImagem: p.hotspotImagem,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1">
        <div className="container-wide py-8 sm:py-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para dashboard
          </Link>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Editar setup
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">{setup.titulo}</p>

          <UserSetupForm categorias={categorias} initialData={initialData} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
