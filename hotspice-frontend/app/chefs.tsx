import { FadeInView, PressableScale } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { chefs, type Chef } from "@/src/data/chefsData";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / 2;

export default function ChefsScreen() {
  const [selected, setSelected] = useState<Chef | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <Text style={styles.eyebrow}>The Talent</Text>
          <Text style={styles.title}>Meet Our Chefs</Text>
          <Text style={styles.intro}>
            Each member of our kitchen has spent years mastering their craft at some of the world&apos;s finest
            institutions. Their passion defines what Hot &amp; Spice means to every guest.
          </Text>
        </FadeInView>

        <View style={styles.grid}>
          {chefs.map((chef, i) => (
            <ChefCard key={chef.id} chef={chef} index={i} onPress={() => setSelected(chef)} />
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="none" onRequestClose={() => setSelected(null)}>
        {selected ? (
          <ChefModal chef={selected} onClose={() => setSelected(null)} />
        ) : null}
      </Modal>
    </View>
  );
}

function ChefCard({ chef, index, onPress }: { chef: Chef; index: number; onPress: () => void }) {
  const lift = useSharedValue(0);

  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
  }));

  return (
    <FadeInView index={index} style={{ width: CARD_WIDTH }}>
      <PressableScale
        haptic
        scaleTo={0.97}
        onPress={onPress}
        onPressIn={() => {
          lift.value = withSpring(-4, { damping: 14, stiffness: 300 });
        }}
        onPressOut={() => {
          lift.value = withSpring(0, { damping: 14, stiffness: 300 });
        }}
      >
        <Animated.View style={liftStyle}>
          <View style={styles.card}>
            <Image source={{ uri: chef.image }} style={styles.cardImage} contentFit="cover" cachePolicy="memory-disk" />
            <View style={styles.cardBody}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {chef.name}
                  </Text>
                  <Text style={styles.cardRole} numberOfLines={1}>
                    {chef.role}
                  </Text>
                </View>
                <View style={styles.experienceBadge}>
                  <Ionicons name="time-outline" size={11} color={Colors.secondary} />
                  <Text style={styles.experienceText}>{chef.experience}y</Text>
                </View>
              </View>
              <View style={styles.specialtyRow}>
                <Ionicons name="ribbon-outline" size={12} color={Colors.secondary} />
                <Text style={styles.specialtyText} numberOfLines={1}>
                  {chef.specialty.split(",")[0]}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </PressableScale>
    </FadeInView>
  );
}

function ChefModal({ chef, onClose }: { chef: Chef; onClose: () => void }) {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.modalBackdropWrap}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View entering={FadeIn.duration(260).springify().damping(18)} style={styles.modalPanel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalHeaderImageWrap}>
            <Image
              source={{ uri: chef.image }}
              style={styles.modalHeaderImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={styles.modalHeaderGradient} />
            <View style={styles.modalHeaderTextWrap}>
              <Text style={styles.modalName}>{chef.name}</Text>
              <Text style={styles.modalRole}>{chef.role}</Text>
            </View>
            <PressableScale haptic onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={18} color={Colors.white} />
            </PressableScale>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.modalPillRow}>
              <View style={styles.modalPill}>
                <Ionicons name="time-outline" size={12} color={Colors.secondary} />
                <Text style={styles.modalPillText}>{chef.experience} Years Experience</Text>
              </View>
              <View style={[styles.modalPill, styles.modalPillAlt]}>
                <Ionicons name="logo-instagram" size={12} color={Colors.secondary} />
                <Text style={[styles.modalPillText, { color: Colors.secondary }]}>{chef.instagram}</Text>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>About</Text>
            <Text style={styles.modalParagraph}>{chef.bio}</Text>

            <Text style={styles.modalSectionTitle}>Specialty</Text>
            <Text style={styles.modalParagraph}>{chef.specialty}</Text>

            <LinearGradient
              colors={[Colors.primary, Colors.primary, Colors.secondary]}
              locations={[0, 0.65, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signatureBox}
            >
              <Text style={styles.signatureLabel}>Signature Dish</Text>
              <Text style={styles.signatureText}>{chef.signature}</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },

  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.secondary,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["7xl"],
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  intro: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },

  card: {
    borderRadius: Radius["2xl"],
    overflow: "hidden",
    backgroundColor: Colors.surface,
    ...Shadows.warm,
  },
  cardImage: { width: "100%", height: 150, backgroundColor: Colors.border },
  cardBody: { padding: Spacing.md },
  cardHeaderRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.xs },
  cardName: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.text },
  cardRole: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.secondary, marginTop: 1 },
  experienceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.secondaryTint,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  experienceText: { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.secondary },
  specialtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  specialtyText: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.muted, flexShrink: 1 },

  modalBackdropWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  modalPanel: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "88%",
    backgroundColor: Colors.surface,
    borderRadius: Radius["3xl"],
    overflow: "hidden",
  },
  modalHeaderImageWrap: { height: 220, width: "100%" },
  modalHeaderImage: { width: "100%", height: "100%", backgroundColor: Colors.border },
  modalHeaderGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: "70%" },
  modalHeaderTextWrap: { position: "absolute", left: Spacing.lg, bottom: Spacing.lg },
  modalName: { fontFamily: FontFamily.extraBold, fontSize: FontSize["6xl"], color: Colors.white },
  modalRole: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.secondaryLight, marginTop: 2 },
  modalCloseBtn: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBody: { padding: Spacing.xl },
  modalPillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.lg },
  modalPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.secondaryTint,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  modalPillAlt: { backgroundColor: "rgba(13, 89, 105, 0.1)" },
  modalPillText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.secondary },

  modalSectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  modalParagraph: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.muted, lineHeight: 20 },

  signatureBox: { borderRadius: Radius["2xl"], padding: Spacing.lg, marginTop: Spacing.xl },
  signatureLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(237,232,208,0.85)",
    marginBottom: 4,
  },
  signatureText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl, color: Colors.bg },
});
