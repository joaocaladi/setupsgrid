import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticação
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // Buscar produto com histórico
    const produto = await prisma.produto.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        linkCompra: true,
        linkStatus: true,
        linkLastCheckedAt: true,
        linkCheckAttempts: true,
        linkBrokenAt: true,
        loja: true,
        setup: {
          select: {
            id: true,
            titulo: true,
          },
        },
        linkChecks: {
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
        },
      },
    });

    if (!produto) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        productId: produto.id,
        productName: produto.nome,
        url: produto.linkCompra,
        status: produto.linkStatus,
        lastCheckedAt: produto.linkLastCheckedAt?.toISOString() || null,
        checkAttempts: produto.linkCheckAttempts,
        brokenAt: produto.linkBrokenAt?.toISOString() || null,
        store: produto.loja,
        setup: produto.setup,
        history: produto.linkChecks.map((check) => ({
          id: check.id,
          status: check.status,
          httpStatus: check.httpStatus,
          responseMs: check.responseMs,
          errorType: check.errorType,
          checkedAt: check.checkedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar link do produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticação
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { linkCompra, linkStatus } = body;

    // Validar dados
    const updateData: {
      linkCompra?: string | null;
      linkStatus?: "active" | "broken" | "unknown";
      linkBrokenAt?: Date | null;
      linkCheckAttempts?: number;
    } = {};

    if (linkCompra !== undefined) {
      updateData.linkCompra = linkCompra || null;
      // Se removeu o link, resetar status
      if (!linkCompra) {
        updateData.linkStatus = "unknown";
        updateData.linkBrokenAt = null;
        updateData.linkCheckAttempts = 0;
      }
    }

    if (linkStatus && ["active", "broken", "unknown"].includes(linkStatus)) {
      updateData.linkStatus = linkStatus;
      if (linkStatus === "active") {
        updateData.linkBrokenAt = null;
        updateData.linkCheckAttempts = 0;
      } else if (linkStatus === "broken") {
        updateData.linkBrokenAt = new Date();
      }
    }

    const produto = await prisma.produto.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        linkCompra: true,
        linkStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: produto,
    });
  } catch (error) {
    console.error("Erro ao atualizar link do produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
