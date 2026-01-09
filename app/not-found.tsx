import Link from "next/link";
import { HeaderWrapper, Footer } from "@/components";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-[96px] sm:text-[144px] font-semibold text-[var(--text-primary)] leading-none mb-4">
            404
          </h1>
          <h2 className="text-h2 text-[var(--text-primary)] mb-3">
            Página não encontrada.
          </h2>
          <p className="text-body-large text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link href="/" className="btn-primary">
            Voltar para o início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
