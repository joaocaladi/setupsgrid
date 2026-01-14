"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, LogOut, Sun, Moon, Inbox, Link2 } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categorias",
    href: "/admin/categorias",
    icon: FolderOpen,
  },
  {
    label: "Submissões",
    href: "/admin/submissions",
    icon: Inbox,
    showBadge: true,
  },
  {
    label: "Links",
    href: "/admin/links",
    icon: Link2,
  },
];

interface AdminHeaderProps {
  pendingSubmissionsCount?: number;
}

export function AdminHeader({ pendingSubmissionsCount = 0 }: AdminHeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[var(--text-primary)]"
            >
              <rect x="1" y="1" width="6" height="6" rx="0.5" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" />
              <rect x="17" y="1" width="6" height="6" rx="0.5" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" />
              <rect x="17" y="9" width="6" height="6" rx="0.5" />
              <rect x="1" y="17" width="6" height="6" rx="0.5" />
              <rect x="9" y="17" width="6" height="6" rx="0.5" />
              <rect x="17" y="17" width="6" height="6" rx="0.5" />
            </svg>
            <span className="text-xl font-semibold text-[var(--text-primary)]">
              Gridiz
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--background-tertiary)] px-2 py-1 rounded-md">
              Admin
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              const showBadge = item.showBadge && pendingSubmissionsCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {showBadge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full min-w-5 text-center">
                      {pendingSubmissionsCount > 99 ? "99+" : pendingSubmissionsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
              aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
