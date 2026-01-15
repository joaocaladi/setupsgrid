import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Settings,
} from "lucide-react";
import type { Profile } from "@prisma/client";

// TikTok icon component
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

interface ProfileHeaderProps {
  profile: Profile;
  isOwner?: boolean;
  setupsCount: number;
}

export function ProfileHeader({
  profile,
  isOwner = false,
  setupsCount,
}: ProfileHeaderProps) {
  const socialLinks = [
    { url: profile.websiteUrl, icon: Globe, label: "Website" },
    { url: profile.instagramUrl, icon: Instagram, label: "Instagram" },
    { url: profile.twitterUrl, icon: Twitter, label: "Twitter" },
    { url: profile.youtubeUrl, icon: Youtube, label: "YouTube" },
    { url: profile.tiktokUrl, icon: TiktokIcon, label: "TikTok" },
  ].filter((link) => link.url);

  return (
    <section className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="container-wide py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[var(--background)] border-2 border-[var(--border)] flex-shrink-0">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName || profile.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-semibold text-[var(--text-secondary)]">
                {(profile.displayName || profile.username)[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                {profile.displayName || profile.username}
              </h1>
              {profile.isVerified && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0071e3]">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>

            <p className="text-[var(--text-secondary)]">@{profile.username}</p>

            {profile.bio && (
              <p className="mt-3 text-[var(--text-primary)] max-w-xl whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 text-sm">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">
                  {setupsCount}
                </span>{" "}
                <span className="text-[var(--text-secondary)]">
                  {setupsCount === 1 ? "setup" : "setups"}
                </span>
              </div>
            </div>

            {/* Edit button (for owner) */}
            {isOwner && (
              <Link
                href="/settings/profile"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <Settings className="h-4 w-4" />
                Editar perfil
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
