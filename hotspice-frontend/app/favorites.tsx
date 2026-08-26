import { Card, EmptyState, FadeInView, PressableScale } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useFavorites } from "@/src/context/FavoritesContext";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No Favorites"
            subtitle="Items you love will show up here."
            actionLabel="EXPLORE MENU"
            onAction={() => router.push("/(tabs)/menu")}
          />
        }
        renderItem={({ item, index }) => (
          <FadeInView index={index}>
            <Card gradient style={styles.itemCard}>
              <View style={styles.cardLeft}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>

                <PressableScale
                  haptic
                  style={styles.detailsLink}
                  onPress={() => router.push(`/item/${item.id}`)}
                >
                  <Text style={styles.detailsLinkText}>VIEW DETAILS</Text>
                  <View style={styles.detailsArrowCircle}>
                    <Ionicons name="arrow-forward" size={12} color={Colors.bg} />
                  </View>
                </PressableScale>

                <View style={styles.priceBadge}>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <PressableScale
                  haptic
                  style={styles.favoriteBadge}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons name="heart" size={18} color={Colors.secondary} />
                </PressableScale>

                <View style={styles.cardImageWrap}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons name="fast-food-outline" size={28} color="rgba(237,232,208,0.75)" />
                  )}
                </View>
              </View>
            </Card>
          </FadeInView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: Spacing.lg, flexGrow: 1 },

  itemCard: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  cardLeft: { flex: 1, justifyContent: "space-between", paddingRight: Spacing.md },
  itemName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["2xl"],
    color: Colors.bg,
  },
  priceBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  itemPrice: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.base,
    color: Colors.secondary,
  },

  detailsLink: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  detailsLinkText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.sm,
    color: Colors.bg,
    letterSpacing: 0.3,
  },
  detailsArrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  cardRight: { justifyContent: "space-between", alignItems: "flex-end" },
  favoriteBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: "100%" },
});
