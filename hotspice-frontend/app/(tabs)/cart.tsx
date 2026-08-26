import { Button, EmptyState, PressableScale, Stepper } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { CartItem, useCart } from "@/src/context/CartContext";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeOutRight, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useCart();

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <Animated.View exiting={FadeOutRight.duration(250)} layout={LinearTransition}>
        <LinearGradient
          colors={[Colors.primary, Colors.primary, Colors.secondary]}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cartItem}
        >
          <View style={styles.itemImageWrap}>
            {item.menuItem.image ? (
              <Image
                source={{ uri: item.menuItem.image }}
                style={styles.itemImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <Ionicons name="fast-food-outline" size={34} color="rgba(237,232,208,0.75)" />
            )}
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.menuItem.name}
            </Text>
            <View style={styles.priceBadge}>
              <Text style={styles.itemPrice}>{formatPrice(item.menuItem.price)}</Text>
            </View>

            <Stepper
              size="sm"
              light
              value={item.quantity}
              onDecrement={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              onIncrement={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
            />
          </View>

          <PressableScale
            haptic
            style={styles.removeButton}
            onPress={() => removeFromCart(item.menuItem.id)}
          >
            <Ionicons name="trash-outline" size={18} color="rgba(237,232,208,0.9)" />
          </PressableScale>
        </LinearGradient>
      </Animated.View>
    ),
    [updateQuantity, removeFromCart],
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            subtitle="Add something delicious from the menu."
            actionLabel="Browse Menu"
            onAction={() => router.push("/(tabs)/menu")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSubtitle}>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.menuItem.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <Button
            title="Proceed to Checkout"
            onPress={() => router.push("/checkout")}
            style={{ backgroundColor: Colors.bg }}
            textStyle={{ color: Colors.secondary }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  emptyContainer: { flex: 1, justifyContent: "center" },

  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize["6xl"], fontFamily: FontFamily.extraBold, color: Colors.secondary },
  headerSubtitle: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.muted, marginTop: 2 },

  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  cartItem: {
    flexDirection: "row",
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadows.card,
  },
  itemImageWrap: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  itemImage: { width: "100%", height: "100%" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.bg },
  priceBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  itemPrice: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    color: Colors.secondary,
  },

  removeButton: { padding: Spacing.sm },

  footer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  totalLabel: { fontSize: FontSize.lg, fontFamily: FontFamily.regular, color: "rgba(237,232,208,0.9)" },
  totalValue: { fontSize: FontSize["4xl"], fontFamily: FontFamily.extraBold, color: Colors.bg },
});
