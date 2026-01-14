"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle,
  Send,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Image as ImageIcon,
  FileText,
  Package,
} from "lucide-react";
import { submissionFormSchema } from "@/lib/validations/submission";
import type { SubmissionFormData } from "@/lib/validations/submission";
import { SubmissionImageUpload } from "./SubmissionImageUpload";
import {
  SubmissionProductList,
  type SubmissionProductWithId,
} from "./SubmissionProductList";

interface ImageItem {
  id: string;
  url: string;
}

type SubmissionState = "form" | "submitting" | "success" | "error";

const STEPS = [
  { id: 1, title: "Suas Informações", icon: User },
  { id: 2, title: "Fotos do Setup", icon: ImageIcon },
  { id: 3, title: "Sobre o Setup", icon: FileText },
  { id: 4, title: "Produtos", icon: Package },
] as const;

export function SubmissionForm() {
  const [state, setState] = useState<SubmissionState>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // ID único para esta submissão (para agrupar uploads)
  const submissionId = useMemo(() => crypto.randomUUID(), []);

  // Imagens (gerenciadas separadamente do form)
  const [images, setImages] = useState<ImageItem[]>([]);

  // Produtos (com ID interno para drag & drop)
  const [products, setProducts] = useState<SubmissionProductWithId[]>([
    {
      _id: crypto.randomUUID(),
      productName: "",
      productCategory: null,
      productUrl: null,
      productPrice: null,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userWhatsapp: "",
      title: "",
      description: "",
      acceptTerms: false,
    },
  });

  // Validar etapa antes de avançar
  const validateStep = useCallback(async () => {
    setErrorMessage(null);

    switch (currentStep) {
      case 1:
        // Validar campos de informações pessoais
        const step1Valid = await trigger(["userName", "userEmail"]);
        return step1Valid;

      case 2:
        // Validar imagens
        if (images.length === 0) {
          setErrorMessage("Adicione pelo menos 1 imagem do seu setup.");
          return false;
        }
        return true;

      case 3:
        // Etapa opcional, sempre válida
        return true;

      case 4:
        // Validar produtos e termos
        const validProducts = products.filter(
          (p) => p.productName.trim().length >= 2
        );
        if (validProducts.length === 0) {
          setErrorMessage("Adicione pelo menos 1 produto com nome válido.");
          return false;
        }

        const termsAccepted = getValues("acceptTerms");
        if (!termsAccepted) {
          setErrorMessage("Você precisa aceitar os termos para continuar.");
          return false;
        }
        return true;

      default:
        return true;
    }
  }, [currentStep, images, products, trigger, getValues]);

  const handleNext = useCallback(async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateStep, currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setErrorMessage(null);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const onSubmit = useCallback(
    async (data: SubmissionFormData) => {
      // Validar imagens
      if (images.length === 0) {
        setErrorMessage("Adicione pelo menos 1 imagem do seu setup.");
        return;
      }

      // Validar produtos
      const validProducts = products.filter(
        (p) => p.productName.trim().length >= 2
      );
      if (validProducts.length === 0) {
        setErrorMessage("Adicione pelo menos 1 produto com nome válido.");
        return;
      }

      setState("submitting");
      setErrorMessage(null);

      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            products: validProducts.map((p) => ({
              productName: p.productName,
              productCategory: p.productCategory,
              productUrl: p.productUrl,
              productPrice: p.productPrice,
            })),
            images: images.map((img, idx) => ({
              url: img.url,
              position: idx,
            })),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Erro ao enviar submissão");
        }

        setState("success");
      } catch (err) {
        setState("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Erro ao enviar. Tente novamente."
        );
      }
    },
    [images, products]
  );

  // Tela de sucesso
  if (state === "success") {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
          Setup Enviado com Sucesso!
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Obrigado por compartilhar seu setup com a comunidade Gridiz! Nossa
          equipe irá revisar sua submissão em até 7 dias úteis.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Você receberá um email quando seu setup for aprovado e publicado.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-3">
          Enviar Seu Setup
        </h1>
        <p className="text-[var(--text-secondary)]">
          Compartilhe seu setup com a comunidade Gridiz.
        </p>
      </div>

      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[#0071e3] text-white"
                            : "bg-[var(--background-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center hidden sm:block
                      ${isActive ? "text-[#0071e3]" : "text-[var(--text-secondary)]"}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-2 transition-colors duration-300
                      ${isCompleted ? "bg-green-500" : "bg-[var(--border)]"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Step Title */}
        <p className="text-center text-sm font-medium text-[#0071e3] mt-4 sm:hidden">
          {STEPS[currentStep - 1].title}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Etapa 1: Informações Pessoais */}
        {currentStep === 1 && (
          <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Suas Informações
            </h2>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Nome Completo *
                </label>
                <input
                  {...register("userName")}
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                />
                {errors.userName && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Email e WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Email *
                  </label>
                  <input
                    {...register("userEmail")}
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  />
                  {errors.userEmail && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.userEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    WhatsApp
                    <span className="text-[var(--text-secondary)] font-normal ml-1">
                      (opcional)
                    </span>
                  </label>
                  <input
                    {...register("userWhatsapp")}
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  />
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Para caso nossa equipe precise tirar alguma dúvida
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Etapa 2: Imagens */}
        {currentStep === 2 && (
          <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Fotos do Setup *
            </h2>

            <SubmissionImageUpload
              value={images}
              onChange={setImages}
              submissionId={submissionId}
              maxImages={10}
            />

            {images.length === 0 && (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Adicione de 1 a 10 fotos do seu setup. A primeira será a imagem
                principal.
              </p>
            )}
          </section>
        )}

        {/* Etapa 3: Informações do Setup */}
        {currentStep === 3 && (
          <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Sobre o Setup
              <span className="text-[var(--text-secondary)] font-normal text-sm ml-2">
                (opcional)
              </span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Título
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Ex: Meu setup minimalista"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Descrição
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Conte um pouco sobre seu setup, inspirações, etc."
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none"
                />
              </div>
            </div>
          </section>
        )}

        {/* Etapa 4: Produtos */}
        {currentStep === 4 && (
          <>
            <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Produtos do Setup *
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Liste os produtos que aparecem no seu setup. O nome é
                obrigatório, os demais campos são opcionais.
              </p>

              <SubmissionProductList
                products={products}
                onChange={setProducts}
              />
            </section>

            {/* Termos */}
            <div className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
              <div className="flex items-start gap-3">
                <input
                  {...register("acceptTerms")}
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3]"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-[var(--text-secondary)]"
                >
                  Confirmo que as fotos são de minha autoria e autorizo a
                  publicação no Gridiz. Entendo que a equipe pode editar
                  informações antes da publicação.
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </>
        )}

        {/* Erro geral */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex items-center gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium transition-colors cursor-pointer"
            >
              Próximo
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={state === "submitting"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === "submitting" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Enviar Setup
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
