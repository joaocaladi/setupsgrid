"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotspotEditorProps {
  imagemPrincipal: string;
  imagens?: string[];
  hotspotX: number | null;
  hotspotY: number | null;
  hotspotImagem: number | null;
  onChange: (x: number | null, y: number | null, imagem: number | null) => void;
  produtoNome: string;
}

export function HotspotEditor({
  imagemPrincipal,
  imagens = [],
  hotspotX,
  hotspotY,
  hotspotImagem,
  onChange,
  produtoNome,
}: HotspotEditorProps) {
  // Combinar imagem principal com adicionais
  const todasImagens = [imagemPrincipal, ...imagens];
  const [imagemSelecionada, setImagemSelecionada] = useState(hotspotImagem ?? 0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Calcula posição do clique em porcentagem
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Limitar entre 0 e 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onChange(
      Math.round(clampedX * 10) / 10,
      Math.round(clampedY * 10) / 10,
      imagemSelecionada
    );
  };

  // Limpar hotspot
  const handleClear = () => {
    onChange(null, null, null);
  };

  // Mudar imagem selecionada
  const handleImageChange = (index: number) => {
    setImagemSelecionada(index);
    // Se já tem hotspot, atualiza para a nova imagem
    if (hotspotX !== null && hotspotY !== null) {
      onChange(hotspotX, hotspotY, index);
    }
  };

  // Atualizar coordenada X manualmente
  const handleXChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onChange(num, hotspotY, imagemSelecionada);
    }
  };

  // Atualizar coordenada Y manualmente
  const handleYChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onChange(hotspotX, num, imagemSelecionada);
    }
  };

  const temHotspot = hotspotX !== null && hotspotY !== null;
  const mostrandoImagemComHotspot = hotspotImagem === imagemSelecionada;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4" />
        <span>Posição na imagem</span>
      </div>

      {/* Seletor de imagem (se houver múltiplas) */}
      {todasImagens.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {todasImagens.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleImageChange(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                imagemSelecionada === index
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={img}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
              {hotspotImagem === index && temHotspot && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Editor de imagem */}
      <div
        ref={imageContainerRef}
        onClick={handleImageClick}
        className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 cursor-crosshair border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
      >
        <Image
          src={todasImagens[imagemSelecionada]}
          alt="Imagem do setup"
          fill
          className="object-contain"
          sizes="400px"
        />

        {/* Preview do hotspot */}
        {temHotspot && mostrandoImagemComHotspot && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${hotspotX}%`,
              top: `${hotspotY}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center animate-hotspot-pulse">
              <Plus className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        )}

        {/* Instrução */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="inline-block px-3 py-1.5 bg-black/70 text-white text-xs rounded-full">
            Clique para posicionar &quot;{produtoNome}&quot;
          </span>
        </div>
      </div>

      {/* Controles manuais */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">X:</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={hotspotX ?? ""}
            onChange={(e) => handleXChange(e.target.value)}
            placeholder="-"
            className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">%</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Y:</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={hotspotY ?? ""}
            onChange={(e) => handleYChange(e.target.value)}
            placeholder="-"
            className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">%</span>
        </div>

        {temHotspot && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>

      {/* Status */}
      {temHotspot ? (
        <p className="text-xs text-green-600">
          ✓ Hotspot definido na imagem {(hotspotImagem ?? 0) + 1}
        </p>
      ) : (
        <p className="text-xs text-gray-400">
          Clique na imagem acima para definir onde o produto aparece
        </p>
      )}
    </div>
  );
}
