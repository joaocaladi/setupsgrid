"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import { ProductList } from "./ProductList";
import { setupSchema, type SetupFormData, type ProdutoFormData } from "@/lib/validations";
import { createSetup, updateSetup } from "@/app/admin/actions";
import type { Categoria } from "@prisma/client";

interface SetupFormProps {
  categorias: Categoria[];
  initialData?: SetupFormData & { id?: string };
}

export function SetupForm({ categorias, initialData }: SetupFormProps) {
  const router = useRouter();
  const [produtos, setProdutos] = useState<ProdutoFormData[]>(
    initialData?.produtos || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: initialData || {
      titulo: "",
      descricao: "",
      imagemUrl: "",
      imagens: [],
      videoUrl: "",
      isVideo: false,
      autor: "",
      fonte: "",
      fonteUrl: "",
      destaque: false,
      categoriaIds: [],
      produtos: [],
    },
  });

  const imagemUrl = watch("imagemUrl");
  const imagens = watch("imagens");
  const categoriaIds = watch("categoriaIds");

  async function onSubmit(data: SetupFormData) {
    const formData = {
      ...data,
      produtos,
    };

    try {
      const result = initialData?.id
        ? await updateSetup(initialData.id, formData)
        : await createSetup(formData);

      if (result.success) {
        toast.success(
          initialData?.id
            ? "Setup atualizado com sucesso!"
            : "Setup criado com sucesso!"
        );
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao salvar setup");
      }
    } catch {
      toast.error("Erro ao salvar setup");
    }
  }

  function handleCategoriaChange(id: string, checked: boolean) {
    const current = categoriaIds || [];
    if (checked) {
      setValue("categoriaIds", [...current, id]);
    } else {
      setValue(
        "categoriaIds",
        current.filter((c) => c !== id)
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Seção 1: Mídia */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Mídia</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Imagens do setup
            </label>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              A primeira imagem será a principal. Adicione até 10 imagens adicionais.
            </p>
            <div className="flex flex-wrap gap-3 items-start">
              {/* Imagem principal */}
              <ImageUpload
                value={imagemUrl}
                onChange={(url) => setValue("imagemUrl", url || "")}
                bucket="setups"
                compact
                label="Principal"
              />
              {/* Imagens adicionais */}
              <MultiImageUpload
                value={imagens || []}
                onChange={(urls) => setValue("imagens", urls)}
                bucket="setups"
                maxImages={10}
              />
            </div>
            {errors.imagemUrl && (
              <p className="mt-2 text-sm text-red-500">
                {errors.imagemUrl.message}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Seção 2: Informações Básicas */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Informações Básicas
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Título *
            </label>
            <input
              type="text"
              {...register("titulo")}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
              placeholder="Ex: Setup Minimalista Clean"
            />
            {errors.titulo && (
              <p className="mt-2 text-sm text-red-500">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Descrição
            </label>
            <textarea
              {...register("descricao")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] resize-none"
              placeholder="Descreva o setup..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Autor
            </label>
            <input
              type="text"
              {...register("autor")}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
              placeholder="Ex: @username"
            />
          </div>
        </div>
      </section>

      {/* Seção 3: Categorias */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Categorias *
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categorias.map((categoria) => (
            <label
              key={categoria.id}
              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                categoriaIds?.includes(categoria.id)
                  ? "border-[#0071e3] bg-[#0071e3]/10"
                  : "border-[var(--border)] hover:border-[var(--text-secondary)]"
              }`}
            >
              <input
                type="checkbox"
                checked={categoriaIds?.includes(categoria.id) || false}
                onChange={(e) =>
                  handleCategoriaChange(categoria.id, e.target.checked)
                }
                className="w-4 h-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3]"
              />
              <span className="text-sm text-[var(--text-primary)]">{categoria.nome}</span>
            </label>
          ))}
        </div>
        {errors.categoriaIds && (
          <p className="mt-2 text-sm text-red-500">
            {errors.categoriaIds.message}
          </p>
        )}
      </section>

      {/* Seção 4: Configurações */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Configurações
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("destaque")}
            className="w-5 h-5 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3]"
          />
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Destacar este setup
            </span>
            <p className="text-xs text-[var(--text-secondary)]">
              Setups em destaque aparecem em posição privilegiada no site
            </p>
          </div>
        </label>
      </section>

      {/* Seção 5: Produtos */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <ProductList
          produtos={produtos}
          onChange={setProdutos}
          imagemPrincipal={imagemUrl}
          imagens={imagens || []}
        />
      </section>

      {/* Ações */}
      <div className="flex items-center gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : initialData?.id ? (
            "Salvar alterações"
          ) : (
            "Publicar"
          )}
        </button>
      </div>
    </form>
  );
}
