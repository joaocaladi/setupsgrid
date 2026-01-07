"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Monitor,
  Gamepad2,
  Briefcase,
  Palette,
  Moon,
  Sun,
  TreePine,
} from "lucide-react";

// Categorias com seus ícones
const categorias = [
  { nome: "Minimalista", slug: "minimalista", icon: Sparkles },
  { nome: "Moderno", slug: "moderno", icon: Monitor },
  { nome: "Gamer", slug: "gamer", icon: Gamepad2 },
  { nome: "Trabalho", slug: "trabalho", icon: Briefcase },
  { nome: "Estiloso", slug: "estiloso", icon: Palette },
  { nome: "Escuro", slug: "escuro", icon: Moon },
  { nome: "Claro", slug: "claro", icon: Sun },
  { nome: "Amadeirado", slug: "amadeirado", icon: TreePine },
];

interface HeaderProps {
  categoriaAtiva?: string;
}

export function Header({ categoriaAtiva }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="gradient-text">Setups</span>
              <span className="text-[var(--text-primary)]">Grid</span>
            </h1>
          </Link>

          {/* Search - hidden on mobile, shown on sm+ */}
          <div className="hidden sm:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Actions placeholder - pode adicionar login/menu futuramente */}
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm hidden sm:inline-flex">
              Entrar
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <SearchBar />
        </div>

        {/* Categories navigation */}
        <nav className="pb-3 -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                !categoriaAtiva
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
              )}
            >
              Todos
            </Link>
            {categorias.map((cat) => {
              const Icon = cat.icon;
              const isActive = categoriaAtiva === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.nome}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
