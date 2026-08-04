# project-boilerplate (AI-ready)

## Scope
This repository is a reusable Vite + React + TypeScript boilerplate built for AI-assisted development.
Keep it dependency-light, generic, and easy to clone.

## Stack (intent)
- Package manager: `pnpm`
- Bundler: `Vite`
- Language: `TypeScript`
- Framework: `React` with `react-router-dom`
- State policy: local → context → Zustand
- Styling: `Tailwind CSS` with class-based light/dark theme
- Formatting/linting: `Biome`

## AI-first rules for contributors
When touching code in this repo, prefer this ladder:

1. Start with component-local state (`useState`, `useReducer`).
2. Move state to Context only when it must be shared across a bounded subtree.
3. Move to Zustand when state must be cross-route or cross-tree and stay synchronized.

Always keep derived UI state out of stored state; compute via selector/hook logic.
Avoid placing route/page-only values in global stores.

State location rule:
- Store slices must live under `src/stores`.
- `src/stores` is the only place for long-lived cross-cutting shared state.
- Zustand slices should be intentionally scoped (`ui`, `session`, `notifications`).

## State files (source of truth)
- `src/stores/types.ts`
- `src/stores/uiStore.ts`
- `src/stores/sessionStore.ts`
- `src/stores/notificationsStore.ts`
- `src/stores/createAppStore.ts`
- `src/stores/index.ts`

## Runbook
1. `pnpm install`
2. `pnpm run dev`
3. `pnpm run lint`
4. `pnpm run build`

## Quality rules for AI edits
- Never rewrite folder scaffolding unless requested.
- Keep changes minimal and predictable for a template starter.
- Preserve `pnpm` + `Biome` commands; avoid adding alternative lock/tooling unless explicitly requested.
- Before finishing, ensure new/modified TS files use existing aliases (`@/...`) and Biome formatting conventions.
- If uncertain, ask before changing cross-cutting behavior (routing, store shape, build config).

## AI agent entry points
- Start from: this file + `README.md` + `docs/STATE_MANAGEMENT.md`.
- For deeper state decisions, follow selectors defined in `src/stores/index.ts`.
- For any global UI behavior, validate behavior from `src/pages/Home.tsx` sample.
- For theme behavior, verify class-based dark mode wiring in `src/layouts/RootLayout.tsx`.

## Notes on removals/keeps
- Removed optional tooling should always be documented in README if added.
- Keep this repo minimal: no feature-specific SDKs or provider-specific business logic.
