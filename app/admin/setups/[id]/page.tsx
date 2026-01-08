import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SetupForm } from "@/components/admin/SetupForm";
import { getCategorias, getSetupForEdit } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSetupPage({ params }: PageProps) {
  const { id } = await params;
  const [setup, categorias] = await Promise.all([
    getSetupForEdit(id),
    getCategorias(),
  ]);

  if (!setup) {
    notFound();
  }

  // Converter para o formato do formulário
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
    destaque: setup.destaque,
    categoriaIds: setup.categorias.map((c) => c.id),
    produtos: setup.produtos.map((p) => ({
      nome: p.nome,
      descricao: p.descricao,
      categoria: p.categoria,
      preco: p.preco,
      moeda: p.moeda,
      linkCompra: p.linkCompra,
      loja: p.loja,
      destaque: p.destaque,
      ordem: p.ordem,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Editar Setup</h1>
        <p className="text-[var(--text-secondary)] mt-1">{setup.titulo}</p>
      </div>

      {/* Form */}
      <SetupForm categorias={categorias} initialData={initialData} />
    </div>
  );
}
