import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
  // Verificar autenticação
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    // Buscar estatísticas por status
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
      { total: number; active: number; broken: number; unknown: number }
    >();

    for (const item of byStoreRaw) {
      if (!item.loja) continue;

      if (!storeMap.has(item.loja)) {
        storeMap.set(item.loja, { total: 0, active: 0, broken: 0, unknown: 0 });
      }

      const store = storeMap.get(item.loja)!;
      store.total += item._count;

      if (item.linkStatus === "active") {
        store.active = item._count;
      } else if (item.linkStatus === "broken") {
        store.broken = item._count;
      } else {
        store.unknown = item._count;
      }
    }

    const byStore = Array.from(storeMap.entries()).map(([store, stats]) => ({
      store,
      ...stats,
    }));

    // Buscar última verificação
    const lastCheck = await prisma.productLinkCheck.findFirst({
      orderBy: { checkedAt: "desc" },
      select: { checkedAt: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        active: activeCount,
        broken: brokenCount,
        unknown: unknownCount,
        byStore,
        lastCheck: lastCheck?.checkedAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de links:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
