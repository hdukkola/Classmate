import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/theme/colors";
import { projectId, publicAnonKey } from "@/config/supabase";
import { getItem } from "@/storage/storage";
import { formatTime } from "@/utils/timeFormat";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
}

export function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState("60");
  const [use24Hour, setUse24Hour] = useState(false);

  useEffect(() => {
    loadEvents();
    getItem("use24HourTime").then((v) => setUse24Hour(v === "true"));
  }, []);

  async function loadEvents() {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch {
      // Keep empty list when API is unavailable.
    }
  }

  async function createEvent() {
    if (!title || !date) return;
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ title, date, time, duration: Number(duration) }),
      });
      if (response.ok) {
        setTitle("");
        await loadEvents();
      }
    } catch {
      Alert.alert("Calendar", "Failed to create event.");
    }
  }

  const selectedEvents = useMemo(() => events.filter((event) => event.date === date), [date, events]);

  return (
    <Screen>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.subtitle}>Plan your study sessions</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Session</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <TextInput value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <TextInput value={duration} onChangeText={setDuration} placeholder="Duration (min)" keyboardType="numeric" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <Pressable style={styles.button} onPress={createEvent}>
          <Text style={styles.buttonText}>Create Study Session</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Events for {date}</Text>
        {selectedEvents.length === 0 ? (
          <Text style={styles.empty}>No sessions yet.</Text>
        ) : (
          selectedEvents.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{event.title}</Text>
                <Text style={styles.rowSubtitle}>
                  {formatTime(event.time, use24Hour)} • {event.duration} min
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8 },
  cardTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 16 },
  input: { backgroundColor: colors.bgSoft, borderRadius: 10, borderColor: colors.border, borderWidth: 1, color: colors.textPrimary, paddingHorizontal: 12, paddingVertical: 10 },
  button: { backgroundColor: colors.primary, borderRadius: 10, alignItems: "center", paddingVertical: 10 },
  buttonText: { color: "white", fontWeight: "700" },
  empty: { color: colors.textSecondary, fontSize: 14 },
  eventRow: { backgroundColor: colors.bgSoft, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border },
  rowTitle: { color: colors.textPrimary, fontWeight: "700" },
  rowSubtitle: { color: colors.textSecondary, fontSize: 13 },
});
