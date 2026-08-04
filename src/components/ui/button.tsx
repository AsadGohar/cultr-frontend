import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  destructive: "btn-destructive",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = forwardRef<
  HTMLButtonElement,
  {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    children,
    leftIcon,
    rightIcon,
    className = "",
    disabled,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`btn ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
