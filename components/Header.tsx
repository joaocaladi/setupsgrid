"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

// Categorias simplificadas (sem ícones para estilo Apple mais limpo)
const categorias = [
  { nome: "Minimalista", slug: "minimalista" },
  { nome: "Moderno", slug: "moderno" },
  { nome: "Gamer", slug: "gamer" },
  { nome: "Trabalho", slug: "trabalho" },
  { nome: "Estiloso", slug: "estiloso" },
  { nome: "Escuro", slug: "escuro" },
  { nome: "Claro", slug: "claro" },
  { nome: "Amadeirado", slug: "amadeirado" },
];

interface HeaderProps {
  categoriaAtiva?: string;
}

export function Header({ categoriaAtiva }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="container-wide">
        {/* Main navigation - Apple style */}
        <nav className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-[21px] font-semibold text-[var(--text-primary)]">
              Gridiz
            </span>
          </Link>

          {/* Center navigation - Categories */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-xs font-normal transition-opacity duration-300",
                !categoriaAtiva
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Todos
            </Link>
            {categorias.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className={cn(
                  "text-xs font-normal transition-opacity duration-300",
                  categoriaAtiva === cat.slug
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {cat.nome}
              </Link>
            ))}
          </div>

          {/* Right side - Theme toggle and Search */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-all duration-300"
              aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            >
              {theme === "light" ? (
                <Moon className="h-[18px] w-[18px]" />
              ) : (
                <Sun className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Search */}
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Buscar"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile categories - horizontal scroll */}
      <div className="md:hidden border-t border-[var(--border)]">
        <div className="container-wide py-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-6 min-w-max">
            <Link
              href="/"
              className={cn(
                "text-sm font-normal whitespace-nowrap transition-colors",
                !categoriaAtiva
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              )}
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className={cn(
                  "text-sm font-normal whitespace-nowrap transition-colors",
                  categoriaAtiva === cat.slug
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {cat.nome}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
