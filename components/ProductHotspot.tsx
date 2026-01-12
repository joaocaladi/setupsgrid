"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, X, ExternalLink } from "lucide-react";
import type { Produto } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

interface ProductHotspotProps {
  produto: Produto;
}

export function ProductHotspot({ produto }: ProductHotspotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (produto.hotspotX === null || produto.hotspotY === null) return null;

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${produto.hotspotX}%`,
        top: `${produto.hotspotY}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Marcador */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 bg-white rounded-full shadow-lg
                   flex items-center justify-center cursor-pointer
                   hover:scale-110 transition-transform duration-200
                   animate-hotspot-pulse"
        aria-label={isOpen ? "Fechar detalhes do produto" : `Ver detalhes: ${produto.nome}`}
      >
        {isOpen ? (
          <X className="w-4 h-4 text-gray-700" />
        ) : (
          <Plus className="w-4 h-4 text-gray-700" />
        )}
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2
                     w-64 bg-white rounded-xl shadow-xl p-4
                     animate-fade-in z-20"
        >
          {/* Seta do popup */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-lg" />

          {/* Conteúdo */}
          <div className="relative">
            {/* Imagem do produto */}
            {produto.imagemUrl && (
              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            )}

            {/* Info */}
            <p className="text-xs text-gray-500 mb-1">{produto.categoria}</p>
            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{produto.nome}</h4>

            {produto.preco && (
              <p className="text-lg font-bold text-gray-900 mb-3">
                {formatPrice(produto.preco, produto.moeda)}
              </p>
            )}

            {/* Botão */}
            {produto.linkCompra && (
              <a
                href={produto.linkCompra}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full
                           bg-[#34C759] text-white rounded-lg py-2.5
                           hover:bg-[#2DB84D] transition-colors"
              >
                <span className="text-sm font-medium">Ver na loja</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {produto.loja && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Vendido por {produto.loja}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
