import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { CampaignCard, BrandMark, EmptyState, formatMoney, palette, StatCard } from "@/components/fundly";
import { MarketingSite } from "@/components/fundly/marketing-site";
import { ScreenContainer } from "@/components/screen-container";
import { loadCampaigns } from "@/lib/campaign-store";
import { CAMPAIGN_CATEGORIES, type Campaign, type CampaignCategory } from "@/shared/types";

const filters: ("All" | CampaignCategory)[] = ["All", ...CAMPAIGN_CATEGORIES];

export default function DiscoverRoute() {
  if (Platform.OS === "web") return <MarketingSite />;
  return <DiscoverScreen />;
}

function DiscoverScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (isPull = false) => {
    if (isPull) setRefreshing(true);
    else setLoading(true);
    try {
      setCampaigns(await loadCampaigns());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const visibleCampaigns = useMemo(
    () => (filter === "All" ? campaigns : campaigns.filter((campaign) => campaign.category === filter)),
    [campaigns, filter],
  );
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalBackers = campaigns.reduce((sum, campaign) => sum + campaign.backerCount, 0);

  return (
    <ScreenContainer edges={["top"]} containerClassName="bg-[#090909]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh(true)} tintColor={palette.blue} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <BrandMark />
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>BACK GOOD IDEAS</Text>
          <Text style={styles.heroTitle}>Fund what matters{"\n"}to your community.</Text>
          <Text style={styles.heroBody}>Support local projects, creative work, and practical fixes.</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard value={formatMoney(totalRaised)} label="raised together" accent="mint" />
          <View style={styles.statGap} />
          <StatCard value={formatMoney(totalRaised * 0.08)} label="fee estimate" accent="blue" />
          <View style={styles.statGap} />
          <StatCard value={String(totalBackers)} label="backers" accent="coral" />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Campaigns</Text>
            <Text style={styles.sectionSubtitle}>{campaigns.length} live {campaigns.length === 1 ? "campaign" : "campaigns"}</Text>
          </View>
          <Pressable onPress={() => router.push("/launch")} style={styles.launchMini}>
            <Ionicons name="add" size={17} color={palette.white} />
            <Text style={styles.launchMiniText}>Launch</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((item) => {
            const active = filter === item;
            return (
              <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, active && styles.filterActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={palette.blue} /><Text style={styles.loadingText}>Loading campaigns…</Text></View>
        ) : visibleCampaigns.length ? (
          <View style={styles.list}>
            {visibleCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onPress={() => router.push(`/campaign/${campaign.id}`)} />
            ))}
          </View>
        ) : campaigns.length ? (
          <View style={styles.noResults}><Text style={styles.noResultsTitle}>No {filter.toLowerCase()} campaigns yet.</Text><Text style={styles.noResultsText}>Try another category or launch the first one.</Text></View>
        ) : (
          <EmptyState onLaunch={() => router.push("/launch")} />
        )}

        <Text style={styles.footerNote}>Simulated pledges · 8% platform fee estimate</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center" },
  hero: { paddingTop: 32, paddingBottom: 24 },
  kicker: { color: palette.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1.4, marginBottom: 11 },
  heroTitle: { color: palette.ink, fontSize: 36, lineHeight: 39, fontWeight: "900", letterSpacing: -1.5 },
  heroBody: { color: palette.muted, fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 280 },
  statsRow: { flexDirection: "row", alignItems: "stretch", marginBottom: 30 },
  statGap: { width: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: palette.ink, fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  sectionSubtitle: { color: palette.muted, fontSize: 12, marginTop: 4 },
  launchMini: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: palette.blue, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  launchMiniText: { color: palette.white, fontSize: 12, fontWeight: "800" },
  filterRow: { gap: 8, paddingBottom: 16 },
  filter: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper },
  filterActive: { borderColor: palette.ink, backgroundColor: palette.ink },
  filterText: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: palette.white },
  list: { gap: 0 },
  loading: { alignItems: "center", paddingVertical: 56, gap: 12 },
  loadingText: { color: palette.muted, fontSize: 14 },
  noResults: { paddingVertical: 42, paddingHorizontal: 10, alignItems: "center" },
  noResultsTitle: { color: palette.ink, fontSize: 18, fontWeight: "800" },
  noResultsText: { color: palette.muted, fontSize: 14, marginTop: 6 },
  footerNote: { color: palette.muted, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 10, paddingHorizontal: 20 },
});
