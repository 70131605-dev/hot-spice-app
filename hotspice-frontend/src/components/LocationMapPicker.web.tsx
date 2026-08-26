import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { PressableScale } from "@/components/ui/PressableScale";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { reverseGeocode, type PickedLocation } from "@/src/utils/geocode";

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: PickedLocation) => void;
}

// react-native-maps has no web renderer, so the web build shows a lightweight
// fallback: real-time geolocation still works (via the browser's Geolocation
// API through expo-location), just without the visual map — that's available
// on the iOS/Android app.
export default function LocationMapPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationMapPickerProps) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const hasPin = latitude != null && longitude != null;

  const useCurrentLocation = async () => {
    setError("");
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lng } = position.coords;
      const { addressText, city } = await reverseGeocode(lat, lng);
      onLocationChange({ latitude: lat, longitude: lng, addressText, city });
    } catch {
      setError("Couldn't get your current location.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.placeholder}>
        <Ionicons name="map-outline" size={26} color={Colors.mutedLight} />
        <Text style={styles.placeholderText}>
          {hasPin
            ? `Pin set at ${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
            : "Map preview is available in the mobile app"}
        </Text>
      </View>

      <PressableScale
        haptic
        style={styles.locateRow}
        onPress={useCurrentLocation}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator size="small" color={Colors.secondary} />
        ) : (
          <Ionicons name="locate" size={18} color={Colors.secondary} />
        )}
        <Text style={styles.locateText}>Use My Current Location</Text>
      </PressableScale>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.sm },
  placeholder: {
    height: 140,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: Colors.bgMuted,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  placeholderText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textTertiary,
    textAlign: "center",
  },
  locateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md - 2,
  },
  locateText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.secondary,
  },
  error: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.secondary,
    marginTop: 6,
  },
});