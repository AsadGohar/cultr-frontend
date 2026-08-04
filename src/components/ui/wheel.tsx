import { useEffect, useRef } from "react";

type WheelItem = {
  value: string;
  label: string;
};

type WheelColumnProps = {
  value: string;
  items: WheelItem[];
  onChange: (next: string) => void;
  className?: string;
};

export function WheelColumn({
  value,
  items,
  onChange,
  className = "",
}: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const target = node.querySelector<HTMLButtonElement>(`[data-value="${value}"]`);
    if (!target) {
      return;
    }

    target.scrollIntoView({ block: "center" });
  }, [value]);

  return (
    <div className={`tessera-wheel ${className}`}>
      <div ref={ref} className="tessera-wheel-track" role="listbox" aria-label="Time value picker">
        {items.map((item) => {
          const isSelected = item.value === value;

          return (
            <button
              key={item.value}
              type="button"
              role="option"
              data-value={item.value}
              aria-selected={isSelected}
              className={`tessera-wheel-item ${isSelected ? "tessera-wheel-item-active" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
