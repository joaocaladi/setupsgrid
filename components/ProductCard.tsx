import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Produto } from "@/types";

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-[var(--background-secondary)] rounded-2xl transition-all duration-300 hover:bg-[var(--background-tertiary)]">
      {/* Product image */}
      {produto.imagemUrl ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--background)]">
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-[var(--background)] flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
      )}

      {/* Product info */}
      <div className="flex-1 min-w-0">
        {/* Category */}
        <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
          {produto.categoria}
        </span>

        {/* Name */}
        <h4 className="text-[15px] font-semibold text-[var(--text-primary)] line-clamp-1 mt-0.5">
          {produto.nome}
        </h4>

        {/* Description */}
        {produto.descricao && (
          <p className="text-[13px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
            {produto.descricao}
          </p>
        )}

        {/* Price and buy link */}
        <div className="flex items-center justify-between mt-2">
          {produto.preco && (
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">
              {formatPrice(produto.preco, produto.moeda)}
            </span>
          )}

          {produto.linkCompra && (
            <a
              href={produto.linkCompra}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:underline transition-colors"
            >
              {produto.loja || "Comprar"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
