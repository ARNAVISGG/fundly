# Fundly premium redesign and feature expansion plan

## Product scope

Upgrade the existing Fundly app in place. Preserve campaign discovery, campaign detail, simulated pledges, campaign launch, local persistence, the responsive product-introduction website, and the public GitHub repository. Add a premium charcoal fintech visual system and three connected product areas: Achievements, Fundly News, and a clearly labeled demo Wallet. No real payments, bank details, Stripe, or invented success claims.

## Implementation approach

- Replace the blue-and-white app styling with a deep-black / charcoal / soft-white / muted-silver system while preserving the signature rocket mark and compact editorial tone.
- Keep the mobile-first Expo Router structure. Add focused routes for Achievements, Fundly News, Wallet, and individual News stories. Keep web root as the existing product-introduction site.
- Store wallet demo balances and transaction history in the managed database through user-scoped tables and protected tRPC procedures. Validate positive finite INR amounts, prevent negative balances, use idempotent transaction IDs, and never expose another user's records.
- Compute Achievements from actual campaign and pledge data. In the current prototype, campaign totals and backers remain the source of truth; achievements show zero/empty states when no qualifying data exists and never fabricate funding.
- Seed Fundly News only with clearly labeled demo/sample stories. Add admin-only create/edit/remove procedures and a public list/detail surface that marks sample content until verified records are available.
- Use loading, error, empty, and unauthorized states on all new screens. Keep actions touch-friendly and avoid decorative controls that imply unsupported functionality.

## Project structure

- `app/(tabs)/_layout.tsx`: compact navigation for Discover, Launch, Achievements, News, and Wallet.
- `app/(tabs)/achievements.tsx`: data-driven achievement dashboard, milestones, history, and badges.
- `app/(tabs)/news.tsx`: Fundly News editorial feed with demo/sample labels.
- `app/(tabs)/wallet.tsx`: demo wallet balance, add/withdraw confirmation, and transaction history.
- `app/news/[id].tsx`: detailed success-story article view.
- `components/fundly/*`: shared dark palette, cards, badges, charts, wallet rows, and editorial components.
- `lib/campaign-store.ts`: preserve existing campaign and simulated pledge persistence; expose derived stats for achievements.
- `lib/demo-wallet-store.ts`: native/local fallback for unauthenticated demo preview only; server-backed wallet is preferred when an authenticated session exists.
- `server/db.ts`, `server/routers.ts`, `drizzle/schema.ts`: user-scoped wallet, transaction, and Fundly News persistence with protected/admin procedures.
- `shared/types.ts`: campaign, wallet, transaction, achievement, and news models.
- `theme.config.js`, `constants/theme.ts`: premium charcoal palette.

## Design direction

### Alternatives considered

- **Quiet luxury fintech** — 0.08: restrained charcoal surfaces, silver hierarchy, precise dividers, and rare champagne emphasis.
- **Editorial black-book** — 0.06: magazine-like story layouts, high-contrast serif headlines, and monochrome campaign briefs.
- **Creator terminal** — 0.04: dense utility panels, telemetry accents, and compact status instrumentation.

### Chosen: Quiet luxury fintech

**Design Movement:** Quiet luxury fintech: dark, tactile surfaces and precise editorial hierarchy instead of dashboard noise.

**Core Principles:** Make money and progress legible; use contrast instead of decoration; separate primary actions from supporting detail; be explicit about demo boundaries.

**Color Philosophy:** `#090909` is the calm canvas, `#111111` and `#181818` create depth, `#F5F5F5` carries trust, `#929292` reduces noise, and `#C5BBA8` acts as a rare premium signal rather than a glow.

**Layout Paradigm:** A vertical product journal with one high-confidence summary at the top, followed by thin-divided sections and compact evidence rows. Avoid card grids that make every item feel equally important.

**Signature Elements:** Champagne hairline dividers; small uppercase section labels; restrained metric numerals with milestone ticks.

**Interaction Philosophy:** Every tap explains what changes. Wallet actions always show DEMO MODE and confirmation. News labels sample stories. Empty states explain what data is missing instead of pretending.

**Animation:** Short fades and 4–8px lifts only for route entry and confirmed wallet updates. No looping effects, neon glows, or celebratory confetti.

**Typography System:** Use the system sans for UI reliability, with heavier display weights for one headline and compact uppercase labels for metadata. Use tabular-looking numerals for balances and progress.

**Brand Essence:** A trustworthy place to move good ideas forward; for backers and creators; different because the funding story stays transparent. Personality: composed, useful, credible.

**Brand Voice:** Clear, direct, and honest about what is simulated. Example lines: “See what your backing changed.” and “Demo balance only — no money moves.”

**Wordmark & Logo:** Preserve the Fundly rocket-spark mark, recolored to soft white with a champagne launch trail on dark surfaces.

**Signature Brand Color:** Muted champagne `#C5BBA8`.

## Frontend/backend serving

The Expo Metro preview remains on port 8081 and the API remains on port 3000. The database tables are added through the existing Drizzle migration workflow. Published web continues to serve the focused marketing root from the static export with the existing API container and `/api/health` readiness contract.

## Material constraints

- Do not break current campaigns, profiles, authentication, pledge behavior, launch flow, or public marketing website.
- Do not add Stripe, bank account fields, real deposits, real withdrawals, or claims that demo money is real.
- Do not invent verified Fundly success stories, people, or funding statistics; sample content must be marked.
- Use actual campaign data for achievements and show meaningful empty states where records do not qualify.
- Keep navigation coherent across mobile and desktop web while the web root remains an introduction page rather than the full app shell.
