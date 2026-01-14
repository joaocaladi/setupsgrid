"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { checkLink } from "@/lib/link-checker";
import type { LinkStatus } from "@prisma/client";

export interface LinkStats {
  total: number;
  active: number;
  broken: number;
  unknown: number;
  byStore: Array<{
    store: string;
    total: number;
    active: number;
    broken: number;
  }>;
  lastCheck: string | null;
}

export interface ProductWithLinkInfo {
  id: string;
  nome: string;
  linkCompra: string | null;
  linkStatus: LinkStatus;
  linkLastCheckedAt: Date | null;
  linkCheckAttempts: number;
  linkBrokenAt: Date | null;
  loja: string | null;
  imagemUrl: string | null;
  setup: {
    id: string;
    titulo: string;
  };
}

export interface LinkFilters {
  status?: LinkStatus | "all";
  store?: string;
  search?: string;
}

export async function getLinkStats(): Promise<LinkStats> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const [total, activeCount, brokenCount, unknownCount] = await Promise.all([
    prisma.produto.count({
      where: { linkCompra: { not: null } },
    }),
    prisma.produto.count({
      where: { linkCompra: { not: null }, linkStatus: "active" },
    }),
    prisma.produto.count({
      where: { linkCompra: { not: null }, linkStatus: "broken" },
    }),
    prisma.produto.count({
      where: { linkCompra: { not: null }, linkStatus: "unknown" },
    }),
  ]);

  // Buscar estatísticas por loja
  const byStoreRaw = await prisma.produto.groupBy({
    by: ["loja", "linkStatus"],
    _count: true,
    where: {
      linkCompra: { not: null },
      loja: { not: null },
    },
  });

  // Agrupar por loja
  const storeMap = new Map<
    string,
    { total: number; active: number; broken: number }
  >();

  for (const item of byStoreRaw) {
    if (!item.loja) continue;

    if (!storeMap.has(item.loja)) {
      storeMap.set(item.loja, { total: 0, active: 0, broken: 0 });
    }

    const store = storeMap.get(item.loja)!;
    store.total += item._count;

    if (item.linkStatus === "active") {
      store.active = item._count;
    } else if (item.linkStatus === "broken") {
      store.broken = item._count;
    }
  }

  const byStore = Array.from(storeMap.entries())
    .map(([store, stats]) => ({
      store,
      ...stats,
    }))
    .sort((a, b) => b.total - a.total);

  // Buscar última verificação
  const lastCheck = await prisma.productLinkCheck.findFirst({
    orderBy: { checkedAt: "desc" },
    select: { checkedAt: true },
  });

  return {
    total,
    active: activeCount,
    broken: brokenCount,
    unknown: unknownCount,
    byStore,
    lastCheck: lastCheck?.checkedAt?.toISOString() || null,
  };
}

export async function getProductsWithLinks(
  filters: LinkFilters = {}
): Promise<ProductWithLinkInfo[]> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const { status, store, search } = filters;

  const whereClause: {
    linkCompra: { not: null };
    linkStatus?: LinkStatus;
    loja?: string;
    nome?: { contains: string; mode: "insensitive" };
  } = {
    linkCompra: { not: null },
  };

  if (status && status !== "all") {
    whereClause.linkStatus = status;
  }

  if (store) {
    whereClause.loja = store;
  }

  if (search) {
    whereClause.nome = { contains: search, mode: "insensitive" };
  }

  const produtos = await prisma.produto.findMany({
    where: whereClause,
    select: {
      id: true,
      nome: true,
      linkCompra: true,
      linkStatus: true,
      linkLastCheckedAt: true,
      linkCheckAttempts: true,
      linkBrokenAt: true,
      loja: true,
      imagemUrl: true,
      setup: {
        select: {
          id: true,
          titulo: true,
        },
      },
    },
    orderBy: [
      { linkStatus: "asc" }, // broken primeiro
      { linkLastCheckedAt: { sort: "desc", nulls: "last" } },
    ],
    take: 100,
  });

  return produtos;
}

export async function checkProductLink(productId: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: productId },
      select: { id: true, linkCompra: true },
    });

    if (!produto || !produto.linkCompra) {
      return { success: false, error: "Produto não encontrado ou sem link" };
    }

    const result = await checkLink(produto.linkCompra);

    // Atualizar produto
    await prisma.produto.update({
      where: { id: productId },
      data: {
        linkStatus: result.status,
        linkLastCheckedAt: new Date(),
        linkCheckAttempts: result.status === "broken" ? { increment: 1 } : 0,
        linkBrokenAt: result.status === "broken" ? new Date() : null,
      },
    });

    // Criar registro
    await prisma.productLinkCheck.create({
      data: {
        produtoId: productId,
        url: produto.linkCompra,
        status: result.status,
        httpStatus: result.httpStatus,
        responseMs: result.responseMs,
        errorType: result.errorType,
      },
    });

    revalidatePath("/admin/links");

    return {
      success: true,
      data: {
        status: result.status,
        httpStatus: result.httpStatus,
      },
    };
  } catch (error) {
    console.error("Erro ao verificar link:", error);
    return { success: false, error: "Erro ao verificar link" };
  }
}

export async function updateProductLink(
  productId: string,
  data: { linkCompra?: string | null; linkStatus?: LinkStatus }
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    const updateData: {
      linkCompra?: string | null;
      linkStatus?: LinkStatus;
      linkBrokenAt?: Date | null;
      linkCheckAttempts?: number;
    } = {};

    if (data.linkCompra !== undefined) {
      updateData.linkCompra = data.linkCompra || null;
      if (!data.linkCompra) {
        updateData.linkStatus = "unknown";
        updateData.linkBrokenAt = null;
        updateData.linkCheckAttempts = 0;
      }
    }

    if (data.linkStatus) {
      updateData.linkStatus = data.linkStatus;
      if (data.linkStatus === "active") {
        updateData.linkBrokenAt = null;
        updateData.linkCheckAttempts = 0;
      }
    }

    await prisma.produto.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath("/admin/links");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar link:", error);
    return { success: false, error: "Erro ao atualizar link" };
  }
}

export async function getProductLinkHistory(productId: string) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const checks = await prisma.productLinkCheck.findMany({
    where: { produtoId: productId },
    orderBy: { checkedAt: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      httpStatus: true,
      responseMs: true,
      errorType: true,
      checkedAt: true,
    },
  });

  return checks;
}

export async function getStoresWithLinks() {
  const session = await verifySession();
  if (!session) {
    throw new Error("Não autorizado");
  }

  const stores = await prisma.produto.groupBy({
    by: ["loja"],
    _count: true,
    where: {
      linkCompra: { not: null },
      loja: { not: null },
    },
    orderBy: {
      _count: {
        loja: "desc",
      },
    },
  });

  return stores
    .filter((s) => s.loja)
    .map((s) => ({
      name: s.loja!,
      count: s._count,
    }));
}
