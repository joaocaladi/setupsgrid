import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { HeaderWrapper, Footer } from "@/components";
import { DashboardContent } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Gridiz",
  description: "Gerencie seus setups no Gridiz",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login?redirect=/dashboard");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
    include: {
      setups: {
        include: {
          categorias: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    // Profile should exist, but if not, redirect to create it
    redirect("/auth/callback");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1">
        <DashboardContent profile={profile} />
      </main>
      <Footer />
    </div>
  );
}
