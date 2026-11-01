import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Campaign, RewardTier } from "@/shared/types";

export const palette = {
  ink: "#172033",
  muted: "#6F788A",
  paper: "#FFFDF9",
  canvas: "#F6F7FB",
  line: "#E7EAF0",
  blue: "#2F6BFF",
  blueSoft: "#EAF0FF",
  mint: "#63BCA9",
  mintSoft: "#E5F5F1",
  coral: "#F06A58",
  coralSoft: "#FFF0EC",
  white: "#FFFFFF",
};

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandSpark}>
        <Ionicons name="rocket-outline" size={compact ? 15 : 18} color={palette.white} />
      </View>
      <Text style={[styles.brandText, compact && styles.brandTextCompact]}>Fundly</Text>
    </View>
  );
}

export function ProgressBar({ raised, goal, large = false }: { raised: number; goal: number; large?: boolean }) {
  const percentage = Math.max(0, Math.min(100, Math.round((raised / Math.max(goal, 1)) * 100)));
  return (
    <View>
      <View style={[styles.progressTrack, large && styles.progressTrackLarge]}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
      <View style={styles.progressMeta}>
        <Text style={styles.progressPercent}>{percentage}% funded</Text>
        <Text style={styles.progressGoal}>{formatMoney(goal)} goal</Text>
      </View>
    </View>
  );
}

export function CategoryPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function CampaignCard({ campaign, onPress }: { campaign: Campaign; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.campaignCard, pressed && styles.pressed]}>
      <View style={styles.cardTopRow}>
        <CategoryPill label={campaign.category} />
        <Ionicons name="open-outline" size={20} color={palette.muted} />
      </View>
      <Text style={styles.campaignTitle}>{campaign.title}</Text>
      <ProgressBar raised={campaign.raised} goal={campaign.goal} />
      <View style={styles.cardFooter}>
        <Text style={styles.cardAmount}>{formatMoney(campaign.raised)} <Text style={styles.cardAmountMuted}>raised</Text></Text>
        <Text style={styles.cardBackers}>{campaign.backerCount} backers</Text>
      </View>
    </Pressable>
  );
}

export function StatCard({ value, label, accent = "blue" }: { value: string; label: string; accent?: "blue" | "mint" | "coral" }) {
  const color = accent === "mint" ? palette.mint : accent === "coral" ? palette.coral : palette.blue;
  return (
    <View style={styles.statCard}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function RewardTierCard({ tier, onPress, selected = false }: { tier: RewardTier; onPress: () => void; selected?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rewardCard, selected && styles.rewardCardSelected, pressed && styles.pressed]}>
      <View style={styles.rewardHeader}>
        <View style={styles.rewardAmountWrap}>
          <Text style={styles.rewardAmount}>{formatMoney(tier.amount)}</Text>
          <Text style={styles.rewardBackers}>{tier.backers} backed this</Text>
        </View>
        <View style={[styles.rewardIcon, selected && styles.rewardIconSelected]}>
          <Ionicons name={selected ? "checkmark" : "gift-outline"} size={20} color={selected ? palette.white : palette.blue} />
        </View>
      </View>
      <Text style={styles.rewardTitle}>{tier.title}</Text>
      <Text style={styles.rewardDescription}>{tier.description || "A thank-you from the campaign team."}</Text>
      <View style={styles.rewardAction}>
        <Text style={styles.rewardActionText}>{selected ? "Selected" : "Back this tier"}</Text>
        <Ionicons name="arrow-forward" size={16} color={palette.blue} />
      </View>
    </Pressable>
  );
}

export function formatMoney(value: number) {
  return `$${Math.round(Number(value) || 0).toLocaleString("en-US")}`;
}

export function EmptyState({ onLaunch }: { onLaunch: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="sparkles-outline" size={28} color={palette.coral} />
      </View>
      <Text style={styles.emptyTitle}>Your next big idea starts here.</Text>
      <Text style={styles.emptyText}>Launch a campaign and invite your first backers to build momentum together.</Text>
      <Pressable onPress={onLaunch} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>Launch a campaign</Text>
        <Ionicons name="arrow-forward" size={18} color={palette.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandSpark: { width: 30, height: 30, borderRadius: 10, backgroundColor: palette.blue, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  brandText: { color: palette.ink, fontSize: 20, fontWeight: "800", letterSpacing: -0.6 },
  brandTextCompact: { fontSize: 17 },
  pill: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: palette.blueSoft },
  pillText: { color: palette.blue, fontSize: 11, fontWeight: "800", letterSpacing: 0.3, textTransform: "uppercase" },
  campaignCard: { backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, borderRadius: 22, padding: 18, marginBottom: 13 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  campaignTitle: { color: palette.ink, fontSize: 18, fontWeight: "800", lineHeight: 23, letterSpacing: -0.35, marginBottom: 18 },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: palette.line, overflow: "hidden" },
  progressTrackLarge: { height: 11, borderRadius: 11 },
  progressFill: { height: "100%", borderRadius: 8, backgroundColor: palette.mint },
  progressMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  progressPercent: { color: palette.mint, fontSize: 12, fontWeight: "800" },
  progressGoal: { color: palette.muted, fontSize: 12 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16 },
  cardAmount: { color: palette.ink, fontSize: 14, fontWeight: "800" },
  cardAmountMuted: { color: palette.muted, fontWeight: "500" },
  cardBackers: { color: palette.muted, fontSize: 13 },
  statCard: { flex: 1, minHeight: 104, borderRadius: 18, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper, padding: 13, justifyContent: "space-between" },
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 7 },
  statValue: { color: palette.ink, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  statLabel: { color: palette.muted, fontSize: 11, lineHeight: 15 },
  rewardCard: { borderWidth: 1, borderColor: palette.line, borderRadius: 20, backgroundColor: palette.paper, padding: 16, marginBottom: 12 },
  rewardCardSelected: { borderColor: palette.blue, backgroundColor: palette.blueSoft },
  rewardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  rewardAmountWrap: { gap: 3 },
  rewardAmount: { color: palette.ink, fontSize: 21, fontWeight: "800" },
  rewardBackers: { color: palette.muted, fontSize: 12 },
  rewardIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.blueSoft, alignItems: "center", justifyContent: "center" },
  rewardIconSelected: { backgroundColor: palette.blue },
  rewardTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", marginTop: 16, marginBottom: 6 },
  rewardDescription: { color: palette.muted, fontSize: 13, lineHeight: 19 },
  rewardAction: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 17 },
  rewardActionText: { color: palette.blue, fontSize: 13, fontWeight: "800" },
  emptyState: { alignItems: "center", paddingHorizontal: 24, paddingVertical: 48, borderRadius: 24, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line },
  emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: palette.coralSoft, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  emptyTitle: { color: palette.ink, fontSize: 20, lineHeight: 25, fontWeight: "800", textAlign: "center" },
  emptyText: { color: palette.muted, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 10, marginBottom: 22 },
  primaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 14, backgroundColor: palette.blue, paddingHorizontal: 18, paddingVertical: 14, minHeight: 50 },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: "800" },
});
