"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";

interface SubmissionStatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  size?: "sm" | "md";
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  rejected: {
    label: "Rejeitado",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export function SubmissionStatusBadge({
  status,
  size = "md",
}: SubmissionStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.className} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {config.label}
    </span>
  );
}
