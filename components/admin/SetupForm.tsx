"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { ProductList } from "./ProductList";
import { setupSchema, FONTES, type SetupFormData, type ProdutoFormData } from "@/lib/validations";
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
  const categoriaIds = watch("categoriaIds");
  const isVideo = watch("isVideo");

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
      <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Mídia</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Imagem principal *
            </label>
            <ImageUpload
              value={imagemUrl}
              onChange={(url) => setValue("imagemUrl", url || "")}
              bucket="setups"
            />
            {errors.imagemUrl && (
              <p className="mt-2 text-sm text-red-600">
                {errors.imagemUrl.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isVideo")}
                className="w-4 h-4 rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
              />
              <span className="text-sm text-[#1d1d1f]">É um vídeo?</span>
            </label>
          </div>

          {isVideo && (
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                URL do vídeo
              </label>
              <input
                type="url"
                {...register("videoUrl")}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      </section>

      {/* Seção 2: Informações Básicas */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">
          Informações Básicas
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Título *
            </label>
            <input
              type="text"
              {...register("titulo")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
              placeholder="Ex: Setup Minimalista Clean"
            />
            {errors.titulo && (
              <p className="mt-2 text-sm text-red-600">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Descrição
            </label>
            <textarea
              {...register("descricao")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] resize-none"
              placeholder="Descreva o setup..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Autor
              </label>
              <input
                type="text"
                {...register("autor")}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
                placeholder="Ex: @username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Fonte
              </label>
              <select
                {...register("fonte")}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] bg-white"
              >
                <option value="">Selecione...</option>
                {FONTES.map((fonte) => (
                  <option key={fonte} value={fonte}>
                    {fonte}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              URL da fonte
            </label>
            <input
              type="url"
              {...register("fonteUrl")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      {/* Seção 3: Categorias */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">
          Categorias *
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categorias.map((categoria) => (
            <label
              key={categoria.id}
              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                categoriaIds?.includes(categoria.id)
                  ? "border-[#0071e3] bg-[#0071e3]/5"
                  : "border-[#d2d2d7] hover:border-[#86868b]"
              }`}
            >
              <input
                type="checkbox"
                checked={categoriaIds?.includes(categoria.id) || false}
                onChange={(e) =>
                  handleCategoriaChange(categoria.id, e.target.checked)
                }
                className="w-4 h-4 rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
              />
              <span className="text-sm text-[#1d1d1f]">{categoria.nome}</span>
            </label>
          ))}
        </div>
        {errors.categoriaIds && (
          <p className="mt-2 text-sm text-red-600">
            {errors.categoriaIds.message}
          </p>
        )}
      </section>

      {/* Seção 4: Configurações */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">
          Configurações
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("destaque")}
            className="w-5 h-5 rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
          />
          <div>
            <span className="text-sm font-medium text-[#1d1d1f]">
              Destacar este setup
            </span>
            <p className="text-xs text-[#86868b]">
              Setups em destaque aparecem em posição privilegiada no site
            </p>
          </div>
        </label>
      </section>

      {/* Seção 5: Produtos */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e5]">
        <ProductList produtos={produtos} onChange={setProdutos} />
      </section>

      {/* Ações */}
      <div className="flex items-center gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors"
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
