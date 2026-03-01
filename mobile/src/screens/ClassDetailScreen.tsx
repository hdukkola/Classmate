import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Screen } from "@/components/Screen";
import { GradeBadge } from "@/components/GradeBadge";
import { assignments, classes } from "@/data/mockData";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type DetailRoute = RouteProp<RootStackParamList, "ClassDetail">;

export function ClassDetailScreen() {
  const route = useRoute<DetailRoute>();
  const classData = useMemo(() => classes.find((cls) => cls.id === route.params.classId), [route.params.classId]);
  const classAssignments = useMemo(() => assignments.filter((a) => a.classId === route.params.classId), [route.params.classId]);

  if (!classData) {
    return (
      <Screen>
        <Text style={styles.title}>Class not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{classData.name}</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <GradeBadge grade={classData.grade} size={72} />
          <View style={{ flex: 1 }}>
            <Text style={styles.teacher}>{classData.teacher}</Text>
            <Text style={styles.meta}>Room: {classData.room ?? "N/A"}</Text>
            <Text style={styles.meta}>Period: {classData.period}</Text>
            <Text style={styles.meta}>Credits: {classData.credits}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Assignments</Text>
        {classAssignments.length === 0 ? (
          <Text style={styles.meta}>No assignment data.</Text>
        ) : (
          classAssignments.map((item) => {
            const pct = Math.round((item.score / item.maxScore) * 100);
            return (
              <View key={item.id} style={styles.assignmentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.assignmentTitle}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.score}/{item.maxScore} • {item.weight}% • {item.category}
                  </Text>
                </View>
                <GradeBadge grade={pct} size={40} />
              </View>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "800", marginTop: 8 },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderColor: colors.border, borderWidth: 1, padding: 14, gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  teacher: { color: colors.textPrimary, fontWeight: "700", fontSize: 16 },
  meta: { color: colors.textSecondary, fontSize: 13 },
  section: { color: colors.textPrimary, fontWeight: "700", fontSize: 16 },
  assignmentRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  assignmentTitle: { color: colors.textPrimary, fontWeight: "600" },
});
