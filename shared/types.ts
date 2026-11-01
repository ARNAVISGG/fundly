/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export const CAMPAIGN_CATEGORIES = ["Creative", "Local Business", "Community", "General"] as const;
export type CampaignCategory = (typeof CAMPAIGN_CATEGORIES)[number];

export type RewardTier = {
  id: string;
  title: string;
  amount: number;
  description: string;
  backers: number;
};

export type Campaign = {
  id: string;
  title: string;
  category: CampaignCategory;
  goal: number;
  story: string;
  raised: number;
  backerCount: number;
  tiers: RewardTier[];
  createdAt: number;
};

export type NewCampaign = Pick<Campaign, "title" | "category" | "goal" | "story"> & {
  tiers: Omit<RewardTier, "id" | "backers">[];
};
