/**
 * HAC (Home Access Center) API Service
 * This handles all communication with PowerSchool HAC
 * 
 * 🎯 QUICK START GUIDE:
 * 
 * RIGHT NOW: App uses mock data (fake grades for testing)
 * 
 * TO CONNECT REAL API:
 * 1. Deploy your Python server to Render.com (see /example_python_api.py)
 * 2. Change API_BASE_URL below to your deployed URL
 * 3. Change USE_MOCK_DATA to false
 * 4. Done! Your app will fetch real grades
 * 
 * Read /README_START_HERE.md for complete beginner tutorial!
 */

// ⚙️ CONFIGURATION
// STEP 1: Change this to your Python API URL when ready
// Example: "https://my-hac-api.onrender.com/api"
const API_BASE_URL = "https://your-python-api-url.com/api";

// STEP 2: Set this to false when you have a real API
const USE_MOCK_DATA = true; // Set to false when you have a real API

// ========================================
// MOCK DATA (for testing without a server)
// ========================================

const MOCK_CLASSES = [
  {
    id: "1",
    name: "AP Calculus BC",
    teacher: "Mrs. Johnson",
    grade: 97,
    credits: 1.0,
    room: "Math 205",
    period: "1"
  },
  {
    id: "2",
    name: "AP Physics C",
    teacher: "Mr. Rodriguez",
    grade: 94,
    credits: 1.0,
    room: "Science 304",
    period: "2"
  },
  {
    id: "3",
    name: "English Literature",
    teacher: "Ms. Thompson",
    grade: 88,
    credits: 1.0,
    room: "English 102",
    period: "3"
  },
  {
    id: "4",
    name: "AP US History",
    teacher: "Mr. Chen",
    grade: 92,
    credits: 1.0,
    room: "History 201",
    period: "4"
  },
  {
    id: "5",
    name: "Spanish IV",
    teacher: "Señora Martinez",
    grade: 90,
    credits: 1.0,
    room: "Lang 105",
    period: "5"
  },
  {
    id: "6",
    name: "AP Computer Science",
    teacher: "Dr. Williams",
    grade: 96,
    credits: 1.0,
    room: "Tech 401",
    period: "6"
  }
];

const MOCK_UPCOMING = [
  {
    className: "AP Calculus BC",
    assignment: "Final Exam",
    dueDate: "Dec 15",
    weight: "30%",
    category: "Tests"
  },
  {
    className: "English Literature",
    assignment: "Final Essay",
    dueDate: "Dec 18",
    weight: "25%",
    category: "Essays"
  },
  {
    className: "AP Physics C",
    assignment: "Lab Final Report",
    dueDate: "Dec 20",
    weight: "20%",
    category: "Labs"
  },
  {
    className: "AP US History",
    assignment: "DBQ Final",
    dueDate: "Dec 16",
    weight: "35%",
    category: "Essays"
  }
];

const MOCK_RECENT = [
  {
    className: "AP Calculus BC",
    assignment: "Midterm Exam",
    grade: "92%",
    date: "Dec 1"
  },
  {
    className: "English Literature",
    assignment: "Shakespeare Essay",
    grade: "88%",
    date: "Nov 28"
  },
  {
    className: "AP Physics C",
    assignment: "Lab Report #3",
    grade: "94%",
    date: "Nov 25"
  }
];

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
 * Stores session token in localStorage for future requests
 */
export async function loginToHAC(credentials: LoginCredentials): Promise<LoginResponse> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockToken = "mock_token_" + Date.now();
    localStorage.setItem("hac_session_token", mockToken);
    localStorage.setItem("hac_student_id", "12345");
    localStorage.setItem("hac_student_name", "Alex Johnson");
    localStorage.setItem("hac_logged_in", "true");
    
    return {
      success: true,
      sessionToken: mockToken,
      studentId: "12345",
      studentName: "Alex Johnson"
    };
  }
  
  // Real API call (when USE_MOCK_DATA = false)
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error("Login failed");
    }
    
    const data = await response.json();
    
    // Store session info
    localStorage.setItem("hac_session_token", data.sessionToken);
    localStorage.setItem("hac_student_id", data.studentId);
    localStorage.setItem("hac_student_name", data.studentName);
    localStorage.setItem("hac_logged_in", "true");
    
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
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
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

/**
 * Fetch all classes and grades
 */
export async function fetchGrades() {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { classes: MOCK_CLASSES };
  }
  
  // Real API call
  try {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch grades");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching grades:", error);
    // Fallback to mock data on error
    return { classes: MOCK_CLASSES };
  }
}

/**
 * Fetch upcoming assignments
 */
export async function fetchUpcomingAssignments() {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { upcoming: MOCK_UPCOMING };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/upcoming`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch upcoming assignments");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming assignments:", error);
    return { upcoming: MOCK_UPCOMING };
  }
}

/**
 * Fetch recent grades
 */
export async function fetchRecentGrades() {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { recent: MOCK_RECENT };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/recent`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch recent grades");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching recent grades:", error);
    return { recent: MOCK_RECENT };
  }
}

/**
 * Fetch assignments for a specific class
 */
export async function fetchClassAssignments(classId: string) {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock assignments for a class
    return {
      assignments: [
        {
          id: "a1",
          name: "Midterm Exam",
          score: 92,
          maxScore: 100,
          percentage: 92,
          weight: 30,
          dueDate: "2024-12-01",
          category: "Tests",
          graded: true
        },
        {
          id: "a2",
          name: "Homework Set 5",
          score: 95,
          maxScore: 100,
          percentage: 95,
          weight: 10,
          dueDate: "2024-11-28",
          category: "Homework",
          graded: true
        },
        {
          id: "a3",
          name: "Quiz 8",
          score: 88,
          maxScore: 100,
          percentage: 88,
          weight: 15,
          dueDate: "2024-11-25",
          category: "Quizzes",
          graded: true
        }
      ]
    };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/assignments`, {
      headers: getAuthHeaders()
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