import type { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

export function Badge({
  variant = "neutral",
  children,
  dot = false,
  className = "",
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={`badge badge-${variant} cursor-pointer ${className}`.trim()} aria-live="polite">
      {dot ? <span className="badge-dot" aria-hidden /> : null}
      {children}
    </span>
  );
}
