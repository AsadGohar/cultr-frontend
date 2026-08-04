import { useState, type ReactNode } from "react";

export type SegmentOption = { value: string; label: string; icon?: ReactNode };

export function ButtonGroup({
  options,
  value,
  defaultValue,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  "aria-label"?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const selected = value ?? internal;

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex items-center gap-0.5 rounded-[var(--radius-app)] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] p-1">
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => select(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.97] ${active ? "bg-[rgb(var(--app-panel))] text-[rgb(var(--app-text))] shadow-sm" : "text-[rgb(var(--app-muted))] hover:text-[rgb(var(--app-text))]"}`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
