import { Button, FadeInView, useToast } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      await updateUser(name.trim(), email.trim(), phone.trim());
      showToast("Profile updated successfully");
      router.back();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 000-0000"
            placeholderTextColor={Colors.textTertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />
        </FadeInView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  error: {
    fontFamily: FontFamily.medium,
    color: Colors.secondary,
    fontSize: FontSize.base,
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    marginBottom: Spacing.lg,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  saveButton: { marginTop: Spacing.sm },
});
