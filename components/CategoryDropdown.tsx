"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  _count?: {
    setups: number;
  };
}

interface GrupoCategoria {
  id: string;
  nome: string;
  slug: string;
  categorias: Categoria[];
}

interface CategoryDropdownProps {
  grupos: GrupoCategoria[];
}

export function CategoryDropdown({ grupos }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGrupo, setActiveGrupo] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveGrupo(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
    if (!activeGrupo && grupos.length > 0) {
      setActiveGrupo(grupos[0].id);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveGrupo(null);
    }, 150);
  };

  const activeGrupoData = grupos.find((g) => g.id === activeGrupo);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-xs font-normal transition-colors duration-300",
          isOpen
            ? "text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        Categorias
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden">
          <div className="flex">
            {/* Grupos (sidebar esquerda) */}
            <div className="w-48 bg-[var(--background-secondary)] border-r border-[var(--border)] py-2">
              {grupos.map((grupo) => (
                <button
                  key={grupo.id}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-xs transition-colors",
                    activeGrupo === grupo.id
                      ? "bg-[var(--background-tertiary)] text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]"
                  )}
                  onMouseEnter={() => setActiveGrupo(grupo.id)}
                >
                  {grupo.nome}
                </button>
              ))}
              <div className="border-t border-[var(--border)] mt-2 pt-2">
                <Link
                  href="/categorias"
                  className="block px-4 py-2.5 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas as categorias
                </Link>
              </div>
            </div>

            {/* Subcategorias (área principal) */}
            <div className="flex-1 p-4 max-h-[400px] overflow-y-auto">
              {activeGrupoData && (
                <>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-3">
                    {activeGrupoData.nome}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {activeGrupoData.categorias.map((categoria) => (
                      <Link
                        key={categoria.id}
                        href={`/categoria/${categoria.slug}`}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 transition-colors truncate"
                        onClick={() => setIsOpen(false)}
                        title={categoria.nome}
                      >
                        {categoria.nome}
                        {categoria._count && categoria._count.setups > 0 && (
                          <span className="text-[var(--text-tertiary)] ml-1">
                            ({categoria._count.setups})
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
