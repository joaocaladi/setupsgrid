"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Check, Image as ImageIcon, Package, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { UserImageUpload } from "./UserImageUpload";
import { UserMultiImageUpload } from "./UserMultiImageUpload";
import { UserProductList } from "./UserProductList";
import { SetupPreview } from "./SetupPreview";
import { userSetupSchema, type UserSetupFormData, type ProdutoFormData } from "@/lib/validations";
import { createUserSetup, updateUserSetup } from "@/app/dashboard/actions";
import type { Categoria } from "@prisma/client";

// Steps configuration
const STEPS = [
  { id: "images", title: "Imagens", icon: ImageIcon, description: "Fotos do setup" },
  { id: "products", title: "Produtos", icon: Package, description: "Lista de produtos" },
  { id: "details", title: "Detalhes", icon: FileText, description: "Informações" },
  { id: "preview", title: "Revisar", icon: Eye, description: "Conferir e publicar" },
] as const;

interface UserSetupFormProps {
  categorias: Categoria[];
  initialData?: UserSetupFormData & { id?: string; status?: "draft" | "published" | "archived" };
}

export function UserSetupForm({ categorias, initialData }: UserSetupFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [produtos, setProdutos] = useState<ProdutoFormData[]>(
    initialData?.produtos || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<UserSetupFormData>({
    resolver: zodResolver(userSetupSchema),
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
      categoriaIds: [],
      produtos: [],
      status: "draft",
    },
  });

  const imagemUrl = watch("imagemUrl");
  const imagens = watch("imagens");
  const categoriaIds = watch("categoriaIds");
  const titulo = watch("titulo");
  const descricao = watch("descricao");

  // Step validation before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 0: // Images
        const hasImage = await trigger("imagemUrl");
        if (!imagemUrl) {
          toast.error("Adicione pelo menos uma imagem principal");
          return false;
        }
        return hasImage;
      case 1: // Products
        if (produtos.length === 0) {
          toast.error("Adicione pelo menos um produto");
          return false;
        }
        const invalidProducts = produtos.filter(p => !p.nome || !p.categoria);
        if (invalidProducts.length > 0) {
          toast.error("Preencha nome e categoria de todos os produtos");
          return false;
        }
        return true;
      case 2: // Details
        const titleValid = await trigger("titulo");
        const categoriesValid = await trigger("categoriaIds");
        if (!titleValid || !titulo) {
          toast.error("Adicione um título para o setup");
          return false;
        }
        if (!categoriesValid || categoriaIds.length === 0) {
          toast.error("Selecione pelo menos uma categoria");
          return false;
        }
        return titleValid && categoriesValid;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step > currentStep) {
      // Validate all steps up to the target
      for (let i = currentStep; i < step; i++) {
        const isValid = await validateStep(i);
        if (!isValid) {
          setCurrentStep(i);
          return;
        }
      }
      setCurrentStep(step);
    }
  };

  async function onSubmit(status: "draft" | "published") {
    if (isLoading) return;

    setIsLoading(true);
    const formData = watch();
    const data = { ...formData, produtos, status };

    try {
      console.log("Submitting setup with data:", {
        titulo: data.titulo,
        status,
        categoriaIds: data.categoriaIds,
        produtosCount: data.produtos.length,
        initialDataId: initialData?.id
      });

      const result = initialData?.id
        ? await updateUserSetup(initialData.id, data)
        : await createUserSetup(data);

      console.log("Server action result:", result);

      if (result.success) {
        toast.success(
          status === "draft"
            ? "Rascunho salvo!"
            : initialData?.id
              ? "Setup atualizado!"
              : "Setup publicado!"
        );
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao salvar setup");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting setup:", error);
      toast.error("Erro ao salvar setup");
      setIsLoading(false);
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
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-[#0071e3] text-white"
                  : isCompleted
                    ? "bg-green-600/20 text-green-500"
                    : "bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)]"
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline text-sm font-medium">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6">
        {/* Step 1: Images */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Fotos do seu setup
              </h2>
              <p className="text-[var(--text-secondary)]">
                Adicione fotos do seu espaço de trabalho. A primeira imagem será a capa.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Imagem principal *
                </label>
                <UserImageUpload
                  value={imagemUrl}
                  onChange={(url) => setValue("imagemUrl", url || "")}
                  bucket="setups"
                />
                {errors.imagemUrl && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.imagemUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Imagens adicionais (opcional)
                </label>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Adicione até 10 imagens extras mostrando diferentes ângulos.
                </p>
                <UserMultiImageUpload
                  value={imagens || []}
                  onChange={(urls) => setValue("imagens", urls)}
                  bucket="setups"
                  maxImages={10}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Produtos do setup
              </h2>
              <p className="text-[var(--text-secondary)]">
                Adicione os produtos com seus links de afiliado. Cole o link e preenchemos automaticamente.
              </p>
            </div>

            <UserProductList
              produtos={produtos}
              onChange={setProdutos}
              imagemPrincipal={imagemUrl}
              imagens={imagens || []}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Detalhes do setup
              </h2>
              <p className="text-[var(--text-secondary)]">
                Dê um nome ao seu setup e selecione as categorias.
              </p>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  {...register("titulo")}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                  placeholder="Ex: Setup Minimalista para Programação"
                />
                {errors.titulo && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  {...register("descricao")}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] resize-none"
                  placeholder="Conte um pouco sobre seu setup, inspirações, quanto tempo levou pra montar..."
                />
              </div>

              {/* Categorias */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Categorias *
                </label>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Selecione as categorias que melhor descrevem seu setup.
                </p>
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
                      <span className="text-sm text-[var(--text-primary)]">
                        {categoria.nome}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.categoriaIds && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.categoriaIds.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors"
              >
                Revisar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 3 && (
          <SetupPreview
            imagemUrl={imagemUrl}
            imagens={imagens || []}
            titulo={titulo}
            descricao={descricao}
            categorias={categorias.filter((c) => categoriaIds?.includes(c.id))}
            produtos={produtos}
            onBack={handlePrev}
            onSaveDraft={() => onSubmit("draft")}
            onPublish={() => onSubmit("published")}
            isSubmitting={isLoading}
            isEditing={!!initialData?.id}
          />
        )}
      </div>
    </div>
  );
}
