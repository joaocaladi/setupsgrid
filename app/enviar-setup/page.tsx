import { HeaderWrapper, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SubmissionForm } from "@/components/submission";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enviar Seu Setup - Gridiz",
  description:
    "Compartilhe seu setup com a comunidade Gridiz. Envie fotos do seu workspace e lista de produtos para publicação.",
};

export default function EnviarSetupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />

      <main className="flex-1">
        {/* Back button */}
        <div className="container-wide pt-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        {/* Form Section */}
        <section className="pb-20 md:pb-32">
          <div className="container-wide">
            <SubmissionForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
