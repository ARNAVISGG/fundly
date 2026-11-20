import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BrandMark, palette, formatMoney } from "@/components/fundly";
import { ScreenContainer } from "@/components/screen-container";
import { createCampaign } from "@/lib/campaign-store";
import { CAMPAIGN_CATEGORIES, type CampaignCategory } from "@/shared/types";

type DraftTier = { amount: string; title: string; description: string };

export default function LaunchScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CampaignCategory>("Community");
  const [goal, setGoal] = useState("");
  const [story, setStory] = useState("");
  const [tier, setTier] = useState<DraftTier>({ amount: "", title: "", description: "" });
  const [tiers, setTiers] = useState<DraftTier[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addTier = () => {
    const numericAmount = Number(tier.amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !tier.title.trim()) {
      setError("Add a reward amount and name before adding this tier.");
      return;
    }
    setTiers((current) => [...current, tier]);
    setTier({ amount: "", title: "", description: "" });
    setError("");
  };

  const submit = async () => {
    const numericGoal = Number(goal);
    if (!title.trim() || !Number.isFinite(numericGoal) || numericGoal < 1 || tiers.length === 0 || tiers.some((item) => !Number.isFinite(Number(item.amount)) || Number(item.amount) <= 0)) {
      setError("Add a title, a valid funding goal, and at least one reward tier.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createCampaign({
        title: title.trim(),
        category,
        goal: numericGoal,
        story: story.trim() || "This campaign is just getting started. Thanks for being part of the first spark.",
        tiers: tiers.map((item) => ({ amount: Number(item.amount), title: item.title.trim(), description: item.description.trim() })),
      });
      router.replace("/");
    } catch {
      setError("Could not save this campaign right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer edges={["top"]} containerClassName="bg-[#090909]">
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}><BrandMark compact /></View>
          <Text style={styles.kicker}>CREATE A CAMPAIGN</Text>
          <Text style={styles.title}>Launch a campaign</Text>
          <Text style={styles.intro}>Set a goal, add rewards, and share what you’re building.</Text>

          <View style={styles.formCard}>
            <Field label="Campaign title" value={title} onChangeText={setTitle} placeholder="e.g. A community garden toolshed" />
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CAMPAIGN_CATEGORIES.map((item) => {
                const active = category === item;
                return <Pressable key={item} onPress={() => setCategory(item)} style={[styles.categoryChip, active && styles.categoryChipActive]}><Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{item}</Text></Pressable>;
              })}
            </ScrollView>
            <Field label="Funding goal" value={goal} onChangeText={setGoal} placeholder="5000" keyboardType="numeric" prefix="$" />
            <Field label="Your story" value={story} onChangeText={setStory} placeholder="What are you raising money for?" multiline />

            <View style={styles.rewardHeading}><View><Text style={styles.sectionTitle}>Reward tiers</Text><Text style={styles.helper}>Offer a simple reward for each level of support.</Text></View><View style={styles.tierCount}><Text style={styles.tierCountText}>{tiers.length}</Text></View></View>
            {tiers.map((item, index) => (
              <View key={`${item.title}-${index}`} style={styles.draftTier}><View style={styles.draftTierCopy}><Text style={styles.draftTierAmount}>{formatMoney(Number(item.amount))}</Text><Text style={styles.draftTierTitle}>{item.title}</Text></View><Pressable onPress={() => setTiers((current) => current.filter((_, itemIndex) => itemIndex !== index))} accessibilityLabel={`Remove ${item.title}`}><Ionicons name="close-circle-outline" size={22} color={palette.coral} /></Pressable></View>
            ))}
            <View style={styles.tierBuilder}>
              <Field label="Reward amount" value={tier.amount} onChangeText={(value) => setTier((current) => ({ ...current, amount: value }))} placeholder="25" keyboardType="numeric" prefix="$" compact />
              <Field label="Reward name" value={tier.title} onChangeText={(value) => setTier((current) => ({ ...current, title: value }))} placeholder="Recipe card" compact />
              <Field label="Description" value={tier.description} onChangeText={(value) => setTier((current) => ({ ...current, description: value }))} placeholder="A thank-you from the team" compact />
              <Pressable onPress={addTier} style={({ pressed }) => [styles.addTierButton, pressed && styles.pressed]}><Ionicons name="add" size={18} color={palette.blue} /><Text style={styles.addTierText}>Add reward tier</Text></Pressable>
            </View>

            {error ? <View style={styles.errorBox}><Ionicons name="alert-circle-outline" size={18} color={palette.coral} /><Text style={styles.errorText}>{error}</Text></View> : null}
            <Pressable disabled={saving} onPress={() => void submit()} style={({ pressed }) => [styles.submitButton, (pressed || saving) && styles.pressed]}><Text style={styles.submitText}>{saving ? "Publishing…" : "Launch campaign"}</Text><Ionicons name="arrow-forward" size={18} color={palette.white} /></Pressable>
            <Text style={styles.finePrint}>Simulated pledges · 8% platform fee estimate</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline = false, prefix, compact = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "numeric" | "default"; multiline?: boolean; prefix?: string; compact?: boolean }) {
  return <View style={[styles.field, compact && styles.fieldCompact]}><Text style={styles.label}>{label}</Text><View style={styles.inputWrap}>{prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}<TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A3AAB7" keyboardType={keyboardType} multiline={multiline} textAlignVertical={multiline ? "top" : "center"} style={[styles.input, multiline && styles.textArea]} /></View></View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 34 },
  kicker: { color: palette.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1.4, marginBottom: 11 },
  title: { color: palette.ink, fontSize: 32, lineHeight: 38, fontWeight: "900", letterSpacing: -1 },
  intro: { color: palette.muted, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 24, maxWidth: 310 },
  formCard: { backgroundColor: palette.paper, borderRadius: 24, borderWidth: 1, borderColor: palette.line, padding: 17 },
  field: { marginBottom: 16 },
  fieldCompact: { marginBottom: 11 },
  label: { color: palette.ink, fontSize: 12, fontWeight: "800", marginBottom: 7 },
  inputWrap: { minHeight: 48, flexDirection: "row", alignItems: "center", borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.canvas, paddingHorizontal: 13 },
  input: { flex: 1, color: palette.ink, fontSize: 14, paddingVertical: 12 },
  textArea: { minHeight: 105, paddingTop: 12 },
  prefix: { color: palette.muted, fontSize: 14, fontWeight: "700", marginRight: 3 },
  categoryRow: { gap: 7, paddingBottom: 17 },
  categoryChip: { borderRadius: 999, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.canvas, paddingHorizontal: 12, paddingVertical: 9 },
  categoryChipActive: { backgroundColor: palette.blueSoft, borderColor: palette.blue },
  categoryChipText: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  categoryChipTextActive: { color: palette.blue },
  rewardHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5, marginBottom: 13 },
  sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: "900" },
  helper: { color: palette.muted, fontSize: 12, marginTop: 4 },
  tierCount: { width: 29, height: 29, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: palette.mintSoft },
  tierCountText: { color: palette.mint, fontSize: 13, fontWeight: "900" },
  draftTier: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: palette.line, paddingVertical: 11 },
  draftTierCopy: { flexDirection: "row", alignItems: "center", gap: 9, flex: 1 },
  draftTierAmount: { color: palette.blue, fontSize: 13, fontWeight: "900" },
  draftTierTitle: { color: palette.ink, fontSize: 13, fontWeight: "700", flexShrink: 1 },
  tierBuilder: { borderWidth: 1, borderStyle: "dashed", borderColor: palette.line, borderRadius: 16, padding: 12, marginTop: 12, marginBottom: 14 },
  addTierButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, backgroundColor: palette.blueSoft, paddingVertical: 12 },
  addTierText: { color: palette.blue, fontSize: 13, fontWeight: "800" },
  errorBox: { flexDirection: "row", gap: 8, alignItems: "flex-start", backgroundColor: palette.coralSoft, borderRadius: 12, padding: 11, marginBottom: 14 },
  errorText: { flex: 1, color: palette.coral, fontSize: 12, lineHeight: 17, fontWeight: "700" },
  submitButton: { minHeight: 52, borderRadius: 14, backgroundColor: palette.blue, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { color: palette.white, fontSize: 14, fontWeight: "900" },
  finePrint: { color: palette.muted, textAlign: "center", fontSize: 11, lineHeight: 16, marginTop: 13, paddingHorizontal: 8 },
  pressed: { opacity: 0.78 },
});
