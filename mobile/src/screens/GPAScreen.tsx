import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { GradeBadge } from "@/components/GradeBadge";
import { calculateGPA, getClassesByQuarter } from "@/data/mockData";
import { colors } from "@/theme/colors";

const periods = ["current", "q1", "q2", "q3", "q4"] as const;

export function GPAScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>("current");
  const [weighted, setWeighted] = useState(false);
  const classes = useMemo(() => getClassesByQuarter(selectedPeriod), [selectedPeriod]);
  const unweighted = calculateGPA(classes);
  const gpa = weighted ? unweighted * 1.08 : unweighted;

  return (
    <Screen>
      <Text style={styles.title}>GPA Calculator</Text>

      <View style={styles.segment}>
        {periods.map((period) => (
          <Pressable key={period} style={[styles.segmentItem, selectedPeriod === period && styles.segmentItemActive]} onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.segmentText, selectedPeriod === period && styles.segmentTextActive]}>{period.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.segment}>
        <Pressable style={[styles.segmentItem, !weighted && styles.segmentItemActive]} onPress={() => setWeighted(false)}>
          <Text style={[styles.segmentText, !weighted && styles.segmentTextActive]}>Unweighted</Text>
        </Pressable>
        <Pressable style={[styles.segmentItem, weighted && styles.segmentItemActive]} onPress={() => setWeighted(true)}>
          <Text style={[styles.segmentText, weighted && styles.segmentTextActive]}>Weighted</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>{weighted ? "Weighted" : "Unweighted"} GPA</Text>
        <Text style={styles.heroValue}>{gpa.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Class Breakdown</Text>
        {classes.map((cls) => (
          <View key={cls.id} style={styles.row}>
            <GradeBadge grade={cls.grade} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{cls.name}</Text>
              <Text style={styles.rowSubtitle}>{cls.credits} credits</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  segment: { flexDirection: "row", backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 4 },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: "center" },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontWeight: "700", fontSize: 12 },
  segmentTextActive: { color: "white" },
  hero: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 18, alignItems: "center" },
  heroLabel: { color: colors.textSecondary, fontWeight: "700" },
  heroValue: { color: colors.primary, fontSize: 48, fontWeight: "900" },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  cardTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowTitle: { color: colors.textPrimary, fontWeight: "600" },
  rowSubtitle: { color: colors.textSecondary, fontSize: 12 },
});
