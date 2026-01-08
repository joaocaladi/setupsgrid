import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  descricao: z.string().optional().nullable(),
  categoria: z.string().min(1, "Selecione uma categoria"),
  preco: z.number().positive().optional().nullable(),
  moeda: z.string().default("BRL"),
  imagemUrl: z.string().optional().nullable(),
  linkCompra: z.string().url("URL inválida").optional().or(z.literal("")).nullable(),
  loja: z.string().optional().nullable(),
  destaque: z.boolean().default(false),
  ordem: z.number().default(0),
});

export const setupSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional().nullable(),
  imagemUrl: z.string().url("Imagem é obrigatória"),
  videoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  isVideo: z.boolean().default(false),
  autor: z.string().optional().nullable(),
  fonte: z.string().optional().nullable(),
  fonteUrl: z.string().url().optional().or(z.literal("")).nullable(),
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
  "ANMA Setups",
  "AliExpress",
  "Apple",
  "Outro",
] as const;
