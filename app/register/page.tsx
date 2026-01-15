import { Suspense } from "react";
import type { Metadata } from "next";
import { HeaderWrapper, Footer } from "@/components";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Criar Conta - Gridiz",
  description:
    "Crie sua conta no Gridiz para compartilhar seus setups e ganhar com links de afiliado",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1 flex items-center justify-center py-12">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
