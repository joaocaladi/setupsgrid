"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, Send, AlertCircle } from "lucide-react";
import { submissionFormSchema } from "@/lib/validations/submission";
import type { SubmissionFormData } from "@/lib/validations/submission";
import { SubmissionImageUpload } from "./SubmissionImageUpload";
import { SubmissionProductList, type SubmissionProductWithId } from "./SubmissionProductList";

interface ImageItem {
  id: string;
  url: string;
}

type SubmissionState = "form" | "submitting" | "success" | "error";

export function SubmissionForm() {
  const [state, setState] = useState<SubmissionState>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ID único para esta submissão (para agrupar uploads)
  const submissionId = useMemo(() => crypto.randomUUID(), []);

  // Imagens (gerenciadas separadamente do form)
  const [images, setImages] = useState<ImageItem[]>([]);

  // Produtos (com ID interno para drag & drop)
  const [products, setProducts] = useState<SubmissionProductWithId[]>([
    {
      _id: crypto.randomUUID(),
      productName: "",
      productBrand: null,
      productCategory: null,
      productUrl: null,
      productPrice: null,
      notes: null,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
              productBrand: p.productBrand,
              productCategory: p.productCategory,
              productUrl: p.productUrl,
              productPrice: p.productPrice,
              notes: p.notes,
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
          Compartilhe seu setup com a comunidade Gridiz. Preencha o formulário
          abaixo e nossa equipe irá revisar sua submissão.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Seção: Informações Pessoais */}
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

        {/* Seção: Imagens */}
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

        {/* Seção: Informações do Setup */}
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
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none"
              />
            </div>
          </div>
        </section>

        {/* Seção: Produtos */}
        <section className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Produtos do Setup *
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Liste os produtos que aparecem no seu setup. O nome é obrigatório,
            os demais campos são opcionais.
          </p>

          <SubmissionProductList products={products} onChange={setProducts} />
        </section>

        {/* Termos */}
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
            Confirmo que as fotos são de minha autoria e autorizo a publicação
            no Gridiz. Entendo que a equipe pode editar informações antes da
            publicação.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
        )}

        {/* Erro geral */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
      </form>
    </div>
  );
}
