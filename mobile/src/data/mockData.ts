export interface Class {
  id: string;
  name: string;
  teacher: string;
  grade: number;
  color: string;
  credits: number;
  room?: string;
  updatedDaysAgo: number;
  period: number;
  q1Grade?: number;
  q2Grade?: number;
  q3Grade?: number;
  q4Grade?: number;
}

export interface Assignment {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  classId: string;
  category: "performance" | "summative";
}

export interface WeeklyPerformance {
  week: string;
  score: number;
  gpa: number;
}

export const classes: Class[] = [
  { id: "1", name: "AP Calculus BC", teacher: "Mrs. Johnson", grade: 97, color: "#6b3894", credits: 1.0, room: "Math 205", updatedDaysAgo: 2, period: 1, q1Grade: 94, q2Grade: 96, q3Grade: 98, q4Grade: 97 },
  { id: "2", name: "English Literature", teacher: "Mr. Smith", grade: 89, color: "#3B82F6", credits: 1.0, room: "English 101", updatedDaysAgo: 1, period: 2, q1Grade: 85, q2Grade: 87, q3Grade: 91, q4Grade: 89 },
  { id: "3", name: "AP Physics", teacher: "Dr. Chen", grade: 76, color: "#F59E0B", credits: 1.0, room: "Science 302", updatedDaysAgo: 3, period: 3, q1Grade: 78, q2Grade: 72, q3Grade: 75, q4Grade: 76 },
  { id: "4", name: "US History", teacher: "Ms. Rodriguez", grade: 65, color: "#EF4444", credits: 1.0, room: "History 115", updatedDaysAgo: 1, period: 4, q1Grade: 68, q2Grade: 61, q3Grade: 64, q4Grade: 65 },
  { id: "5", name: "AP Computer Science", teacher: "Dr. Williams", grade: 94, color: "#8B5CF6", credits: 1.0, room: "Tech 401", updatedDaysAgo: 2, period: 5, q1Grade: 91, q2Grade: 93, q3Grade: 96, q4Grade: 94 },
  { id: "6", name: "Spanish IV", teacher: "Senora Martinez", grade: 91, color: "#EC4899", credits: 1.0, room: "Lang 105", updatedDaysAgo: 1, period: 6, q1Grade: 87, q2Grade: 90, q3Grade: 93, q4Grade: 91 }
];

export const assignments: Assignment[] = [
  { id: "a1", name: "Homework Set 5", score: 98, maxScore: 100, weight: 10, classId: "1", category: "performance" },
  { id: "a2", name: "Integration Quiz", score: 95, maxScore: 100, weight: 15, classId: "1", category: "performance" },
  { id: "a3", name: "Daily Practice", score: 100, maxScore: 100, weight: 10, classId: "1", category: "performance" },
  { id: "a4", name: "Midterm Exam", score: 92, maxScore: 100, weight: 30, classId: "1", category: "summative" },
  { id: "a5", name: "Series Project", score: 96, maxScore: 100, weight: 25, classId: "1", category: "summative" }
];

export const weeklyPerformanceData: WeeklyPerformance[] = [
  { week: "Week 1", score: 88, gpa: 3.76 },
  { week: "Week 2", score: 85, gpa: 3.71 },
  { week: "Week 3", score: 89, gpa: 3.79 },
  { week: "Week 4", score: 92, gpa: 3.85 },
  { week: "Week 5", score: 87, gpa: 3.74 },
  { week: "Week 6", score: 91, gpa: 3.82 }
];

export const studyStreak = { current: 12, longest: 18 };

export const achievements = [
  { id: "gpa-goal", title: "4.0 GPA Goal", current: 3.82, target: 4.0, color: "#6b3894" },
  { id: "honor-roll", title: "Honor Roll", current: 87, target: 90, color: "#3B82F6" },
  { id: "attendance", title: "Perfect Attendance", current: 28, target: 30, color: "#22C55E" }
];

export function calculateGPA(input: Class[]): number {
  const totalCredits = input.reduce((sum, cls) => sum + cls.credits, 0);
  const weightedSum = input.reduce((sum, cls) => {
    const gradePoint = convertGradeToGPA(cls.grade);
    return sum + gradePoint * cls.credits;
  }, 0);
  return totalCredits > 0 ? weightedSum / totalCredits : 0;
}

export function getClassesByQuarter(quarter: string): Class[] {
  if (quarter === "current") return classes;
  return classes.map((cls) => ({
    ...cls,
    grade:
      quarter === "q1"
        ? cls.q1Grade || cls.grade
        : quarter === "q2"
          ? cls.q2Grade || cls.grade
          : quarter === "q3"
            ? cls.q3Grade || cls.grade
            : quarter === "q4"
              ? cls.q4Grade || cls.grade
              : cls.grade,
  }));
}

function convertGradeToGPA(grade: number): number {
  if (grade >= 93) return 4.0;
  if (grade >= 90) return 3.7;
  if (grade >= 87) return 3.3;
  if (grade >= 83) return 3.0;
  if (grade >= 80) return 2.7;
  if (grade >= 77) return 2.3;
  if (grade >= 73) return 2.0;
  if (grade >= 70) return 1.7;
  return 1.0;
}
