import { getGruposWithCategorias } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { HeaderClientWrapper } from "./HeaderClientWrapper";

interface HeaderWrapperProps {
  categoriaAtiva?: string;
}

export async function HeaderWrapper({ categoriaAtiva }: HeaderWrapperProps) {
  const grupos = await getGruposWithCategorias();

  // Get user profile for header (if Supabase is configured)
  let profile = null;
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      profile = await prisma.profile.findUnique({
        where: { supabaseUserId: user.id },
      });
    }
  }

  return (
    <HeaderClientWrapper
      categoriaAtiva={categoriaAtiva}
      grupos={grupos}
      profile={profile}
    />
  );
}
