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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-tertiary)] border-none rounded-xl
                   text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20
                   transition-all duration-300"
      />
    </div>
  );
}
