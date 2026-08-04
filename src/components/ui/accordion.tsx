"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function Accordion({
  items,
  type = "single",
  defaultOpen = [0],
}: {
  items: { title: string; content: ReactNode }[];
  type?: "single" | "multiple";
  defaultOpen?: number[];
}) {
  const [open, setOpen] = useState<number[]>(defaultOpen);

  const toggle = (index: number) =>
    setOpen((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : type === "single"
          ? [index]
          : [...prev, index],
    );

  return (
    <div className="overflow-hidden rounded-[var(--radius-app)] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))]">
      {items.map((item, index) => {
        const isOpen = open.includes(index);

        return (
          <div key={item.title} className={index === 0 ? "" : "border-t border-[rgb(var(--app-border))]"}>
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-[rgb(var(--app-text))] transition-colors hover:bg-[rgb(var(--app-bg))]"
            >
              <span>{item.title}</span>
              <svg
                viewBox="0 0 16 16"
                className={`size-4 shrink-0 text-[rgb(var(--app-muted))] transition-transform duration-150 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                aria-hidden
              >
                <path
                  d="m4 6 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 pt-0 text-sm leading-relaxed text-[rgb(var(--app-muted))]">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
