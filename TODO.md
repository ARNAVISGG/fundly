# Fundly TODO

## Introduce Fundly on the public web

- [x] On web, the root route is a focused marketing website for introducing Fundly rather than the full campaign app.
- [x] The website explains what Fundly is, shows a real app screenshot, communicates the core Discover / Back / Launch flow, and describes the primary features and demo limitations.
- [x] The website uses the existing Fundly identity with a restrained responsive layout, clear calls to action, readable typography, and no fake account controls or decorative UI that implies unavailable functionality.
- [x] The website includes route-level title and description metadata and a synchronized `public/manus-routes.json` entry for the public root route.
- [x] Native app routes remain available with the existing Discover, Launch, detail, pledge, and persistence behavior.

## Discover campaigns and show fundraising context

- [x] The app opens to a portrait-mobile Discover experience where users can browse persisted campaigns in a readable stacked list.
- [x] Each campaign card shows its category, title, raised amount, goal amount, backer count, and a visible progress bar.
- [x] The Discover experience shows total funds raised across campaigns and an approximate platform fee calculated at 8% of funds raised.
- [x] The app includes clear navigation between campaign discovery and campaign launch, with accessible tap targets and readable layouts.

## View campaign details and reward tiers

- [x] Tapping a campaign opens a detail view with a back affordance, category, title, progress toward goal, raised amount, goal amount, backer count, and the campaign story.
- [x] The detail view lists all available reward tiers with pledge amount, reward name, description, and tier backer count.
- [x] Each reward tier provides a clear action to back that tier.

## Record simulated pledges

- [x] Selecting a reward tier records a simulated pledge without taking real payment.
- [x] A successful simulated pledge increments the campaign raised amount and campaign backer count, increments the selected tier backer count, persists the updated data, and communicates the no-payment nature of the action.
- [x] The updated progress and backer totals are visible after returning to the campaign detail or discovery view.

## Launch campaigns with reward tiers

- [x] The Launch flow collects a campaign title, category, funding goal, and story.
- [x] The creator can add one or more reward tiers, each with an amount, reward name, and description, and can remove draft tiers before publishing.
- [x] Launch is blocked unless a title, valid funding goal, and at least one reward tier are provided; the user receives clear inline guidance.
- [x] Publishing creates a persisted campaign with zero raised funds and zero backers, then returns the user to the browsable campaign list where it is visible.
- [x] The form explains that Fundly keeps an 8% platform fee on funds raised and that pledges are simulated.

## Persist the Fundly experience

- [x] Campaigns, reward tiers, campaign totals, and simulated pledge counts persist across app sessions using the managed Expo starter's local persistence layer.
- [x] First launch contains a small set of seeded example campaigns so the app is understandable before the user creates content; later launches reuse the user's stored data.
- [x] Native launcher/splash branding uses the Fundly rocket-spark identity and the app keeps the starter's required mobile project structure and runtime ports.
