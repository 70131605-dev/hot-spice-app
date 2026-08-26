import { EmptyState, FadeInView, PressableScale, useToast } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import {
  Category,
  getCategories,
  getMenuItems,
  MenuItem,
} from "@/src/api/menu";
import { useCart } from "@/src/context/CartContext";
import { useFavorites } from "@/src/context/FavoritesContext";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  burgers: "fast-food",
  combos: "restaurant",
  chicken: "flame",
  beverages: "cafe",
  desserts: "ice-cream",
};

function CategoryPill({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.surface, Colors.secondary],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.border, Colors.secondary],
    ),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [Colors.text, Colors.bg]),
  }));

  return (
    <PressableScale haptic onPress={onPress}>
      <Animated.View style={[styles.pill, containerStyle]}>
        <Ionicons name={icon} size={15} color={active ? Colors.bg : Colors.secondary} />
        <Animated.Text style={[styles.pillText, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

function ItemCard({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onAdd,
}: {
  item: MenuItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
}) {
  return (
    <FadeInView index={index} style={styles.cardWrap}>
      <PressableScale
        onPress={() =>
          router.push({ pathname: "/item/[id]", params: { id: String(item.id) } })
        }
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primary, Colors.secondary]}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.itemCard}
        >
          <View style={styles.itemImageWrap}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <Ionicons name="fast-food-outline" size={40} color="rgba(237,232,208,0.75)" />
            )}
            <PressableScale
              haptic
              scaleTo={0.8}
              style={styles.favoriteButton}
              onPress={onToggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={16}
                color={isFavorite ? Colors.secondary : Colors.white}
              />
            </PressableScale>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.description ? (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            <View style={styles.itemFooter}>
              <View style={styles.priceBadge}>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
              </View>
              <PressableScale haptic style={styles.addButton} onPress={onAdd}>
                <Ionicons name="add" size={20} color={Colors.bg} />
              </PressableScale>
            </View>
          </View>
        </LinearGradient>
      </PressableScale>
    </FadeInView>
  );
}

export default function MenuScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setSelectedCategoryId(params.categoryId ? Number(params.categoryId) : null);
  }, [params.categoryId]);

  useEffect(() => {
    setLoading(true);
    getMenuItems(selectedCategoryId ?? undefined)
      .then(setMenuItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return menuItems;
    return menuItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [menuItems, searchQuery]);

  const renderItem = useCallback(
    ({ item, index }: { item: MenuItem; index: number }) => (
      <ItemCard
        item={item}
        index={index}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={() => toggleFavorite(item)}
        onAdd={() => {
          addToCart(item);
          showToast(`${item.name} added to cart`, { icon: "cart", position: "bottom" });
        }}
      />
    ),
    [isFavorite, toggleFavorite, addToCart, showToast],
  );

  const listHeader = (
    <View style={styles.stickyHeader}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={17} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search the menu..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <PressableScale onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </PressableScale>
        ) : null}
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.categoryList}
        ListHeaderComponent={
          <CategoryPill
            label="All"
            icon="apps"
            active={selectedCategoryId === null}
            onPress={() => setSelectedCategoryId(null)}
          />
        }
        renderItem={({ item }) => (
          <CategoryPill
            label={item.name}
            icon={CATEGORY_ICONS[item.slug] ?? "fast-food"}
            active={selectedCategoryId === item.id}
            onPress={() => setSelectedCategoryId(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.sm }} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Our Menu</Text>
        </View>

        <FlatList
          data={loading ? [] : filteredItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.itemList}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 40 }} />
            ) : (
              <EmptyState
                icon="fast-food-outline"
                title="No items found"
                subtitle="Try a different search or category."
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize["6xl"], fontFamily: FontFamily.extraBold, color: Colors.secondary },

  stickyHeader: { backgroundColor: Colors.bg, paddingBottom: Spacing.md },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    padding: 0,
  },

  categoryList: { paddingHorizontal: Spacing.lg },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
  },

  itemList: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing["2xl"] },
  cardWrap: { marginBottom: Spacing.md },
  itemCard: {
    flexDirection: "row",
    borderRadius: Radius.xl,
    padding: Spacing.md,
    ...Shadows.card,
  },
  itemImageWrap: {
    width: 108,
    height: 108,
    borderRadius: Radius["2xl"],
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  itemImage: { width: "100%", height: "100%" },
  favoriteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: { flex: 1, justifyContent: "space-between" },
  itemName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.bg },
  itemDescription: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: "rgba(237,232,208,0.85)",
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  itemPrice: { fontSize: FontSize.base, fontFamily: FontFamily.extraBold, color: Colors.secondary },
  addButton: {
    backgroundColor: Colors.secondary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
