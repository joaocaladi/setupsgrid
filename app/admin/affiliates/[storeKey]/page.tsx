import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAffiliateConfig } from "../actions";
import {
  AffiliateConfigForm,
  AffiliateUrlTester,
} from "@/components/admin/affiliates";

interface PageProps {
  params: Promise<{ storeKey: string }>;
}

export default async function AffiliateEditPage({ params }: PageProps) {
  const { storeKey } = await params;
  const config = await getAffiliateConfig(storeKey);

  if (!config) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/affiliates"
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {config.storeName}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Configurar link de afiliado
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AffiliateConfigForm config={config} />
        <AffiliateUrlTester config={config} />
      </div>
    </div>
  );
}
