import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkLinksInBatch } from "@/lib/link-checker";

const BATCH_SIZE = 50;

export async function POST(request: NextRequest) {
  // Verificar autenticação do cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    // Buscar produtos que precisam ser verificados
    // Prioridade: unknown > verificados há mais tempo
    const produtos = await prisma.produto.findMany({
      where: {
        linkCompra: { not: null },
      },
      select: { id: true, linkCompra: true },
      orderBy: [
        { linkStatus: "asc" }, // unknown vem primeiro
        { linkLastCheckedAt: { sort: "asc", nulls: "first" } },
      ],
      take: BATCH_SIZE,
    });

    if (produtos.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          processed: 0,
          active: 0,
          broken: 0,
          duration: Date.now() - startTime,
        },
      });
    }

    // Verificar links em lote
    const productsWithLinks = produtos
      .filter((p): p is { id: string; linkCompra: string } => p.linkCompra !== null)
      .map((p) => ({ id: p.id, linkCompra: p.linkCompra }));

    const results = await checkLinksInBatch(productsWithLinks, 10, 300);

    // Atualizar produtos e criar registros
    const updatePromises: Promise<unknown>[] = [];
    let activeCount = 0;
    let brokenCount = 0;

    for (const [productId, result] of results) {
      const produto = productsWithLinks.find((p) => p.id === productId);
      if (!produto) continue;

      if (result.status === "active") {
        activeCount++;
      } else {
        brokenCount++;
      }

      // Atualizar produto
      updatePromises.push(
        prisma.produto.update({
          where: { id: productId },
          data: {
            linkStatus: result.status,
            linkLastCheckedAt: new Date(),
            linkCheckAttempts: result.status === "broken" ? { increment: 1 } : 0,
            linkBrokenAt: result.status === "broken" ? new Date() : null,
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
    }

    await Promise.all(updatePromises);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        processed: results.size,
        active: activeCount,
        broken: brokenCount,
        duration,
      },
    });
  } catch (error) {
    console.error("Erro no cron de verificação de links:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno no cron",
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// Também aceitar GET para facilitar testes locais
export async function GET(request: NextRequest) {
  return POST(request);
}
