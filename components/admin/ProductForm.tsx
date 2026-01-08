"use client";

import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { PRODUTO_CATEGORIAS, LOJAS, type ProdutoFormData } from "@/lib/validations";

interface ProductFormProps {
  produto: ProdutoFormData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (data: ProdutoFormData) => void;
  onRemove: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ProductForm({
  produto,
  index,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
  dragHandleProps,
}: ProductFormProps) {
  function handleChange(field: keyof ProdutoFormData, value: unknown) {
    onChange({ ...produto, [field]: value });
  }

  return (
    <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--background)]">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {produto.nome || `Produto ${index + 1}`}
          </span>
          {produto.destaque && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500 rounded">
              Destaque
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[var(--text-secondary)] ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] ml-auto" />
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Nome *
              </label>
              <input
                type="text"
                value={produto.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                placeholder="Ex: MacBook Pro 14"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Categoria *
              </label>
              <select
                value={produto.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] bg-[var(--background)]"
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

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              value={produto.descricao || ""}
              onChange={(e) => handleChange("descricao", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
              placeholder="Ex: Chip M3 Pro, 18GB RAM"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={produto.preco || ""}
                onChange={(e) =>
                  handleChange(
                    "preco",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                placeholder="0,00"
              />
            </div>

            {/* Loja */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Loja
              </label>
              <select
                value={produto.loja || ""}
                onChange={(e) => handleChange("loja", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] bg-[var(--background)]"
              >
                <option value="">Selecione...</option>
                {LOJAS.map((loja) => (
                  <option key={loja} value={loja}>
                    {loja}
                  </option>
                ))}
              </select>
            </div>

            {/* Destaque */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={produto.destaque}
                  onChange={(e) => handleChange("destaque", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[#0071e3] focus:ring-[#0071e3]"
                />
                <span className="text-sm text-[var(--text-primary)]">Produto destaque</span>
              </label>
            </div>
          </div>

          {/* Link de compra */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Link de compra
            </label>
            <input
              type="url"
              value={produto.linkCompra || ""}
              onChange={(e) => handleChange("linkCompra", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
