import AsyncStorage from "@react-native-async-storage/async-storage";

export type DemoWalletTransaction = {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: "completed";
  createdAt: number;
  balanceAfter: number;
};

export type DemoWallet = {
  balance: number;
  totalAdded: number;
  totalWithdrawn: number;
  transactions: DemoWalletTransaction[];
};

export type NewsStory = {
  id: string;
  title: string;
  dek: string;
  creator: string;
  category: string;
  goal: number;
  raised: number;
  supporters: number;
  createdAt: string;
  completedAt: string;
  lessons: string;
  status: "sample" | "verified";
};

const WALLET_KEY = "@fundly/demo-wallet:v1";
const NEWS_KEY = "@fundly/news:v1";

const SAMPLE_NEWS: NewsStory[] = [
  {
    id: "sample-kitchen",
    title: "A neighborhood kitchen becomes a shared table",
    dek: "A sample success story showing how a clear goal and a visible local need can bring people together.",
    creator: "Fundly sample editorial",
    category: "Community",
    goal: 12000,
    raised: 14850,
    supporters: 132,
    createdAt: "March 2025",
    completedAt: "April 2025",
    lessons: "Keep the ask specific, share progress often, and give early supporters a reason to tell the story forward.",
    status: "sample",
  },
  {
    id: "sample-zine",
    title: "The small print run that found its audience",
    dek: "A sample creator story about building trust around a focused creative project.",
    creator: "Fundly sample editorial",
    category: "Creative",
    goal: 6400,
    raised: 8120,
    supporters: 96,
    createdAt: "January 2025",
    completedAt: "February 2025",
    lessons: "Show the work early, explain exactly where the money goes, and make rewards feel like part of the project.",
    status: "sample",
  },
];

const EMPTY_WALLET: DemoWallet = { balance: 0, totalAdded: 0, totalWithdrawn: 0, transactions: [] };

export async function loadDemoWallet(): Promise<DemoWallet> {
  const raw = await AsyncStorage.getItem(WALLET_KEY);
  if (!raw) {
    await AsyncStorage.setItem(WALLET_KEY, JSON.stringify(EMPTY_WALLET));
    return EMPTY_WALLET;
  }
  try {
    const parsed = JSON.parse(raw) as DemoWallet;
    if (!parsed || typeof parsed.balance !== "number" || !Array.isArray(parsed.transactions)) throw new Error("invalid wallet");
    return parsed;
  } catch {
    await AsyncStorage.setItem(WALLET_KEY, JSON.stringify(EMPTY_WALLET));
    return EMPTY_WALLET;
  }
}

async function persistWallet(wallet: DemoWallet) {
  await AsyncStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  return wallet;
}

export async function addDemoMoney(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive amount.");
  const wallet = await loadDemoWallet();
  const nextBalance = wallet.balance + amount;
  const transaction: DemoWalletTransaction = { id: `demo-deposit-${Date.now()}`, type: "deposit", amount, status: "completed", createdAt: Date.now(), balanceAfter: nextBalance };
  return persistWallet({ ...wallet, balance: nextBalance, totalAdded: wallet.totalAdded + amount, transactions: [transaction, ...wallet.transactions] });
}

export async function withdrawDemoMoney(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive amount.");
  const wallet = await loadDemoWallet();
  if (amount > wallet.balance) throw new Error("That withdrawal is larger than your demo balance.");
  const nextBalance = wallet.balance - amount;
  const transaction: DemoWalletTransaction = { id: `demo-withdrawal-${Date.now()}`, type: "withdrawal", amount, status: "completed", createdAt: Date.now(), balanceAfter: nextBalance };
  return persistWallet({ ...wallet, balance: nextBalance, totalWithdrawn: wallet.totalWithdrawn + amount, transactions: [transaction, ...wallet.transactions] });
}

export async function loadNewsStories(): Promise<NewsStory[]> {
  const raw = await AsyncStorage.getItem(NEWS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(NEWS_KEY, JSON.stringify(SAMPLE_NEWS));
    return SAMPLE_NEWS;
  }
  try {
    const parsed = JSON.parse(raw) as NewsStory[];
    return Array.isArray(parsed) ? parsed : SAMPLE_NEWS;
  } catch {
    return SAMPLE_NEWS;
  }
}

export function formatInr(value: number) {
  return `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
}
