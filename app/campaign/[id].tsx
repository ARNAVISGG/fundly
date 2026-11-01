import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BrandMark, CategoryPill, formatMoney, palette, ProgressBar, RewardTierCard, StatCard } from "@/components/fundly";
import { ScreenContainer } from "@/components/screen-container";
import { loadCampaigns, pledgeToTier } from "@/lib/campaign-store";
import type { Campaign } from "@/shared/types";

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pledging, setPledging] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    let active = true;
    void loadCampaigns().then((campaigns) => {
      if (!active) return;
      setCampaign(campaigns.find((item) => item.id === id) ?? null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  const selected = campaign?.tiers.find((tier) => tier.id === selectedTier);
  const pledge = async () => {
    if (!campaign || !selected || pledging) return;
    setPledging(true);
    try {
      const result = await pledgeToTier(campaign.id, selected.id);
      if (result) {
        setCampaign(result.campaign);
        setSelectedTier(null);
        setConfirmation(`You pledged ${formatMoney(result.amount)} to ${result.campaign.title}. Simulated only — no payment was taken.`);
      } else {
        setConfirmation("That reward is no longer available. Please choose another tier.");
      }
    } catch {
      setConfirmation("Could not record the simulated pledge. Please try again.");
    } finally {
      setPledging(false);
    }
  };

  if (loading) {
    return <ScreenContainer containerClassName="bg-[#F6F7FB]"><View style={styles.center}><ActivityIndicator color={palette.blue} /></View></ScreenContainer>;
  }

  if (!campaign) {
    return <ScreenContainer containerClassName="bg-[#F6F7FB]"><View style={styles.center}><Text style={styles.notFound}>Campaign not found.</Text><Pressable onPress={() => router.back()}><Text style={styles.backLink}>Go back</Text></Pressable></View></ScreenContainer>;
  }

  return (
    <ScreenContainer edges={["top"]} containerClassName="bg-[#F6F7FB]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back"><Ionicons name="arrow-back" size={20} color={palette.ink} /></Pressable><BrandMark compact /><View style={styles.topbarSpacer} /></View>
        <View style={styles.heroCard}>
          <CategoryPill label={campaign.category} />
          <Text style={styles.title}>{campaign.title}</Text>
          <Text style={styles.raised}><Text style={styles.raisedStrong}>{formatMoney(campaign.raised)}</Text> raised of {formatMoney(campaign.goal)}</Text>
          <ProgressBar raised={campaign.raised} goal={campaign.goal} large />
          <View style={styles.heroStats}><Text style={styles.heroStat}>{campaign.backerCount} backers</Text><Text style={styles.heroDivider}>•</Text><Text style={styles.heroStat}>{Math.max(0, Math.round((campaign.raised / Math.max(campaign.goal, 1)) * 100))}% funded</Text></View>
        </View>

        {confirmation ? <View style={styles.confirmation}><View style={styles.confirmationIcon}><Ionicons name="checkmark" size={17} color={palette.white} /></View><Text style={styles.confirmationText}>{confirmation}</Text><Pressable onPress={() => setConfirmation("")}><Ionicons name="close" size={17} color={palette.mint} /></Pressable></View> : null}

        <Text style={styles.sectionTitle}>Why this matters</Text>
        <Text style={styles.story}>{campaign.story}</Text>

        <View style={styles.impactRow}><StatCard value={formatMoney(campaign.raised * 0.08)} label="estimated platform fee" accent="blue" /><View style={styles.impactGap} /><StatCard value={String(campaign.backerCount)} label="people in the circle" accent="mint" /></View>

        <View style={styles.rewardHeader}><View><Text style={styles.sectionTitle}>Choose your thank-you</Text><Text style={styles.sectionSub}>Tap a tier to preview your simulated pledge.</Text></View><Ionicons name="gift-outline" size={22} color={palette.blue} /></View>
        <View style={styles.rewards}>{campaign.tiers.map((tier) => <RewardTierCard key={tier.id} tier={tier} selected={tier.id === selectedTier} onPress={() => { setSelectedTier(tier.id); setConfirmation(""); }} />)}</View>

        {selected ? <View style={styles.pledgeDock}><View style={styles.pledgeCopy}><Text style={styles.pledgeLabel}>Ready to back</Text><Text style={styles.pledgeAmount}>{formatMoney(selected.amount)} · {selected.title}</Text></View><Pressable onPress={() => void pledge()} style={({ pressed }) => [styles.pledgeButton, pressed && styles.pressed]}><Text style={styles.pledgeButtonText}>{pledging ? "Saving…" : "Pledge"}</Text><Ionicons name="arrow-forward" size={17} color={palette.white} /></Pressable></View> : null}
        <Text style={styles.footerNote}>Simulated pledge · no real payment taken</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 35 },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backButton: { width: 38, height: 38, borderRadius: 14, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" },
  topbarSpacer: { width: 38 },
  heroCard: { backgroundColor: palette.paper, borderRadius: 24, borderWidth: 1, borderColor: palette.line, padding: 18, marginBottom: 20 },
  title: { color: palette.ink, fontSize: 28, lineHeight: 33, fontWeight: "900", letterSpacing: -0.9, marginTop: 15, marginBottom: 13 },
  raised: { color: palette.muted, fontSize: 14, marginBottom: 17 },
  raisedStrong: { color: palette.ink, fontSize: 18, fontWeight: "900" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 13 },
  heroStat: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  heroDivider: { color: palette.line, fontSize: 14 },
  confirmation: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: palette.mintSoft, borderWidth: 1, borderColor: "#C8E9E1", borderRadius: 15, padding: 11, marginBottom: 21 },
  confirmationIcon: { width: 25, height: 25, borderRadius: 9, backgroundColor: palette.mint, alignItems: "center", justifyContent: "center" },
  confirmationText: { flex: 1, color: "#34776B", fontSize: 12, lineHeight: 17, fontWeight: "700" },
  sectionTitle: { color: palette.ink, fontSize: 20, fontWeight: "900", letterSpacing: -0.4 },
  story: { color: palette.muted, fontSize: 15, lineHeight: 23, marginTop: 10, marginBottom: 24 },
  impactRow: { flexDirection: "row", marginBottom: 28 },
  impactGap: { width: 9 },
  rewardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  sectionSub: { color: palette.muted, fontSize: 12, marginTop: 5 },
  rewards: { marginBottom: 8 },
  pledgeDock: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, backgroundColor: palette.ink, borderRadius: 18, padding: 13, marginTop: 4 },
  pledgeCopy: { flex: 1 },
  pledgeLabel: { color: "#AEB7C9", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  pledgeAmount: { color: palette.white, fontSize: 13, fontWeight: "800" },
  pledgeButton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: palette.blue, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  pledgeButtonText: { color: palette.white, fontSize: 13, fontWeight: "900" },
  footerNote: { color: palette.muted, fontSize: 11, textAlign: "center", marginTop: 17 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFound: { color: palette.ink, fontSize: 18, fontWeight: "800" },
  backLink: { color: palette.blue, fontSize: 14, fontWeight: "800", marginTop: 8 },
  pressed: { opacity: 0.78 },
});
