import { Button, Card, EmptyState, FadeInView, PressableScale } from "@/components/ui";
import LocationMapPicker from "@/src/components/LocationMapPicker";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import {
  Address,
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/src/api/addresses";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [label, setLabel] = useState("Home");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to load addresses", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, []),
  );

  const handleAdd = async () => {
    if (!addressLine.trim()) {
      Alert.alert("Required", "Please enter an address.");
      return;
    }
    setSaving(true);
    try {
      await createAddress({
        label: label || "Home",
        address_line: addressLine,
        city: city || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        is_default: addresses.length === 0,
      });
      setModalVisible(false);
      setLabel("Home");
      setAddressLine("");
      setCity("");
      setLatitude(null);
      setLongitude(null);
      loadAddresses();
    } catch {
      Alert.alert("Error", "Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteAddress(id);
          loadAddresses();
        },
      },
    ]);
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    loadAddresses();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.secondary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="location-outline"
                title="No saved addresses yet"
                subtitle="Add an address to speed up checkout next time."
              />
            }
            renderItem={({ item, index }) => (
              <FadeInView index={index}>
                <Card style={styles.addressCard}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>{item.label}</Text>
                    {!!item.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressLine}>{item.address_line}</Text>
                  {item.city && <Text style={styles.addressCity}>{item.city}</Text>}

                  <View style={styles.addressActions}>
                    {!item.is_default && (
                      <PressableScale haptic onPress={() => handleSetDefault(item.id)}>
                        <Text style={styles.actionText}>Set as Default</Text>
                      </PressableScale>
                    )}
                    <PressableScale haptic onPress={() => handleDelete(item.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </PressableScale>
                  </View>
                </Card>
              </FadeInView>
            )}
          />
        )}

        <View style={styles.addButtonWrap}>
          <Button
            title="Add New Address"
            icon={<Ionicons name="add" size={20} color={Colors.bg} />}
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* Add Address Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                    >
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>New Address</Text>
                        <PressableScale haptic onPress={() => setModalVisible(false)}>
                          <Ionicons name="close" size={24} color={Colors.text} />
                        </PressableScale>
                      </View>

                      <Text style={styles.inputLabel}>Label</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Home, Work, etc."
                        placeholderTextColor={Colors.textTertiary}
                        value={label}
                        onChangeText={setLabel}
                        returnKeyType="next"
                      />

                      <Text style={styles.inputLabel}>Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="House #, Street, Area"
                        placeholderTextColor={Colors.textTertiary}
                        value={addressLine}
                        onChangeText={setAddressLine}
                        multiline
                        returnKeyType="next"
                      />

                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Lahore"
                        placeholderTextColor={Colors.textTertiary}
                        value={city}
                        onChangeText={setCity}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />

                      <Text style={styles.inputLabel}>Pin Location</Text>
                      <LocationMapPicker
                        latitude={latitude}
                        longitude={longitude}
                        onLocationChange={({ latitude: lat, longitude: lng, addressText, city: pickedCity }) => {
                          setLatitude(lat);
                          setLongitude(lng);
                          if (addressText) setAddressLine(addressText);
                          if (pickedCity) setCity(pickedCity);
                        }}
                      />

                      <Button
                        title="Save Address"
                        onPress={handleAdd}
                        loading={saving}
                        style={styles.saveButton}
                      />
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: Spacing.lg, flexGrow: 1 },

  addressCard: { marginBottom: Spacing.md },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: 6,
  },
  addressLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  defaultBadge: {
    backgroundColor: Colors.secondaryTint,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  defaultBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.secondary,
  },
  addressLine: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  addressCity: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 2,
  },

  addressActions: { flexDirection: "row", gap: Spacing.xl, marginTop: Spacing.md },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.secondary,
  },
  deleteText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.muted,
  },

  addButtonWrap: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["4xl"],
    color: Colors.secondary,
  },
  inputLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  saveButton: { marginTop: Spacing.xl },
});
