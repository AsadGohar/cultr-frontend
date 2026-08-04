import { type ChangeEvent, type InputHTMLAttributes, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { ClockIcon, ChevronDownIcon } from "@/components/ui/icons";
import { MenuPortal, useMenuPlacement } from "@/components/ui/use-menu-placement";
import { useDismiss } from "@/components/ui/use-dismiss";
import { Field } from "@/components/ui/field";
import { WheelColumn as TesseraWheelColumn } from "@/components/ui/tessera-wheel";
import { NlSuggestField, TIME_SUGGESTIONS } from "@/components/ui/nl-suggest";

type ParsedTime = {
  hours: number;
  minutes: number;
};

type TimePickerProps = {
  label?: string;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const pad2 = (value: number) => String(value).padStart(2, "0");

function parseTime(value: string): ParsedTime | null {
  if (!value) {
    return null;
  }

  if (value.trim().toLowerCase() === "noon") return { hours: 12, minutes: 0 };
  if (value.trim().toLowerCase() === "midnight") return { hours: 0, minutes: 0 };

  const twelveHourMatch = value.match(/^\s*(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)\s*$/);
  if (twelveHourMatch) {
    const hours12 = Number.parseInt(twelveHourMatch[1], 10);
    const minutes = Number.parseInt(twelveHourMatch[2], 10);
    const period = twelveHourMatch[3].toUpperCase();

    if (
      Number.isNaN(hours12) ||
      Number.isNaN(minutes) ||
      hours12 < 1 ||
      hours12 > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    let hours = hours12 % 12;
    if (period === "PM") {
      hours += 12;
    }

    return { hours, minutes };
  }

  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number.parseInt(hoursRaw, 10);
  const minutes = Number.parseInt(minutesRaw, 10);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return { hours, minutes };
}

const toTimeValue = ({ hours, minutes }: ParsedTime) => `${pad2(hours)}:${pad2(minutes)}`;

export function TimePicker({
  label,
  hint,
  error,
  htmlFor,
  className = "",
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a time",
  ...props
}: TimePickerProps) {
  const isControlled = value !== undefined;
  const id = htmlFor ?? props.id;

  const [internalValue, setInternalValue] = useState(() => String((defaultValue as string | undefined) ?? ""));
  const [isOpen, setIsOpen] = useState(false);
  const [naturalInput, setNaturalInput] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentValue = isControlled ? String(value ?? "") : internalValue;
  const [draftValue, setDraftValue] = useState(currentValue);
  const parsed = parseTime(draftValue) ?? { hours: 9, minutes: 0 };
  const hourItems = Array.from({ length: 12 }, (_, index) => {
    const hour = index + 1;
    return {
      value: pad2(hour),
      label: pad2(hour),
    };
  });

  const minuteItems = Array.from({ length: 60 }, (_, index) => ({
    value: pad2(index),
    label: pad2(index),
  }));

  const periodItems = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  const naturalLabel = useMemo(() => {
    const hour = parsed.hours % 12 || 12;
    const period = parsed.hours >= 12 ? "PM" : "AM";
    return `${hour}:${pad2(parsed.minutes)} ${period}`;
  }, [parsed.hours, parsed.minutes]);

  useEffect(() => {
    if (isOpen) {
      setDraftValue(currentValue);
      setNaturalInput("");
    }
  }, [isOpen, currentValue]);

  useDismiss({
    refs: [rootRef, triggerRef, panelRef],
    enabled: isOpen,
    onDismiss: () => setIsOpen(false),
  });

  const { style: menuStyle } = useMenuPlacement({
    isOpen,
    triggerRef,
    menuRef: panelRef,
    minWidth: 260,
    sideOffset: 6,
    alignment: "start",
  });

  const commitValue = (next: string) => {
    setDraftValue(next);
    if (!isControlled) {
      setInternalValue(next);
    }

    if (!onChange) {
      return;
    }

    const event = {
      target: { value: next },
      currentTarget: { value: next },
      preventDefault() {},
      stopPropagation() {},
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const closePicker = () => setIsOpen(false);

  const commitNaturalTime = (input = naturalInput) => {
    const next = parseTime(input);
    if (next) {
      commitValue(toTimeValue(next));
      setIsOpen(false);
      setNaturalInput("");
    }
  };

  const setNow = () => {
    const now = new Date();
    commitValue(toTimeValue({ hours: now.getHours(), minutes: now.getMinutes() }));
  };

  const setTimeFrom12Hour = (hour12: string, minute: string, period: string) => {
    const hour24 = Number.parseInt(hour12, 10) % 12 + (period === "PM" ? 12 : 0);
    commitValue(toTimeValue({ hours: hour24, minutes: Number.parseInt(minute, 10) }));
  };

  const selectedHour12 = ((parsed.hours % 12) || 12).toString().padStart(2, "0");
  const selectedPeriod = parsed.hours >= 12 ? "PM" : "AM";

  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <div className="relative" ref={rootRef}>
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className={`tessera-picker-trigger ${className}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={id ? `${id}-panel` : undefined}
        >
          <ClockIcon />
          <span className={currentValue ? "truncate text-[rgb(var(--app-text))]" : "text-[rgb(var(--app-muted))]"}>
            {currentValue ? naturalLabel : placeholder}
          </span>
          <ChevronDownIcon className="ml-auto text-[rgb(var(--app-muted))]" />
        </button>

        <input
          type="time"
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          value={currentValue}
          name={props.name}
          required={props.required}
          readOnly
          onChange={undefined}
        />

        {isOpen && menuStyle ? (
          <MenuPortal>
            <div
              ref={panelRef}
              id={id ? `${id}-panel` : undefined}
              role="dialog"
              className="menu w-80 p-3"
              style={menuStyle}
              aria-label="Time picker"
            >
              <NlSuggestField value={naturalInput} onChange={setNaturalInput} onCommit={(value) => { setNaturalInput(value); commitNaturalTime(value); }} catalog={TIME_SUGGESTIONS} placeholder="e.g. 3:30pm · noon · half past 6" />
              <div className="relative">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-9 -translate-y-1/2 rounded-md bg-[rgb(var(--app-panel))]" />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-9 -translate-y-1/2 border-y border-[rgb(var(--app-border))]" />
                <div className="relative z-[1] grid grid-cols-3 gap-1">
                  <TesseraWheelColumn
                    values={hourItems.map((item) => item.value)}
                    index={hourItems.findIndex((item) => item.value === selectedHour12)}
                    format={(item) => item}
                    ariaLabel="Hours"
                    onIndexChange={(index) => setTimeFrom12Hour(hourItems[index].value, pad2(parsed.minutes), selectedPeriod)}
                  />
                  <TesseraWheelColumn
                    values={minuteItems.map((item) => item.value)}
                    index={minuteItems.findIndex((item) => item.value === pad2(parsed.minutes))}
                    format={(item) => item}
                    ariaLabel="Minutes"
                    onIndexChange={(index) => setTimeFrom12Hour(selectedHour12, minuteItems[index].value, selectedPeriod)}
                  />
                  <TesseraWheelColumn
                    values={periodItems.map((item) => item.value)}
                    index={periodItems.findIndex((item) => item.value === selectedPeriod)}
                    format={(item) => item}
                    ariaLabel="AM or PM"
                    onIndexChange={(index) => setTimeFrom12Hour(selectedHour12, pad2(parsed.minutes), periodItems[index].value)}
                  />
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[rgb(var(--app-border))] pt-2.5">
                <button type="button" className="menu-item pressable w-auto px-2 py-1 text-xs font-medium" onClick={setNow}>
                  Now
                </button>
                <button type="button" className="pressable rounded-md bg-[rgb(var(--app-accent))] px-2.5 py-1 text-xs font-medium text-white" onClick={closePicker}>
                  Done
                </button>
              </div>
            </div>
          </MenuPortal>
        ) : null}
      </div>
    </Field>
  );
}
