"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  deleteSession,
  validateCredentials,
  verifySession,
} from "@/lib/auth";
import { setupSchema, type SetupFormData } from "@/lib/validations";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

// ============================================
// AUTH ACTIONS
// ============================================

export async function login(email: string, password: string) {
  const rateLimitKey = `login:${email.toLowerCase()}`;
  const rateLimit = checkRateLimit(rateLimitKey);

  if (!rateLimit.success) {
    const minutesRemaining = Math.ceil(
      (rateLimit.resetAt - Date.now()) / 60000
    );
    return {
      success: false,
      error: `Muitas tentativas. Tente novamente em ${minutesRemaining} minutos.`,
    };
  }

  const isValid = await validateCredentials(email, password);

  if (!isValid) {
    return {
      success: false,
      error: `Credenciais inválidas. ${rateLimit.remaining} tentativas restantes.`,
    };
  }

  resetRateLimit(rateLimitKey);
  await createSession(email);
  return { success: true };
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ============================================
// SETUP ACTIONS
// ============================================

export async function createSetup(data: SetupFormData) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  const parsed = setupSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { categoriaIds, produtos, ...setupData } = parsed.data;

  try {
    const setup = await prisma.setup.create({
      data: {
        ...setupData,
        categorias: {
          connect: categoriaIds.map((id) => ({ id })),
        },
        produtos: {
          create: produtos.map((produto, index) => ({
            ...produto,
            ordem: index,
            precoCapturedAt: produto.preco ? new Date() : null,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, setupId: setup.id };
  } catch (error) {
    console.error("Erro ao criar setup:", error);
    return { success: false, error: "Erro ao criar setup" };
  }
}

export async function updateSetup(id: string, data: SetupFormData) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  const parsed = setupSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { categoriaIds, produtos, ...setupData } = parsed.data;

  try {
    // Deletar produtos existentes
    await prisma.produto.deleteMany({
      where: { setupId: id },
    });

    // Atualizar setup e criar novos produtos
    await prisma.setup.update({
      where: { id },
      data: {
        ...setupData,
        categorias: {
          set: categoriaIds.map((id) => ({ id })),
        },
        produtos: {
          create: produtos.map((produto, index) => ({
            ...produto,
            ordem: index,
            precoCapturedAt: produto.preco ? new Date() : null,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/setup/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar setup:", error);
    return { success: false, error: "Erro ao atualizar setup" };
  }
}

export async function deleteSetup(id: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.setup.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar setup:", error);
    return { success: false, error: "Erro ao deletar setup" };
  }
}

// ============================================
// CATEGORIA ACTIONS
// ============================================

export async function updateCategoria(
  id: string,
  data: { nome: string; slug: string; icone?: string; descricao?: string }
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.categoria.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, error: "Erro ao atualizar categoria" };
  }
}

// ============================================
// DATA FETCHING
// ============================================

export async function getAdminSetups(search?: string, categoriaId?: string) {
  try {
    const setups = await prisma.setup.findMany({
      where: {
        ...(search && {
          titulo: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(categoriaId && {
          categorias: {
            some: {
              id: categoriaId,
            },
          },
        }),
      },
      include: {
        categorias: true,
        produtos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return setups;
  } catch (error) {
    console.error("Erro ao buscar setups:", error);
    return [];
  }
}

export async function getAdminStats() {
  try {
    const [totalSetups, totalProdutos, setupsDestaque] = await Promise.all([
      prisma.setup.count(),
      prisma.produto.count(),
      prisma.setup.count({ where: { destaque: true } }),
    ]);

    return { totalSetups, totalProdutos, setupsDestaque };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return { totalSetups: 0, totalProdutos: 0, setupsDestaque: 0 };
  }
}

export async function getCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { setups: true },
        },
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return categorias;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export async function getCategoriasWithGrupos() {
  try {
    const grupos = await prisma.grupoCategoria.findMany({
      include: {
        categorias: {
          include: {
            _count: {
              select: { setups: true },
            },
          },
          orderBy: {
            ordem: "asc",
          },
        },
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return grupos;
  } catch (error) {
    console.error("Erro ao buscar grupos de categorias:", error);
    return [];
  }
}

export async function getSetupForEdit(id: string) {
  try {
    const setup = await prisma.setup.findUnique({
      where: { id },
      include: {
        categorias: true,
        produtos: {
          orderBy: {
            ordem: "asc",
          },
        },
      },
    });

    return setup;
  } catch (error) {
    console.error("Erro ao buscar setup:", error);
    return null;
  }
}
