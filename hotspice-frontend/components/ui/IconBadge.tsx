import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface IconBadgeProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

/** The circular teal-tinted icon badge used constantly on the site
 * (category tiles, "why choose us" icons, contact rows, etc.) — structural
 * icons default to teal; pass explicit `color`/`backgroundColor` props for
 * an orange badge in a menu/featured/highlight context. */
export function IconBadge({
  name,
  size = 52,
  iconSize,
  color = Colors.secondary,
  backgroundColor = Colors.secondaryTint,
  style,
}: IconBadgeProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Ionicons name={name} size={iconSize ?? size * 0.5} color={color} />
    </View>
  );
}
