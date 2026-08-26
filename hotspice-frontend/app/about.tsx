import { Button, Card, FadeInView, IconBadge } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const STATS = [
  { value: "8+", label: "Years in Lahore" },
  { value: "150+", label: "Dishes Served Daily" },
  { value: "5", label: "Cities & Counting" },
  { value: "200K+", label: "Happy Customers" },
];

const PROMISE_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}[] = [
  { icon: "flame-outline", title: "Freshly prepared, never frozen leftovers" },
  { icon: "bicycle-outline", title: "Fast delivery straight to your door" },
  { icon: "pricetag-outline", title: "Honest prices, no hidden charges" },
];

const CONTACT_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}[] = [
  { icon: "call-outline", text: "042-111-000-111" },
  { icon: "mail-outline", text: "support@hotandspice.pk" },
  { icon: "location-outline", text: "Lahore, Pakistan" },
];

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/double_beef_deluxe.jpg")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.9)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>Our Story</Text>
          <Text style={styles.heroTitle}>About Us</Text>
        </View>
      </View>

      {/* Story */}
      <View style={styles.section}>
        <FadeInView index={0}>
          <Text style={styles.eyebrow}>Who We Are</Text>
          <Text style={styles.sectionTitle}>Bold Flavor, Made Fresh Daily</Text>
          <Text style={styles.paragraph}>
            Hot & Spice started as a single kitchen in Lahore with one simple
            goal: crispy chicken and juicy burgers that actually taste like
            they were made with care. No shortcuts, no frozen leftovers —
            just bold, honest flavor cooked fresh every single day.
          </Text>
          <Text style={styles.paragraph}>
            Today we serve thousands of happy customers across the city, from
            late-night cravings to family feasts, but the recipe for success
            hasn&apos;t changed — fresh ingredients, fair prices, and food that
            brings the heat.
          </Text>
        </FadeInView>

        <FadeInView index={1} delay={80}>
          <View style={styles.statGrid}>
            {STATS.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </FadeInView>
      </View>

      {/* Our Promise */}
      <View style={styles.valuesSection}>
        <FadeInView index={0}>
          <Text style={[styles.eyebrow, styles.eyebrowLight]}>What Drives Us</Text>
          <Text style={[styles.sectionTitle, styles.sectionTitleLight]}>
            Our Promise
          </Text>
        </FadeInView>

        <View style={{ marginTop: Spacing.lg }}>
          {PROMISE_ITEMS.map((item, i) => (
            <FadeInView key={item.title} index={i} delay={100}>
              <View style={styles.valueRow}>
                <IconBadge name={item.icon} size={48} iconSize={22} />
                <Text style={styles.valueText}>{item.title}</Text>
              </View>
            </FadeInView>
          ))}
        </View>
      </View>

      {/* Get in Touch */}
      <View style={styles.section}>
        <FadeInView index={0}>
          <Text style={styles.eyebrow}>Reach Us</Text>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
        </FadeInView>

        <FadeInView index={1} delay={60}>
          <Card style={{ marginTop: Spacing.lg }}>
            {CONTACT_ITEMS.map((item, i) => (
              <View
                key={item.text}
                style={[
                  styles.contactRow,
                  i < CONTACT_ITEMS.length - 1 && styles.contactRowBorder,
                ]}
              >
                <IconBadge name={item.icon} size={40} iconSize={18} />
                <Text style={styles.contactText}>{item.text}</Text>
              </View>
            ))}
          </Card>
        </FadeInView>
      </View>

      {/* CTA */}
      <FadeInView>
        <LinearGradient
          colors={[Colors.primary, Colors.primary, Colors.secondary]}
          locations={[0, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cta}
        >
          <Text style={styles.ctaTitle}>Hungry Already?</Text>
          <Text style={styles.ctaSubtitle}>
            Explore the menu and get your favorites delivered hot.
          </Text>
          <Button
            title="Order Now"
            onPress={() => router.push("/(tabs)/menu")}
            fullWidth={false}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          />
        </LinearGradient>
      </FadeInView>

      <Text style={styles.footer}>Hot & Spice — Lahore&apos;s home of bold flavor</Text>
    </ScrollView>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: Spacing["3xl"] },

  hero: {
    height: 220,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
  heroEyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["8xl"],
    color: Colors.white,
  },

  section: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["2xl"],
  },
  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.secondary,
    marginBottom: 4,
  },
  eyebrowLight: { color: Colors.secondaryLight },
  sectionTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  sectionTitleLight: { color: Colors.bg },
  paragraph: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  statCard: {
    width: "47%",
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    ...cardShadow,
  },
  statValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["5xl"],
    color: Colors.text,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 2,
  },

  valuesSection: {
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing["2xl"],
    marginTop: Spacing["2xl"],
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  valueText: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: "rgba(237,232,208,0.9)",
    lineHeight: 20,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.sm,
  },
  contactText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.text,
  },

  cta: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing["2xl"],
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  ctaTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    color: Colors.bg,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: "rgba(237,232,208,0.85)",
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  ctaButton: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing["2xl"],
  },
  ctaButtonText: { color: Colors.secondary },

  footer: {
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing["2xl"],
  },
});
