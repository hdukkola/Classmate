import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { GradeBadge } from "@/components/GradeBadge";
import { getClassesByQuarter } from "@/data/mockData";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const periods = ["current", "q1", "q2", "q3", "q4"] as const;

export function GradesScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>("current");
  const displayClasses = useMemo(() => getClassesByQuarter(selectedPeriod), [selectedPeriod]);

  return (
    <Screen>
      <Text style={styles.title}>Grades</Text>
      <View style={styles.segment}>
        {periods.map((period) => (
          <Pressable key={period} style={[styles.segmentItem, selectedPeriod === period && styles.segmentItemActive]} onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.segmentText, selectedPeriod === period && styles.segmentTextActive]}>{period.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      {displayClasses.map((cls) => (
        <Pressable key={cls.id} style={styles.card} onPress={() => navigation.navigate("ClassDetail", { classId: cls.id })}>
          <GradeBadge grade={cls.grade} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{cls.name}</Text>
            <Text style={styles.rowSubtitle}>{cls.teacher}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  segment: { flexDirection: "row", backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 4 },
  segmentItem: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  segmentTextActive: { color: "white" },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  rowTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 15 },
  rowSubtitle: { color: colors.textSecondary, fontSize: 13 },
  arrow: { color: colors.textSecondary, fontSize: 26, fontWeight: "700" },
});
