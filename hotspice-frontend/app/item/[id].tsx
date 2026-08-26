import { Button, PressableScale, Stepper } from "@/components/ui";
import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { getMenuItems, MenuItem } from "@/src/api/menu";
import { useCart } from "@/src/context/CartContext";
import { useFavorites } from "@/src/context/FavoritesContext";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    getMenuItems()
      .then((items) => {
        const found = items.find((i) => i.id === Number(id));
        setItem(found ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Item not found</Text>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(item);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn.duration(350)} style={styles.imageWrap}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <Ionicons name="fast-food-outline" size={64} color={Colors.borderStrong} />
          )}
          <PressableScale
            haptic
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite(item.id) ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite(item.id) ? Colors.secondary : Colors.white}
            />
          </PressableScale>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(400).springify().damping(18)}
          style={styles.details}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>

          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <Stepper
              value={quantity}
              min={1}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Add to Cart — ${formatPrice(Number(item.price) * quantity)}`}
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  notFoundText: { fontSize: FontSize.lg, fontFamily: FontFamily.medium, color: Colors.muted },

  content: { paddingBottom: 24 },
  imageWrap: {
    width: "100%",
    height: 340,
    backgroundColor: Colors.bgMuted,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  details: { padding: Spacing.xl },
  name: { fontSize: FontSize["7xl"], fontFamily: FontFamily.extraBold, color: Colors.text },
  price: { fontSize: FontSize["4xl"], fontFamily: FontFamily.extraBold, color: Colors.secondary, marginTop: Spacing.xs },
  description: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: Spacing.lg,
  },

  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing["2xl"] + 4,
  },
  quantityLabel: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text },

  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});
