import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
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
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL é obrigatória" },
        { status: 400 }
      );
    }

    const result = await transformToAffiliateUrl(url);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao testar URL:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
