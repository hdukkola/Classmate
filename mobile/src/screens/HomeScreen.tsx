import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { GradeBadge } from "@/components/GradeBadge";
import { classes as fallbackClasses, calculateGPA } from "@/data/mockData";
import { fetchGrades, fetchRecentGrades, fetchUpcomingAssignments } from "@/services/hacApi";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [hacClasses, setHacClasses] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [upcomingGrades, setUpcomingGrades] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [gradesData, recentData, upcomingData] = await Promise.all([
        fetchGrades(),
        fetchRecentGrades(),
        fetchUpcomingAssignments(),
      ]);
      setHacClasses(gradesData.classes || []);
      setRecentGrades(recentData.recent || []);
      setUpcomingGrades(upcomingData.upcoming || []);
    }
    load();
  }, []);

  const activeClasses = hacClasses.length > 0 ? hacClasses : fallbackClasses;
  const gpa = useMemo(() => calculateGPA(activeClasses as any), [activeClasses]);
  const topClass = activeClasses[0];

  return (
    <Screen>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Hi, Alex!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current GPA</Text>
        <Text style={styles.gpa}>{gpa.toFixed(2)}</Text>
      </View>

      {topClass ? (
        <Pressable style={styles.rowCard} onPress={() => navigation.navigate("ClassDetail", { classId: String(topClass.id) })}>
          <GradeBadge grade={Number(topClass.grade)} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{topClass.name}</Text>
            <Text style={styles.rowSubtitle}>{topClass.teacher}</Text>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Grades</Text>
        {recentGrades.slice(0, 3).map((item, i) => (
          <Text key={`${item.assignment}-${i}`} style={styles.listItem}>
            {item.assignment}: {item.grade}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming</Text>
        {upcomingGrades.slice(0, 3).map((item, i) => (
          <Text key={`${item.assignment}-${i}`} style={styles.listItem}>
            {item.assignment} • {item.dueDate}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, marginTop: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 4 },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  cardTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 17 },
  gpa: { color: colors.primary, fontSize: 42, fontWeight: "800" },
  rowCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 15 },
  rowSubtitle: { color: colors.textSecondary, fontSize: 13 },
  listItem: { color: colors.textSecondary, fontSize: 14 },
});
