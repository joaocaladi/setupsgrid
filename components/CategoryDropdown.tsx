"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
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
  grupo: GrupoCategoria;
}

// Mapeamento de nomes curtos para o header
const nomesAbreviados: Record<string, string> = {
  "Por Profissão": "Profissão",
  "Por Configuração": "Config",
  "Por Estética": "Estética",
  "Por Ambiente": "Ambiente",
  "Por Elementos": "Elementos",
  "Por Orçamento": "Orçamento",
};

export function CategoryDropdown({ grupo }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Bloquear scroll da página quando o megamenu está aberto
  useEffect(() => {
    if (isOpen) {
      // Salvar posição atual do scroll
      const scrollY = window.scrollY;

      // Aplicar estilos para bloquear scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      // Recuperar posição do scroll
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";

      // Restaurar scroll para posição original
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const nomeExibido = nomesAbreviados[grupo.nome] || grupo.nome;

  // Calcular número de colunas baseado na quantidade de categorias
  const numCategorias = grupo.categorias.length;
  const colunasGrid = numCategorias > 30 ? 6 : numCategorias > 20 ? 5 : numCategorias > 10 ? 4 : 3;

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "text-xs font-normal transition-colors duration-300",
          isOpen
            ? "text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {nomeExibido}
      </button>

      {isOpen && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 top-12 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
            onWheel={(e) => e.preventDefault()}
          />

          {/* Megamenu full-width */}
          <div className="fixed left-0 right-0 top-12 z-50 bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-lg max-h-[calc(100vh-48px)] overflow-y-auto overscroll-contain">
            <div className="max-w-[980px] mx-auto px-6 py-8">
              {/* Título do grupo */}
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                {grupo.nome}
              </h3>

              {/* Grid de categorias */}
              <div
                className="grid gap-x-8 gap-y-2.5"
                style={{ gridTemplateColumns: `repeat(${colunasGrid}, minmax(0, 1fr))` }}
              >
                {grupo.categorias.map((categoria) => (
                  <Link
                    key={categoria.id}
                    href={`/categoria/${categoria.slug}`}
                    className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors block py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {categoria.nome}
                  </Link>
                ))}
              </div>

              {/* Link para ver todas */}
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <Link
                  href={`/categorias#${grupo.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas de {grupo.nome}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
