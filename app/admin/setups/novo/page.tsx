import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SetupForm } from "@/components/admin/SetupForm";
import { getCategorias } from "../../actions";

export default async function NovoSetupPage() {
  const categorias = await getCategorias();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Novo Setup</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Preencha as informações para criar um novo setup
        </p>
      </div>

      {/* Form */}
      <SetupForm categorias={categorias} />
    </div>
  );
}
