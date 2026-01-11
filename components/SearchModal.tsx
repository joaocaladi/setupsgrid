"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import type { SetupWithRelations } from "@/types";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SetupWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Block body scroll
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-[600px] bg-[var(--background)] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <Search className="h-5 w-5 text-[var(--text-tertiary)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar setups..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded bg-[var(--background-tertiary)]"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-[var(--text-tertiary)] animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((setup) => (
                <Link
                  key={setup.id}
                  href={`/setup/${setup.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--background-tertiary)]">
                    <Image
                      src={setup.imagemUrl}
                      alt={setup.titulo}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {setup.titulo}
                    </h3>
                    {setup.categorias.length > 0 && (
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                        {setup.categorias.slice(0, 3).map((c) => c.nome).join(", ")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : hasSearched && query.length >= 2 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Nenhum setup encontrado para &quot;{query}&quot;
              </p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--text-tertiary)]">
                Digite pelo menos 2 caracteres para buscar
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Pressione <kbd className="px-1.5 py-0.5 rounded bg-[var(--background-tertiary)] font-mono">Enter</kbd> para selecionar ou <kbd className="px-1.5 py-0.5 rounded bg-[var(--background-tertiary)] font-mono">ESC</kbd> para fechar
          </p>
        </div>
      </div>
    </div>
  );
}
