"use client";

import { ChevronDown, ChevronUp, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { PRODUTO_CATEGORIAS } from "@/lib/validations";
import type { SubmissionProductData } from "@/lib/validations/submission";

interface SubmissionProductFormProps {
  product: SubmissionProductData;
  index: number;
  onChange: (product: SubmissionProductData) => void;
  onRemove: () => void;
  canRemove: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function SubmissionProductForm({
  product,
  index,
  onChange,
  onRemove,
  canRemove,
  dragHandleProps,
}: SubmissionProductFormProps) {
  const [expanded, setExpanded] = useState(true);

  const updateField = <K extends keyof SubmissionProductData>(
    field: K,
    value: SubmissionProductData[K]
  ) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--background)]">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="p-1 cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Título */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--background-tertiary)] px-2 py-0.5 rounded">
            #{index + 1}
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {product.productName || "Novo Produto"}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[var(--text-secondary)] ml-auto flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] ml-auto flex-shrink-0" />
          )}
        </button>

        {/* Remover */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Campos */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Nome do produto */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={product.productName}
              onChange={(e) => updateField("productName", e.target.value)}
              placeholder="Ex: Monitor Dell Ultrasharp U2722D"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* Marca e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Marca
              </label>
              <input
                type="text"
                value={product.productBrand || ""}
                onChange={(e) => updateField("productBrand", e.target.value)}
                placeholder="Ex: Dell, Apple, Logitech"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Categoria
              </label>
              <select
                value={product.productCategory || ""}
                onChange={(e) => updateField("productCategory", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
              >
                <option value="">Selecione...</option>
                {PRODUTO_CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Link e Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Link para Compra
              </label>
              <input
                type="url"
                value={product.productUrl || ""}
                onChange={(e) => updateField("productUrl", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Preço Aproximado (R$)
              </label>
              <input
                type="number"
                value={product.productPrice || ""}
                onChange={(e) =>
                  updateField(
                    "productPrice",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                placeholder="Ex: 1500"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Observações
            </label>
            <textarea
              value={product.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Alguma informação adicional sobre o produto..."
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none"
            />
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {(product.notes || "").length}/500 caracteres
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
