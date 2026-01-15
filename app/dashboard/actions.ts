"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  userSetupSchema,
  type UserSetupFormData,
  type ProdutoFormData,
} from "@/lib/validations";
import { transformToAffiliateUrl } from "@/lib/affiliate/transformer";

// Helper to get authenticated user profile
async function getAuthenticatedProfile() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
  });
}

// Transform products with affiliate links
async function transformProductsWithAffiliate(produtos: ProdutoFormData[]) {
  return Promise.all(
    produtos.map(async (produto, index) => {
      let linkData = {
        linkCompra: produto.linkCompra,
        linkCompraOriginal: null as string | null,
        affiliateStoreKey: null as string | null,
        hasAffiliate: false,
      };

      if (produto.linkCompra) {
        const result = await transformToAffiliateUrl(produto.linkCompra);
        linkData = {
          linkCompra: result.transformedUrl,
          linkCompraOriginal: produto.linkCompra,
          affiliateStoreKey: result.storeKey,
          hasAffiliate: result.wasTransformed,
        };
      }

      return {
        ...produto,
        ...linkData,
        ordem: index,
        precoCapturedAt: produto.preco ? new Date() : null,
      };
    })
  );
}

export async function createUserSetup(data: UserSetupFormData) {
  const profile = await getAuthenticatedProfile();
  if (!profile) {
    return { success: false, error: "Não autorizado" };
  }

  const parsed = userSetupSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { categoriaIds, produtos, status, ...setupData } = parsed.data;

  try {
    // Transform affiliate links
    const produtosComAfiliado = await transformProductsWithAffiliate(produtos);

    const setup = await prisma.setup.create({
      data: {
        ...setupData,
        destaque: false, // Users cannot set destaque
        status: status || "draft",
        userId: profile.id,
        categorias: {
          connect: categoriaIds.map((id) => ({ id })),
        },
        produtos: {
          create: produtosComAfiliado,
        },
      },
    });

    revalidatePath("/dashboard");
    if (status === "published") {
      revalidatePath("/");
    }

    return { success: true, setupId: setup.id };
  } catch (error) {
    console.error("Erro ao criar setup:", error);
    return { success: false, error: "Erro ao criar setup" };
  }
}

export async function updateUserSetup(id: string, data: UserSetupFormData) {
  const profile = await getAuthenticatedProfile();
  if (!profile) {
    return { success: false, error: "Não autorizado" };
  }

  // Verify ownership
  const existingSetup = await prisma.setup.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingSetup || existingSetup.userId !== profile.id) {
    return { success: false, error: "Setup não encontrado ou sem permissão" };
  }

  const parsed = userSetupSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { categoriaIds, produtos, status, ...setupData } = parsed.data;

  try {
    // Transform affiliate links
    const produtosComAfiliado = await transformProductsWithAffiliate(produtos);

    // Delete existing products
    await prisma.produto.deleteMany({ where: { setupId: id } });

    // Update setup and create new products
    await prisma.setup.update({
      where: { id },
      data: {
        ...setupData,
        status: status || undefined,
        categorias: {
          set: categoriaIds.map((catId) => ({ id: catId })),
        },
        produtos: {
          create: produtosComAfiliado,
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/setup/${id}`);
    if (status === "published") {
      revalidatePath("/");
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar setup:", error);
    return { success: false, error: "Erro ao atualizar setup" };
  }
}

export async function deleteUserSetup(id: string) {
  const profile = await getAuthenticatedProfile();
  if (!profile) {
    return { success: false, error: "Não autorizado" };
  }

  // Verify ownership
  const existingSetup = await prisma.setup.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingSetup || existingSetup.userId !== profile.id) {
    return { success: false, error: "Setup não encontrado ou sem permissão" };
  }

  try {
    await prisma.setup.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar setup:", error);
    return { success: false, error: "Erro ao deletar setup" };
  }
}

export async function getUserSetupForEdit(id: string) {
  const profile = await getAuthenticatedProfile();
  if (!profile) return null;

  const setup = await prisma.setup.findUnique({
    where: { id, userId: profile.id },
    include: {
      categorias: true,
      produtos: { orderBy: { ordem: "asc" } },
    },
  });

  return setup;
}

export async function getCategorias() {
  return prisma.categoria.findMany({
    orderBy: { ordem: "asc" },
  });
}
