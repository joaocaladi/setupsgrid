import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-[var(--border)] border-t-[var(--accent)]",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

// Skeleton components for loading states
export function SetupCardSkeleton() {
  return (
    <div className="masonry-item">
      <div className="skeleton rounded-xl overflow-hidden">
        <div className="aspect-[3/4]" />
      </div>
    </div>
  );
}

export function SetupGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="masonry-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SetupCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
      <div className="skeleton w-20 h-20 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
