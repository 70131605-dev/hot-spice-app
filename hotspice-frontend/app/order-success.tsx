import { Button, Card } from "@/components/ui";
import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

export default function OrderSuccessScreen() {
  const { orderNumber, subtotal, deliveryFee, discountAmount, couponCode, total } =
    useLocalSearchParams<{
      orderNumber: string;
      subtotal?: string;
      deliveryFee?: string;
      discountAmount?: string;
      couponCode?: string;
      total?: string;
    }>();

  const discount = discountAmount ? Number(discountAmount) : 0;
  const hasSummary = !!subtotal && !!total;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    opacity.value = withSpring(1, { damping: 16 });
    scale.value = withDelay(60, withSpring(1, { damping: 10, stiffness: 140 }));
  }, [opacity, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconCircle, iconStyle]}>
        <Ionicons name="checkmark" size={48} color={Colors.white} />
      </Animated.View>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
      <Text style={styles.subtitle}>
        Your order has been received and is being prepared.
      </Text>

      {hasSummary && (
        <Card variant="flat" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(Number(subtotal))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(Number(deliveryFee))}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount ({couponCode})</Text>
              <Text style={styles.discountValue}>-{formatPrice(discount)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(Number(total))}</Text>
          </View>
        </Card>
      )}

      <Button
        title="Track My Order"
        onPress={() => router.replace("/(tabs)/orders")}
        fullWidth={false}
        style={styles.button}
      />

      <Text style={styles.link} onPress={() => router.replace("/(tabs)")}>
        Back to Home
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    backgroundColor: Colors.surface,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: { fontSize: FontSize["6xl"], fontFamily: FontFamily.extraBold, color: Colors.secondary },
  orderNumber: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.medium,
    color: Colors.muted,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  summaryCard: {
    width: "100%",
    backgroundColor: Colors.bgAlt,
    marginBottom: Spacing["2xl"],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  summaryLabel: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  discountValue: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.success },
  totalLabel: { fontSize: FontSize.xl, fontFamily: FontFamily.extraBold, color: Colors.text },
  totalValue: { fontSize: FontSize.xl, fontFamily: FontFamily.extraBold, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  button: {
    alignSelf: "center",
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing["3xl"],
  },
  link: { color: Colors.secondary, fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
});
