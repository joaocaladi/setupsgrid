import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  nome: string;
  slug: string;
  size?: "sm" | "md";
  clickable?: boolean;
}

export function CategoryBadge({
  nome,
  slug,
  size = "sm",
  clickable = true,
}: CategoryBadgeProps) {
  const baseStyles = cn(
    "inline-flex items-center rounded-full font-medium transition-all duration-300",
    size === "sm" ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-[13px]",
    "bg-[var(--background-tertiary)] text-[var(--text-secondary)]",
    clickable && "hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
  );

  const content = <span className={baseStyles}>{nome}</span>;

  if (clickable) {
    return <Link href={`/categoria/${slug}`}>{content}</Link>;
  }

  return content;
}
