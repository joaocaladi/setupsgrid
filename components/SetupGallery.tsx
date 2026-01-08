"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetupGalleryProps {
  imagemPrincipal: string;
  imagens?: string[];
  titulo: string;
  isVideo?: boolean;
  videoUrl?: string | null;
}

export function SetupGallery({
  imagemPrincipal,
  imagens,
  titulo,
  isVideo,
  videoUrl,
}: SetupGalleryProps) {
  // Combinar imagem principal com imagens adicionais (se existirem)
  const todasImagens = imagens && imagens.length > 0 ? imagens : [imagemPrincipal];
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  const temMultiplasImagens = todasImagens.length > 1;

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--background-tertiary)]">
        {isVideo && videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            poster={imagemPrincipal}
          />
        ) : (
          <>
            <Image
              src={todasImagens[imagemSelecionada]}
              alt={titulo}
              fill
              className="object-cover transition-opacity duration-300"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white rounded-full p-5 shadow-lg">
                  <Play className="h-8 w-8 text-[var(--text-primary)] fill-current" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Miniaturas */}
      {temMultiplasImagens && (
        <div className="flex gap-2 overflow-x-auto p-1 -m-1 hide-scrollbar">
          {todasImagens.map((imagem, index) => (
            <button
              key={index}
              onClick={() => setImagemSelecionada(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200",
                imagemSelecionada === index
                  ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={imagem}
                alt={`${titulo} - Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
