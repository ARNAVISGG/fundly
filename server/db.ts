import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, Wallet, WalletTransaction, InsertWallet, users, wallets, walletTransactions, newsStories, NewsStoryRecord } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch {
      console.warn("[Database] Failed to connect");
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user");
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateWallet(userId: number): Promise<{ wallet: Wallet; transactions: WalletTransaction[] } | null> {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (!existing[0]) {
    const values: InsertWallet = { userId, balance: 0, totalAdded: 0, totalWithdrawn: 0 };
    await db.insert(wallets).values(values);
  }
  const wallet = (await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1))[0];
  const transactions = await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId)).orderBy(desc(walletTransactions.createdAt));
  return wallet ? { wallet, transactions } : null;
}

export async function applyWalletTransaction(userId: number, type: "deposit" | "withdrawal", amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Amount must be a positive whole INR value.");
  const db = await getDb();
  if (!db) return null;
  return db.transaction(async (tx) => {
    const current = await tx.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
    if (!current[0]) await tx.insert(wallets).values({ userId, balance: 0, totalAdded: 0, totalWithdrawn: 0 });
    const wallet = (await tx.select().from(wallets).where(eq(wallets.userId, userId)).limit(1))[0];
    if (!wallet || (type === "withdrawal" && wallet.balance < amount)) throw new Error("Insufficient demo balance.");
    const nextBalance = type === "deposit" ? wallet.balance + amount : wallet.balance - amount;
    const transactionId = `demo-${type}-${userId}-${Date.now()}`;
    await tx.update(wallets).set({ balance: nextBalance, totalAdded: wallet.totalAdded + (type === "deposit" ? amount : 0), totalWithdrawn: wallet.totalWithdrawn + (type === "withdrawal" ? amount : 0) }).where(eq(wallets.userId, userId));
    await tx.insert(walletTransactions).values({ transactionId, userId, type, amount, balanceAfter: nextBalance, status: "completed" });
    return { transactionId, balance: nextBalance };
  });
}

export async function listNewsStories(): Promise<NewsStoryRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsStories).where(eq(newsStories.published, 1)).orderBy(desc(newsStories.createdAt));
}

export async function createNewsStory(input: Omit<typeof newsStories.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(newsStories).values(input);
  return (await db.select().from(newsStories).where(eq(newsStories.slug, input.slug)).limit(1))[0] ?? null;
}

export async function updateNewsStory(id: number, input: Partial<Omit<typeof newsStories.$inferInsert, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(newsStories).set(input).where(eq(newsStories.id, id));
  return (await db.select().from(newsStories).where(eq(newsStories.id, id)).limit(1))[0] ?? null;
}

export async function removeNewsStory(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(newsStories).where(eq(newsStories.id, id));
  return true;
}
