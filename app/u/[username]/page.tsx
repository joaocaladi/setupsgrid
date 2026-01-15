import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { HeaderWrapper, Footer, SetupGrid } from "@/components";
import { ProfileHeader } from "@/components/profile";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username, isPublic: true },
    select: { displayName: true, username: true, bio: true },
  });

  if (!profile) {
    return { title: "Perfil não encontrado - Gridiz" };
  }

  const name = profile.displayName || profile.username;

  return {
    title: `${name} - Gridiz`,
    description: profile.bio || `Confira os setups de ${name} no Gridiz`,
    openGraph: {
      title: `${name} - Gridiz`,
      description: profile.bio || `Confira os setups de ${name} no Gridiz`,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username, isPublic: true },
    include: {
      setups: {
        include: {
          categorias: true,
          produtos: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Check if current user is the owner
  let isOwner = false;
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isOwner = user?.id === profile.supabaseUserId;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1">
        <ProfileHeader
          profile={profile}
          isOwner={isOwner}
          setupsCount={profile.setups.length}
        />

        <section className="container-wide py-8 sm:py-12">
          {profile.setups.length > 0 ? (
            <SetupGrid setups={profile.setups} />
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">
                {isOwner
                  ? "Você ainda não publicou nenhum setup."
                  : "Este usuário ainda não publicou nenhum setup."}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
