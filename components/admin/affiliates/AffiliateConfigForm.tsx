"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ExternalLink } from "lucide-react";
import { updateAffiliateConfig } from "@/app/admin/affiliates/actions";
import type { AffiliateConfig, AffiliateType } from "@prisma/client";

interface AffiliateConfigFormProps {
  config: AffiliateConfig;
}

export function AffiliateConfigForm({ config }: AffiliateConfigFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    affiliateType: config.affiliateType,
    affiliateCode: config.affiliateCode || "",
    affiliateParam: config.affiliateParam || "",
    redirectTemplate: config.redirectTemplate || "",
    isActive: config.isActive,
    notes: config.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateAffiliateConfig(config.storeKey, {
        affiliateType: formData.affiliateType as AffiliateType,
        affiliateCode: formData.affiliateCode || null,
        affiliateParam: formData.affiliateParam || null,
        redirectTemplate: formData.redirectTemplate || null,
        isActive: formData.isActive,
        notes: formData.notes || null,
      });

      if (result.success) {
        toast.success("Configuração salva com sucesso");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao salvar");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info do Programa */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Informações do Programa
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Programa:</span>
            <span className="text-[var(--text-primary)]">
              {config.programName || "-"}
            </span>
          </div>

          {config.programUrl && (
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Site:</span>
              <a
                href={config.programUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                Acessar <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Comissão:</span>
            <span className="text-[var(--text-primary)]">
              {config.commissionInfo || "Variável"}
            </span>
          </div>
        </div>
      </section>

      {/* Configuração */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Configuração
        </h2>

        <div className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Tipo de Afiliado
            </label>
            <div className="flex gap-4">
              {[
                { value: "parameter", label: "Parâmetro na URL" },
                { value: "redirect", label: "Redirect" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="affiliateType"
                    value={option.value}
                    checked={formData.affiliateType === option.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        affiliateType: e.target.value as AffiliateType,
                      }))
                    }
                    className="text-[var(--accent)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Campos para tipo parameter */}
          {formData.affiliateType === "parameter" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nome do Parâmetro
                </label>
                <input
                  type="text"
                  value={formData.affiliateParam}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      affiliateParam: e.target.value,
                    }))
                  }
                  placeholder="Ex: tag, parceiro, aff"
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Nome do parâmetro de URL (ex: ?tag=codigo)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Seu Código de Afiliado
                </label>
                <input
                  type="text"
                  value={formData.affiliateCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      affiliateCode: e.target.value,
                    }))
                  }
                  placeholder="Ex: gridiz-20"
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </>
          )}

          {/* Campos para tipo redirect */}
          {formData.affiliateType === "redirect" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Template de Redirect
                </label>
                <textarea
                  value={formData.redirectTemplate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      redirectTemplate: e.target.value,
                    }))
                  }
                  placeholder="Ex: https://redirect.lomadee.com/v2/deeplink?url={{URL}}&sourceId={{CODE}}"
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-mono text-xs"
                />
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Use {"{{URL}}"} para a URL do produto e {"{{CODE}}"} para seu
                  código
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Seu Código/ID de Afiliado
                </label>
                <input
                  type="text"
                  value={formData.affiliateCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      affiliateCode: e.target.value,
                    }))
                  }
                  placeholder="Ex: 12345678"
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Status */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Status
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Ativo
            </span>
            <p className="text-xs text-[var(--text-secondary)]">
              Aplicar link de afiliado automaticamente nos produtos desta loja
            </p>
          </div>
        </label>
      </section>

      {/* Domínios */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Domínios Associados
        </h2>

        <div className="flex flex-wrap gap-2">
          {config.domains.map((domain) => (
            <span
              key={domain}
              className="px-3 py-1 bg-[var(--background)] rounded-full text-sm text-[var(--text-secondary)]"
            >
              {domain}
            </span>
          ))}
        </div>
      </section>

      {/* Notas */}
      <section className="bg-[var(--background-secondary)] rounded-xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Notas Internas
        </h2>

        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Anotações sobre o programa, datas importantes, etc."
          rows={3}
          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </section>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
