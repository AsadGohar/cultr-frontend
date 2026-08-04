---
applyTo: "**"
---

# Project Boilerplate (AI instructions)

You are working in a shared React + Vite + TypeScript template with Zustand as the optional global state layer.

## Commands
- Run `pnpm install` after dependency changes.
- Use `pnpm run lint` for checks.
- Use `pnpm run build` before merging changes.

## State handling expectations
- Default to local component state.
- Use Context for bounded UI scope (modal/theme/form subtree state).
- Use Zustand when state must be shared across distant components, survive route transitions, or hold cross-cutting logic.
- Keep selectors narrow: `useAppStore((state) => state.someField)` should be preferred.
- Keep route/page-only state out of global store.
- Do not mirror server cache in Zustand; keep API data in React Query or another server cache layer.

## Code style
- Follow existing Biome style and existing aliases.
- Use files under `src/stores` for shared state slices.
- Keep placeholder/template edits minimal and generic.

## Files to read first
- `AGENTS.md`
- `README.md`
- `docs/STATE_MANAGEMENT.md`
- `src/stores/index.ts`
