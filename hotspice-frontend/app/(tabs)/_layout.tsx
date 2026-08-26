import { Colors, FontFamily, FontSize, Radius } from "@/constants/theme";
import { useCart } from "@/src/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({
  name,
  focusedName,
  color,
  focused,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  badge?: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.08 : 1, { damping: 12, stiffness: 260 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.iconWrap, focused && styles.iconWrapActive, animatedStyle]}>
      <Ionicons name={focused ? focusedName : name} size={22} color={color} />
      {badge !== undefined && badge > 0 && <CartBadge count={badge} />}
    </Animated.View>
  );
}

function CartBadge({ count }: { count: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.35, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
  }, [count, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.badge, animatedStyle]}>
      <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
    </Animated.View>
  );
}

function CartIcon({ color, focused }: { color: string; focused: boolean }) {
  const { totalItems } = useCart();
  return <TabIcon name="cart-outline" focusedName="cart" color={color} focused={focused} badge={totalItems} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textQuaternary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          { height: 58 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) },
        ],
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" focusedName="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="restaurant-outline" focusedName="restaurant" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => <CartIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="receipt-outline" focusedName="receipt" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" focusedName="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    ...Platform.select({ android: { paddingTop: 6 } }),
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  iconWrap: {
    width: 40,
    height: 30,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapActive: {
    backgroundColor: Colors.secondaryTint,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    minWidth: 17,
    height: 17,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  badgeText: {
    color: Colors.bg,
    fontSize: 9,
    fontFamily: FontFamily.bold,
  },
});
