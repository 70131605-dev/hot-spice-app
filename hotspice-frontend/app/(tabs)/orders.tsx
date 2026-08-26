import { Card, EmptyState, FadeInView, StatusPill } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { getMyOrders, Order } from "@/src/api/orders";
import { formatDate, formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload every time this tab is focused, so a just-placed order shows up immediately
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.secondary}
              colors={[Colors.secondary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No orders yet"
              subtitle="Your placed orders will show up here."
            />
          }
          renderItem={({ item, index }) => (
            <FadeInView index={index}>
              <Card style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>#{item.order_number}</Text>
                  <StatusPill status={item.status} />
                </View>

                <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>

                <View style={styles.divider} />

                {item.items.map((orderItem) => (
                  <View key={orderItem.id} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {orderItem.quantity}x {orderItem.item_name}
                    </Text>
                    <Text style={styles.itemPrice}>{formatPrice(orderItem.line_total)}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <View style={styles.orderTypeBadge}>
                    <Ionicons
                      name={item.order_type === "delivery" ? "bicycle" : "storefront-outline"}
                      size={14}
                      color={Colors.secondary}
                    />
                    <Text style={styles.orderTypeLabel}>
                      {item.order_type === "delivery" ? "Delivery" : "Pickup"}
                    </Text>
                  </View>
                  <Text style={styles.totalText}>{formatPrice(item.total)}</Text>
                </View>
              </Card>
            </FadeInView>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["7xl"],
    color: Colors.secondary,
  },

  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, flexGrow: 1 },
  orderCard: { marginBottom: Spacing.md },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  orderDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 4,
  },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    flex: 1,
  },
  itemPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.secondaryTint,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  orderTypeLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.secondaryDark,
  },
  totalText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
});
