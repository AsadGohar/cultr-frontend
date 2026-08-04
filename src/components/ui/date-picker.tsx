import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Field } from "@/components/ui/field";
import { useDismiss } from "@/components/ui/use-dismiss";
import { MenuPortal, useMenuPlacement } from "@/components/ui/use-menu-placement";
import { DATE_SUGGESTIONS, NlSuggestField } from "@/components/ui/nl-suggest";

type DatePickerProps = {
  label?: string;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = MONTHS.map((month) => month.slice(0, 3));
type Picking = "day" | "month" | "year";

const parseDate = (value: string) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatLabel = (date: Date | null, fallback: string) =>
  date
    ? `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    : fallback;

const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const yearWindowStart = (year: number) => Math.floor(year / 12) * 12;

export function DatePicker({
  label,
  hint,
  error,
  htmlFor,
  className = "",
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  ...props
}: DatePickerProps) {
  const controlled = value !== undefined;
  const id = htmlFor ?? props.id;
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
  const currentValue = controlled ? String(value ?? "") : internalValue;
  const selected = parseDate(currentValue);
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState<Picking>("day");
  const [view, setView] = useState(() => selected ?? new Date());
  const [naturalInput, setNaturalInput] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useDismiss({ refs: [rootRef, triggerRef, menuRef], enabled: open, onDismiss: () => setOpen(false) });

  const { style } = useMenuPlacement({
    isOpen: open,
    triggerRef,
    menuRef,
    minWidth: 280,
    sideOffset: 6,
    alignment: "start",
  });

  useEffect(() => {
    if (open) {
      setView(selected ?? new Date());
      setPicking("day");
      setNaturalInput("");
    }
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const today = new Date();
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstDay }, () => null as Date | null),
      ...Array.from({ length: total }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [month, year]);

  const commit = (date: Date) => {
    const next = formatValue(date);
    if (!controlled) setInternalValue(next);
    setOpen(false);
    const event = {
      target: { value: next },
      currentTarget: { value: next },
      preventDefault() {},
      stopPropagation() {},
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  const moveHeader = (direction: -1 | 1) => {
    if (picking === "day") setView(new Date(year, month + direction, 1));
    if (picking === "month") setView(new Date(year + direction, month, 1));
    if (picking === "year") setView(new Date(year + direction * 12, month, 1));
  };

  const commitNaturalDate = (input = naturalInput) => {
    const query = input.trim().toLowerCase();
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const nextWeekday = query.match(/^next (sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/);
    const weekdayDate = nextWeekday ? new Date(today) : null;
    if (weekdayDate && nextWeekday) {
      const target = weekdays.indexOf(nextWeekday[1]);
      weekdayDate.setDate(today.getDate() + ((target - today.getDay() + 7) % 7 || 7));
    }
    const weeks = query.match(/^in (\d+) weeks?$/);
    const next = weekdayDate ?? (weeks ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + Number(weeks[1]) * 7) : query === "tomorrow" ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) : query === "today" ? today : parseDate(input));
    if (next) commit(next);
  };

  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className={`tessera-picker-trigger ${className}`}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={id ? `${id}-panel` : undefined}
        >
          <CalendarIcon className="shrink-0" />
          <span className={selected ? "truncate text-[rgb(var(--app-text))]" : "truncate text-[rgb(var(--app-muted))]"}>
            {formatLabel(selected, placeholder)}
          </span>
          <ChevronDownIcon className="ml-auto shrink-0 text-[rgb(var(--app-muted))]" />
        </button>

        <input
          type="date"
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          value={currentValue}
          name={props.name}
          required={props.required}
          readOnly
          onChange={undefined}
        />

        {open && style ? (
          <MenuPortal>
            <div ref={menuRef} id={id ? `${id}-panel` : undefined} role="dialog" aria-label="Choose date" style={style} className="menu w-72 p-3">
              <NlSuggestField value={naturalInput} onChange={setNaturalInput} onCommit={(value) => { setNaturalInput(value); commitNaturalDate(value); }} catalog={DATE_SUGGESTIONS} placeholder="e.g. next Friday · in 2 weeks" />
              <div className="mb-2 flex items-center justify-between">
                <button type="button" className="pressable rounded-md p-1.5 text-[rgb(var(--app-muted))]" aria-label="Previous" onClick={() => moveHeader(-1)}>
                  <ChevronLeftIcon className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={picking === "year"}
                  className={`rounded-md px-2 py-1 text-sm font-medium text-[rgb(var(--app-text))] ${picking === "year" ? "cursor-default" : "hover:bg-[rgb(var(--app-panel))]"}`}
                  onClick={() => setPicking((current) => current === "day" ? "month" : "year")}
                >
                  {picking === "day" ? `${MONTHS[month]} ${year}` : picking === "month" ? year : `${yearWindowStart(year)} - ${yearWindowStart(year) + 11}`}
                </button>
                <button type="button" className="pressable rounded-md p-1.5 text-[rgb(var(--app-muted))]" aria-label="Next" onClick={() => moveHeader(1)}>
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>

              {picking === "year" ? (
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 12 }, (_, index) => yearWindowStart(year) + index).map((item) => (
                    <button key={item} type="button" className={`rounded-md py-2 text-sm ${item === year ? "bg-[rgb(var(--app-panel))] font-medium" : "text-[rgb(var(--app-text))] hover:bg-[rgb(var(--app-panel))]"}`} onClick={() => { setView(new Date(item, month, 1)); setPicking("month"); }}>
                      {item}
                    </button>
                  ))}
                </div>
              ) : picking === "month" ? (
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS_SHORT.map((item, index) => (
                    <button key={item} type="button" className={`rounded-md py-2 text-sm ${index === month ? "bg-[rgb(var(--app-panel))] font-medium" : "text-[rgb(var(--app-text))] hover:bg-[rgb(var(--app-panel))]"}`} onClick={() => { setView(new Date(year, index, 1)); setPicking("day"); }}>
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-y-0.5">
                  {WEEKDAYS.map((weekday) => <div key={weekday} className="py-1 text-center text-xs font-medium text-[rgb(var(--app-muted))]">{weekday}</div>)}
                  {cells.map((date, index) => date ? (
                    <button key={index} type="button" className={`num flex aspect-square items-center justify-center rounded-md text-sm ${sameDay(date, selected) ? "bg-[rgb(var(--app-accent))] font-medium text-white" : sameDay(date, today) ? "font-medium text-[rgb(var(--app-accent))] hover:bg-[rgb(var(--app-panel))]" : "text-[rgb(var(--app-text))] hover:bg-[rgb(var(--app-panel))]"}`} onClick={() => commit(date)}>
                      {date.getDate()}
                    </button>
                  ) : <div key={index} />)}
                </div>
              )}

              <button type="button" className="mt-2 flex w-full items-center justify-center rounded-md py-1.5 text-xs font-medium text-[rgb(var(--app-muted))] transition-colors hover:bg-[rgb(var(--app-bg))] hover:text-[rgb(var(--app-text))]" onClick={() => commit(new Date())}>Today</button>
            </div>
          </MenuPortal>
        ) : null}
      </div>
    </Field>
  );
}
