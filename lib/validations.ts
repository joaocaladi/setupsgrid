import { z } from "zod";

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

// Validador opcional de URL segura
const optionalSafeUrl = safeUrl.optional().or(z.literal("")).nullable();

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  descricao: z.string().optional().nullable(),
  categoria: z.string().min(1, "Selecione uma categoria"),
  imagemUrl: optionalSafeUrl,
  preco: z.number().positive().optional().nullable(),
  moeda: z.string().default("BRL"),
  linkCompra: optionalSafeUrl,
  loja: z.string().optional().nullable(),
  destaque: z.boolean().default(false),
  ordem: z.number().default(0),
  hotspotX: z.number().min(0).max(100).optional().nullable(),
  hotspotY: z.number().min(0).max(100).optional().nullable(),
  hotspotImagem: z.number().int().min(0).optional().nullable(),
});

export const setupSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional().nullable(),
  imagemUrl: safeUrl,
  imagens: z.array(safeUrl).max(10, "Máximo de 10 imagens").default([]),
  videoUrl: optionalSafeUrl,
  isVideo: z.boolean().default(false),
  autor: z.string().optional().nullable(),
  fonte: z.string().optional().nullable(),
  fonteUrl: optionalSafeUrl,
  destaque: z.boolean().default(false),
  categoriaIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  produtos: z.array(produtoSchema).default([]),
});

export type SetupFormData = z.input<typeof setupSchema>;
export type ProdutoFormData = z.input<typeof produtoSchema>;

// Categorias de produtos disponíveis
export const PRODUTO_CATEGORIAS = [
  "Mesa",
  "Monitor",
  "Teclado",
  "Mouse",
  "Cadeira",
  "Headset",
  "Mousepad",
  "Webcam",
  "Microfone",
  "Iluminação",
  "Decoração",
  "Organização",
  "Acessório",
  "Outro",
] as const;

// Fontes disponíveis
export const FONTES = [
  "Instagram",
  "Twitter/X",
  "Reddit",
  "Pinterest",
  "YouTube",
  "TikTok",
  "Outro",
] as const;

// Lojas disponíveis
export const LOJAS = [
  "Amazon",
  "Kabum",
  "Mercado Livre",
  "Magalu",
  "Pichau",
  "Terabyte",
  "Anma",
  "AliExpress",
  "Apple",
  "Outro",
] as const;
