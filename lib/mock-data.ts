import type { SetupWithRelations, Categoria } from "@/types";

// Dados mock vazios - os dados reais estão no banco de dados
export const mockCategorias: Categoria[] = [];

export const mockSetups: SetupWithRelations[] = [];

// Funções para obter dados mock (retornam arrays vazios)
export function getMockSetups(): SetupWithRelations[] {
  return mockSetups;
}

export function getMockSetupById(id: string): SetupWithRelations | null {
  return mockSetups.find((s) => s.id === id) || null;
}

export function getMockCategorias(): Categoria[] {
  return mockCategorias;
}

export function getMockCategoriaBySlug(slug: string) {
  const categoria = mockCategorias.find((c) => c.slug === slug);
  if (!categoria) return null;

  const setups = mockSetups.filter((s) =>
    s.categorias.some((c) => c.slug === slug)
  );

  return {
    ...categoria,
    setups,
  };
}
