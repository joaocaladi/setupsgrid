import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import type { Produto } from "@/types";

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 bg-[var(--card)] rounded-xl border transition-all duration-200",
        produto.destaque
          ? "border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20"
          : "border-[var(--border)] hover:border-[var(--border-light)]"
      )}
    >
      {/* Product image */}
      {produto.imagemUrl ? (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--background)]">
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-[var(--background)] flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
      )}

      {/* Product info */}
      <div className="flex-1 min-w-0">
        {/* Category + highlight badge */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
            {produto.categoria}
          </span>
          {produto.destaque && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-[var(--accent)]/10 text-[var(--accent)]">
              <Star className="h-3 w-3 fill-current" />
              Destaque
            </span>
          )}
        </div>

        {/* Name */}
        <h4 className="font-medium text-[var(--text-primary)] line-clamp-1">
          {produto.nome}
        </h4>

        {/* Description */}
        {produto.descricao && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-0.5">
            {produto.descricao}
          </p>
        )}

        {/* Price and buy link */}
        <div className="flex items-center justify-between mt-2">
          {produto.preco && (
            <span className="font-semibold text-[var(--text-primary)]">
              {formatPrice(produto.preco, produto.moeda)}
            </span>
          )}

          {produto.linkCompra && (
            <a
              href={produto.linkCompra}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              {produto.loja || "Comprar"}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
