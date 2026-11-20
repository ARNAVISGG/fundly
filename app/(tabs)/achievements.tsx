import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BrandMark, formatMoney, palette } from "@/components/fundly";
import { ScreenContainer } from "@/components/screen-container";
import { loadCampaigns } from "@/lib/campaign-store";
import type { Campaign } from "@/shared/types";

const milestones = [1000, 10000, 50000];

export default function AchievementsScreen() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); try { setCampaigns(await loadCampaigns()); } finally { setLoading(false); } }, []);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const stats = useMemo(() => {
    const raised = campaigns.reduce((sum, item) => sum + item.raised, 0);
    const supporters = campaigns.reduce((sum, item) => sum + item.backerCount, 0);
    const successful = campaigns.filter((item) => item.raised >= item.goal).length;
    const biggest = campaigns.reduce<Campaign | null>((best, item) => (!best || item.raised > best.raised ? item : best), null);
    const next = milestones.find((item) => item > raised) ?? 50000;
    return { raised, supporters, successful, biggest, next };
  }, [campaigns]);
  const achievementRows = [
    { label: "First supporter", detail: "Backers across your campaigns", earned: stats.supporters >= 1, icon: "people-outline" as const },
    { label: "First ₹1,000 raised", detail: "Reach your first funding marker", earned: stats.raised >= 1000, icon: "flag-outline" as const },
    { label: "₹10,000 milestone", detail: "Build meaningful momentum", earned: stats.raised >= 10000, icon: "trending-up-outline" as const },
    { label: "₹50,000 milestone", detail: "A substantial community signal", earned: stats.raised >= 50000, icon: "ribbon-outline" as const },
    { label: "Fully funded", detail: "One campaign reaches its goal", earned: stats.successful >= 1, icon: "checkmark-circle-outline" as const },
    { label: "Multiple campaigns", detail: "Successfully fund more than one", earned: stats.successful >= 2, icon: "layers-outline" as const },
  ];

  return <ScreenContainer edges={["top"]} containerClassName="bg-[#090909]"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <BrandMark />
    <View style={styles.heading}><Text style={styles.kicker}>PROGRESS, MADE VISIBLE</Text><Text style={styles.title}>Achievements</Text><Text style={styles.subtitle}>A record of what your campaigns have actually moved forward.</Text></View>
    {loading ? <View style={styles.loading}><ActivityIndicator color={palette.blue} /></View> : <>
      <View style={styles.heroMetric}><Text style={styles.metricLabel}>TOTAL RAISED</Text><Text style={styles.metricValue}>{formatMoney(stats.raised)}</Text><Text style={styles.metricNote}>{stats.supporters} supporters across {campaigns.length} campaigns</Text><View style={styles.milestoneTrack}><View style={[styles.milestoneFill, { width: `${Math.min(100, (stats.raised / stats.next) * 100)}%` }]} /></View><Text style={styles.milestoneText}>{formatMoney(Math.max(0, stats.next - stats.raised))} until next milestone</Text></View>
      <View style={styles.grid}><Metric label="Successful campaigns" value={String(stats.successful)} /><Metric label="Supporters" value={String(stats.supporters)} /><Metric label="Biggest campaign" value={stats.biggest ? formatMoney(stats.biggest.raised) : "—"} /></View>
      <Text style={styles.sectionTitle}>Badges</Text><View style={styles.badgeList}>{achievementRows.map((item) => <View key={item.label} style={[styles.badgeRow, item.earned && styles.badgeEarned]}><View style={[styles.badgeIcon, item.earned && styles.badgeIconEarned]}><Ionicons name={item.icon} size={21} color={item.earned ? palette.blue : palette.muted} /></View><View style={styles.badgeCopy}><Text style={styles.badgeLabel}>{item.label}</Text><Text style={styles.badgeDetail}>{item.detail}</Text></View><Ionicons name={item.earned ? "checkmark" : "lock-closed-outline"} size={17} color={item.earned ? palette.mint : palette.muted} /></View>)}</View>
      <Text style={styles.sectionTitle}>Funding history</Text>{campaigns.length ? campaigns.map((campaign) => <View key={campaign.id} style={styles.historyRow}><View style={styles.historyDot} /><View style={styles.historyCopy}><Text style={styles.historyTitle}>{campaign.title}</Text><Text style={styles.historyMeta}>{formatMoney(campaign.raised)} raised · {campaign.backerCount} supporters</Text></View><Text style={styles.historyDate}>{campaign.raised >= campaign.goal ? "Funded" : "In progress"}</Text></View>) : <Text style={styles.empty}>Create a campaign to start your funding history.</Text>}
    </>}
  </ScrollView></ScreenContainer>;
}

function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricSmall}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }
const styles = StyleSheet.create({ content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40 }, heading: { paddingTop: 34, paddingBottom: 24 }, kicker: { color: palette.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 }, title: { color: palette.ink, fontSize: 34, fontWeight: "900", marginTop: 10 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 9, maxWidth: 310 }, loading: { paddingVertical: 80 }, heroMetric: { backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, padding: 20, borderRadius: 12 }, metricLabel: { color: palette.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.2 }, metricValue: { color: palette.ink, fontSize: 40, fontWeight: "900", marginTop: 8 }, metricNote: { color: palette.muted, fontSize: 13, marginTop: 5 }, milestoneTrack: { height: 6, backgroundColor: palette.line, marginTop: 22, overflow: "hidden" }, milestoneFill: { height: "100%", backgroundColor: palette.mint }, milestoneText: { color: palette.muted, fontSize: 11, marginTop: 8 }, grid: { flexDirection: "row", gap: 8, marginVertical: 24 }, metric: { flex: 1, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, padding: 14, minHeight: 86 }, metricSmall: { color: palette.ink, fontSize: 20, fontWeight: "900", marginBottom: 9 }, sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: "900", marginBottom: 12, marginTop: 7 }, badgeList: { borderTopWidth: 1, borderTopColor: palette.line, marginBottom: 26 }, badgeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line, opacity: 0.55 }, badgeEarned: { opacity: 1 }, badgeIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: palette.line }, badgeIconEarned: { borderColor: palette.blue, backgroundColor: palette.blueSoft }, badgeCopy: { flex: 1 }, badgeLabel: { color: palette.ink, fontSize: 14, fontWeight: "800" }, badgeDetail: { color: palette.muted, fontSize: 12, marginTop: 3 }, historyRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line }, historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.mint }, historyCopy: { flex: 1 }, historyTitle: { color: palette.ink, fontSize: 13, fontWeight: "800" }, historyMeta: { color: palette.muted, fontSize: 12, marginTop: 3 }, historyDate: { color: palette.muted, fontSize: 11 }, empty: { color: palette.muted, fontSize: 13, paddingVertical: 18 }, });
