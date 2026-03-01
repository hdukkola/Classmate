import { getItem, removeItem, setItem } from "@/storage/storage";

const API_BASE_URL = "https://your-python-api-url.com/api";
const USE_MOCK_DATA = true;

const MOCK_CLASSES = [
  { id: "1", name: "AP Calculus BC", teacher: "Mrs. Johnson", grade: 97, credits: 1.0, room: "Math 205", period: "1" },
  { id: "2", name: "AP Physics C", teacher: "Mr. Rodriguez", grade: 94, credits: 1.0, room: "Science 304", period: "2" },
  { id: "3", name: "English Literature", teacher: "Ms. Thompson", grade: 88, credits: 1.0, room: "English 102", period: "3" }
];

const MOCK_UPCOMING = [
  { className: "AP Calculus BC", assignment: "Final Exam", dueDate: "Dec 15", weight: "30%", category: "Tests" },
  { className: "English Literature", assignment: "Final Essay", dueDate: "Dec 18", weight: "25%", category: "Essays" }
];

const MOCK_RECENT = [
  { className: "AP Calculus BC", assignment: "Midterm Exam", grade: "92%", date: "Dec 1" },
  { className: "English Literature", assignment: "Shakespeare Essay", grade: "88%", date: "Nov 28" }
];

interface LoginCredentials {
  username: string;
  password: string;
  districtUrl: string;
}

export async function loginToHAC(credentials: LoginCredentials) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockToken = `mock_token_${Date.now()}`;
    await setItem("hac_session_token", mockToken);
    await setItem("hac_student_id", "12345");
    await setItem("hac_student_name", "Alex Johnson");
    await setItem("hac_logged_in", "true");
    return { success: true, sessionToken: mockToken, studentId: "12345", studentName: "Alex Johnson" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    await setItem("hac_session_token", data.sessionToken);
    await setItem("hac_student_id", data.studentId);
    await setItem("hac_student_name", data.studentName);
    await setItem("hac_logged_in", "true");
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function logoutFromHAC() {
  await removeItem("hac_session_token");
  await removeItem("hac_student_id");
  await removeItem("hac_student_name");
  await removeItem("hac_logged_in");
}

export async function isLoggedIn() {
  return (await getItem("hac_logged_in")) === "true";
}

export async function getStudentInfo() {
  return {
    name: (await getItem("hac_student_name")) || "Student",
    id: (await getItem("hac_student_id")) || "",
  };
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getItem("hac_session_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchGrades() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { classes: MOCK_CLASSES };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/grades`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch grades");
    return await response.json();
  } catch {
    return { classes: MOCK_CLASSES };
  }
}

export async function fetchUpcomingAssignments() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { upcoming: MOCK_UPCOMING };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/upcoming`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch upcoming assignments");
    return await response.json();
  } catch {
    return { upcoming: MOCK_UPCOMING };
  }
}

export async function fetchRecentGrades() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { recent: MOCK_RECENT };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/recent`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch recent grades");
    return await response.json();
  } catch {
    return { recent: MOCK_RECENT };
  }
}
