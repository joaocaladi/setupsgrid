import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { checkLink } from "@/lib/link-checker";

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
    const { productId } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, error: "productId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar produto
    const produto = await prisma.produto.findUnique({
      where: { id: productId },
      select: { id: true, linkCompra: true, nome: true },
    });

    if (!produto) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (!produto.linkCompra) {
      return NextResponse.json(
        { success: false, error: "Produto não possui link de compra" },
        { status: 400 }
      );
    }

    // Verificar link
    const result = await checkLink(produto.linkCompra);

    // Atualizar produto
    const updateData: {
      linkStatus: "active" | "broken" | "unknown";
      linkLastCheckedAt: Date;
      linkCheckAttempts: number;
      linkBrokenAt: Date | null;
    } = {
      linkStatus: result.status,
      linkLastCheckedAt: new Date(),
      linkCheckAttempts: result.status === "broken" ? { increment: 1 } : 0,
      linkBrokenAt:
        result.status === "broken"
          ? await prisma.produto
              .findUnique({ where: { id: productId } })
              .then((p) => p?.linkBrokenAt || new Date())
          : null,
    } as {
      linkStatus: "active" | "broken" | "unknown";
      linkLastCheckedAt: Date;
      linkCheckAttempts: number;
      linkBrokenAt: Date | null;
    };

    await prisma.produto.update({
      where: { id: productId },
      data: {
        linkStatus: result.status,
        linkLastCheckedAt: new Date(),
        linkCheckAttempts:
          result.status === "broken" ? { increment: 1 } : 0,
        linkBrokenAt: updateData.linkBrokenAt,
      },
    });

    // Criar registro de verificação
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

    return NextResponse.json({
      success: true,
      data: {
        productId,
        productName: produto.nome,
        url: produto.linkCompra,
        status: result.status,
        httpStatus: result.httpStatus,
        responseMs: result.responseMs,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao verificar link:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao verificar link" },
      { status: 500 }
    );
  }
}
