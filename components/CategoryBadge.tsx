import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  nome: string;
  slug: string;
  cor?: string | null;
  size?: "sm" | "md";
  clickable?: boolean;
}

export function CategoryBadge({
  nome,
  slug,
  cor,
  size = "sm",
  clickable = true,
}: CategoryBadgeProps) {
  const baseStyles = cn(
    "inline-flex items-center rounded-full font-medium transition-all duration-200",
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
    clickable && "hover:opacity-80"
  );

  const colorStyle = cor
    ? { backgroundColor: `${cor}20`, color: cor, borderColor: `${cor}40` }
    : {};

  const defaultColorClasses = !cor
    ? "bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20"
    : "border";

  const content = (
    <span className={cn(baseStyles, defaultColorClasses)} style={colorStyle}>
      {nome}
    </span>
  );

  if (clickable) {
    return <Link href={`/categoria/${slug}`}>{content}</Link>;
  }

  return content;
}
