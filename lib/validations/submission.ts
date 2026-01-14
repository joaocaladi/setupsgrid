import { z } from "zod";
import { PRODUTO_CATEGORIAS } from "../validations";

// Validador de URL segura (bloqueia javascript:, data:, etc.)
const safeUrl = z.string().url().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  { message: "URL deve usar protocolo http ou https" }
);

const optionalSafeUrl = safeUrl.optional().or(z.literal("")).nullable();

// Schema do produto na submissão (usuário público)
export const submissionProductSchema = z.object({
  productName: z.string().min(2, "Nome do produto é obrigatório"),
  productBrand: z.string().optional().nullable(),
  productCategory: z.string().optional().nullable(),
  productUrl: optionalSafeUrl,
  productPrice: z.number().positive().optional().nullable(),
  notes: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
});

// Schema do formulário público de submissão
// Nota: products é validado separadamente no onSubmit porque é gerenciado em useState
export const submissionFormSchema = z.object({
  userName: z.string().min(2, "Nome é obrigatório"),
  userEmail: z.string().email("Email inválido"),
  userWhatsapp: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().max(1000, "Máximo 1000 caracteres").optional().nullable(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos",
  }),
});

// Schema de produto para revisão admin (formato completo)
export const reviewProductSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  descricao: z.string().optional().nullable(),
  preco: z.number().positive().optional().nullable(),
  moeda: z.string().default("BRL"),
  linkCompra: optionalSafeUrl,
  loja: z.string().optional().nullable(),
  destaque: z.boolean().default(false),
});

// Schema para revisão/aprovação admin
export const submissionReviewSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional().nullable(),
  categoriaIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  products: z.array(reviewProductSchema).min(1, "Adicione pelo menos 1 produto"),
});

export type SubmissionFormData = z.infer<typeof submissionFormSchema>;
export type SubmissionProductData = z.infer<typeof submissionProductSchema>;
export type SubmissionReviewData = z.infer<typeof submissionReviewSchema>;
export type ReviewProductData = z.infer<typeof reviewProductSchema>;
