"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import {
  submissionReviewSchema,
  type SubmissionReviewData,
} from "@/lib/validations/submission";

// ============================================
// DATA FETCHING
// ============================================

export async function getSubmissions(status?: string) {
  const session = await verifySession();
  if (!session) return [];

  try {
    const submissions = await prisma.setupSubmission.findMany({
      where: status && status !== "all" ? { status: status as "pending" | "approved" | "rejected" } : undefined,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        products: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return submissions;
  } catch (error) {
    console.error("Erro ao buscar submissões:", error);
    return [];
  }
}

export async function getSubmissionForReview(id: string) {
  const session = await verifySession();
  if (!session) return null;

  try {
    const submission = await prisma.setupSubmission.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        products: {
          orderBy: { position: "asc" },
        },
        publishedSetup: true,
      },
    });

    return submission;
  } catch (error) {
    console.error("Erro ao buscar submissão:", error);
    return null;
  }
}

export async function getPendingSubmissionsCount() {
  const session = await verifySession();
  if (!session) return 0;

  try {
    const count = await prisma.setupSubmission.count({
      where: { status: "pending" },
    });

    return count;
  } catch (error) {
    console.error("Erro ao contar submissões pendentes:", error);
    return 0;
  }
}

// ============================================
// IMAGE MANAGEMENT
// ============================================

export async function updateSubmissionImageOrder(
  submissionId: string,
  imageIds: string[]
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await Promise.all(
      imageIds.map((id, position) =>
        prisma.setupSubmissionImage.update({
          where: { id },
          data: { position },
        })
      )
    );

    revalidatePath(`/admin/submissions/${submissionId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao reordenar imagens:", error);
    return { success: false, error: "Erro ao reordenar imagens" };
  }
}

export async function removeSubmissionImage(imageId: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    const image = await prisma.setupSubmissionImage.delete({
      where: { id: imageId },
    });

    revalidatePath(`/admin/submissions/${image.submissionId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover imagem:", error);
    return { success: false, error: "Erro ao remover imagem" };
  }
}

// ============================================
// APPROVAL / REJECTION
// ============================================

export async function approveSubmission(
  submissionId: string,
  reviewData: SubmissionReviewData
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  // Validar dados
  const parsed = submissionReviewSchema.safeParse(reviewData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Buscar submissão com imagens
    const submission = await prisma.setupSubmission.findUnique({
      where: { id: submissionId },
      include: {
        images: { orderBy: { position: "asc" } },
      },
    });

    if (!submission) {
      return { success: false, error: "Submissão não encontrada" };
    }

    if (submission.status !== "pending") {
      return { success: false, error: "Submissão já foi processada" };
    }

    if (submission.images.length === 0) {
      return { success: false, error: "Submissão não possui imagens" };
    }

    const { title, description, categoriaIds, products } = parsed.data;

    // Criar o setup
    const setup = await prisma.setup.create({
      data: {
        titulo: title,
        descricao: description,
        imagemUrl: submission.images[0].storagePath,
        imagens: submission.images.slice(1).map((img) => img.storagePath),
        autor: submission.userName,
        fonte: "Comunidade",
        categorias: {
          connect: categoriaIds.map((id) => ({ id })),
        },
        produtos: {
          create: products.map((p, idx) => ({
            nome: p.nome,
            categoria: p.categoria,
            descricao: p.descricao,
            preco: p.preco,
            moeda: p.moeda,
            linkCompra: p.linkCompra || null,
            loja: p.loja,
            destaque: p.destaque,
            ordem: idx,
          })),
        },
      },
    });

    // Atualizar status da submissão
    await prisma.setupSubmission.update({
      where: { id: submissionId },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        publishedSetupId: setup.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
    revalidatePath(`/admin/submissions/${submissionId}`);

    return { success: true, setupId: setup.id };
  } catch (error) {
    console.error("Erro ao aprovar submissão:", error);
    return { success: false, error: "Erro ao aprovar submissão" };
  }
}

export async function rejectSubmission(submissionId: string, reason: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  if (!reason || reason.trim().length < 5) {
    return { success: false, error: "Informe o motivo da rejeição" };
  }

  try {
    const submission = await prisma.setupSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return { success: false, error: "Submissão não encontrada" };
    }

    if (submission.status !== "pending") {
      return { success: false, error: "Submissão já foi processada" };
    }

    await prisma.setupSubmission.update({
      where: { id: submissionId },
      data: {
        status: "rejected",
        rejectionReason: reason.trim(),
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin/submissions");
    revalidatePath(`/admin/submissions/${submissionId}`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao rejeitar submissão:", error);
    return { success: false, error: "Erro ao rejeitar submissão" };
  }
}

// ============================================
// DELETE
// ============================================

export async function deleteSubmission(submissionId: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.setupSubmission.delete({
      where: { id: submissionId },
    });

    revalidatePath("/admin/submissions");

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir submissão:", error);
    return { success: false, error: "Erro ao excluir submissão" };
  }
}
