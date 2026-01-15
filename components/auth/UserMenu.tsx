"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import type { Profile } from "@prisma/client";

interface UserMenuProps {
  profile: Profile | null;
}

export function UserMenu({ profile }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium px-4 py-2 rounded-full bg-[#0071e3] text-white hover:bg-[#0077ED] transition-colors"
        >
          Criar conta
        </Link>
      </div>
    );
  }

  const displayName =
    profile?.displayName || profile?.username || user.email?.split("@")[0];
  const avatarUrl = profile?.avatarUrl || user.user_metadata?.avatar_url;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--background-tertiary)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName || ""}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-[var(--text-secondary)]" />
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl shadow-lg py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {displayName}
            </p>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            {profile && (
              <Link
                href={`/u/${profile.username}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <User className="h-4 w-4" />
                Meu Perfil
              </Link>
            )}
            <Link
              href="/settings/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-[var(--background-tertiary)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
