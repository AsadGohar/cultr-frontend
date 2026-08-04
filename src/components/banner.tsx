import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function Banner({
  id,
  children,
  href,
  linkLabel = "Learn more",
  variant = "brand",
  dismissible = true,
}: {
  id: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  variant?: "brand" | "subtle";
  dismissible?: boolean;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    try {
      setShown(localStorage.getItem(`banner-${id}`) !== "dismissed");
    } catch {
      setShown(true);
    }
  }, [id]);

  const dismiss = () => {
    setShown(false);
    try {
      localStorage.setItem(`banner-${id}`, "dismissed");
    } catch {
      // private mode
    }
  };

  if (!shown) {
    return null;
  }

  const isBrand = variant === "brand";
  const base = isBrand
    ? "border-b border-[color-mix(in_srgb,_rgb(var(--app-accent))_45%,_transparent)] bg-gradient-to-r from-[rgb(var(--app-accent))] to-[rgb(var(--app-accent-strong))] text-white"
    : "border-b border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] text-[rgb(var(--app-text))]";

  return (
    <div className={base}>
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-10 py-2.5 text-sm sm:px-12 lg:px-14">
        <p className="min-w-0 truncate text-center text-[13px] leading-snug sm:text-sm">
          {children}
          {href ? (
            <a
              href={href}
              className={`ml-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2 ${
                isBrand ? "text-white" : "text-[rgb(var(--app-accent))]"
              }`}
            >
              {linkLabel}
            </a>
          ) : null}
        </p>
        {dismissible ? (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className={`absolute top-1/2 right-4 shrink-0 -translate-y-1/2 rounded-md p-1 transition-colors duration-150 sm:right-6 lg:right-8 ${
              isBrand
                ? "hover:bg-white/15"
                : "hover:bg-[color-mix(in_srgb,rgb(var(--app-bg))_84%,_rgb(var(--app-text))_16%)]"
            }`}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
