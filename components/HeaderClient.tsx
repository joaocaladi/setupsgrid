"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Moon, Sun, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { SearchModal } from "./SearchModal";

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

interface HeaderClientProps {
  categoriaAtiva?: string;
  grupos?: GrupoCategoria[];
}

export function HeaderClient({ categoriaAtiva, grupos = [] }: HeaderClientProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeGrupo, setActiveGrupo] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Encontrar o grupo ativo
  const activeGrupoData = grupos.find((g) => g.id === activeGrupo);

  // Calcular número de colunas baseado na quantidade de categorias
  const numCategorias = activeGrupoData?.categorias.length || 0;
  const colunasGrid = numCategorias > 30 ? 6 : numCategorias > 20 ? 5 : numCategorias > 10 ? 4 : 3;

  const handleMenuEnter = (grupoId: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveGrupo(grupoId);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveGrupo(null);
    }, 150);
  };

  const handleMenuClose = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveGrupo(null);
  };

  // Bloquear scroll da página quando o megamenu está aberto
  useEffect(() => {
    if (activeGrupo) {
      // Calcular largura da scrollbar para compensar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

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
      document.body.style.paddingRight = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [activeGrupo]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      const isOutsideMegaMenu = !megaMenuRef.current || !megaMenuRef.current.contains(target);

      // Só fecha se o clique for fora de AMBAS as áreas
      if (isOutsideMenu && isOutsideMegaMenu) {
        handleMenuClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="container-wide">
        {/* Main navigation - Apple style */}
        <nav className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[var(--text-primary)]"
            >
              <rect x="1" y="1" width="6" height="6" rx="0.5" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" />
              <rect x="17" y="1" width="6" height="6" rx="0.5" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" />
              <rect x="17" y="9" width="6" height="6" rx="0.5" />
              <rect x="1" y="17" width="6" height="6" rx="0.5" />
              <rect x="9" y="17" width="6" height="6" rx="0.5" />
              <rect x="17" y="17" width="6" height="6" rx="0.5" />
            </svg>
            <span className="text-[21px] font-semibold text-[var(--text-primary)]">
              Gridiz
            </span>
          </Link>

          {/* Center navigation - Category groups */}
          <div
            ref={menuRef}
            className="hidden md:flex items-center gap-5"
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/"
              className={cn(
                "text-xs font-normal transition-colors duration-300",
                !categoriaAtiva
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Todos
            </Link>
            {grupos.map((grupo) => (
              <button
                key={grupo.id}
                className={cn(
                  "text-xs font-normal transition-colors duration-300 cursor-pointer",
                  activeGrupo === grupo.id
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                onMouseEnter={() => handleMenuEnter(grupo.id)}
                onClick={() => setActiveGrupo(activeGrupo === grupo.id ? null : grupo.id)}
              >
                {grupo.nome}
              </button>
            ))}
          </div>

          {/* Right side - Submit setup, Theme toggle and Search */}
          <div className="flex items-center gap-3">
            {/* Submit setup */}
            <Link
              href="/enviar-setup"
              className="px-3 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white text-xs font-medium transition-colors"
            >
              Enviar Setup
            </Link>

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
              onClick={() => setSearchOpen(true)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Buscar (Cmd+K)"
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
            <Link
              href="/categorias"
              className="text-sm font-normal whitespace-nowrap text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Categorias
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu - único, compartilhado */}
      {activeGrupo && activeGrupoData && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 top-12 bg-black/40 z-40"
            onClick={handleMenuClose}
            onWheel={(e) => e.preventDefault()}
          />

          {/* Megamenu full-width */}
          <div
            ref={megaMenuRef}
            className="fixed left-0 right-0 top-12 z-50 bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-lg max-h-[calc(100vh-48px)] overflow-y-auto overscroll-contain"
            onMouseEnter={() => {
              if (menuTimeoutRef.current) {
                clearTimeout(menuTimeoutRef.current);
              }
            }}
            onMouseLeave={handleMenuLeave}
          >
            <div className="max-w-[980px] mx-auto px-6 py-8">
              {/* Título do grupo */}
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                {activeGrupoData.nome}
              </h3>

              {/* Grid de categorias */}
              <div
                className="grid gap-x-8 gap-y-2.5"
                style={{ gridTemplateColumns: `repeat(${colunasGrid}, minmax(0, 1fr))` }}
              >
                {activeGrupoData.categorias.map((categoria) => (
                  <Link
                    key={categoria.id}
                    href={`/categoria/${categoria.slug}`}
                    className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors block py-1"
                  >
                    {categoria.nome}
                  </Link>
                ))}
              </div>

              {/* Link para ver todas */}
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <Link
                  href={`/categoria/grupo/${activeGrupoData.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Ver todas {activeGrupoData.nome}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
