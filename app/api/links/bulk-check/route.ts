import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { checkLinksInBatch } from "@/lib/link-checker";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export async function POST(request: NextRequest) {
  // Verificar autenticação
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { productIds, limit = DEFAULT_LIMIT } = body;

    const effectiveLimit = Math.min(limit, MAX_LIMIT);

    // Buscar produtos para verificar
    let produtos;
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      produtos = await prisma.produto.findMany({
        where: {
          id: { in: productIds },
          linkCompra: { not: null },
        },
        select: { id: true, linkCompra: true },
        take: effectiveLimit,
      });
    } else {
      // Buscar produtos que precisam ser verificados
      // Prioridade: nunca verificados > verificados há mais tempo
      produtos = await prisma.produto.findMany({
        where: {
          linkCompra: { not: null },
        },
        select: { id: true, linkCompra: true },
        orderBy: [
          { linkLastCheckedAt: { sort: "asc", nulls: "first" } },
        ],
        take: effectiveLimit,
      });
    }

    if (produtos.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          checked: 0,
          active: 0,
          broken: 0,
          results: [],
        },
      });
    }

    // Verificar links em lote
    const productsWithLinks = produtos
      .filter((p): p is { id: string; linkCompra: string } => p.linkCompra !== null)
      .map((p) => ({ id: p.id, linkCompra: p.linkCompra }));

    const results = await checkLinksInBatch(productsWithLinks, 10, 500);

    // Atualizar produtos e criar registros
    const updatePromises: Promise<unknown>[] = [];
    const resultArray: Array<{ productId: string; status: string; error?: string }> = [];

    for (const [productId, result] of results) {
      const produto = productsWithLinks.find((p) => p.id === productId);
      if (!produto) continue;

      // Atualizar produto
      updatePromises.push(
        prisma.produto.update({
          where: { id: productId },
          data: {
            linkStatus: result.status,
            linkLastCheckedAt: new Date(),
            linkCheckAttempts: result.status === "broken" ? { increment: 1 } : 0,
            linkBrokenAt:
              result.status === "broken"
                ? new Date()
                : null,
          },
        })
      );

      // Criar registro de verificação
      updatePromises.push(
        prisma.productLinkCheck.create({
          data: {
            produtoId: productId,
            url: produto.linkCompra,
            status: result.status,
            httpStatus: result.httpStatus,
            responseMs: result.responseMs,
            errorType: result.errorType,
          },
        })
      );

      resultArray.push({
        productId,
        status: result.status,
        error: result.errorType || undefined,
      });
    }

    await Promise.all(updatePromises);

    const activeCount = resultArray.filter((r) => r.status === "active").length;
    const brokenCount = resultArray.filter((r) => r.status === "broken").length;

    return NextResponse.json({
      success: true,
      data: {
        checked: resultArray.length,
        active: activeCount,
        broken: brokenCount,
        results: resultArray,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar links em lote:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao verificar links" },
      { status: 500 }
    );
  }
}
