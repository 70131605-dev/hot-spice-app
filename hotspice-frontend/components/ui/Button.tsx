import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { PressableScale } from "./PressableScale";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <PressableScale
      haptic
      scaleTo={0.97}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth ? { alignSelf: "stretch" } : { alignSelf: "flex-start" },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text.color as string} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, sizeStyle.text, variantStyle.text, textStyle]}>{title}</Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: Radius.lg,
  },
  text: {
    fontFamily: FontFamily.bold,
  },
});

const sizeStyles = {
  md: StyleSheet.create({
    container: { paddingVertical: 12, paddingHorizontal: Spacing.lg },
    text: { fontSize: FontSize.md },
  }),
  lg: StyleSheet.create({
    container: { paddingVertical: 16, paddingHorizontal: Spacing.xl },
    text: { fontSize: FontSize.xl },
  }),
};

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: Colors.primary },
    text: { color: Colors.bg },
  }),
  dark: StyleSheet.create({
    container: { backgroundColor: Colors.dark },
    text: { color: Colors.white },
  }),
  outline: StyleSheet.create({
    container: { backgroundColor: Colors.bg, borderWidth: 1.5, borderColor: Colors.secondary },
    text: { color: Colors.secondary },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: "transparent" },
    text: { color: Colors.secondary },
  }),
};
