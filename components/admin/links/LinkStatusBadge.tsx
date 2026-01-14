"use client";

import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { LinkStatus } from "@prisma/client";

interface LinkStatusBadgeProps {
  status: LinkStatus;
  size?: "sm" | "md";
}

const statusConfig = {
  active: {
    label: "Ativo",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  broken: {
    label: "Quebrado",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  unknown: {
    label: "Não verificado",
    icon: HelpCircle,
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
};

export function LinkStatusBadge({ status, size = "md" }: LinkStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.className} ${sizeClasses}`}
    >
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}
