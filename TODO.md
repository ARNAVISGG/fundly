# Fundly premium redesign and feature expansion TODO

## Premium dark product experience

- [x] Replace the blue-and-white theme with primary background `#090909`, secondary background `#111111`, cards `#181818`, elevated surfaces `#202020`, soft-white text `#F5F5F5`, muted gray `#929292`, subtle borders `#292929`, and muted champagne `#C5BBA8`.
- [x] Redesign existing Discover, Launch, campaign detail, and website-connected app surfaces with premium fintech hierarchy, refined buttons and inputs, consistent icons, restrained borders/shadows, dark-mode charts, intentional empty states, and smooth low-distance transitions.
- [ ] Remove excessive gradients, glow effects, oversized headings, repetitive rounded cards, decorative fake controls, and generic AI-looking illustrations without breaking existing campaign interactions.

## Data-driven Achievements

- [x] Add a dedicated Achievements section showing total money funded to the user’s campaigns, successful campaign count, supporters, biggest funded campaign, campaign funding milestones, funding history, and recent achievements from actual application data.
- [x] Add distinct badges for First Supporter, First ₹1,000 Raised, ₹10,000 Milestone, ₹50,000 Milestone, Fully Funded, and Multiple Successful Campaigns.
- [x] Show progress toward the next milestone and use clear zero/empty states instead of fake achievements or real-looking invented totals.

## Fundly News

- [ ] Add a dedicated Fundly News section with a featured story, latest stories, trending campaigns, creator interviews, and fundraiser tips using editorial layouts.
- [ ] Show campaign creator profile, project description, original goal, amount raised, supporter count, creation date, completion date, photos/updates, and lessons learned on detailed story pages when data exists.
- [x] Mark all seeded content as sample/demo until verified stories exist; never invent real people, success stories, or funding statistics.
- [x] Add admin-only create, edit, and remove operations with secure authorization; public users can browse and read published stories.

## Demo Wallet

- [x] Add a Wallet section with available DEMO balance, total DEMO added, total DEMO withdrawals, recent transactions, and a persistent DEMO MODE label.
- [x] Add Money accepts INR input and presets, validates positive finite amounts, shows confirmation, updates the simulated balance, and creates a transaction record.
- [x] Withdraw Money validates sufficient simulated balance, shows confirmation, deducts only demo balance, and records the withdrawal.
- [x] Transaction history shows transaction ID, type, amount, date/time, status, and updated balance with distinct deposit/withdrawal indicators.
- [x] Persist wallet balances and transactions in user-scoped database records, prevent negative balances and duplicate transactions, validate all amounts, and prevent access to another user’s wallet.
- [x] Do not integrate Stripe, payment gateways, bank details, real deposits, real withdrawals, or claims that demo money is real.

## Navigation, data, and quality

- [x] Integrate Achievements, Fundly News, and Wallet into the existing mobile/desktop navigation without clutter.
- [x] Add database structures, protected procedures, admin authorization, achievement calculations, campaign funding statistics, news management, loading states, error handling, and empty states while preserving current app behavior.
- [ ] Test wallet updates and persistence, achievement calculations, Fundly News display, desktop/mobile layouts, navigation, and the absence of leftover blue-and-white styling before delivery.
