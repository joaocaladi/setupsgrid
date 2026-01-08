import type { Setup, Categoria, Produto } from "@prisma/client";

// Types com relações incluídas
export type SetupWithRelations = Setup & {
  categorias: Categoria[];
  produtos: Produto[];
};

export type CategoriaWithSetups = Categoria & {
  setups: Setup[];
};

// Re-export dos tipos base do Prisma
export type { Setup, Categoria, Produto };
