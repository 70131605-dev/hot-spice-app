import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface StatusPillProps {
  status: keyof typeof Colors.status | string;
}

export function StatusPill({ status }: StatusPillProps) {
  const color = (Colors.status as Record<string, string>)[status] ?? Colors.muted;
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.text}>{LABELS[status] ?? status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.lg,
  },
  text: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
});
