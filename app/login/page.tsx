import { Suspense } from "react";
import type { Metadata } from "next";
import { HeaderWrapper, Footer } from "@/components";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Entrar - Gridiz",
  description: "Entre na sua conta Gridiz para gerenciar seus setups",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1 flex items-center justify-center py-12">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
