import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/theme/colors";
import { getItem, setItem } from "@/storage/storage";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsScreen() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [aiGradeAccess, setAiGradeAccess] = useState(false);
  const [use24HourTime, setUse24HourTime] = useState(false);

  useEffect(() => {
    async function load() {
      setNotifications((await getItem("notifications")) !== "false");
      setAiGradeAccess((await getItem("aiGradeAccess")) === "true");
      setUse24HourTime((await getItem("use24HourTime")) === "true");
    }
    load();
  }, []);

  async function updateBool(key: string, value: boolean, setter: (v: boolean) => void) {
    setter(value);
    await setItem(key, value ? "true" : "false");
  }

  async function onLogout() {
    Alert.alert("Logout", "Sign out of ClassMate?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your preferences</Text>

      <View style={styles.card}>
        <ToggleRow
          label="Notifications"
          value={notifications}
          onValueChange={(value) => updateBool("notifications", value, setNotifications)}
        />
        <ToggleRow
          label="AI Grade Access"
          value={aiGradeAccess}
          onValueChange={(value) => updateBool("aiGradeAccess", value, setAiGradeAccess)}
        />
        <ToggleRow
          label="24-Hour Time"
          value={use24HourTime}
          onValueChange={(value) => updateBool("use24HourTime", value, setUse24HourTime)}
        />
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </Screen>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} thumbColor="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  subtitle: { color: colors.textSecondary, marginBottom: 6 },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 10, gap: 4 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  logoutButton: { marginTop: 8, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.danger, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 16 },
});
