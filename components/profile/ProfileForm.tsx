"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, User, Camera } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@prisma/client";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username,
    displayName: profile.displayName || "",
    bio: profile.bio || "",
    websiteUrl: profile.websiteUrl || "",
    instagramUrl: profile.instagramUrl || "",
    twitterUrl: profile.twitterUrl || "",
    youtubeUrl: profile.youtubeUrl || "",
    tiktokUrl: profile.tiktokUrl || "",
    isPublic: profile.isPublic,
  });
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo deve ser uma imagem");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 5MB");
      return;
    }

    setAvatarUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("bucket", "setups");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const { url } = await response.json();
      setAvatarUrl(url);
      toast.success("Avatar atualizado");
    } catch {
      toast.error("Erro ao fazer upload do avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validate username format
    if (!/^[a-z0-9_]+$/.test(formData.username)) {
      toast.error("Username deve conter apenas letras minúsculas, números e _");
      setSaving(false);
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 30) {
      toast.error("Username deve ter entre 3 e 30 caracteres");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatarUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      toast.success("Perfil atualizado com sucesso");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
          Foto de perfil
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[var(--background-tertiary)] border border-[var(--border)]">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 text-[var(--text-secondary)]" />
              </div>
            )}
            {avatarUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors">
            <Camera className="h-4 w-4" />
            Alterar foto
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          Username
        </label>
        <div className="flex items-center">
          <span className="px-4 py-3 rounded-l-xl border border-r-0 border-[var(--border)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] text-sm">
            gridiz.com/u/
          </span>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
              }))
            }
            required
            pattern="[a-z0-9_]+"
            minLength={3}
            maxLength={30}
            className="flex-1 px-4 py-3 rounded-r-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)]"
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Apenas letras minúsculas, números e underscore
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          Nome de exibição
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={formData.displayName}
          onChange={handleChange}
          maxLength={50}
          placeholder="Seu nome"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          maxLength={300}
          placeholder="Conte um pouco sobre você..."
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none"
        />
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {formData.bio.length}/300
        </p>
      </div>

      {/* Website */}
      <div>
        <label
          htmlFor="websiteUrl"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          Website
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://seusite.com"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          Redes Sociais
        </h3>

        <div>
          <label
            htmlFor="instagramUrl"
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            Instagram
          </label>
          <input
            id="instagramUrl"
            name="instagramUrl"
            type="url"
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/seuusuario"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div>
          <label
            htmlFor="twitterUrl"
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            Twitter / X
          </label>
          <input
            id="twitterUrl"
            name="twitterUrl"
            type="url"
            value={formData.twitterUrl}
            onChange={handleChange}
            placeholder="https://twitter.com/seuusuario"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div>
          <label
            htmlFor="youtubeUrl"
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            YouTube
          </label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/@seucanal"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div>
          <label
            htmlFor="tiktokUrl"
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            TikTok
          </label>
          <input
            id="tiktokUrl"
            name="tiktokUrl"
            type="url"
            value={formData.tiktokUrl}
            onChange={handleChange}
            placeholder="https://tiktok.com/@seuusuario"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
          Privacidade
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[var(--border)] bg-[var(--background)] text-[#0071e3] focus:ring-[#0071e3] focus:ring-offset-0"
          />
          <span className="text-[var(--text-primary)]">Perfil público</span>
        </label>
        <p className="text-xs text-[var(--text-secondary)] mt-1 ml-8">
          Seu perfil e setups serão visíveis para todos
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0071e3] text-white font-medium py-3 rounded-xl hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar alterações"
        )}
      </button>
    </form>
  );
}
