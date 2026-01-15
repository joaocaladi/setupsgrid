"use client";

import { useState, useTransition } from "react";
import { Play, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import type { AffiliateConfig } from "@prisma/client";
import type { TransformResult } from "@/lib/affiliate/types";

interface AffiliateUrlTesterProps {
  config: AffiliateConfig;
}

export function AffiliateUrlTester({ config }: AffiliateUrlTesterProps) {
  const [testUrl, setTestUrl] = useState("");
  const [result, setResult] = useState<TransformResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!testUrl.trim()) {
      setError("Digite uma URL para testar");
      return;
    }

    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/affiliates/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: testUrl }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data.data);
        } else {
          setError(data.error || "Erro ao testar URL");
        }
      } catch {
        setError("Erro ao testar URL");
      }
    });
  };

  // Placeholder de exemplo baseado na loja
  const getPlaceholder = () => {
    const domain = config.domains[0];
    if (domain.includes("amazon")) {
      return `https://www.${domain}/dp/B09V1KXJPB`;
    }
    if (domain.includes("kabum")) {
      return `https://www.${domain}/produto/123456`;
    }
    if (domain.includes("mercadolivre")) {
      return `https://www.${domain}/MLB-123456`;
    }
    return `https://www.${domain}/produto/exemplo`;
  };

  return (
    <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Testar Transformação
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            URL de Teste
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder={getPlaceholder()}
              className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              onClick={handleTest}
              disabled={isPending || !config.isActive}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isPending ? "Testando..." : "Testar"}
            </button>
          </div>
          {!config.isActive && (
            <p className="mt-1 text-xs text-amber-500">
              Ative a configuração para testar a transformação
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.wasTransformed
                ? "bg-green-500/10 border-green-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {result.wasTransformed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-500">
                    Transformação OK
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-amber-500">
                    URL não foi transformada
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Original:</span>
                <p className="text-[var(--text-primary)] font-mono text-xs break-all bg-[var(--background)] p-2 rounded mt-1">
                  {result.originalUrl}
                </p>
              </div>

              {result.wasTransformed && (
                <>
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
                  </div>

                  <div>
                    <span className="text-[var(--text-secondary)]">
                      Com afiliado:
                    </span>
                    <p className="text-[var(--text-primary)] font-mono text-xs break-all bg-[var(--background)] p-2 rounded mt-1">
                      {result.transformedUrl}
                    </p>
                  </div>
                </>
              )}

              {result.storeKey && (
                <p className="text-xs text-[var(--text-secondary)]">
                  Loja detectada: {result.storeName} ({result.storeKey})
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
