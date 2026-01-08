"use client";

import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
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
    <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f5f5f7]">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-[#86868b] hover:text-[#1d1d1f]"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-sm font-medium text-[#1d1d1f]">
            {produto.nome || `Produto ${index + 1}`}
          </span>
          {produto.destaque && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
              Destaque
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#86868b] ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#86868b] ml-auto" />
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-[#86868b] hover:text-red-600 transition-colors"
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
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
                Nome *
              </label>
              <input
                type="text"
                value={produto.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
                placeholder="Ex: MacBook Pro 14"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
                Categoria *
              </label>
              <select
                value={produto.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] bg-white"
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
            <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              value={produto.descricao || ""}
              onChange={(e) => handleChange("descricao", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
              placeholder="Ex: Chip M3 Pro, 18GB RAM"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
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
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
                placeholder="0,00"
              />
            </div>

            {/* Loja */}
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
                Loja
              </label>
              <select
                value={produto.loja || ""}
                onChange={(e) => handleChange("loja", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f] bg-white"
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
                  className="w-4 h-4 rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
                />
                <span className="text-sm text-[#1d1d1f]">Produto destaque</span>
              </label>
            </div>
          </div>

          {/* Link de compra */}
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
              Link de compra
            </label>
            <input
              type="url"
              value={produto.linkCompra || ""}
              onChange={(e) => handleChange("linkCompra", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1d1d1f]"
              placeholder="https://..."
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
              Imagem do produto
            </label>
            <ImageUpload
              value={produto.imagemUrl}
              onChange={(url) => handleChange("imagemUrl", url)}
              bucket="produtos"
              className="max-w-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
