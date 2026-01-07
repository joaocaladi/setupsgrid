import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
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
        <article className="group card-apple">
          {/* Image container */}
          <div className={cn("relative overflow-hidden", aspectRatio)}>
            <Image
              src={setup.imagemUrl}
              alt={setup.titulo}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Video indicator */}
            {setup.isVideo && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                <Play className="h-3 w-3 text-[var(--text-primary)] fill-current" />
              </div>
            )}

            {/* Categories - simple pills */}
            {setup.categorias.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {setup.categorias.slice(0, 2).map((cat) => (
                  <span
                    key={cat.id}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-sm text-[var(--text-primary)] shadow-sm"
                  >
                    {cat.nome}
                  </span>
                ))}
              </div>
            )}

            {/* Info overlay - bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-[15px] font-semibold text-white line-clamp-2 mb-0.5">
                {setup.titulo}
              </h3>
              {setup.autor && (
                <p className="text-[13px] text-white/80">{setup.autor}</p>
              )}
            </div>
          </div>

          {/* Bottom info bar - minimal */}
          <div className="px-4 py-3">
            <p className="text-[13px] text-[var(--text-secondary)] line-clamp-1">
              {setup.produtos.length} produtos
              {setup.fonte && ` · ${setup.fonte}`}
            </p>
          </div>
        </article>
      </Link>
    </div>
  );
}
