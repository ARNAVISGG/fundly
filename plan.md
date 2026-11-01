# Fundly implementation plan

## Product scope

Fundly is a portrait-first crowdfunding app adapted from the supplied `Fundly.html` prototype. It keeps the core experience: browse campaigns, inspect fundraising progress and stories, choose a reward tier for a simulated pledge, and launch a campaign with at least one reward tier. Campaign data persists across app sessions using the starter's local persistence layer so the prototype is usable immediately without real payment processing.

## Implementation approach

- Use the fixed Expo Router / React Native / TypeScript / NativeWind starter. Do not replace the starter or change its ports.
- Use a single tab shell with two focused routes: **Discover** for campaign browsing and **Launch** for campaign creation. Campaign detail and pledge confirmation use route-driven modal-style screens so the back affordance stays predictable on mobile.
- Keep campaign state in a small typed data layer backed by `@react-native-async-storage/async-storage`. Seed a few realistic campaigns on first launch so the app communicates its purpose immediately; afterwards, all launched campaigns and simulated pledges are read from and written to the local store.
- Build reusable UI primitives for the Fundly wordmark, progress bar, category pill, campaign card, reward tier card, stat card, and bottom tab bar. Keep the user flow tap-friendly and avoid dense forms.
- Preserve the prototype's 8% estimated platform fee language. Pledges add the selected reward amount to the campaign total and increment both campaign and tier backer counts; no payment provider or real charge is initiated.
- Keep the implementation self-contained in the app and components folders, with a typed storage module in `lib/` and product types in `shared/`.

## Project structure

- `app/_layout.tsx`: app providers and route stack configuration.
- `app/(tabs)/_layout.tsx`: Discover / Launch tab shell.
- `app/(tabs)/index.tsx`: campaign discovery, stats, filters, and empty/loading states.
- `app/(tabs)/launch.tsx`: campaign creation form and reward-tier builder.
- `app/campaign/[id].tsx`: campaign detail, progress, story, rewards, and simulated pledge action.
- `components/fundly/*`: brand and reusable campaign UI primitives.
- `lib/campaign-store.ts`: typed AsyncStorage persistence, seed data, campaign creation, and pledge updates.
- `shared/types.ts`: campaign, tier, and category types.
- `constants/theme.ts`: palette and typography tokens used by the Fundly surface.
- `assets/images/*`: native launcher and splash identity assets, preserving the starter's required filenames.

## Design direction

### Alternatives considered

- **Civic editorial warmth** — 0.07: optimistic community funding with paper-like surfaces and bright action color.
- **Quiet fintech utility** — 0.05: restrained dashboard hierarchy with cool neutrals and compact metrics.
- **Playful creator studio** — 0.04: expressive color blocks and energetic creator-first cards.

### Chosen: Civic editorial warmth

**Design Movement:** Modern civic editorial design: generous margins, soft paper surfaces, ink-like type hierarchy, and one confident signal color for action.

**Core Principles:** Make community impact legible at a glance; keep calls to action obvious without feeling salesy; use compact cards that read like short editorial briefs; make every state feel reassuring and human.

**Color Philosophy:** Warm off-white and ink navy create trust and calm. Fundly blue is the signature action color, while a muted mint marks progress and successful impact. Coral is reserved for small moments of emphasis such as the launch spark and empty-state illustration.

**Layout Paradigm:** A vertically paced feed with an editorial masthead, sticky-feeling summary band, and stacked campaign briefs. Detail pages open with a strong title and progress moment, then move into story and rewards rather than a dense dashboard.

**Signature Elements:** A tiny rocket/spark mark in the wordmark; rounded category pills with slightly tinted paper backgrounds; progress bars with a mint fill and a small milestone dot.

**Interaction Philosophy:** Tap targets should feel generous and direct. Browsing is low-friction; launching a campaign is guided in small sections; pledging confirms impact in plain language and never implies a real charge.

**Animation:** Use short, low-distance fades and vertical lifts when cards appear. Progress updates animate once after a pledge. Avoid looping or decorative motion that competes with the fundraising message.

**Typography System:** Use the starter's available system sans for reliable native rendering. Pair a heavier display weight for campaign titles with regular body copy and medium-weight labels. Use large numeric stats sparingly as editorial pull quotes.

**Brand Essence:** Everyday people turning good ideas into funded action; for local builders, creators, and neighbors; different because the funding story stays personal and transparent. Personality: hopeful, grounded, generous.

**Brand Voice:** Headlines are clear and encouraging; CTAs are active but never pushy; microcopy is transparent about simulation and fees. Example lines: “Small sparks. Real momentum.” and “Back this idea — simulated pledge, no payment taken.”

**Wordmark & Logo:** A compact rocket trail leading into the “Fundly” wordmark, with the trail doubling as the dot/launch spark in the app icon.

**Signature Brand Color:** Fundly blue `#2F6BFF`, an ownable, optimistic action blue used for primary CTAs and the launch spark.

## Frontend/backend serving

This is a managed mobile app using the fixed Expo Metro listener on 8081 and starter API listener on 3000. The first implementation does not require a new server endpoint or managed database capability: AsyncStorage provides durable local persistence for campaigns and simulated pledge records. The starter providers remain intact for future auth/API expansion.

## Material constraints

- Preserve the installed Expo/React Native/TypeScript starter and existing app identifiers.
- Keep the app functional on native and Expo Web; gate any web-only confirmation behavior if needed.
- Do not add a real payment flow or claim that pledges transfer money.
- Use the supplied prototype as the interaction reference; no additional external imagery is required beyond native branding assets.
