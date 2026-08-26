import { FadeInView, PressableScale } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { galleryCategories, galleryItems, type GalleryItem } from "@/src/data/galleryData";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

/** Deterministic pseudo-height per item so the masonry has visual variety
 * without needing real image dimensions (the site relies on real photo
 * aspect ratios via CSS columns; RN has no equivalent). */
function pseudoHeight(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return 140 + (hash % 81); // 140-220
}

function distributeColumns(items: GalleryItem[]) {
  const left: GalleryItem[] = [];
  const right: GalleryItem[] = [];
  let leftHeight = 0;
  let rightHeight = 0;
  for (const item of items) {
    const h = pseudoHeight(item.id);
    if (leftHeight <= rightHeight) {
      left.push(item);
      leftHeight += h;
    } else {
      right.push(item);
      rightHeight += h;
    }
  }
  return { left, right };
}

export default function GalleryScreen() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeCategory === "all" ? galleryItems : galleryItems.filter((i) => i.category === activeCategory)),
    [activeCategory]
  );

  const { left, right } = useMemo(() => distributeColumns(filtered), [filtered]);

  const openLightbox = (item: GalleryItem) => {
    const idx = filtered.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const nextItem = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  const tileWidth = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / 2;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <Text style={styles.eyebrow}>Visual Journey</Text>
          <Text style={styles.title}>Our Gallery</Text>
        </FadeInView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={{ marginBottom: Spacing.lg }}
        >
          {galleryCategories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <PressableScale
                key={cat.id}
                haptic
                scaleTo={0.94}
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{cat.label}</Text>
              </PressableScale>
            );
          })}
        </ScrollView>

        <View style={styles.masonryRow}>
          <View style={{ width: tileWidth, gap: Spacing.md }}>
            {left.map((item, i) => (
              <GalleryTile key={item.id} item={item} index={i * 2} width={tileWidth} onPress={() => openLightbox(item)} />
            ))}
          </View>
          <View style={{ width: tileWidth, gap: Spacing.md }}>
            {right.map((item, i) => (
              <GalleryTile
                key={item.id}
                item={item}
                index={i * 2 + 1}
                width={tileWidth}
                onPress={() => openLightbox(item)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={lightboxIndex !== null} transparent animationType="none" onRequestClose={closeLightbox}>
        {lightboxIndex !== null ? (
          <Animated.View entering={FadeIn.duration(220)} style={styles.lightboxBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeLightbox} />

            <PressableScale haptic onPress={closeLightbox} style={styles.lightboxCloseBtn}>
              <Ionicons name="close" size={22} color={Colors.white} />
            </PressableScale>

            <PressableScale haptic onPress={prevItem} style={[styles.lightboxNavBtn, styles.lightboxNavLeft]}>
              <Ionicons name="chevron-back" size={24} color={Colors.white} />
            </PressableScale>

            <View style={styles.lightboxImageWrap} pointerEvents="box-none">
              <Image
                source={{ uri: filtered[lightboxIndex].src }}
                style={styles.lightboxImage}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
              <Text style={styles.lightboxCaption}>{filtered[lightboxIndex].alt}</Text>
            </View>

            <PressableScale haptic onPress={nextItem} style={[styles.lightboxNavBtn, styles.lightboxNavRight]}>
              <Ionicons name="chevron-forward" size={24} color={Colors.white} />
            </PressableScale>

            <Text style={styles.lightboxCounter}>
              {lightboxIndex + 1} / {filtered.length}
            </Text>
          </Animated.View>
        ) : null}
      </Modal>
    </View>
  );
}

function GalleryTile({
  item,
  index,
  width,
  onPress,
}: {
  item: GalleryItem;
  index: number;
  width: number;
  onPress: () => void;
}) {
  const height = pseudoHeight(item.id);
  return (
    <FadeInView index={index}>
      <PressableScale haptic scaleTo={0.96} onPress={onPress} style={[styles.tile, { width, height }]}>
        <Image source={{ uri: item.src }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.75)"]} style={styles.tileGradient}>
          <Text style={styles.tileCaption} numberOfLines={1}>
            {item.alt}
          </Text>
        </LinearGradient>
      </PressableScale>
    </FadeInView>
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
    marginBottom: Spacing.lg,
  },

  filterRow: { gap: Spacing.sm, paddingRight: Spacing.lg },
  filterPill: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  filterPillActive: { backgroundColor: Colors.secondary },
  filterPillText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.text },
  filterPillTextActive: { color: Colors.bg },

  masonryRow: { flexDirection: "row", gap: Spacing.md },

  tile: {
    borderRadius: Radius["2xl"],
    overflow: "hidden",
    backgroundColor: Colors.border,
  },
  tileGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop: 24,
  },
  tileCaption: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.white },

  lightboxBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxCloseBtn: {
    position: "absolute",
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  lightboxNavBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  lightboxNavLeft: { left: 12 },
  lightboxNavRight: { right: 12 },
  lightboxImageWrap: { width: "100%", paddingHorizontal: 64, alignItems: "center" },
  lightboxImage: { width: "100%", height: 420 },
  lightboxCaption: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    marginTop: Spacing.md,
  },
  lightboxCounter: {
    position: "absolute",
    bottom: 40,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.45)",
  },
});
