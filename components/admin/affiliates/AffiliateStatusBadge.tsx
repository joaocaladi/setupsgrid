"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";

interface AffiliateStatusBadgeProps {
  isActive: boolean;
  hasCode: boolean;
  size?: "sm" | "md";
}

export function AffiliateStatusBadge({
  isActive,
  hasCode,
  size = "md",
}: AffiliateStatusBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  if (isActive) {
    return (
      <span
        className={`inline-flex items-center gap-1 ${sizeClasses} font-medium rounded-full bg-green-500/10 text-green-500`}
      >
        <CheckCircle className={iconSize} />
        Ativo
      </span>
    );
  }

  if (!hasCode) {
    return (
      <span
        className={`inline-flex items-center gap-1 ${sizeClasses} font-medium rounded-full bg-amber-500/10 text-amber-500`}
      >
        <Clock className={iconSize} />
        Pendente
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses} font-medium rounded-full bg-gray-500/10 text-gray-500`}
    >
      <XCircle className={iconSize} />
      Inativo
    </span>
  );
}
