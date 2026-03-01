export const getGradeColor = (grade: number): string => {
  if (grade >= 94) return "#8b5cf6";
  if (grade >= 85) return "#3b82f6";
  if (grade >= 70) return "#10b981";
  return "#ef4444";
};

export const getBadgeTextColor = (): string => "#ffffff";

export const getGPAColor = (gpa: number): string => {
  if (gpa >= 3.7) return "#8b5cf6";
  if (gpa >= 3.0) return "#3b82f6";
  if (gpa >= 2.0) return "#10b981";
  return "#ef4444";
};
