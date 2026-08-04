import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";

export const DATE_SUGGESTIONS = [
  "today", "tomorrow", "next Monday", "next Friday", "in 2 weeks", "next month",
] as const;

export const TIME_SUGGESTIONS = [
  "9:00am", "12pm", "3:30pm", "5pm", "noon", "midnight", "15:00",
] as const;

export function NlSuggestField({
  value,
  onChange,
  onCommit,
  catalog,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  catalog: readonly string[];
  placeholder: string;
  preview?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return catalog.filter((item) => item.toLowerCase().includes(query)).slice(0, 6);
  }, [catalog, value]);

  useEffect(() => setActive(0), [value]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      onCommit(suggestions[active] ?? value.trim());
    }
  };

  return (
    <div className="relative mb-2.5">
      <input
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        className="h-9 w-full rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] px-2.5 text-sm text-[rgb(var(--app-text))] outline-none placeholder:text-[rgb(var(--app-muted))] focus:border-[rgb(var(--app-accent))]"
      />
      {suggestions.length ? (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-1 shadow-xl" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion} role="option" aria-selected={index === active}>
              <button type="button" className={`menu-item w-full justify-start px-2 py-1.5 text-xs ${index === active ? "menu-item-active" : ""}`} onMouseEnter={() => setActive(index)} onClick={() => onCommit(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
