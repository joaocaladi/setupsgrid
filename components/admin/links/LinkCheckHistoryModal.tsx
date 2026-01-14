"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { getProductLinkHistory } from "@/app/admin/links/actions";
import type { LinkStatus } from "@prisma/client";

interface HistoryEntry {
  id: string;
  status: LinkStatus;
  httpStatus: number | null;
  responseMs: number | null;
  errorType: string | null;
  checkedAt: Date;
}

interface LinkCheckHistoryModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LinkCheckHistoryModal({
  productId,
  productName,
  isOpen,
  onClose,
}: LinkCheckHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      getProductLinkHistory(productId)
        .then((data) => {
          setHistory(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: LinkStatus) => {
    if (status === "active") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getErrorLabel = (errorType: string | null) => {
    if (!errorType) return null;
    const labels: Record<string, string> = {
      timeout: "Timeout",
      network: "Erro de rede",
      ssl: "Erro SSL",
      http_error: "Erro HTTP",
      unknown: "Erro desconhecido",
    };
    return labels[errorType] || errorType;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Histórico de Verificações
            </h3>
            <p className="text-sm text-[var(--text-secondary)] truncate max-w-[300px]">
              {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma verificação realizada ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    index === 0
                      ? "bg-[var(--background-tertiary)]"
                      : "bg-[var(--background)]"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(entry.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          entry.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {entry.status === "active" ? "Ativo" : "Quebrado"}
                      </span>
                      {entry.httpStatus && (
                        <span className="text-xs text-[var(--text-secondary)] bg-[var(--background-secondary)] px-2 py-0.5 rounded">
                          HTTP {entry.httpStatus}
                        </span>
                      )}
                      {entry.errorType && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                          {getErrorLabel(entry.errorType)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatDate(entry.checkedAt)}
                      </span>
                      {entry.responseMs && (
                        <span className="text-xs text-[var(--text-secondary)]">
                          {entry.responseMs}ms
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
