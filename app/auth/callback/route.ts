import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=not_configured`);
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists
      let profile = await prisma.profile.findUnique({
        where: { supabaseUserId: data.user.id },
      });

      // Create profile if it doesn't exist
      if (!profile) {
        // Generate unique username from email or name
        const baseName =
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "user";
        const baseUsername = baseName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 20);

        let username = baseUsername;
        let counter = 1;

        // Ensure username is unique
        while (await prisma.profile.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        profile = await prisma.profile.create({
          data: {
            supabaseUserId: data.user.id,
            username,
            displayName: data.user.user_metadata?.full_name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
          },
        });
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
