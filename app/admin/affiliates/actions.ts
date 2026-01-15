"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { invalidateConfigCache } from "@/lib/affiliate/transformer";
import type { AffiliateType } from "@prisma/client";
import type { AffiliateStats } from "@/lib/affiliate/types";

// ============================================
// ESTATÍSTICAS
// ============================================

export async function getAffiliateStats(): Promise<AffiliateStats> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const [total, active, pendingConfig, totalProductsWithAffiliate] =
    await Promise.all([
      prisma.affiliateConfig.count(),
      prisma.affiliateConfig.count({ where: { isActive: true } }),
      prisma.affiliateConfig.count({
        where: {
          isActive: false,
          affiliateCode: null,
        },
      }),
      prisma.produto.count({ where: { hasAffiliate: true } }),
    ]);

  return {
    total,
    active,
    pendingConfig,
    inactive: total - active,
    totalProductsWithAffiliate,
  };
}

// ============================================
// LISTAGEM
// ============================================

export async function getAffiliateConfigs(
  filter?: "all" | "active" | "pending" | "inactive"
) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const where =
    filter === "active"
      ? { isActive: true }
      : filter === "pending"
        ? { isActive: false, affiliateCode: null }
        : filter === "inactive"
          ? { isActive: false, affiliateCode: { not: null } }
          : {};

  return prisma.affiliateConfig.findMany({
    where,
    orderBy: [{ isActive: "desc" }, { storeName: "asc" }],
  });
}

// ============================================
// BUSCA INDIVIDUAL
// ============================================

export async function getAffiliateConfig(storeKey: string) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  return prisma.affiliateConfig.findUnique({
    where: { storeKey },
  });
}

// ============================================
// ATUALIZAÇÃO
// ============================================

export async function updateAffiliateConfig(
  storeKey: string,
  data: {
    affiliateType?: AffiliateType;
    affiliateCode?: string | null;
    affiliateParam?: string | null;
    redirectTemplate?: string | null;
    isActive?: boolean;
    programName?: string | null;
    programUrl?: string | null;
    commissionInfo?: string | null;
    notes?: string | null;
    domains?: string[];
  }
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.affiliateConfig.update({
      where: { storeKey },
      data,
    });

    invalidateConfigCache();
    revalidatePath("/admin/affiliates");
    revalidatePath(`/admin/affiliates/${storeKey}`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar config:", error);
    return { success: false, error: "Erro ao atualizar configuração" };
  }
}

// ============================================
// CRIAÇÃO
// ============================================

export async function createAffiliateConfig(data: {
  storeKey: string;
  storeName: string;
  domains: string[];
  affiliateType: AffiliateType;
  affiliateCode?: string | null;
  affiliateParam?: string | null;
  redirectTemplate?: string | null;
  isActive?: boolean;
  programName?: string | null;
  programUrl?: string | null;
  commissionInfo?: string | null;
}) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.affiliateConfig.create({ data });

    invalidateConfigCache();
    revalidatePath("/admin/affiliates");

    return { success: true };
  } catch (error) {
    console.error("Erro ao criar config:", error);
    return { success: false, error: "Erro ao criar configuração" };
  }
}

// ============================================
// ATUALIZAÇÃO DE CONTADORES
// ============================================

export async function updateAffiliateProductCounts() {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    // Agrupa produtos por storeKey
    const counts = await prisma.produto.groupBy({
      by: ["affiliateStoreKey"],
      _count: true,
      where: { affiliateStoreKey: { not: null } },
    });

    // Primeiro zera todos os contadores
    await prisma.affiliateConfig.updateMany({
      data: { productCount: 0 },
    });

    // Atualiza cada config com a contagem correta
    for (const count of counts) {
      if (count.affiliateStoreKey) {
        await prisma.affiliateConfig.update({
          where: { storeKey: count.affiliateStoreKey },
          data: { productCount: count._count },
        });
      }
    }

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar contadores:", error);
    return { success: false, error: "Erro ao atualizar contadores" };
  }
}
