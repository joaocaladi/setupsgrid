"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = "Buscar setups...",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-lg
                   text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                   focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                   transition-all duration-200"
      />
    </div>
  );
}
