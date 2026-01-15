import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "./UserMenu";

export async function UserMenuWrapper() {
  const supabase = await createClient();

  if (!supabase) {
    return <UserMenu profile={null} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <UserMenu profile={null} />;
  }

  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
  });

  return <UserMenu profile={profile} />;
}
