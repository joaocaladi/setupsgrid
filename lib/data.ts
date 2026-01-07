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
