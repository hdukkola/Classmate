import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getBadgeTextColor, getGradeColor } from "@/utils/gradeBadges";

export function GradeBadge({ grade, size = 48 }: { grade: number; size?: number }) {
  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2, backgroundColor: getGradeColor(grade) }]}>
      <Text style={[styles.text, { color: getBadgeTextColor(), fontSize: Math.max(12, size * 0.32) }]}>{grade}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
  },
});
