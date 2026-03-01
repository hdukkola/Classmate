/**
 * HAC (Home Access Center) API Service
 * This handles all communication with PowerSchool HAC
 * 
 * 🎯 REAL HAC DATA ONLY - NO MOCK DATA!
 * 
 * This service connects to our backend server which scrapes HAC directly
 * to fetch real grades from the Interim Progress Report.
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

// ⚙️ CONFIGURATION
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a`;

// ========================================
// AUTHENTICATION
// ========================================

interface LoginCredentials {
  username: string;
  password: string;
  districtUrl: string;
}

interface LoginResponse {
  success: boolean;
  sessionToken?: string;
  studentId?: string;
  studentName?: string;
  error?: string;
}

/**
 * Log in to PowerSchool HAC
 * Calls our backend server which scrapes HAC directly
 */
export async function loginToHAC(credentials: LoginCredentials): Promise<LoginResponse> {
  // Real API call through backend server - NO MOCK DATA!
  try {
    console.log("🔐 Attempting HAC login...");
    console.log("📍 API URL:", `${API_BASE_URL}/hac/login`);
    console.log("👤 Username:", credentials.username);
    console.log("🌐 District:", credentials.districtUrl);
    
    const response = await fetch(`${API_BASE_URL}/hac/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(credentials)
    });
    
    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("📡 Raw response:", responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError);
      throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
    }
    
    console.log("📦 Parsed data:", data);
    
    if (!response.ok) {
      const errorMessage = data.error || `Server error (${response.status})`;
      console.error("❌ Login failed:", errorMessage);
      throw new Error(errorMessage);
    }
    
    if (!data.success) {
      const errorMessage = data.error || "Login failed - no success flag";
      console.error("❌ Login unsuccessful:", errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log("✅ Login successful!");
    console.log("👤 Student:", data.studentName);
    console.log("🎫 Session token:", data.sessionToken?.substring(0, 20) + "...");
    
    // Store session info
    localStorage.setItem("hac_session_token", data.sessionToken);
    localStorage.setItem("hac_student_name", data.studentName);
    localStorage.setItem("hac_student_id", data.studentId);
    localStorage.setItem("hac_logged_in", "true");
    
    return {
      success: true,
      sessionToken: data.sessionToken,
      studentId: data.studentId,
      studentName: data.studentName
    };
  } catch (error) {
    console.error("❌ HAC Login error:", error);
    console.error("❌ Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Log out and clear session
 */
export function logoutFromHAC(): void {
  localStorage.removeItem("hac_session_token");
  localStorage.removeItem("hac_student_id");
  localStorage.removeItem("hac_student_name");
  localStorage.removeItem("hac_logged_in");
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return localStorage.getItem("hac_logged_in") === "true";
}

/**
 * Get current student info
 */
export function getStudentInfo() {
  return {
    name: localStorage.getItem("hac_student_name") || "Student",
    id: localStorage.getItem("hac_student_id") || ""
  };
}

// ========================================
// FETCH DATA
// ========================================

/**
 * Get authorization headers for API requests
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("hac_session_token");
  console.log("🔑 getAuthHeaders called:");
  console.log("   Token from localStorage:", token ? `${token.substring(0, 30)}...` : "NOT FOUND");
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${publicAnonKey}`, // Dummy header to satisfy Supabase edge function security
    "X-HAC-Session-Token": token || "" // Our actual session token
  };
  
  console.log("   Headers being sent:", headers);
  return headers;
}

/**
 * Fetch all classes and grades - HAC DATA ONLY!
 */
export async function fetchGrades() {
  // NO MOCK DATA - Must be logged in to HAC!
  if (!isLoggedIn()) {
    console.warn("⚠️ User not logged in to HAC - returning empty data");
    return { classes: [] };
  }
  
  // Real API call to HAC scraper
  try {
    console.log("📊 Fetching grades from HAC...");
    console.log("   Auth headers:", getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/hac/grades`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    
    console.log("   Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("❌ Grades API error:", errorData);
      throw new Error(`Failed to fetch grades: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Grades received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching grades:", error);
    return { classes: [] };
  }
}

/**
 * Fetch upcoming assignments - HAC DATA ONLY!
 */
export async function fetchUpcomingAssignments() {
  // NO MOCK DATA - Must be logged in to HAC!
  if (!isLoggedIn()) {
    console.warn("⚠️ User not logged in to HAC - returning empty data");
    return { upcoming: [] };
  }
  
  try {
    console.log("📝 Fetching upcoming assignments from HAC...");
    console.log("   Auth headers:", getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/hac/assignments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ type: "upcoming" })
    });
    
    console.log("   Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("❌ Assignments API error:", errorData);
      throw new Error(`Failed to fetch upcoming assignments: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Upcoming assignments received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching upcoming assignments:", error);
    return { upcoming: [] };
  }
}

/**
 * Fetch recent grades - HAC DATA ONLY!
 */
export async function fetchRecentGrades() {
  // NO MOCK DATA - Must be logged in to HAC!
  if (!isLoggedIn()) {
    console.warn("⚠️ User not logged in to HAC - returning empty data");
    return { recent: [] };
  }
  
  try {
    console.log("📈 Fetching recent grades from HAC...");
    console.log("   Auth headers:", getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/hac/assignments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ type: "recent" })
    });
    
    console.log("   Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("❌ Recent grades API error:", errorData);
      throw new Error(`Failed to fetch recent grades: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Recent grades received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching recent grades:", error);
    return { recent: [] };
  }
}

/**
 * Fetch assignments for a specific class - HAC DATA ONLY!
 */
export async function fetchClassAssignments(classId: string) {
  // NO MOCK DATA - Must be logged in to HAC!
  if (!isLoggedIn()) {
    console.warn("⚠️ User not logged in to HAC - returning empty data");
    return { assignments: [] };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/hac/assignments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ classId })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch class assignments");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching class assignments:", error);
    return { assignments: [] };
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Calculate GPA from classes
 */
export function calculateGPA(classes: any[]) {
  if (classes.length === 0) return 0;
  
  const totalPoints = classes.reduce((sum, cls) => {
    // Convert percentage to 4.0 scale
    let gradePoint = 0;
    if (cls.grade >= 93) gradePoint = 4.0;
    else if (cls.grade >= 90) gradePoint = 3.7;
    else if (cls.grade >= 87) gradePoint = 3.3;
    else if (cls.grade >= 83) gradePoint = 3.0;
    else if (cls.grade >= 80) gradePoint = 2.7;
    else if (cls.grade >= 77) gradePoint = 2.3;
    else if (cls.grade >= 73) gradePoint = 2.0;
    else if (cls.grade >= 70) gradePoint = 1.7;
    else if (cls.grade >= 67) gradePoint = 1.3;
    else if (cls.grade >= 65) gradePoint = 1.0;
    
    return sum + gradePoint;
  }, 0);
  
  return totalPoints / classes.length;
}