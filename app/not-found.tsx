import Link from "next/link";
import { Header, Footer } from "@/components";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl sm:text-8xl font-serif gradient-text mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-medium text-[var(--text-primary)] mb-2">
            Página não encontrada
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Voltar para o início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
