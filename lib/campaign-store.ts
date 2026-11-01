import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Campaign, NewCampaign } from "@/shared/types";

const STORAGE_KEY = "@fundly/campaigns:v1";

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "seed-community-kitchen",
    title: "A community kitchen for Eastside neighbors",
    category: "Community",
    goal: 12000,
    raised: 7350,
    backerCount: 84,
    story:
      "We are turning an empty storefront into a warm, accessible kitchen where neighbors can cook together, share recipes, and make sure nobody eats alone. Your backing helps us cover the first month of rent, equipment, and community meals.",
    tiers: [
      { id: "tier-kitchen-1", amount: 25, title: "Recipe card", description: "A handwritten recipe from our opening-night menu.", backers: 38 },
      { id: "tier-kitchen-2", amount: 75, title: "Community table", description: "Your name on our founding supporters wall and an invite to dinner.", backers: 31 },
      { id: "tier-kitchen-3", amount: 180, title: "Pantry sponsor", description: "Help stock a pantry shelf for a month and join a cooking workshop.", backers: 15 },
    ],
    createdAt: 3,
  },
  {
    id: "seed-studio-zine",
    title: "Print the next issue of Small Hours",
    category: "Creative",
    goal: 6400,
    raised: 4180,
    backerCount: 57,
    story:
      "Small Hours is an independent photo zine about the quiet rituals that make a city feel like home. This issue brings together 14 local artists and a beautiful, tactile print run.",
    tiers: [
      { id: "tier-zine-1", amount: 20, title: "Digital issue", description: "A phone-friendly edition delivered on launch day.", backers: 22 },
      { id: "tier-zine-2", amount: 45, title: "Printed copy", description: "A numbered copy of issue 04, shipped anywhere in the country.", backers: 27 },
      { id: "tier-zine-3", amount: 120, title: "Studio bundle", description: "The printed issue, a mini print, and a behind-the-scenes note.", backers: 8 },
    ],
    createdAt: 2,
  },
  {
    id: "seed-repair-bike",
    title: "Keep the neighborhood bike shop open",
    category: "Local Business",
    goal: 18000,
    raised: 9820,
    backerCount: 116,
    story:
      "Patch & Spoke has kept bikes rolling for twelve years. A sudden building repair has put our lease at risk, so we are asking the neighborhood to help bridge the gap and keep affordable repairs on the block.",
    tiers: [
      { id: "tier-bike-1", amount: 30, title: "Tune-up tip jar", description: "A thank-you sticker and one free tire-pressure check.", backers: 51 },
      { id: "tier-bike-2", amount: 90, title: "Future repair credit", description: "A repair credit plus your name on our community supporters board.", backers: 48 },
      { id: "tier-bike-3", amount: 250, title: "Tool wall patron", description: "A repair credit, shop tour, and a custom brass nameplate.", backers: 17 },
    ],
    createdAt: 1,
  },
];

export async function loadCampaigns(): Promise<Campaign[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CAMPAIGNS));
    return SEED_CAMPAIGNS;
  }

  try {
    const parsed = JSON.parse(stored) as Campaign[];
    if (Array.isArray(parsed)) return parsed;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CAMPAIGNS));
    return SEED_CAMPAIGNS;
  } catch {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CAMPAIGNS));
    return SEED_CAMPAIGNS;
  }
}

async function persist(campaigns: Campaign[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export async function createCampaign(input: NewCampaign): Promise<Campaign> {
  const campaigns = await loadCampaigns();
  const campaign: Campaign = {
    ...input,
    id: `campaign-${Date.now()}`,
    raised: 0,
    backerCount: 0,
    tiers: input.tiers.map((tier, index) => ({ ...tier, id: `tier-${Date.now()}-${index}`, backers: 0 })),
    createdAt: Date.now(),
  };
  await persist([campaign, ...campaigns]);
  return campaign;
}

export async function pledgeToTier(campaignId: string, tierId: string): Promise<{ campaign: Campaign; amount: number } | null> {
  const campaigns = await loadCampaigns();
  const index = campaigns.findIndex((campaign) => campaign.id === campaignId);
  if (index < 0) return null;

  const campaign = campaigns[index];
  const tier = campaign.tiers.find((item) => item.id === tierId);
  if (!tier) return null;

  const updated: Campaign = {
    ...campaign,
    raised: campaign.raised + tier.amount,
    backerCount: campaign.backerCount + 1,
    tiers: campaign.tiers.map((item) => (item.id === tierId ? { ...item, backers: item.backers + 1 } : item)),
  };
  const next = [...campaigns];
  next[index] = updated;
  await persist(next);
  return { campaign: updated, amount: tier.amount };
}
