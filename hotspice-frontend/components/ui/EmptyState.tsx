import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "./Button";
import { IconBadge } from "./IconBadge";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <IconBadge name={icon} size={88} iconSize={40} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} fullWidth={false} style={styles.button} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    paddingHorizontal: Spacing["2xl"],
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize["4xl"],
    color: Colors.secondary,
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing["3xl"],
  },
});
