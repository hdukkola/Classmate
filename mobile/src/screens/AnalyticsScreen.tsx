import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { calculateGPA, classes } from "@/data/mockData";
import { colors } from "@/theme/colors";

export function AnalyticsScreen() {
  const [simulatedScore, setSimulatedScore] = useState(85);
  const [selectedClassId, setSelectedClassId] = useState(classes[0].id);
  const currentClass = useMemo(() => classes.find((c) => c.id === selectedClassId) || classes[0], [selectedClassId]);
  const currentGpa = calculateGPA(classes);
  const projectedGpa = (currentGpa + (simulatedScore - currentClass.grade) * 0.015).toFixed(2);

  return (
    <Screen>
      <Text style={styles.title}>Analytics</Text>
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Grade</Text>
          <Text style={styles.statValue}>{Math.round(classes.reduce((a, c) => a + c.grade, 0) / classes.length)}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current GPA</Text>
          <Text style={styles.statValue}>{currentGpa.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Projection Simulator</Text>
        {classes.map((cls) => (
          <Pressable key={cls.id} style={[styles.selectorItem, cls.id === selectedClassId && styles.selectorItemActive]} onPress={() => setSelectedClassId(cls.id)}>
            <Text style={[styles.selectorText, cls.id === selectedClassId && styles.selectorTextActive]}>
              {cls.name} ({cls.grade}%)
            </Text>
          </Pressable>
        ))}

        <Text style={styles.sliderLabel}>Simulated Score: {simulatedScore}%</Text>
        <View style={styles.sliderRow}>
          <Pressable onPress={() => setSimulatedScore((v) => Math.max(0, v - 5))} style={styles.scoreButton}>
            <Text style={styles.scoreButtonText}>-5</Text>
          </Pressable>
          <Pressable onPress={() => setSimulatedScore((v) => Math.min(100, v + 5))} style={styles.scoreButton}>
            <Text style={styles.scoreButtonText}>+5</Text>
          </Pressable>
        </View>

        <Text style={styles.projected}>Projected GPA: {projectedGpa}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  row: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontSize: 26, fontWeight: "800" },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8 },
  cardTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 16, marginBottom: 2 },
  selectorItem: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingVertical: 8, paddingHorizontal: 10 },
  selectorItemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  selectorText: { color: colors.textSecondary, fontSize: 13 },
  selectorTextActive: { color: colors.textPrimary, fontWeight: "700" },
  sliderLabel: { color: colors.textPrimary, fontWeight: "600", marginTop: 8 },
  sliderRow: { flexDirection: "row", gap: 8 },
  scoreButton: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  scoreButtonText: { color: "white", fontWeight: "700" },
  projected: { color: colors.info, fontWeight: "700", fontSize: 18, marginTop: 4 },
});
