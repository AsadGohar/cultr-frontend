import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type AlertVariant = "success" | "warning" | "error" | "info";

const tone = {
  success: {
    wrapper:
      "bg-green-50/75 dark:bg-green-950/30 border-green-200 dark:border-green-800/60 text-green-900 dark:text-green-200",
    icon: "✅",
  },
  warning: {
    wrapper:
      "bg-amber-50/75 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200",
    icon: "⚠️",
  },
  error: {
    wrapper:
      "bg-red-50/75 dark:bg-red-950/25 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200",
    icon: "⛔",
  },
  info: {
    wrapper:
      "bg-blue-50/75 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200",
    icon: "ℹ️",
  },
} as const;

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  action,
}: {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={`rounded-app border p-3 text-sm ${tone[variant].wrapper}`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden>{tone[variant].icon}</span>
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="font-semibold">{title}</h4>
          {children ? <div>{children}</div> : null}
          {action ? <div className="pt-2">{action}</div> : null}
        </div>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Dismiss
          </Button>
        ) : null}
      </div>
    </div>
  );
}
