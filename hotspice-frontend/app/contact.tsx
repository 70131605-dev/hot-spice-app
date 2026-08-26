import { Button, Card, FadeInView, IconBadge, PressableScale, useToast } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PHONE = "042-111-000-111";
const EMAIL = "support@hotandspice.pk";
const ADDRESS = "Lahore, Pakistan";

const HOURS = [
  { day: "Monday – Friday", time: "11:00 AM – 11:00 PM" },
  { day: "Saturday", time: "10:00 AM – 12:00 AM" },
  { day: "Sunday", time: "10:00 AM – 10:00 PM" },
];

const SUBJECTS = ["Reservation", "Private Event", "Catering", "Feedback", "Other"];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactScreen() {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.subject) next.subject = "Please select a subject";
    if (!form.message.trim() || form.message.trim().length < 20)
      next.message = "Message must be at least 20 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setForm(INITIAL_FORM);
    showToast("Message sent! We'll get back to you soon.");
  };

  const openDirections = () => {
    Linking.openURL("https://www.google.com/maps?q=Lahore,+Pakistan");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FadeInView>
          <Text style={styles.eyebrow}>Get In Touch</Text>
          <Text style={styles.title}>Contact Us</Text>
        </FadeInView>

        <FadeInView index={1}>
          <PressableScale haptic onPress={openDirections}>
            <Card variant="warm" style={styles.infoRow}>
              <IconBadge name="location-outline" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{ADDRESS}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </Card>
          </PressableScale>
        </FadeInView>

        <FadeInView index={2}>
          <PressableScale haptic onPress={() => Linking.openURL(`tel:${PHONE.replace(/-/g, "")}`)}>
            <Card variant="warm" style={styles.infoRow}>
              <IconBadge name="call-outline" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{PHONE}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </Card>
          </PressableScale>
        </FadeInView>

        <FadeInView index={3}>
          <PressableScale haptic onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>
            <Card variant="warm" style={styles.infoRow}>
              <IconBadge name="mail-outline" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{EMAIL}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </Card>
          </PressableScale>
        </FadeInView>

        <FadeInView index={4}>
          <View style={styles.hoursCard}>
            <View style={styles.hoursHeader}>
              <Ionicons name="time-outline" size={16} color={Colors.secondary} />
              <Text style={styles.hoursTitle}>Business Hours</Text>
            </View>
            {HOURS.map((h) => (
              <View key={h.day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{h.day}</Text>
                <Text style={styles.hoursTime}>{h.time}</Text>
              </View>
            ))}
          </View>
        </FadeInView>

        <FadeInView index={5}>
          <Card variant="warm" style={styles.directionsCard}>
            <Text style={styles.directionsTitle}>Find Us</Text>
            <Text style={styles.directionsText}>
              Visit us in {ADDRESS}. Tap below to open directions in your maps app.
            </Text>
            <Button
              title="Get Directions"
              variant="outline"
              onPress={openDirections}
              icon={<Ionicons name="navigate-outline" size={17} color={Colors.secondary} />}
            />
          </Card>
        </FadeInView>

        <FadeInView index={6}>
          <Card variant="warm" style={styles.formCard}>
            <View style={styles.formHeaderRow}>
              <IconBadge name="chatbubble-ellipses-outline" />
              <Text style={styles.formTitle}>Send Us a Message</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="John Doe"
                placeholderTextColor={Colors.textTertiary}
                value={form.name}
                onChangeText={(v) => update("name", v)}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="john@example.com"
                placeholderTextColor={Colors.textTertiary}
                value={form.email}
                onChangeText={(v) => update("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Subject *</Text>
              <View style={styles.subjectWrap}>
                {SUBJECTS.map((s) => {
                  const active = form.subject === s;
                  return (
                    <PressableScale
                      key={s}
                      haptic
                      scaleTo={0.94}
                      onPress={() => update("subject", s)}
                      style={[styles.subjectPill, active && styles.subjectPillActive]}
                    >
                      <Text style={[styles.subjectPillText, active && styles.subjectPillTextActive]}>{s}</Text>
                    </PressableScale>
                  );
                })}
              </View>
              {errors.subject ? <Text style={styles.errorText}>{errors.subject}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textarea, errors.message && styles.inputError]}
                placeholder="Tell us how we can help..."
                placeholderTextColor={Colors.textTertiary}
                value={form.message}
                onChangeText={(v) => update("message", v)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              {errors.message ? <Text style={styles.errorText}>{errors.message}</Text> : null}
            </View>

            <Button
              title={submitting ? "Sending..." : "Send Message"}
              onPress={handleSend}
              loading={submitting}
              icon={!submitting ? <Ionicons name="send-outline" size={16} color={Colors.bg} /> : undefined}
            />
          </Card>
        </FadeInView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: Spacing["4xl"], gap: Spacing.md },

  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.secondary,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["7xl"],
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },

  infoRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  infoLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.muted,
    marginBottom: 2,
  },
  infoValue: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.text },

  hoursCard: { borderRadius: Radius["2xl"], padding: Spacing.lg, backgroundColor: Colors.surface, ...Shadows.warm },
  hoursHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Spacing.md },
  hoursTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, color: Colors.text },
  hoursRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  hoursDay: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.muted },
  hoursTime: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.text },

  directionsCard: {},
  directionsTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.text, marginBottom: 6 },
  directionsText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.muted,
    lineHeight: 19,
    marginBottom: Spacing.lg,
  },

  formCard: {},
  formHeaderRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.lg },
  formTitle: { fontFamily: FontFamily.bold, fontSize: FontSize["4xl"], color: Colors.secondary },

  fieldGroup: { marginBottom: Spacing.lg },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.md, color: Colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: { borderColor: Colors.secondary },
  textarea: { minHeight: 110, paddingTop: 12 },
  errorText: { color: Colors.secondary, fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 4 },

  subjectWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  subjectPill: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  subjectPillActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  subjectPillText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.text },
  subjectPillTextActive: { color: Colors.bg },
});
