# Contributing to Fundly

Thanks for helping improve Fundly.

## Before you start

Open an issue for substantial product changes so the direction can be discussed before implementation. Small bug fixes, accessibility improvements, documentation updates, and focused UI refinements can go straight to a pull request.

## Local setup

```bash
pnpm install
pnpm dev
```

## Pull requests

Keep each pull request focused on one change. Include a short explanation of the user-facing result and screenshots for visual changes. Preserve the portrait-mobile layout and keep simulated pledge behavior clearly separate from real payments.

Before submitting, run:

```bash
pnpm check
pnpm lint
pnpm test
```

## Commit messages

Use short imperative commit messages, for example `Improve reward tier validation` or `Document local persistence`.
