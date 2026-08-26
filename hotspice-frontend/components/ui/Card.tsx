import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  variant?: "card" | "warm" | "flat";
  /** Renders the orange→teal brand gradient (60% orange / 40% teal) instead
   * of the plain white surface — used for content tiles that carry the
   * orange "menu card" treatment. Don't also pass a `backgroundColor`
   * override in `style` when this is set. */
  gradient?: boolean;
}

/** The rounded card w/ soft shadow used everywhere on the site
 * (`bg-white rounded-2xl shadow-warm`), or the orange→teal brand gradient
 * card when `gradient` is set. */
export function Card({
  children,
  style,
  padding = Spacing.lg,
  variant = "warm",
  gradient = false,
}: CardProps) {
  const shadow = variant === "flat" ? {} : variant === "warm" ? Shadows.warm : Shadows.card;
  const baseStyle = { borderRadius: Radius["2xl"], padding };

  if (gradient) {
    return (
      <LinearGradient
        colors={[Colors.primary, Colors.primary, Colors.secondary]}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, shadow, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        { backgroundColor: Colors.surface, ...baseStyle },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
