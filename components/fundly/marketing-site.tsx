import Head from "expo-router/head";
import { Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const palette = {
  paper: "#FFFDF9",
  canvas: "#F6F7FB",
  ink: "#172033",
  muted: "#6B7280",
  line: "#E5E7EF",
  blue: "#2F6BFF",
  blueSoft: "#EAF0FF",
  mint: "#5CBEA9",
  mintSoft: "#E4F5F0",
  coral: "#F46F57",
  coralSoft: "#FFF0EC",
  white: "#FFFFFF",
};

const discoverImage = require("../../assets/images/marketing-discover.png");
const launchImage = require("../../assets/images/marketing-launch.png");
const detailImage = require("../../assets/images/marketing-detail.png");

function scrollToSection(id: string) {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openGithub() {
  void Linking.openURL("https://github.com/ARNAVISGG/fundly");
}

function MarketingMark() {
  return (
    <View style={styles.mark} accessibilityRole="image" accessibilityLabel="Fundly">
      <Image source={require("../../assets/images/icon.png")} style={styles.markIcon} />
      <Text style={styles.markText}>Fundly</Text>
    </View>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

function ArrowButton({ label, onPress, tone = "blue" }: { label: string; onPress: () => void; tone?: "blue" | "quiet" }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [tone === "blue" ? styles.primaryButton : styles.quietButton, pressed && styles.pressed]}
    >
      <Text style={tone === "blue" ? styles.primaryButtonText : styles.quietButtonText}>{label}</Text>
      <Text style={tone === "blue" ? styles.primaryArrow : styles.quietArrow}>→</Text>
    </Pressable>
  );
}

function FeatureRow({ number, title, body, accent }: { number: string; title: string; body: string; accent: "blue" | "mint" | "coral" }) {
  const accentColor = accent === "blue" ? palette.blue : accent === "mint" ? palette.mint : palette.coral;
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureNumber, { backgroundColor: accentColor }]}><Text style={styles.featureNumberText}>{number}</Text></View>
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

export function MarketingSite() {
  const { width } = useWindowDimensions();
  const compact = width < 760;

  return (
    <>
      <Head>
        <title>Fundly — Back good ideas</title>
        <meta name="description" content="Fundly is a clearer way to discover campaigns, back projects, and launch community ideas." />
        <meta property="og:title" content="Fundly — Back good ideas" />
        <meta property="og:description" content="A crowdfunding app for local projects, creative work, and community ideas." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Fundly" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fundly — Back good ideas" />
        <meta name="twitter:description" content="Discover campaigns, back projects, and launch something worth supporting." />
      </Head>
      <ScrollView style={styles.page} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={[styles.nav, compact && styles.navCompact]}>
            <MarketingMark />
            <View style={[styles.navLinks, compact && styles.navLinksCompact]}>
              <Pressable onPress={() => scrollToSection("features")} accessibilityRole="link"><Text style={styles.navLink}>Features</Text></Pressable>
              <Pressable onPress={() => scrollToSection("how-it-works")} accessibilityRole="link"><Text style={styles.navLink}>How it works</Text></Pressable>
              <Pressable onPress={openGithub} accessibilityRole="link"><Text style={styles.navLink}>Open source</Text></Pressable>
            </View>
            <Pressable onPress={() => scrollToSection("how-it-works")} style={({ pressed }) => [styles.navCta, compact && styles.navCtaCompact, pressed && styles.pressed]} accessibilityRole="button">
              <Text style={styles.navCtaText}>See the idea</Text>
            </Pressable>
          </View>

          <View style={[styles.hero, compact && styles.heroCompact]}>
            <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
              <SectionEyebrow>A CLEARER WAY TO BACK GOOD IDEAS</SectionEyebrow>
              <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Good ideas deserve momentum.</Text>
              <Text style={styles.heroBody}>Fundly helps people discover campaigns, back projects they care about, and launch something worth supporting.</Text>
              <View style={styles.heroActions}>
                <ArrowButton label="See how it works" onPress={() => scrollToSection("how-it-works")} />
                <ArrowButton label="View the source" tone="quiet" onPress={openGithub} />
              </View>
              <Text style={styles.heroNote}>Demo app · local persistence · no payment taken</Text>
            </View>
            <View style={[styles.heroVisual, compact && styles.heroVisualCompact]}>
              <View style={styles.phoneGlow} />
              <View style={styles.phoneFrame}>
                <Image source={discoverImage} style={styles.phoneImage} resizeMode="cover" accessibilityLabel="Fundly Discover screen showing live campaigns" />
              </View>
              <View style={styles.floatCard}>
                <View style={styles.floatDot} />
                <View><Text style={styles.floatValue}>3 live campaigns</Text><Text style={styles.floatLabel}>small sparks, real momentum</Text></View>
              </View>
            </View>
          </View>

          <View nativeID="features" style={[styles.featureSection, compact && styles.featureSectionCompact]}>
            <View style={styles.sectionIntro}>
              <SectionEyebrow>THE PRODUCT, IN PLAIN LANGUAGE</SectionEyebrow>
              <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Less noise. More reason to join in.</Text>
              <Text style={styles.sectionBody}>Fundly keeps the funding story close to the people and projects behind it.</Text>
            </View>
            <View style={styles.featureList}>
              <FeatureRow number="01" title="Browse campaigns that feel human" body="Scan progress, stories, backers, and categories without getting lost in a dashboard." accent="blue" />
              <FeatureRow number="02" title="Back with a clear reward" body="Choose a reward tier, see what your pledge changes, and get plain language at every step." accent="mint" />
              <FeatureRow number="03" title="Launch your own next step" body="Set a goal, tell the story, add rewards, and make the first ask in a few focused fields." accent="coral" />
            </View>
          </View>

          <View nativeID="how-it-works" style={[styles.howSection, compact && styles.howSectionCompact]}>
            <View style={styles.howCopy}>
              <SectionEyebrow>DISCOVER · BACK · LAUNCH</SectionEyebrow>
              <Text style={[styles.howTitle, compact && styles.howTitleCompact]}>A small loop for moving good ideas forward.</Text>
              <Text style={styles.howBody}>The app is designed around one simple loop: find something worth supporting, make a visible difference, or give your own idea a place to start.</Text>
              <ArrowButton label="Read the open-source code" onPress={openGithub} />
            </View>
            <View style={styles.stepStack}>
              <View style={styles.stepCard}><Text style={styles.stepIndex}>01</Text><Text style={styles.stepTitle}>Discover</Text><Text style={styles.stepBody}>Find a project that makes your corner of the world better.</Text></View>
              <View style={[styles.stepCard, styles.stepCardRaised, compact && styles.stepCardRaisedCompact]}><Text style={styles.stepIndex}>02</Text><Text style={styles.stepTitle}>Back</Text><Text style={styles.stepBody}>Choose a reward and add momentum with a simulated pledge.</Text></View>
              <View style={styles.stepCard}><Text style={styles.stepIndex}>03</Text><Text style={styles.stepTitle}>Launch</Text><Text style={styles.stepBody}>Turn your own idea into a clear campaign people can understand.</Text></View>
            </View>
          </View>

          <View style={[styles.productProof, compact && styles.productProofCompact]}>
            <View style={styles.proofCopy}>
              <SectionEyebrow>BUILT TO BE UNDERSTOOD</SectionEyebrow>
              <Text style={[styles.proofTitle, compact && styles.proofTitleCompact]}>The app stays close to the action.</Text>
              <Text style={styles.proofBody}>Campaign detail, reward tiers, and launch flow are all designed for a small screen first—so the important part never gets buried.</Text>
              <View style={styles.proofMeta}><View style={styles.metaPill}><Text style={styles.metaPillText}>Expo</Text></View><View style={styles.metaPill}><Text style={styles.metaPillText}>React Native</Text></View><View style={styles.metaPill}><Text style={styles.metaPillText}>TypeScript</Text></View></View>
            </View>
            <View style={styles.proofScreens}>
              <Image source={detailImage} style={[styles.smallPhone, styles.smallPhoneDetail]} resizeMode="cover" accessibilityLabel="Fundly campaign detail screen" />
              <Image source={launchImage} style={[styles.smallPhone, styles.smallPhoneLaunch]} resizeMode="cover" accessibilityLabel="Fundly campaign launch screen" />
            </View>
          </View>

          <View style={styles.scopeSection}>
            <View style={styles.scopeMark}><Text style={styles.scopeMarkText}>i</Text></View>
            <View style={styles.scopeCopy}><Text style={styles.scopeTitle}>Honest about the demo</Text><Text style={styles.scopeBody}>Fundly currently uses local persistence and simulated pledges. There are no accounts, payment processing, refunds, or tax receipts hidden behind the interface.</Text></View>
          </View>

          <View style={[styles.footer, compact && styles.footerCompact]}>
            <MarketingMark />
            <Text style={styles.footerText}>Crowdfunding for local projects, creative work, and community ideas.</Text>
            <Pressable onPress={openGithub} accessibilityRole="link"><Text style={styles.footerLink}>View Fundly on GitHub ↗</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.canvas },
  pageContent: { paddingBottom: 72 },
  shell: { width: "100%", maxWidth: 1180, alignSelf: "center", paddingHorizontal: 32 },
  nav: { minHeight: 88, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 24 },
  navCompact: { minHeight: 72 },
  mark: { flexDirection: "row", alignItems: "center", gap: 10 },
  markIcon: { width: 34, height: 34, borderRadius: 10 },
  markText: { color: palette.ink, fontSize: 24, fontWeight: "900", letterSpacing: -0.7 },
  navLinks: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 30 },
  navLinksCompact: { display: "none" },
  navLink: { color: palette.muted, fontSize: 14, fontWeight: "700" },
  navCta: { backgroundColor: palette.ink, borderRadius: 999, paddingHorizontal: 17, paddingVertical: 10 },
  navCtaCompact: { paddingHorizontal: 13, paddingVertical: 9 },
  navCtaText: { color: palette.white, fontSize: 13, fontWeight: "800" },
  hero: { minHeight: 690, flexDirection: "row", alignItems: "center", gap: 56, paddingVertical: 64 },
  heroCompact: { minHeight: 0, flexDirection: "column", alignItems: "stretch", gap: 24, paddingVertical: 52 },
  heroCopy: { flex: 1, maxWidth: 550 },
  heroCopyCompact: { maxWidth: 999 },
  eyebrow: { color: palette.blue, fontSize: 11, fontWeight: "900", letterSpacing: 1.7, marginBottom: 17 },
  heroTitle: { color: palette.ink, fontSize: 70, lineHeight: 75, fontWeight: "900", letterSpacing: -3.5 },
  heroTitleCompact: { fontSize: 48, lineHeight: 53, letterSpacing: -2.2 },
  heroBody: { color: palette.muted, fontSize: 20, lineHeight: 30, marginTop: 24, maxWidth: 500 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 32 },
  primaryButton: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: palette.blue, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 15 },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: "900" },
  primaryArrow: { color: palette.white, fontSize: 22, lineHeight: 18 },
  quietButton: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 15 },
  quietButtonText: { color: palette.ink, fontSize: 14, fontWeight: "800" },
  quietArrow: { color: palette.blue, fontSize: 21, lineHeight: 18 },
  heroNote: { color: palette.muted, fontSize: 12, marginTop: 18 },
  heroVisual: { flex: 1, minHeight: 610, alignItems: "center", justifyContent: "center", position: "relative" },
  heroVisualCompact: { minHeight: 540 },
  phoneGlow: { position: "absolute", width: 330, height: 490, borderRadius: 165, backgroundColor: palette.blueSoft, transform: [{ rotate: "-10deg" }] },
  phoneFrame: { width: 286, height: 590, borderRadius: 37, padding: 10, backgroundColor: palette.ink, transform: [{ rotate: "3deg" }] },
  phoneImage: { width: "100%", height: "100%", borderRadius: 28 },
  floatCard: { position: "absolute", right: 8, bottom: 78, flexDirection: "row", alignItems: "center", gap: 12, maxWidth: 210, paddingHorizontal: 15, paddingVertical: 14, borderRadius: 18, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line },
  floatDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: palette.mint },
  floatValue: { color: palette.ink, fontSize: 14, fontWeight: "900" },
  floatLabel: { color: palette.muted, fontSize: 11, marginTop: 3 },
  featureSection: { paddingVertical: 100, flexDirection: "row", gap: 90, borderTopWidth: 1, borderTopColor: palette.line },
  featureSectionCompact: { paddingVertical: 64, flexDirection: "column", gap: 38 },
  sectionIntro: { flex: 1, maxWidth: 420 },
  sectionTitle: { color: palette.ink, fontSize: 46, lineHeight: 51, fontWeight: "900", letterSpacing: -2 },
  sectionTitleCompact: { fontSize: 36, lineHeight: 41, letterSpacing: -1.2 },
  sectionBody: { color: palette.muted, fontSize: 18, lineHeight: 28, marginTop: 20 },
  featureList: { flex: 1.1, gap: 28, paddingTop: 8 },
  featureRow: { flexDirection: "row", gap: 20, alignItems: "flex-start" },
  featureNumber: { width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  featureNumberText: { color: palette.white, fontSize: 12, fontWeight: "900" },
  featureCopy: { flex: 1, paddingBottom: 26, borderBottomWidth: 1, borderBottomColor: palette.line },
  featureTitle: { color: palette.ink, fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  featureBody: { color: palette.muted, fontSize: 15, lineHeight: 23, marginTop: 8, maxWidth: 470 },
  howSection: { borderRadius: 34, backgroundColor: palette.ink, padding: 58, flexDirection: "row", gap: 70, alignItems: "center" },
  howSectionCompact: { borderRadius: 26, padding: 28, flexDirection: "column", gap: 34, alignItems: "stretch" },
  howCopy: { flex: 1, maxWidth: 500 },
  howTitle: { color: palette.white, fontSize: 46, lineHeight: 51, fontWeight: "900", letterSpacing: -2 },
  howTitleCompact: { fontSize: 36, lineHeight: 41, letterSpacing: -1.2 },
  howBody: { color: "#B7BFCE", fontSize: 17, lineHeight: 27, marginTop: 20, marginBottom: 28 },
  stepStack: { flex: 1, gap: 12, maxWidth: 430 },
  stepCard: { borderRadius: 20, borderWidth: 1, borderColor: "#39445B", padding: 22, backgroundColor: "#202A3E" },
  stepCardRaised: { transform: [{ translateX: -22 }], backgroundColor: palette.blue, borderColor: palette.blue },
  stepCardRaisedCompact: { transform: [{ translateX: 0 }] },
  stepIndex: { color: palette.mint, fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  stepTitle: { color: palette.white, fontSize: 23, fontWeight: "900", marginTop: 8 },
  stepBody: { color: "#B7BFCE", fontSize: 14, lineHeight: 21, marginTop: 5 },
  productProof: { paddingVertical: 110, flexDirection: "row", alignItems: "center", gap: 70 },
  productProofCompact: { paddingVertical: 70, flexDirection: "column", alignItems: "stretch", gap: 30 },
  proofCopy: { flex: 1, maxWidth: 480 },
  proofTitle: { color: palette.ink, fontSize: 43, lineHeight: 49, fontWeight: "900", letterSpacing: -1.7 },
  proofTitleCompact: { fontSize: 36, lineHeight: 41, letterSpacing: -1.2 },
  proofBody: { color: palette.muted, fontSize: 17, lineHeight: 27, marginTop: 18 },
  proofMeta: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24 },
  metaPill: { backgroundColor: palette.mintSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  metaPillText: { color: palette.ink, fontSize: 12, fontWeight: "800" },
  proofScreens: { flex: 1, minHeight: 440, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18 },
  smallPhone: { width: 190, height: 412, borderRadius: 25, borderWidth: 7, borderColor: palette.ink },
  smallPhoneDetail: { transform: [{ rotate: "-6deg" }] },
  smallPhoneLaunch: { transform: [{ rotate: "6deg" }] },
  scopeSection: { flexDirection: "row", alignItems: "flex-start", gap: 18, padding: 25, borderRadius: 22, backgroundColor: palette.coralSoft, borderWidth: 1, borderColor: "#F8D8CF" },
  scopeMark: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.coral, alignItems: "center", justifyContent: "center" },
  scopeMarkText: { color: palette.white, fontSize: 17, fontWeight: "900" },
  scopeCopy: { flex: 1 },
  scopeTitle: { color: palette.ink, fontSize: 16, fontWeight: "900" },
  scopeBody: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 5, maxWidth: 850 },
  footer: { paddingTop: 70, paddingBottom: 15, flexDirection: "row", alignItems: "center", gap: 24 },
  footerCompact: { paddingTop: 50, flexDirection: "column", alignItems: "flex-start", gap: 14 },
  footerText: { flex: 1, color: palette.muted, fontSize: 13 },
  footerLink: { color: palette.blue, fontSize: 13, fontWeight: "900" },
  pressed: { opacity: 0.78 },
});
