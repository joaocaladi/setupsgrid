import Image from "next/image";
import { formatPriceWithDate } from "@/lib/utils";
import type { Produto } from "@/types";

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  const isBrokenLink = produto.linkStatus === "broken";

  return (
    <div className="relative flex gap-5 p-5 pr-36 bg-[var(--background-secondary)] rounded-2xl transition-all duration-300 hover:bg-[var(--background-tertiary)]">
      {/* Product image */}
      <div className="relative w-40 h-40 rounded-xl flex-shrink-0 bg-[var(--background)] flex items-center justify-center overflow-hidden">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

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

        {/* Price with date */}
        {produto.preco && (
          <span className="text-[15px] font-semibold text-[var(--text-primary)] mt-1 block">
            {formatPriceWithDate(
              produto.preco,
              produto.precoCapturedAt,
              produto.moeda
            )}
          </span>
        )}
      </div>

      {/* Botão - meio direito */}
      {produto.linkCompra && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1">
          <a
            href={produto.linkCompra}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-[13px] font-medium text-white bg-[#34C759] rounded-lg hover:bg-[#2DB84E] transition-colors"
          >
            Ir para loja &gt;
          </a>
          {isBrokenLink && (
            <span className="text-yellow-500 text-[11px]">
              (pode estar indisponível)
            </span>
          )}
        </div>
      )}

      {/* Vendido por - bottom right */}
      {produto.loja && (
        <span className="absolute bottom-3 right-5 text-xs text-[var(--text-secondary)]">
          Vendido por {produto.loja}
        </span>
      )}
    </div>
  );
}
