# Contributing to Bloom

## Local setup

```bash
pnpm install
pnpm dev:static
```

Run the checks before opening a pull request:

```bash
pnpm check
pnpm build:static
```

## Product conventions

Keep the floral-magazine direction intact: generous white space, Cormorant Garamond for editorial headings, DM Sans for controls, blush petal accents, sage actions, and calm microcopy.

Keep the Create view focused on the sequence of image, direction, preview, and schedule. New features should support that flow rather than turning the workspace into a generic dashboard.

When changing generated copy or scheduling, update `docs/architecture.md`, `docs/demo.md`, and `docs/qa-checklist.md` so the repository demo remains accurate.

## Pull request checklist

- Explain the user-facing behavior changed.
- Include a screenshot for layout changes.
- Run `pnpm check` and `pnpm build:static`.
- Update the changelog when a completed product behavior changes.
- Avoid committing secrets, local environment files, or generated build output.
