import type { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

export function CalendarIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" aria-hidden {...props}>
      <path
        d="M7 2v3M17 2v3M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2"
        fill="currentColor"
      />
    </svg>
  );
}

export function ClockIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" aria-hidden {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" aria-hidden {...props}>
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" aria-hidden {...props}>
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" aria-hidden {...props}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
