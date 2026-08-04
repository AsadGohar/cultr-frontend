import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const controlBase =
  "w-full rounded-[var(--radius-app)] border bg-[rgb(var(--app-bg))] px-3 text-sm text-[rgb(var(--app-text))] outline-none transition-colors " +
  "focus-visible:outline-0 disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,rgb(var(--app-bg))_82%,_rgb(var(--app-text))_18%)] disabled:text-[rgb(var(--app-muted))]";

const controlState = {
  default:
    "border-[rgb(var(--app-border))] hover:border-[rgb(var(--app-muted))] focus-visible:border-[rgb(var(--app-accent))] focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,_rgb(var(--app-ring))_30%,_transparent)]",
  error:
    "border-red-400 hover:border-red-500 focus-visible:border-red-500 focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,#ef4444_25%,_transparent)]",
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      {label ? <span className="text-sm font-medium text-[rgb(var(--app-text))]">{label}</span> : null}
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[rgb(var(--app-muted))]">{hint}</span> : null}
    </label>
  );
}

export function Input({
  invalid = false,
  className = "",
  ...props
}: { invalid?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const state = invalid ? controlState.error : controlState.default;
  return <input className={`${controlBase} ${state} h-11 ${className}`} {...props} />;
}

export function Textarea({
  invalid = false,
  className = "",
  ...props
}: { invalid?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const state = invalid ? controlState.error : controlState.default;
  return (
    <textarea
      className={`${controlBase} ${state} min-h-24 resize-none px-3 py-2.5 leading-relaxed ${className}`}
      {...props}
    />
  );
}
