import { Button, Card, FadeInView, PressableScale } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft, ZoomIn } from "react-native-reanimated";

const STEPS = ["Contact Info", "Date & Time", "Confirmation"];

const TIME_SLOTS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8];

type FormData = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: 2,
  notes: "",
};

export default function ReservationScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormData, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: Record<string, string> = {};
    if (!form.date.trim()) next.date = "Date is required";
    if (!form.time) next.time = "Please select a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const code = `RF-${Date.now()}`;
    setConfirmationCode(code);
    setSubmitting(false);
    setSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setConfirmationCode("");
    setSubmitted(false);
    setStep(0);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={52} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Reservation Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            We&apos;ll send a confirmation to <Text style={styles.bold}>{form.email}</Text>
          </Text>

          <View style={styles.summaryBox}>
            <SummaryRow label="Confirmation #" value={confirmationCode} accent />
            <SummaryRow label="Name" value={form.name} />
            <SummaryRow label="Date" value={form.date} />
            <SummaryRow label="Time" value={form.time} />
            <SummaryRow label="Guests" value={`${form.guests} ${form.guests === 1 ? "person" : "people"}`} />
          </View>

          <Button title="Make Another Reservation" onPress={resetAll} style={{ marginTop: Spacing.xl }} />
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <FadeInView>
          <Text style={styles.eyebrow}>Secure Your Seat</Text>
          <Text style={styles.title}>Book Your Table</Text>
        </FadeInView>

        {/* Step progress */}
        <View style={styles.progressRow}>
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    i <= step ? styles.progressCircleActive : styles.progressCircleInactive,
                  ]}
                >
                  {i < step ? (
                    <Ionicons name="checkmark" size={16} color={Colors.bg} />
                  ) : (
                    <Text style={[styles.progressNumber, i === step && { color: Colors.bg }]}>{i + 1}</Text>
                  )}
                </View>
                <Text style={[styles.progressLabel, i <= step && { color: Colors.secondary }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
              {i < STEPS.length - 1 ? (
                <View style={[styles.progressBar, i < step && styles.progressBarActive]} />
              ) : null}
            </React.Fragment>
          ))}
        </View>

        <Card style={styles.formCard}>
          {step === 0 ? (
            <Animated.View entering={SlideInRight.duration(280)} exiting={SlideOutLeft.duration(200)}>
              <Text style={styles.stepTitle}>Contact Information</Text>

              <Field
                icon="person-outline"
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChangeText={(v) => update("name", v)}
                error={errors.name}
              />
              <Field
                icon="call-outline"
                label="Phone Number"
                placeholder="+92 300 0000000"
                value={form.phone}
                onChangeText={(v) => update("phone", v)}
                error={errors.phone}
                keyboardType="phone-pad"
              />
              <Field
                icon="mail-outline"
                label="Email Address"
                placeholder="john@example.com"
                value={form.email}
                onChangeText={(v) => update("email", v)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button title="Next Step" onPress={goNext} icon={<Ionicons name="chevron-forward" size={18} color={Colors.bg} />} style={{ marginTop: Spacing.sm }} />
            </Animated.View>
          ) : null}

          {step === 1 ? (
            <Animated.View entering={SlideInRight.duration(280)} exiting={SlideOutLeft.duration(200)}>
              <Text style={styles.stepTitle}>Date, Time & Guests</Text>

              <Field
                icon="calendar-outline"
                label="Preferred Date"
                placeholder="DD/MM/YYYY"
                value={form.date}
                onChangeText={(v) => update("date", v)}
                error={errors.date}
                keyboardType="numbers-and-punctuation"
              />

              <View style={styles.fieldGroup}>
                <FieldLabel icon="time-outline" label="Preferred Time" />
                <View style={styles.pillWrap}>
                  {TIME_SLOTS.map((t) => {
                    const active = form.time === t;
                    return (
                      <PressableScale
                        key={t}
                        haptic
                        scaleTo={0.94}
                        onPress={() => update("time", t)}
                        style={[styles.timePill, active && styles.timePillActive]}
                      >
                        <Text style={[styles.timePillText, active && styles.timePillTextActive]}>{t}</Text>
                      </PressableScale>
                    );
                  })}
                </View>
                {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <FieldLabel icon="people-outline" label="Number of Guests" />
                <View style={styles.pillWrap}>
                  {GUEST_COUNTS.map((n) => {
                    const active = form.guests === n;
                    return (
                      <PressableScale
                        key={n}
                        haptic
                        scaleTo={0.88}
                        onPress={() => update("guests", n)}
                        style={[styles.guestPill, active && styles.timePillActive]}
                      >
                        <Text style={[styles.guestPillText, active && styles.timePillTextActive]}>{n}</Text>
                      </PressableScale>
                    );
                  })}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <FieldLabel icon="chatbubble-ellipses-outline" label="Special Requests (Optional)" />
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Allergies, dietary restrictions, special occasion..."
                  placeholderTextColor={Colors.textTertiary}
                  value={form.notes}
                  onChangeText={(v) => update("notes", v)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.buttonRow}>
                <Button title="Back" variant="outline" onPress={goBack} style={{ flex: 1 }} icon={<Ionicons name="chevron-back" size={18} color={Colors.secondary} />} />
                <Button title="Review" onPress={goNext} style={{ flex: 1 }} icon={<Ionicons name="chevron-forward" size={18} color={Colors.bg} />} />
              </View>
            </Animated.View>
          ) : null}

          {step === 2 ? (
            <Animated.View entering={SlideInRight.duration(280)} exiting={SlideOutLeft.duration(200)}>
              <Text style={styles.stepTitle}>Review & Confirm</Text>

              <View style={styles.summaryBox}>
                <SummaryRow label="Name" value={form.name} />
                <SummaryRow label="Email" value={form.email} />
                <SummaryRow label="Phone" value={form.phone} />
                <SummaryRow label="Date" value={form.date} />
                <SummaryRow label="Time" value={form.time} />
                <SummaryRow label="Guests" value={`${form.guests} ${form.guests === 1 ? "person" : "people"}`} />
                {form.notes ? <SummaryRow label="Notes" value={form.notes} /> : null}
              </View>

              <Text style={styles.disclaimer}>
                By confirming, you agree to our cancellation policy. Reservations can be modified up to 2 hours
                before your booking.
              </Text>

              <View style={styles.buttonRow}>
                <Button
                  title="Edit"
                  variant="outline"
                  onPress={() => setStep(0)}
                  style={{ flex: 1 }}
                  icon={<Ionicons name="chevron-back" size={18} color={Colors.secondary} />}
                />
                <Button
                  title={submitting ? "Confirming..." : "Confirm Reservation"}
                  onPress={handleConfirm}
                  loading={submitting}
                  style={{ flex: 1 }}
                />
              </View>
            </Animated.View>
          ) : null}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, accent && { color: Colors.secondary }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function FieldLabel({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.labelRow}>
      <Ionicons name={icon} size={14} color={Colors.secondary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

interface FieldProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numbers-and-punctuation";
  autoCapitalize?: "none" | "sentences" | "words";
}

function Field({ icon, label, placeholder, value, onChangeText, error, keyboardType, autoCapitalize }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel icon={icon} label={label} />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },

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
    marginBottom: Spacing.xl,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
  },
  progressStep: { alignItems: "center", width: 64 },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircleActive: { backgroundColor: Colors.secondary },
  progressCircleInactive: { backgroundColor: Colors.secondaryTint },
  progressNumber: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.secondary },
  progressLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.secondaryTint,
    marginTop: 15,
    marginHorizontal: -4,
  },
  progressBarActive: { backgroundColor: Colors.secondary },

  formCard: { padding: Spacing.xl },
  stepTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize["5xl"],
    color: Colors.secondary,
    marginBottom: Spacing.lg,
  },

  fieldGroup: { marginBottom: Spacing.lg },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.md, color: Colors.text },
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
  textarea: { minHeight: 84, paddingTop: 12 },
  errorText: { color: Colors.secondary, fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 4 },

  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timePill: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timePillActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  timePillText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.text },
  timePillTextActive: { color: Colors.bg },

  guestPill: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  guestPillText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, color: Colors.text },

  buttonRow: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.sm },

  summaryBox: {
    backgroundColor: Colors.bg,
    borderRadius: Radius["2xl"],
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: Spacing.md },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.muted },
  summaryValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.text,
    flexShrink: 1,
    textAlign: "right",
  },
  disclaimer: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: Spacing.md,
    lineHeight: 16,
  },
  bold: { fontFamily: FontFamily.semiBold, color: Colors.text },

  successContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius["3xl"],
    padding: Spacing["2xl"],
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(46, 204, 113, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    color: Colors.secondary,
    textAlign: "center",
  },
  successSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
});
