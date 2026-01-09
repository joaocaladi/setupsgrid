import { Header, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato - SetupsGrid",
  description:
    "Entre em contato com o SetupsGrid. Estamos aqui para ajudar com dúvidas, sugestões ou parcerias.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

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

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container-text">
            <h1 className="text-display text-[var(--text-primary)] mb-4">
              Contato.
            </h1>
            <p className="text-body-large text-[var(--text-secondary)]">
              Entre em contato conosco
            </p>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="pb-20 md:pb-32">
          <div className="container-text">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Email */}
              <a
                href="mailto:contato@setupsgrid.com"
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--background-tertiary)]">
                  <Mail className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Email</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    contato@setupsgrid.com
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/554898635132"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--background-tertiary)]">
                  <MessageCircle className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    WhatsApp
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Enviar mensagem
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
