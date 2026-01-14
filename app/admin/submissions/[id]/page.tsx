import { notFound } from "next/navigation";
import { getSubmissionForReview } from "../actions";
import { getCategorias } from "@/app/admin/actions";
import { SubmissionReviewForm } from "@/components/admin/submissions";

interface SubmissionReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionReviewPage({
  params,
}: SubmissionReviewPageProps) {
  const { id } = await params;

  const [submission, categorias] = await Promise.all([
    getSubmissionForReview(id),
    getCategorias(),
  ]);

  if (!submission) {
    notFound();
  }

  return <SubmissionReviewForm submission={submission} categorias={categorias} />;
}
