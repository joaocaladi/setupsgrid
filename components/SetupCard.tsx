import Image from "next/image";
import Link from "next/link";
import { Play, Package } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";
import type { SetupWithRelations } from "@/types";

interface SetupCardProps {
  setup: SetupWithRelations;
  index?: number;
}

export function SetupCard({ setup, index = 0 }: SetupCardProps) {
  // Gerar aspect ratios variados para efeito Pinterest
  const aspectRatios = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-[2/3]",
    "aspect-[3/4]",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[5/6]",
    "aspect-[4/5]",
  ];
  const aspectRatio = aspectRatios[index % aspectRatios.length];

  // Stagger animation class
  const staggerClass = `stagger-${(index % 8) + 1}`;

  return (
    <div className={cn("masonry-item opacity-0 animate-fade-in-up", staggerClass)}>
      <Link href={`/setup/${setup.id}`}>
        <article className="group relative rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] card-hover">
          {/* Image container */}
          <div className={cn("relative overflow-hidden", aspectRatio)}>
            <Image
              src={setup.imagemUrl}
              alt={setup.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Video indicator */}
            {setup.isVideo && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
            )}

            {/* Categories - top left */}
            {setup.categorias.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-4rem)]">
                {setup.categorias.slice(0, 2).map((cat) => (
                  <CategoryBadge
                    key={cat.id}
                    nome={cat.nome}
                    slug={cat.slug}
                    cor={cat.cor}
                    size="sm"
                    clickable={false}
                  />
                ))}
              </div>
            )}

            {/* Info overlay - bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-medium text-white line-clamp-2 mb-1">
                {setup.titulo}
              </h3>
              {setup.autor && (
                <p className="text-sm text-white/70">por {setup.autor}</p>
              )}
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="px-3 py-2.5 flex items-center justify-between border-t border-[var(--border-light)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Package className="h-3.5 w-3.5" />
              <span>{setup.produtos.length} produtos</span>
            </div>

            {setup.fonte && (
              <span className="text-xs text-[var(--text-muted)]">
                {setup.fonte}
              </span>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
}
