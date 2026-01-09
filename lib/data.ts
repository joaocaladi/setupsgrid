import { prisma } from "./prisma";
import {
  getMockSetups,
  getMockSetupById,
  getMockCategoriaBySlug,
} from "./mock-data";
import type { SetupWithRelations } from "@/types";

// Verifica se o banco de dados está disponível
const USE_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("your-") || process.env.USE_MOCK === "true";

export async function getSetups(): Promise<SetupWithRelations[]> {
  if (USE_MOCK) {
    return getMockSetups();
  }

  try {
    const setups = await prisma.setup.findMany({
      include: {
        categorias: true,
        produtos: true,
      },
      orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
    });
    return setups;
  } catch {
    console.warn("Database unavailable, using mock data");
    return getMockSetups();
  }
}

export async function getSetupById(id: string): Promise<SetupWithRelations | null> {
  if (USE_MOCK) {
    return getMockSetupById(id);
  }

  try {
    const setup = await prisma.setup.findUnique({
      where: { id },
      include: {
        categorias: true,
        produtos: {
          orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
        },
      },
    });
    return setup;
  } catch {
    console.warn("Database unavailable, using mock data");
    return getMockSetupById(id);
  }
}

export async function getCategoriaBySlug(slug: string) {
  if (USE_MOCK) {
    return getMockCategoriaBySlug(slug);
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { slug },
      include: {
        setups: {
          include: {
            categorias: true,
            produtos: true,
          },
          orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
        },
      },
    });
    return categoria;
  } catch {
    console.warn("Database unavailable, using mock data");
    return getMockCategoriaBySlug(slug);
  }
}

export async function getRelatedSetups(
  setupId: string,
  categoriaIds: string[],
  limit: number = 6
): Promise<SetupWithRelations[]> {
  if (USE_MOCK || categoriaIds.length === 0) {
    return [];
  }

  try {
    const setups = await prisma.setup.findMany({
      where: {
        id: { not: setupId },
        categorias: {
          some: {
            id: { in: categoriaIds },
          },
        },
      },
      include: {
        categorias: true,
        produtos: true,
      },
      orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return setups;
  } catch {
    console.warn("Database unavailable");
    return [];
  }
}

export async function getGruposWithCategorias() {
  if (USE_MOCK) {
    return [];
  }

  try {
    const grupos = await prisma.grupoCategoria.findMany({
      include: {
        categorias: {
          orderBy: { ordem: "asc" },
          include: {
            _count: {
              select: { setups: true },
            },
          },
        },
      },
      orderBy: { ordem: "asc" },
    });
    return grupos;
  } catch {
    console.warn("Database unavailable");
    return [];
  }
}

export async function getCategoriaWithGrupo(slug: string) {
  if (USE_MOCK) {
    return null;
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { slug },
      include: {
        grupo: true,
        setups: {
          include: {
            categorias: true,
            produtos: true,
          },
          orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
        },
      },
    });
    return categoria;
  } catch {
    console.warn("Database unavailable");
    return null;
  }
}
