import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RESERVED_USERNAMES = [
  "admin",
  "api",
  "dashboard",
  "settings",
  "login",
  "register",
  "auth",
  "setup",
  "setups",
  "categoria",
  "categorias",
  "u",
  "user",
  "profile",
  "gridiz",
  "help",
  "support",
  "contato",
];

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username deve ter no mínimo 3 caracteres")
    .max(30, "Username deve ter no máximo 30 caracteres")
    .regex(
      /^[a-z0-9_]+$/,
      "Username deve conter apenas letras minúsculas, números e underscore"
    )
    .refine(
      (val) => !RESERVED_USERNAMES.includes(val),
      "Este username não está disponível"
    ),
  displayName: z.string().max(50).optional().nullable(),
  bio: z.string().max(300).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  instagramUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal("")),
  tiktokUrl: z.string().url().optional().nullable().or(z.literal("")),
  isPublic: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Não configurado" }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Dados inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = validationResult.data;

    // Get current profile
    const currentProfile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!currentProfile) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Check if username is already taken (by another user)
    if (data.username !== currentProfile.username) {
      const existingProfile = await prisma.profile.findUnique({
        where: { username: data.username },
      });

      if (existingProfile) {
        return NextResponse.json(
          { error: "Este username já está em uso" },
          { status: 400 }
        );
      }
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { supabaseUserId: user.id },
      data: {
        username: data.username,
        displayName: data.displayName || null,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        websiteUrl: data.websiteUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        isPublic: data.isPublic ?? true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Não configurado" }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}
