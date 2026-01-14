import * as XLSX from "xlsx";
import type { SubmissionWithRelations } from "@/types";

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };
  return map[status] || status;
}

function formatSubmissionsForExport(submissions: SubmissionWithRelations[]) {
  return submissions.map((sub) => ({
    ID: sub.id,
    Título: sub.title || "Sem título",
    Nome: sub.userName,
    Email: sub.userEmail,
    WhatsApp: sub.userWhatsapp || "",
    Status: translateStatus(sub.status),
    "Qtd Imagens": sub.images.length,
    "Qtd Produtos": sub.products.length,
    Produtos: sub.products.map((p) => p.productName).join(", "),
    Descrição: sub.description || "",
    "Motivo Rejeição": sub.rejectionReason || "",
    "Data Envio": new Date(sub.createdAt).toLocaleString("pt-BR"),
    "Data Revisão": sub.reviewedAt
      ? new Date(sub.reviewedAt).toLocaleString("pt-BR")
      : "",
  }));
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSubmissionsToXLSX(submissions: SubmissionWithRelations[]) {
  const data = formatSubmissionsForExport(submissions);
  const ws = XLSX.utils.json_to_sheet(data);

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 25 }, // ID
    { wch: 30 }, // Título
    { wch: 20 }, // Nome
    { wch: 30 }, // Email
    { wch: 15 }, // WhatsApp
    { wch: 12 }, // Status
    { wch: 12 }, // Qtd Imagens
    { wch: 12 }, // Qtd Produtos
    { wch: 50 }, // Produtos
    { wch: 40 }, // Descrição
    { wch: 30 }, // Motivo Rejeição
    { wch: 20 }, // Data Envio
    { wch: 20 }, // Data Revisão
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Submissões");
  XLSX.writeFile(
    wb,
    `submissoes-${new Date().toISOString().split("T")[0]}.xlsx`
  );
}

export function exportSubmissionsToCSV(submissions: SubmissionWithRelations[]) {
  const data = formatSubmissionsForExport(submissions);
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  downloadFile(
    csv,
    `submissoes-${new Date().toISOString().split("T")[0]}.csv`,
    "text/csv;charset=utf-8"
  );
}
