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

export interface ScheduleItem {
  id: string;
  classId: string;
  className: string;
  startTime: string;
  endTime: string;
  day: string;
  room: string;
  color: string;
}

// Quarter/Period GPA Data
export interface PeriodData {
  id: string;
  label: string;
  gpa: number;
  weighted: number;
  credits: number;
}

// Weekly Performance Data
export interface WeeklyPerformance {
  week: string;
  score: number;
  gpa: number;
}

// Study Streak Data
export interface StreakData {
  current: number;
  longest: number;
}

// Achievement Milestone
export interface Achievement {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  color: string;
  icon: string;
}

export const classes: Class[] = [
  {
    id: "1",
    name: "AP Calculus BC",
    teacher: "Mrs. Johnson",
    grade: 97,
    color: "#6b3894",
    credits: 1.0,
    room: "Math 205",
    updatedDaysAgo: 2,
    period: 1,
    q1Grade: 94,
    q2Grade: 96,
    q3Grade: 98,
    q4Grade: 97,
  },
  {
    id: "2",
    name: "English Literature",
    teacher: "Mr. Smith",
    grade: 89,
    color: "#3B82F6",
    credits: 1.0,
    room: "English 101",
    updatedDaysAgo: 1,
    period: 2,
    q1Grade: 85,
    q2Grade: 87,
    q3Grade: 91,
    q4Grade: 89,
  },
  {
    id: "3",
    name: "AP Physics",
    teacher: "Dr. Chen",
    grade: 76,
    color: "#F59E0B",
    credits: 1.0,
    room: "Science 302",
    updatedDaysAgo: 3,
    period: 3,
    q1Grade: 78,
    q2Grade: 72,
    q3Grade: 75,
    q4Grade: 76,
  },
  {
    id: "4",
    name: "US History",
    teacher: "Ms. Rodriguez",
    grade: 65,
    color: "#EF4444",
    credits: 1.0,
    room: "History 115",
    updatedDaysAgo: 1,
    period: 4,
    q1Grade: 68,
    q2Grade: 61,
    q3Grade: 64,
    q4Grade: 65,
  },
  {
    id: "5",
    name: "AP Computer Science",
    teacher: "Dr. Williams",
    grade: 94,
    color: "#8B5CF6",
    credits: 1.0,
    room: "Tech 401",
    updatedDaysAgo: 2,
    period: 5,
    q1Grade: 91,
    q2Grade: 93,
    q3Grade: 96,
    q4Grade: 94,
  },
  {
    id: "6",
    name: "Spanish IV",
    teacher: "Señora Martinez",
    grade: 91,
    color: "#EC4899",
    credits: 1.0,
    room: "Lang 105",
    updatedDaysAgo: 1,
    period: 6,
    q1Grade: 87,
    q2Grade: 90,
    q3Grade: 93,
    q4Grade: 91,
  },
  {
    id: "7",
    name: "AP Chemistry",
    teacher: "Mr. Patel",
    grade: 88,
    color: "#10B981",
    credits: 1.0,
    room: "Science 210",
    updatedDaysAgo: 4,
    period: 7,
    q1Grade: 84,
    q2Grade: 86,
    q3Grade: 90,
    q4Grade: 88,
  },
  {
    id: "8",
    name: "Art History",
    teacher: "Ms. Thompson",
    grade: 96,
    color: "#F97316",
    credits: 0.5,
    room: "Arts 304",
    updatedDaysAgo: 1,
    period: 8,
    q1Grade: 93,
    q2Grade: 95,
    q3Grade: 98,
    q4Grade: 96,
  },
];

export const assignments: Assignment[] = [
  // AP Calculus BC (Class 1) - 3 performance, 2 summative
  { id: "a1", name: "Homework Set 5", score: 98, maxScore: 100, weight: 10, classId: "1", category: "performance" },
  { id: "a2", name: "Integration Quiz", score: 95, maxScore: 100, weight: 15, classId: "1", category: "performance" },
  { id: "a3", name: "Daily Practice", score: 100, maxScore: 100, weight: 10, classId: "1", category: "performance" },
  { id: "a4", name: "Midterm Exam", score: 92, maxScore: 100, weight: 30, classId: "1", category: "summative" },
  { id: "a5", name: "Series Project", score: 96, maxScore: 100, weight: 25, classId: "1", category: "summative" },
  
  // English Literature (Class 2) - 3 performance, 2 summative
  { id: "a6", name: "Poetry Analysis", score: 90, maxScore: 100, weight: 15, classId: "2", category: "performance" },
  { id: "a7", name: "Class Participation", score: 92, maxScore: 100, weight: 10, classId: "2", category: "performance" },
  { id: "a8", name: "Reading Responses", score: 88, maxScore: 100, weight: 15, classId: "2", category: "performance" },
  { id: "a9", name: "Shakespeare Essay", score: 85, maxScore: 100, weight: 30, classId: "2", category: "summative" },
  { id: "a10", name: "Final Paper", score: 90, maxScore: 100, weight: 30, classId: "2", category: "summative" },
  
  // AP Physics (Class 3) - 3 performance, 2 summative
  { id: "a11", name: "Lab Report #3", score: 94, maxScore: 100, weight: 15, classId: "3", category: "performance" },
  { id: "a12", name: "Problem Sets", score: 95, maxScore: 100, weight: 15, classId: "3", category: "performance" },
  { id: "a13", name: "Lab Participation", score: 88, maxScore: 100, weight: 10, classId: "3", category: "performance" },
  { id: "a14", name: "Mechanics Test", score: 68, maxScore: 100, weight: 30, classId: "3", category: "summative" },
  { id: "a15", name: "Electricity Exam", score: 72, maxScore: 100, weight: 30, classId: "3", category: "summative" },
  
  // US History (Class 4) - 3 performance, 2 summative
  { id: "a16", name: "Reading Notes", score: 78, maxScore: 100, weight: 10, classId: "4", category: "performance" },
  { id: "a17", name: "Class Discussion", score: 82, maxScore: 100, weight: 10, classId: "4", category: "performance" },
  { id: "a18", name: "Homework Essays", score: 75, maxScore: 100, weight: 15, classId: "4", category: "performance" },
  { id: "a19", name: "Midterm Exam", score: 58, maxScore: 100, weight: 30, classId: "4", category: "summative" },
  { id: "a20", name: "DBQ Final", score: 62, maxScore: 100, weight: 35, classId: "4", category: "summative" },
  
  // AP Computer Science (Class 5) - 3 performance, 2 summative
  { id: "a21", name: "Coding Assignments", score: 98, maxScore: 100, weight: 15, classId: "5", category: "performance" },
  { id: "a22", name: "Lab Exercises", score: 96, maxScore: 100, weight: 15, classId: "5", category: "performance" },
  { id: "a23", name: "Debugging Practice", score: 92, maxScore: 100, weight: 10, classId: "5", category: "performance" },
  { id: "a24", name: "Algorithm Test", score: 90, maxScore: 100, weight: 30, classId: "5", category: "summative" },
  { id: "a25", name: "Final Project", score: 95, maxScore: 100, weight: 30, classId: "5", category: "summative" },
  
  // Spanish IV (Class 6) - 3 performance, 2 summative
  { id: "a26", name: "Conversación Diaria", score: 94, maxScore: 100, weight: 15, classId: "6", category: "performance" },
  { id: "a27", name: "Tarea", score: 92, maxScore: 100, weight: 10, classId: "6", category: "performance" },
  { id: "a28", name: "Participación", score: 96, maxScore: 100, weight: 10, classId: "6", category: "performance" },
  { id: "a29", name: "Examen Oral", score: 88, maxScore: 100, weight: 30, classId: "6", category: "summative" },
  { id: "a30", name: "Examen Escrito", score: 90, maxScore: 100, weight: 35, classId: "6", category: "summative" },
  
  // AP Chemistry (Class 7) - 3 performance, 2 summative
  { id: "a31", name: "Lab Reports", score: 90, maxScore: 100, weight: 15, classId: "7", category: "performance" },
  { id: "a32", name: "Problem Sets", score: 92, maxScore: 100, weight: 15, classId: "7", category: "performance" },
  { id: "a33", name: "Lab Safety Quiz", score: 100, maxScore: 100, weight: 10, classId: "7", category: "performance" },
  { id: "a34", name: "Stoichiometry Test", score: 82, maxScore: 100, weight: 30, classId: "7", category: "summative" },
  { id: "a35", name: "Bonding Exam", score: 86, maxScore: 100, weight: 30, classId: "7", category: "summative" },
  
  // Art History (Class 8) - 3 performance, 2 summative
  { id: "a36", name: "Gallery Visit Report", score: 98, maxScore: 100, weight: 15, classId: "8", category: "performance" },
  { id: "a37", name: "Weekly Reflections", score: 96, maxScore: 100, weight: 10, classId: "8", category: "performance" },
  { id: "a38", name: "Artist Presentations", score: 94, maxScore: 100, weight: 15, classId: "8", category: "performance" },
  { id: "a39", name: "Renaissance Exam", score: 95, maxScore: 100, weight: 30, classId: "8", category: "summative" },
  { id: "a40", name: "Final Analysis Paper", score: 98, maxScore: 100, weight: 30, classId: "8", category: "summative" },
];

export const schedule: ScheduleItem[] = [
  {
    id: "s1",
    classId: "1",
    className: "AP Calculus BC",
    startTime: "8:00 AM",
    endTime: "9:15 AM",
    day: "Monday",
    room: "Math 205",
    color: "#2563EB",
  },
  {
    id: "s2",
    classId: "2",
    className: "English Literature",
    startTime: "9:30 AM",
    endTime: "10:45 AM",
    day: "Monday",
    room: "English 101",
    color: "#4F46E5",
  },
  {
    id: "s3",
    classId: "3",
    className: "AP Physics",
    startTime: "11:00 AM",
    endTime: "12:15 PM",
    day: "Monday",
    room: "Science 302",
    color: "#22C55E",
  },
  {
    id: "s4",
    classId: "4",
    className: "US History",
    startTime: "1:00 PM",
    endTime: "2:15 PM",
    day: "Monday",
    room: "History 115",
    color: "#F59E0B",
  },
];

export function calculateGPA(classes: Class[]): number {
  const totalCredits = classes.reduce((sum, cls) => sum + cls.credits, 0);
  const weightedSum = classes.reduce((sum, cls) => {
    const gradePoint = convertGradeToGPA(cls.grade);
    return sum + gradePoint * cls.credits;
  }, 0);
  return weightedSum / totalCredits;
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

export function getGradeColor(grade: number): string {
  if (grade >= 90) return "#22C55E"; // Success green
  if (grade >= 80) return "#F59E0B"; // Warning orange
  return "#EF4444"; // Danger red
}

export function getGradeStatus(grade: number): string {
  if (grade >= 90) return "Excellent";
  if (grade >= 80) return "Good";
  if (grade >= 70) return "Fair";
  return "Needs Improvement";
}

// Analytics Data
export const weeklyPerformanceData: WeeklyPerformance[] = [
  { week: "Week 1", score: 88, gpa: 3.76 },
  { week: "Week 2", score: 85, gpa: 3.71 },
  { week: "Week 3", score: 89, gpa: 3.79 },
  { week: "Week 4", score: 92, gpa: 3.85 },
  { week: "Week 5", score: 87, gpa: 3.74 },
  { week: "Week 6", score: 91, gpa: 3.82 },
];

export const studyStreak: StreakData = {
  current: 12,
  longest: 18,
};

export const achievements: Achievement[] = [
  {
    id: "gpa-goal",
    title: "4.0 GPA Goal",
    description: "Achieve and maintain a perfect GPA",
    current: 3.82,
    target: 4.0,
    color: "#6b3894",
    icon: "target",
  },
  {
    id: "honor-roll",
    title: "Honor Roll",
    description: "Maintain 90% average across all classes",
    current: 87,
    target: 90,
    color: "#3B82F6",
    icon: "award",
  },
  {
    id: "attendance",
    title: "Perfect Attendance",
    description: "30 consecutive days without absence",
    current: 28,
    target: 30,
    color: "#22C55E",
    icon: "calendar",
  },
];

// Period/Quarter Data with calculated GPAs
export const periodDataHistory: Record<string, PeriodData> = {
  current: {
    id: "current",
    label: "Current",
    gpa: 3.82,
    weighted: 4.13,
    credits: 7.5,
  },
  q1: {
    id: "q1",
    label: "Q1",
    gpa: 3.78,
    weighted: 4.08,
    credits: 7.5,
  },
  q2: {
    id: "q2",
    label: "Q2",
    gpa: 3.75,
    weighted: 4.05,
    credits: 7.5,
  },
  q3: {
    id: "q3",
    label: "Q3",
    gpa: 3.88,
    weighted: 4.19,
    credits: 7.5,
  },
  q4: {
    id: "q4",
    label: "Q4",
    gpa: 3.80,
    weighted: 4.10,
    credits: 7.5,
  },
};

// Helper function to get grades by quarter
export function getClassesByQuarter(quarter: string): Class[] {
  if (quarter === "current") return classes;
  
  return classes.map(cls => ({
    ...cls,
    grade: quarter === "q1" ? (cls.q1Grade || cls.grade) :
           quarter === "q2" ? (cls.q2Grade || cls.grade) :
           quarter === "q3" ? (cls.q3Grade || cls.grade) :
           quarter === "q4" ? (cls.q4Grade || cls.grade) : cls.grade
  }));
}