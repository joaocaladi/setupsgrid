import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { HeaderWrapper, Footer } from "@/components";
import { ProfileForm } from "@/components/profile";

export const metadata: Metadata = {
  title: "Configurações do Perfil - Gridiz",
  description: "Edite seu perfil no Gridiz",
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login?redirect=/settings/profile");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/settings/profile");
  }

  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!profile) {
    redirect("/auth/callback");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1">
        <div className="container-text py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Configurações do Perfil
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Atualize suas informações públicas
          </p>

          <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <ProfileForm profile={profile} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
