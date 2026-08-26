import { Button, Card, PressableScale } from "@/components/ui";
import LocationMapPicker from "@/src/components/LocationMapPicker";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { Address, getAddresses } from "@/src/api/addresses";
import { placeOrder } from "@/src/api/orders";
import { useCart } from "@/src/context/CartContext";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DELIVERY_FEE = 150;

function SegmentedOption({
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
      [Colors.secondary, Colors.secondary],
    ),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [Colors.secondary, Colors.bg]),
  }));

  return (
    <PressableScale haptic onPress={onPress} style={{ flex: 1 }}>
      <Animated.View style={[styles.segment, containerStyle]}>
        <Ionicons name={icon} size={18} color={active ? Colors.bg : Colors.secondary} />
        <Animated.Text style={[styles.segmentText, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = totalPrice + deliveryFee;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddressText, setNewAddressText] = useState("");
  const [newAddressLat, setNewAddressLat] = useState<number | null>(null);
  const [newAddressLng, setNewAddressLng] = useState<number | null>(null);

  useEffect(() => {
    getAddresses()
      .then((data) => {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.is_default) ?? data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      })
      .catch(console.error);
  }, []);

  const handlePlaceOrder = async () => {
    if (orderType === "delivery") {
      if (useNewAddress && !newAddressText.trim()) {
        Alert.alert("Address Required", "Please enter a delivery address.");
        return;
      }
      if (!useNewAddress && !selectedAddressId) {
        Alert.alert(
          "Address Required",
          "Please select or add a delivery address.",
        );
        return;
      }
    }
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    const deliveryAddress = useNewAddress
      ? newAddressText.trim()
      : selectedAddress?.address_line;

    setCouponError("");
    setLoading(true);
    try {
      const order = await placeOrder({
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        notes: notes || undefined,
        cartItems: items,
        couponCode: couponCode.trim() || undefined,
      });
      clearCart();
      router.replace({
        pathname: "/order-success",
        params: {
          orderNumber: order.order_number,
          subtotal: order.subtotal,
          deliveryFee: order.delivery_fee,
          discountAmount: order.discount_amount,
          couponCode: order.coupon_code ?? "",
          total: order.total,
        },
      });
    } catch (error: any) {
      const couponMessage = error.response?.data?.errors?.coupon_code?.[0];
      if (couponMessage) {
        setShowCoupon(true);
        setCouponError(couponMessage);
        return;
      }
      const message =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      Alert.alert("Order Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Order Type</Text>
      <View style={styles.orderTypeRow}>
        <SegmentedOption
          label="Delivery"
          icon="bicycle"
          active={orderType === "delivery"}
          onPress={() => setOrderType("delivery")}
        />
        <SegmentedOption
          label="Pickup"
          icon="storefront"
          active={orderType === "pickup"}
          onPress={() => setOrderType("pickup")}
        />
      </View>

      {orderType === "delivery" && (
        <>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          {addresses.map((addr) => {
            const selected = !useNewAddress && selectedAddressId === addr.id;
            return (
              <PressableScale
                key={addr.id}
                haptic
                style={[styles.addressOption, selected && styles.addressOptionSelected]}
                onPress={() => {
                  setUseNewAddress(false);
                  setSelectedAddressId(addr.id);
                }}
              >
                <Ionicons
                  name={selected ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={Colors.secondary}
                />
                <View style={{ flex: 1, marginLeft: Spacing.sm + 2 }}>
                  <Text style={styles.addressOptionLabel}>{addr.label}</Text>
                  <Text style={styles.addressOptionText}>{addr.address_line}</Text>
                </View>
              </PressableScale>
            );
          })}

          <PressableScale
            haptic
            style={[styles.addressOption, useNewAddress && styles.addressOptionSelected]}
            onPress={() => setUseNewAddress(true)}
          >
            <Ionicons
              name={useNewAddress ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={Colors.secondary}
            />
            <Text style={[styles.addressOptionLabel, { marginLeft: Spacing.sm + 2 }]}>
              Use a different address
            </Text>
          </PressableScale>

          {useNewAddress && (
            <>
              <TextInput
                style={[styles.input, { marginTop: Spacing.sm }]}
                placeholder="House #, Street, Area, City"
                placeholderTextColor={Colors.textTertiary}
                value={newAddressText}
                onChangeText={setNewAddressText}
                multiline
              />
              <LocationMapPicker
                latitude={newAddressLat}
                longitude={newAddressLng}
                onLocationChange={({ latitude: lat, longitude: lng, addressText }) => {
                  setNewAddressLat(lat);
                  setNewAddressLng(lng);
                  if (addressText) setNewAddressText(addressText);
                }}
              />
            </>
          )}

          {addresses.length === 0 && !useNewAddress && (
            <PressableScale
              haptic
              style={styles.addAddressPrompt}
              onPress={() => router.push("/addresses")}
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.secondary} />
              <Text style={styles.addAddressPromptText}>
                Save an address for next time
              </Text>
            </PressableScale>
          )}
        </>
      )}

      <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g. Extra spicy, no onions..."
        placeholderTextColor={Colors.textTertiary}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {showCoupon ? (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(180)}
          layout={LinearTransition}
        >
          <Text style={styles.sectionTitle}>Coupon Code</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g. SAVE20"
            placeholderTextColor={Colors.textTertiary}
            value={couponCode}
            onChangeText={(text) => {
              setCouponCode(text);
              setCouponError("");
            }}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
        </Animated.View>
      ) : (
        <PressableScale
          haptic
          style={styles.couponToggle}
          onPress={() => setShowCoupon(true)}
        >
          <Ionicons name="pricetag-outline" size={16} color={Colors.secondary} />
          <Text style={styles.couponToggleText}>Have a coupon?</Text>
        </PressableScale>
      )}

      <Text style={styles.sectionTitle}>Order Summary</Text>
      <Card variant="card" style={styles.summaryCard}>
        {items.map((item) => (
          <View key={item.menuItem.id} style={styles.summaryRow}>
            <Text style={styles.summaryItemName}>
              {item.quantity}x {item.menuItem.name}
            </Text>
            <Text style={styles.summaryItemPrice}>
              {formatPrice(Number(item.menuItem.price) * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </Card>

      <Button
        title={`Place Order — ${formatPrice(total)}`}
        onPress={handlePlaceOrder}
        loading={loading}
        style={{ marginTop: Spacing["2xl"] }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm + 2,
  },
  addAddressPrompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderStyle: "dashed",
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
  },
  addAddressPromptText: { color: Colors.secondary, fontFamily: FontFamily.semiBold, fontSize: FontSize.md },

  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  addressOptionSelected: { borderColor: Colors.secondary, backgroundColor: Colors.secondaryTint },
  addressOptionLabel: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.text },
  addressOptionText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },

  orderTypeRow: { flexDirection: "row", gap: Spacing.md },
  segment: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md - 2,
  },
  segmentText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    minHeight: 48,
  },

  couponToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.xl,
  },
  couponToggleText: { color: Colors.secondary, fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  couponError: { color: Colors.secondary, fontSize: FontSize.sm, fontFamily: FontFamily.medium, marginTop: 6 },

  summaryCard: {},
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  summaryItemName: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, flex: 1 },
  summaryItemPrice: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.text },
  summaryLabel: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  totalLabel: { fontSize: FontSize.xl, fontFamily: FontFamily.extraBold, color: Colors.text },
  totalValue: { fontSize: FontSize.xl, fontFamily: FontFamily.extraBold, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
});
