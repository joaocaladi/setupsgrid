import { NextRequest, NextResponse } from "next/server";
import { extractProductData } from "@/lib/scraper";
import { isValidUrl } from "@/lib/scraper/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validar presença da URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "URL é obrigatória",
        },
        { status: 400 }
      );
    }

    // Validar formato da URL
    if (!isValidUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: "URL inválida. Use uma URL completa (http:// ou https://)",
        },
        { status: 400 }
      );
    }

    // Extrair dados do produto
    const result = await extractProductData(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao extrair produto:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
