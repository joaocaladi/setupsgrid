"use client";

import Image from "next/image";
import { ExternalLink, Loader2, ChevronLeft } from "lucide-react";
import type { Categoria } from "@prisma/client";
import type { ProdutoFormData } from "@/lib/validations";

interface SetupPreviewProps {
  imagemUrl: string;
  imagens: string[];
  titulo: string;
  descricao?: string | null;
  categorias: Categoria[];
  produtos: ProdutoFormData[];
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export function SetupPreview({
  imagemUrl,
  imagens,
  titulo,
  descricao,
  categorias,
  produtos,
  onBack,
  onSaveDraft,
  onPublish,
  isSubmitting,
  isEditing,
}: SetupPreviewProps) {
  const allImages = [imagemUrl, ...imagens].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Revisar setup
        </h2>
        <p className="text-[var(--text-secondary)]">
          Confira como seu setup vai aparecer antes de {isEditing ? "salvar" : "publicar"}.
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Main Image */}
        {imagemUrl && (
          <div className="relative aspect-video">
            <Image
              src={imagemUrl}
              alt={titulo || "Preview do setup"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Additional Images */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {allImages.slice(1).map((url, index) => (
              <div
                key={url}
                className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Imagem ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--background-tertiary)] text-[var(--text-secondary)]"
                >
                  {cat.nome}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {titulo || "Setup sem título"}
          </h3>

          {/* Description */}
          {descricao && (
            <p className="text-[var(--text-secondary)] mb-6 whitespace-pre-wrap">
              {descricao}
            </p>
          )}

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Produtos ({produtos.length})
            </h4>

            {produtos.length === 0 ? (
              <p className="text-[var(--text-secondary)] text-sm">
                Nenhum produto adicionado.
              </p>
            ) : (
              <div className="space-y-3">
                {produtos.map((produto, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-[var(--background-secondary)] rounded-xl p-3"
                  >
                    {/* Product Image */}
                    <div className="w-14 h-14 bg-[var(--background-tertiary)] rounded-lg overflow-hidden flex-shrink-0">
                      {produto.imagemUrl ? (
                        <Image
                          src={produto.imagemUrl}
                          alt={produto.nome}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                          <ExternalLink className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        {produto.nome || `Produto ${index + 1}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        {produto.categoria && (
                          <span className="text-[var(--text-secondary)]">
                            {produto.categoria}
                          </span>
                        )}
                        {produto.loja && (
                          <>
                            <span className="text-[var(--text-secondary)]">•</span>
                            <span className="text-[var(--text-secondary)]">
                              {produto.loja}
                            </span>
                          </>
                        )}
                      </div>
                      {produto.preco && (
                        <p className="text-[#0071e3] font-medium">
                          R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>

                    {/* Link indicator */}
                    {produto.linkCompra && (
                      <ExternalLink className="h-4 w-4 text-[var(--text-secondary)] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--background-tertiary)] transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar e editar
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--background-tertiary)] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Salvar rascunho
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {isEditing ? "Salvar alterações" : "Publicar setup"}
        </button>
      </div>
    </div>
  );
}
