import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const setups = await prisma.setup.findMany({
      where: {
        OR: [
          { titulo: { contains: query, mode: "insensitive" } },
          { descricao: { contains: query, mode: "insensitive" } },
          { autor: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        categorias: true,
      },
      take: 10,
      orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ results: setups });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Erro na busca" }, { status: 500 });
  }
}
