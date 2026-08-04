# UI Components (Starter)

This folder contains lightweight, reusable starter primitives copied into a generic
shape for quick AI agent onboarding.

Available components:

- `ui/button.tsx`
- `ui/card.tsx`
- `ui/field.tsx`
- `ui/badge.tsx`
- `ui/alert.tsx`
- `ui/spinner.tsx`
- `ui/date-picker.tsx`
- `ui/time-picker.tsx`

These are intentionally framework-neutral and app-agnostic:

- Keep global app styling in `src/index.css` and `src/stores`.
- Keep state concerns near owners and use Zustand only when cross-route/state-wide.

Font usage in this starter:

- Body and heading text uses `font-sans` (wired to `InterLocal`).
- Numeric/timestamp displays should use `font-mono` and `tabular-nums`.
