"use client";

import { useState, useCallback } from "react";
import { Loader2, Search, X, ExternalLink } from "lucide-react";
import type { ExtractedProduct } from "@/lib/scraper/types";

interface ProductUrlExtractorProps {
  value: string;
  onChange: (url: string) => void;
  onExtract: (data: ExtractedProduct) => void;
  extractedImage?: string | null;
  disabled?: boolean;
}

type ExtractorState = "idle" | "loading" | "success" | "error";

export function ProductUrlExtractor({
  value,
  onChange,
  onExtract,
  extractedImage,
  disabled = false,
}: ProductUrlExtractorProps) {
  const [state, setState] = useState<ExtractorState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExtract = useCallback(async () => {
    if (!value.trim()) {
      setErrorMessage("Cole uma URL de produto");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setState("success");
        onExtract(result.data);
      } else {
        setState("error");
        setErrorMessage(result.error || "Não foi possível extrair dados");
      }
    } catch {
      setState("error");
      setErrorMessage("Erro de conexão. Tente novamente.");
    }
  }, [value, onExtract]);

  const handleClear = useCallback(() => {
    onChange("");
    setState("idle");
    setErrorMessage(null);
  }, [onChange]);

  const isValidUrl = value.startsWith("http://") || value.startsWith("https://");

  return (
    <div className="space-y-3">
      {/* Input + Botão */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (state === "error") {
                setState("idle");
                setErrorMessage(null);
              }
            }}
            placeholder="https://amazon.com.br/produto..."
            disabled={disabled || state === "loading"}
            className="w-full px-3 py-2 pr-8 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] disabled:opacity-50"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={state === "loading"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleExtract}
          disabled={disabled || state === "loading" || !isValidUrl}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0077ED] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Buscando...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar dados</span>
            </>
          )}
        </button>
      </div>

      {/* Mensagem de erro */}
      {state === "error" && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      {/* Preview da imagem extraída - mostra sempre que tiver imagem */}
      {extractedImage && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--background)] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={extractedImage}
              alt="Imagem do produto"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Se a imagem falhar, esconder
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-600 font-medium mb-1">
              {state === "success" ? "Dados extraídos com sucesso!" : "Imagem do produto"}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {state === "success"
                ? "Os campos foram preenchidos automaticamente. Você pode editá-los se necessário."
                : "Imagem extraída automaticamente do link."}
            </p>
          </div>
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[var(--text-secondary)] hover:text-[#0071e3] flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {/* Dica */}
      {state === "idle" && !value && (
        <p className="text-xs text-[var(--text-secondary)]">
          Cole o link do produto para preencher automaticamente nome e preço
        </p>
      )}
    </div>
  );
}
