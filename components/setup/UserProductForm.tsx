"use client";

import { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronUp, Loader2, Link } from "lucide-react";
import { PRODUTO_CATEGORIAS, LOJAS, type ProdutoFormData } from "@/lib/validations";
import { UserImageUpload } from "./UserImageUpload";
import { HotspotEditor } from "@/components/admin/HotspotEditor";

interface UserProductFormProps {
  produto: ProdutoFormData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (data: ProdutoFormData) => void;
  onRemove: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  imagemPrincipal?: string;
  imagens?: string[];
}

export function UserProductForm({
  produto,
  index,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
  dragHandleProps,
  imagemPrincipal,
  imagens,
}: UserProductFormProps) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  function handleChange(field: keyof ProdutoFormData, value: unknown) {
    onChange({ ...produto, [field]: value });
  }

  // Extract product data from URL
  async function handleUrlPaste(url: string) {
    handleChange("linkCompra", url);

    if (!url || !url.startsWith("http")) return;

    setExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Update product with extracted data
        onChange({
          ...produto,
          linkCompra: url,
          nome: data.data.name || produto.nome,
          preco: data.data.priceValue || produto.preco,
          imagemUrl: data.data.image || produto.imagemUrl,
          loja: data.data.storeName || produto.loja,
        });
      } else {
        setExtractError("Não foi possível extrair os dados. Preencha manualmente.");
      }
    } catch {
      setExtractError("Erro ao extrair dados. Preencha manualmente.");
    } finally {
      setExtracting(false);
    }
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
          {produto.categoria && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--background-tertiary)] text-[var(--text-secondary)] rounded">
              {produto.categoria}
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
          {/* Link de afiliado - primeiro campo */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Link de afiliado
            </label>
            <div className="relative">
              <input
                type="url"
                value={produto.linkCompra || ""}
                onChange={(e) => handleUrlPaste(e.target.value)}
                onPaste={(e) => {
                  const pastedUrl = e.clipboardData.getData("text");
                  setTimeout(() => handleUrlPaste(pastedUrl), 100);
                }}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)]"
                placeholder="Cole o link do produto..."
              />
              {extracting && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0071e3] animate-spin" />
              )}
              {!extracting && produto.linkCompra && (
                <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Cole seu link de afiliado e preenchemos os dados automaticamente
            </p>
            {extractError && (
              <p className="text-xs text-amber-500 mt-1">{extractError}</p>
            )}
          </div>

          {/* Imagem e campos principais */}
          <div className="flex gap-4">
            {/* Imagem do produto */}
            <UserImageUpload
              value={produto.imagemUrl}
              onChange={(url) => handleChange("imagemUrl", url || "")}
              bucket="produtos"
              compact
            />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Ex: Mesa Flexform"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Hotspot Editor - only shows if there's a setup image */}
          {imagemPrincipal && (
            <div className="pt-4 border-t border-[var(--border)]">
              <HotspotEditor
                imagemPrincipal={imagemPrincipal}
                imagens={imagens}
                hotspotX={produto.hotspotX ?? null}
                hotspotY={produto.hotspotY ?? null}
                hotspotImagem={produto.hotspotImagem ?? null}
                onChange={(x, y, imagem) => {
                  onChange({
                    ...produto,
                    hotspotX: x,
                    hotspotY: y,
                    hotspotImagem: imagem,
                  });
                }}
                produtoNome={produto.nome || `Produto ${index + 1}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
