import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
import { PressableScale } from "@/components/ui/PressableScale";
import { reverseGeocode, type PickedLocation } from "@/src/utils/geocode";

// Lahore, Pakistan — matches the restaurant's location shown elsewhere in the app.
const DEFAULT_REGION: Region = {
  latitude: 31.5204,
  longitude: 74.3587,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: PickedLocation) => void;
}

export default function LocationMapPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationMapPickerProps) {
  const mapRef = useRef<MapView>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const hasPin = latitude != null && longitude != null;
  const region: Region = hasPin
    ? { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : DEFAULT_REGION;

  const applyLocation = async (lat: number, lng: number) => {
    const { addressText, city } = await reverseGeocode(lat, lng);
    onLocationChange({ latitude: lat, longitude: lng, addressText, city });
  };

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    applyLocation(lat, lng);
  };

  const useCurrentLocation = async () => {
    setError("");
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied. You can still drop a pin on the map.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lng } = position.coords;
      mapRef.current?.animateToRegion(
        { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        400,
      );
      await applyLocation(lat, lng);
    } catch {
      setError("Couldn't get your current location. Try dropping a pin instead.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {hasPin && <Marker coordinate={{ latitude, longitude }} pinColor={Colors.secondary} />}
        </MapView>

        <PressableScale
          haptic
          style={styles.locateButton}
          onPress={useCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" color={Colors.secondary} />
          ) : (
            <Ionicons name="locate" size={20} color={Colors.secondary} />
          )}
        </PressableScale>
      </View>

      <Text style={styles.hint}>
        {hasPin ? "Tap the map to move the pin, or use your current location." : "Tap the map to drop a pin, or use your current location."}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.sm },
  mapWrap: {
    height: 220,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locateButton: {
    position: "absolute",
    right: Spacing.md,
    bottom: Spacing.md,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  hint: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  error: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.secondary,
    marginTop: 4,
  },
});