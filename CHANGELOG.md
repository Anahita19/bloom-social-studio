# Changelog

## 2026-11-19 — Studio completion update

### Completed

- Added click-to-add behavior for empty week-strip and full-calendar slots.
- Kept drag-and-drop scheduling for generated platform previews.
- Added complete GitHub-facing documentation, a guided demo, architecture notes, and a Persian quick-start.
- Added the repository preview screenshot under `docs/assets`.
- Added a contributor-oriented QA checklist for the main flows.

### Verified

- `pnpm check` passes with no TypeScript errors.
- `pnpm build:static` produces the production frontend bundle.
- `/manus-routes.json` returns the single `/` route manifest.
- Desktop and mobile preview layouts render with the floral-magazine system.

### Product note

The copy-generation step remains a local demo implementation by design. It shows the loading and multi-platform output experience without requiring a provider key. The documented extension point in `docs/architecture.md` describes the request and response shape for connecting a production copy engine later.
