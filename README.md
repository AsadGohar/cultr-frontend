# frontend-boiler-plate

A reusable Vite + React + TypeScript starter tuned for AI-assisted development.

## AI agent setup

This repository is prepared for AI coding agents via:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `docs/STATE_MANAGEMENT.md`

## Included stack

- `pnpm` (lockfile is managed by `pnpm-lock.yaml`)
- `Vite` with `React` and `TypeScript`
- `Biome` for lint + format (`pnpm run lint`, `pnpm run format`, `pnpm run check`)
- `Zustand` shared store with slice-based architecture
- `Tailwind CSS v4` + light/dark theme toggle
- Static setup for icons + fonts

## Routing and base page

- `/` → `src/pages/Home.tsx` (landing page)
- `*` → `src/pages/NotFound.tsx`

`Home` uses reusable components in `src/components/landing/*`:

- `LandingBanner`
- `LandingHeader`
- `LandingHero`
- `LandingFeatures`
- `LandingProof`
- `LandingPricing`
- `LandingSignup`
- `LandingFooter`

## State pattern

- Keep local state in components by default.
- Use Context for bounded subtree state.
- Use Zustand for cross-route/cross-tree state.

Detailed rules are in `docs/STATE_MANAGEMENT.md`.

## Static assets setup

- `public/icons` includes placeholder site/favicon assets used by `index.html`.
- `public/fonts` includes placeholders for local font files:
  - `Inter-Regular.woff2`
  - `Inter-Regular.woff`
  - `Inter-Regular.ttf`

`src/index.css` sets up a local `@font-face` and maps it to `--font-sans`.

## Useful commands

```sh
pnpm install
pnpm run lint
pnpm run build
```

## Tailwind theme

Theme is class-based (`light` / `dark`) and controlled through Zustand theme state.
`RootLayout` syncs `theme` to the root `<html>` class.

## Date/time utilities in template

Template includes generic components:

- `src/components/ui/date-picker.tsx`
- `src/components/ui/time-picker.tsx`

These are used in the landing hero example.
