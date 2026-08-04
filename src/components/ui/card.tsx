import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`overflow-hidden rounded-app border border-[rgb(var(--app-muted))] bg-[rgb(var(--app-panel))] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`flex items-start justify-between gap-3 border-b border-[rgb(var(--app-muted))] px-5 py-4 ${
        className
      }`}
    >
      <div className="min-w-0 space-y-1">
        <h3 className="text-base font-semibold text-[rgb(var(--app-text))]">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-[rgb(var(--app-muted))]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={`border-t border-[rgb(var(--app-muted))] bg-[color-mix(in srgb,rgb(var(--app-panel)) 90%, rgb(var(--app-bg)) 10%)] px-5 py-3 ${className}`}
    >
      <div className="flex items-center justify-end gap-2">{children}</div>
    </footer>
  );
}
