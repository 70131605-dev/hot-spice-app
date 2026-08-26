import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { PressableScale } from "./PressableScale";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  onAction?: () => void;
  actionLabel?: string;
  light?: boolean; // for use on dark section backgrounds
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

/** The "eyebrow + title (+ optional subtitle / View All action)" pattern
 * repeated at the top of nearly every section on the site. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  onAction,
  actionLabel = "View All",
  light = false,
  style,
  titleStyle,
}: SectionHeaderProps) {
  const textAlign = align === "center" ? "center" : "left";
  return (
    <View
      style={[
        styles.row,
        align === "center" && { alignItems: "center" },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { textAlign, color: light ? Colors.secondaryLight : Colors.secondary }]}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[styles.title, { textAlign, color: light ? Colors.bg : Colors.secondary }, titleStyle]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { textAlign, color: light ? "rgba(255,255,255,0.6)" : Colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onAction ? (
        <PressableScale onPress={onAction} haptic>
          <Text style={[styles.action, { color: light ? Colors.secondaryLight : Colors.secondary }]}>{actionLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    lineHeight: 19,
  },
  action: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
});
