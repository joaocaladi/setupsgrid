import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HeaderWrapper, Footer } from "@/components";
import { UserSetupForm } from "@/components/setup";
import { getCategorias } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Criar Setup - Gridiz",
  description: "Crie e compartilhe seu setup no Gridiz",
};

export default async function NewSetupPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login?redirect=/setup/new");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/setup/new");
  }

  const categorias = await getCategorias();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1">
        <div className="container-wide py-8 sm:py-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para dashboard
          </Link>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Criar novo setup
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Compartilhe seu espaço de trabalho com a comunidade
          </p>

          <UserSetupForm categorias={categorias} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
