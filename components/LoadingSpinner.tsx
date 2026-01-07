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

// Skeleton components for loading states - Apple style
export function SetupCardSkeleton() {
  return (
    <div className="masonry-item">
      <div className="bg-[var(--background-tertiary)] rounded-2xl overflow-hidden animate-pulse">
        <div className="aspect-[3/4]" />
        <div className="px-4 py-3">
          <div className="h-3 w-2/3 bg-[var(--border)] rounded-full" />
        </div>
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
    <div className="flex gap-4 p-4 bg-[var(--background-secondary)] rounded-2xl animate-pulse">
      <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-[var(--background-tertiary)]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 bg-[var(--border)] rounded-full" />
        <div className="h-4 w-3/4 bg-[var(--border)] rounded-full" />
        <div className="h-3 w-1/2 bg-[var(--border)] rounded-full" />
      </div>
    </div>
  );
}
