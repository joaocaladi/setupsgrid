import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionFormSchema } from "@/lib/validations/submission";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Separar imagens e produtos do resto dos dados para validação
    const { images, products, ...formData } = body;

    // Validar dados do formulário
    const parsed = submissionFormSchema.safeParse(formData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Validar imagens
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Adicione pelo menos 1 imagem" },
        { status: 400 }
      );
    }

    if (images.length > 10) {
      return NextResponse.json(
        { error: "Máximo de 10 imagens permitidas" },
        { status: 400 }
      );
    }

    // Validar products
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Adicione pelo menos 1 produto" },
        { status: 400 }
      );
    }

    // Validar que cada produto tem nome
    const validProducts = products.filter(
      (p: { productName?: string }) =>
        p.productName && p.productName.trim().length >= 2
    );
    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: "Adicione pelo menos 1 produto com nome válido" },
        { status: 400 }
      );
    }

    const { userName, userEmail, userWhatsapp, title, description } =
      parsed.data;

    // Criar submissão com imagens e produtos
    const submission = await prisma.setupSubmission.create({
      data: {
        userName,
        userEmail,
        userWhatsapp,
        title,
        description,
        images: {
          create: images.map(
            (img: { url: string; position?: number }, idx: number) => ({
              storagePath: img.url,
              position: img.position ?? idx,
            })
          ),
        },
        products: {
          create: validProducts.map(
            (
              p: {
                productName: string;
                productCategory?: string;
                productUrl?: string;
                productPrice?: number;
                productImage?: string;
              },
              idx: number
            ) => ({
              productName: p.productName,
              productCategory: p.productCategory || null,
              productUrl: p.productUrl || null,
              productPrice: p.productPrice || null,
              productImage: p.productImage || null,
              position: idx,
            })
          ),
        },
      },
      include: {
        images: true,
        products: true,
      },
    });

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: "Submissão enviada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar submissão:", error);
    return NextResponse.json(
      { error: "Erro ao enviar submissão. Tente novamente." },
      { status: 500 }
    );
  }
}
