import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transformToAffiliateUrl } from "@/lib/affiliate/transformer";

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { storeKey, limit = 500 } = body;

    // Busca produtos que precisam ser reprocessados
    // Prioriza produtos sem afiliado aplicado
    const where = storeKey
      ? {
          affiliateStoreKey: storeKey,
          linkCompra: { not: null },
        }
      : {
          linkCompra: { not: null },
        };

    const products = await prisma.produto.findMany({
      where,
      select: {
        id: true,
        linkCompra: true,
        linkCompraOriginal: true,
      },
      take: limit,
    });

    let processed = 0;
    let updated = 0;

    for (const product of products) {
      // Usa URL original se disponível, senão usa a atual
      const urlToTransform =
        product.linkCompraOriginal || product.linkCompra;

      if (!urlToTransform) continue;

      const result = await transformToAffiliateUrl(urlToTransform);
      processed++;

      // Só atualiza se houve transformação ou se os dados mudaram
      if (result.wasTransformed) {
        await prisma.produto.update({
          where: { id: product.id },
          data: {
            linkCompraOriginal: urlToTransform,
            linkCompra: result.transformedUrl,
            affiliateStoreKey: result.storeKey,
            hasAffiliate: true,
          },
        });
        updated++;
      } else if (result.storeKey && !product.linkCompraOriginal) {
        // Mesmo sem transformação, salva a referência da loja
        await prisma.produto.update({
          where: { id: product.id },
          data: {
            linkCompraOriginal: urlToTransform,
            affiliateStoreKey: result.storeKey,
            hasAffiliate: false,
          },
        });
      }
    }

    // Atualiza contadores de produtos por loja
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

    return NextResponse.json({
      success: true,
      data: { processed, updated },
    });
  } catch (error) {
    console.error("Erro ao reprocessar:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
