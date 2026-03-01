// ========================================
// HAC WEB SCRAPER - ClassMate v2.71
// ========================================
// Scrapes student data from Home Access Center (HAC/PowerSchool)
// Including: Login, Classes, Quarterly Grades, and Assignments

// ========================================
// TYPES & INTERFACES
// ========================================

export interface HACSession {
  cookies: string;
  studentName: string;
}

export interface HACClass {
  id: string;
  name: string;
  period: string;
  teacher: string;
  grade: number;
  letterGrade: string;
  // Quarterly grades
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  // 6-week averages (from Classwork page)
  sixWeekAverage?: number;
}

export interface HACAssignment {
  id: string;
  title: string;
  category: string;
  dateAssigned: string;
  dateDue: string;
  score: string;
  totalPoints: string;
  weight: string;
  notes: string;
}

export interface HACCategoryGrade {
  category: string;
  grade: string;
  weight: string;
}

export interface HACLoginCredentials {
  districtUrl: string;
  username: string;
  password: string;
}

// ========================================
// LOGIN FUNCTION
// ========================================

/**
 * Logs into HAC and returns a session with cookies
 */
export async function hacLogin(credentials: HACLoginCredentials): Promise<HACSession> {
  console.log("🔐 HAC Login: Starting login process...");
  console.log("   District URL:", credentials.districtUrl);
  console.log("   Username:", credentials.username);
  
  const loginUrl = `https://${credentials.districtUrl}/HomeAccess/Account/LogOn`;
  console.log("   Login URL:", loginUrl);
  
  // Step 1: Get the login page to extract form fields
  console.log("📄 Step 1: Fetching login page...");
  let loginPageResponse;
  
  try {
    loginPageResponse = await fetch(loginUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch login page:", error.message);
    throw new Error(`Network error: ${error.message}`);
  }
  
  console.log("   Login page status:", loginPageResponse.status);
  
  if (loginPageResponse.status !== 200) {
    throw new Error(`Login page returned status ${loginPageResponse.status}`);
  }
  
  const loginPageHtml = await loginPageResponse.text();
  console.log("   Login page HTML length:", loginPageHtml.length);
  
  // Extract __RequestVerificationToken
  const tokenRegex = /<input[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"/i;
  const tokenMatch = loginPageHtml.match(tokenRegex);
  
  if (!tokenMatch) {
    console.error("❌ Could not find __RequestVerificationToken in login page");
    console.error("   HTML preview:", loginPageHtml.substring(0, 500));
    throw new Error("Login form token not found");
  }
  
  const verificationToken = tokenMatch[1];
  console.log("   Found verification token:", verificationToken.substring(0, 20) + "...");
  
  // Extract Database dropdown options and get the first available value
  let databaseValue = "10"; // Default fallback
  const selectRegex = /<select[^>]*name="Database"[^>]*>(.*?)<\/select>/is;
  const selectMatch = loginPageHtml.match(selectRegex);
  
  if (selectMatch) {
    const optionsHtml = selectMatch[1];
    const optionRegex = /<option[^>]*value="([^"]*)"/i;
    const optionMatch = optionsHtml.match(optionRegex);
    
    if (optionMatch && optionMatch[1]) {
      databaseValue = optionMatch[1];
      console.log("   Auto-detected Database value:", databaseValue);
    }
  } else {
    console.log("   No Database dropdown found, using default:", databaseValue);
  }
  
  // Get cookies from login page
  const setCookieHeaders = loginPageResponse.headers.getSetCookie();
  let initialCookies = "";
  
  if (setCookieHeaders && setCookieHeaders.length > 0) {
    initialCookies = setCookieHeaders.map((cookie: string) => {
      return cookie.split(";")[0];
    }).join("; ");
    console.log("   Initial cookies:", initialCookies);
  }
  
  // Step 2: Submit login form
  console.log("📝 Step 2: Submitting login credentials...");
  
  const formData = new URLSearchParams({
    "__RequestVerificationToken": verificationToken,
    "Database": databaseValue,
    "LogOnDetails.UserName": credentials.username,
    "LogOnDetails.Password": credentials.password,
  });
  
  console.log("   Form data:", formData.toString().replace(credentials.password, "****"));
  
  let loginResponse;
  
  try {
    loginResponse = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": initialCookies,
        "Referer": loginUrl,
        "Origin": `https://${credentials.districtUrl}`,
      },
      body: formData.toString(),
      redirect: "manual", // Don't follow redirects automatically
    });
  } catch (error: any) {
    console.error("❌ Failed to submit login:", error.message);
    throw new Error(`Login submission failed: ${error.message}`);
  }
  
  console.log("   Login response status:", loginResponse.status);
  console.log("   Login response headers:", Object.fromEntries(loginResponse.headers.entries()));
  
  // Check for redirect (successful login typically redirects)
  if (loginResponse.status === 302 || loginResponse.status === 301) {
    const redirectLocation = loginResponse.headers.get("Location");
    console.log("   ✅ Got redirect to:", redirectLocation);
    
    // Check if redirect is back to login page (failed login)
    if (redirectLocation?.includes("/Account/LogOn")) {
      console.error("❌ Redirected back to login page - credentials invalid");
      throw new Error("Invalid username or password");
    }
    
    // Get session cookies - MERGE initial cookies with new ones
    const loginSetCookies = loginResponse.headers.getSetCookie();
    let sessionCookies = initialCookies;
    
    if (loginSetCookies && loginSetCookies.length > 0) {
      // Parse existing cookies into a map
      const cookieMap = new Map<string, string>();
      
      // Add initial cookies
      if (initialCookies) {
        initialCookies.split("; ").forEach(cookie => {
          const [name, value] = cookie.split("=");
          if (name && value) {
            cookieMap.set(name, value);
          }
        });
      }
      
      // Add/override with new cookies from login response
      loginSetCookies.forEach((cookie: string) => {
        const cookiePart = cookie.split(";")[0];
        const [name, value] = cookiePart.split("=");
        if (name && value) {
          cookieMap.set(name, value);
        }
      });
      
      // Rebuild cookie string
      sessionCookies = Array.from(cookieMap.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join("; ");
      
      console.log("   Merged cookies:", sessionCookies);
    }
    
    console.log("   Session cookies:", sessionCookies);
    
    // Follow the redirect to get student name
    const homeUrl = redirectLocation?.startsWith("http") 
      ? redirectLocation 
      : `https://${credentials.districtUrl}${redirectLocation}`;
    
    console.log("   Following redirect to:", homeUrl);
    
    let homeResponse;
    try {
      homeResponse = await fetch(homeUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Cookie": sessionCookies,
        },
      });
    } catch (error: any) {
      console.error("❌ Failed to fetch home page:", error.message);
      throw new Error(`Failed to access home page: ${error.message}`);
    }
    
    const homeHtml = await homeResponse.text();
    
    // Extract student name from the home page
    // Look for patterns like: "Welcome, STUDENT NAME" or student name in header
    let studentName = "Student";
    
    const namePatterns = [
      /Welcome,\s*([^<]+)/i,
      /Student:\s*([^<]+)/i,
      /<span[^>]*class="[^"]*student[^"]*"[^>]*>([^<]+)/i,
    ];
    
    for (const pattern of namePatterns) {
      const match = homeHtml.match(pattern);
      if (match) {
        studentName = match[1].trim();
        console.log("   ✅ Found student name:", studentName);
        break;
      }
    }
    
    return {
      cookies: sessionCookies,
      studentName: studentName,
    };
    
  } else if (loginResponse.status === 200) {
    // Status 200 usually means login failed (stayed on login page)
    const responseHtml = await loginResponse.text();
    
    // Check for error messages
    if (responseHtml.includes("invalid") || responseHtml.includes("incorrect") || responseHtml.includes("failed")) {
      throw new Error("Invalid username or password");
    }
    
    throw new Error("Login failed - please check your credentials");
    
  } else {
    throw new Error(`Unexpected login response: ${loginResponse.status}`);
  }
}

// ========================================
// GET CLASSES FROM INTERIM PROGRESS REPORT
// ========================================

/**
 * Fetches all classes with grades from the Interim Progress Report
 * This is the MAIN function - parses the grade table with Q1-Q4 grades
 */
export async function hacGetClasses(session: HACSession, districtUrl: string): Promise<HACClass[]> {
  console.log("📚 HAC Scraper: Fetching classes with grades...");
  console.log("   Session cookies:", session.cookies ? "Present" : "Missing");
  console.log("   District URL:", districtUrl);
  
  if (!session.cookies) {
    console.error("❌ No session cookies provided!");
    throw new Error("Invalid session: no cookies");
  }
  
  // STRATEGY: User says grades are in Classwork page, names are in Interim
  // So let's fetch BOTH and combine them!
  
  // Step 1: Get class names from Interim Progress Report
  console.log("📊 Step 1: Fetching Interim Progress Report for class list...");
  const reportUrl = `https://${districtUrl}/HomeAccess/Content/Student/InterimProgressReport.aspx`;
  
  let reportResponse;
  try {
    reportResponse = await fetch(reportUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": session.cookies,
      },
      redirect: "manual",
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch interim report:", error.message);
    // Fall back to Classwork page only
    return await hacGetClassesFromClassworkOnly(session, districtUrl);
  }
  
  console.log("   Interim Report status:", reportResponse.status);
  
  if (reportResponse.status !== 200) {
    console.log("   ⚠️ Interim Report not accessible, using Classwork only");
    return await hacGetClassesFromClassworkOnly(session, districtUrl);
  }
  
  const reportHtml = await reportResponse.text();
  console.log("   Interim Report HTML length:", reportHtml.length);
  
  // Parse the Interim Report table for class names and quarterly grades
  const tableRegex = /<table[^>]*id=["']plnMain_dgIPR["'][^>]*>([\s\S]*?)<\/table>/i;
  const tableMatch = reportHtml.match(tableRegex);
  
  if (!tableMatch) {
    console.log("   ⚠️ No Interim Report table found");
    return await hacGetClassesFromClassworkOnly(session, districtUrl);
  }
  
  const classes: HACClass[] = [];
  const tableContent = tableMatch[1];
  
  // Parse rows
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = [...tableContent.matchAll(rowRegex)];
  
  console.log(`   Found ${rows.length} rows in Interim Report table`);
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const rowHtml = rows[i][1];
    
    // Skip header rows
    if (rowHtml.includes("<th")) {
      continue;
    }
    
    // Extract cells
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cellMatches = [...rowHtml.matchAll(cellRegex)];
    
    if (cellMatches.length === 0) {
      continue;
    }
    
    const cells = cellMatches.map(match => {
      return match[1].replace(/<[^>]+>/g, '').trim();
    });
    
    if (cells.length < 4) {
      continue;
    }
    
    // Typical Interim Report columns:
    // [Course, Period, Teacher, Q1, Q2, Q3, Q4, Sem1, Sem2, Exam, Final]
    const courseName = cells[0] || "";
    const period = cells[1] || "";
    const teacher = cells[2] || "";
    const q1Str = cells[3] || "";
    const q2Str = cells[4] || "";
    const q3Str = cells[5] || "";
    const q4Str = cells[6] || "";
    
    // Parse quarterly grades
    const q1 = parseFloat(q1Str) || undefined;
    const q2 = parseFloat(q2Str) || undefined;
    const q3 = parseFloat(q3Str) || undefined;
    const q4 = parseFloat(q4Str) || undefined;
    
    // Calculate current grade (use most recent quarter)
    const currentGrade = q4 || q3 || q2 || q1 || 0;
    
    console.log(`   Class ${i}: ${courseName} (Period ${period}) - ${currentGrade}%`);
    
    classes.push({
      id: `class_${i}`,
      name: courseName,
      period,
      teacher,
      grade: currentGrade,
      letterGrade: calculateLetterGrade(currentGrade),
      q1,
      q2,
      q3,
      q4,
    });
  }
  
  console.log(`   ✅ Parsed ${classes.length} classes from Interim Report`);
  return classes;
}

/**
 * Fallback: Get classes from Classwork page only
 */
async function hacGetClassesFromClassworkOnly(session: HACSession, districtUrl: string): Promise<HACClass[]> {
  console.log("📝 Fallback: Fetching from Classwork page...");
  
  const classworkUrl = `https://${districtUrl}/HomeAccess/Content/Student/Assignments.aspx`;
  
  let response;
  try {
    response = await fetch(classworkUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": session.cookies,
      },
      redirect: "manual",
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch classwork page:", error.message);
    throw new Error(`Network error: ${error.message}`);
  }
  
  console.log("   Response status:", response.status);
  
  if (response.status === 302 || response.status === 301) {
    throw new Error("Session expired. Please log in again.");
  }
  
  if (response.status !== 200) {
    throw new Error(`Failed to fetch classes: HTTP ${response.status}`);
  }
  
  const html = await response.text();
  console.log("   HTML length:", html.length);
  
  const classes: HACClass[] = [];
  
  // First, get the class list from the dropdown
  console.log("   Looking for class dropdown...");
  const dropdownRegex = /<select[^>]*id=["']plnMain_ddlClasses["'][^>]*>([\s\S]*?)<\/select>/i;
  const dropdownMatch = html.match(dropdownRegex);
  
  if (!dropdownMatch) {
    console.error("❌ No class dropdown found!");
    return [];
  }
  
  console.log("   ✅ Found class dropdown");
  const dropdownContent = dropdownMatch[1];
  
  // Parse options from dropdown
  const optionRegex = /<option[^>]*value=["']([^"']+)["'][^>]*>(.*?)<\/option>/gi;
  const options = [...dropdownContent.matchAll(optionRegex)];
  
  console.log(`   Found ${options.length} class options`);
  
  for (let i = 0; i < options.length; i++) {
    const [, classId, classText] = options[i];
    
    // Skip empty or "All Classes" option
    if (!classId || classId === "" || classId === "0" || classId === "ALL") {
      console.log(`   Option ${i}: Skipping (${classId})`);
      continue;
    }
    
    const text = classText.trim();
    console.log(`   Option ${i}: "${text}" (id: ${classId})`);
    
    // Parse class name from text like "1511A - 1    ENGLISH I HONORS A"
    // Format: [Course Code] - [Period]    [Course Name]
    let courseName = text;
    let period = "";
    
    const parts = text.split(/\s{2,}/); // Split by 2+ spaces
    if (parts.length >= 2) {
      const firstPart = parts[0]; // "1511A - 1"
      courseName = parts[1]; // "ENGLISH I HONORS A"
      
      // Extract period from first part
      const periodMatch = firstPart.match(/-\s*(\d+)/);
      if (periodMatch) {
        period = periodMatch[1];
      }
    }
    
    console.log(`      Parsed: name="${courseName}", period="${period}"`);
    
    classes.push({
      id: classId,
      name: courseName,
      period: period,
      teacher: "", // Need to fetch per-class
      grade: 95, // TEMPORARY: Mock grade until we fetch per-class
      letterGrade: "A",
    });
  }
  
  console.log(`   ✅ Parsed ${classes.length} classes from dropdown (grades mocked)`);
  return classes;
}

// ========================================
// GET ASSIGNMENTS FOR A CLASS
// ========================================

/**
 * Fetch assignments for a class with Performance/Summative categories
 */
export async function hacGetAssignments(session: HACSession, districtUrl: string, classId?: string) {
  console.log("📝 HAC Scraper: Fetching assignments...");
  console.log("   Class ID:", classId || "All classes");
  
  if (!classId) {
    console.log("   NOTE: No classId provided, returning empty data");
    return {
      assignments: [],
      categories: [],
      performance: [],
      summative: [],
    };
  }
  
  // Fetch the Classwork page for this specific class
  const classworkUrl = `https://${districtUrl}/HomeAccess/Content/Student/Assignments.aspx?classID=${classId}`;
  console.log("   Fetching:", classworkUrl);
  
  let response;
  try {
    response = await fetch(classworkUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": session.cookies,
      },
      redirect: "manual",
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch classwork page:", error.message);
    return { assignments: [], categories: [], performance: [], summative: [] };
  }
  
  console.log("   Response status:", response.status);
  
  if (response.status === 302 || response.status === 301) {
    console.error("❌ Got 302 redirect - session expired!");
    throw new Error("Session expired. Please log in again.");
  }
  
  if (response.status !== 200) {
    console.error("❌ Classwork page error:", response.status);
    return { assignments: [], categories: [], performance: [], summative: [] };
  }
  
  const html = await response.text();
  console.log("   HTML length:", html.length);
  
  const assignments: HACAssignment[] = [];
  const categories: HACCategoryGrade[] = [];
  
  // Parse assignment table - look for table with id="plnMain_dgClasswork"
  const tableRegex = /<table[^>]*id=["']plnMain_dgClasswork["'][^>]*>([\s\S]*?)<\/table>/i;
  const tableMatch = html.match(tableRegex);
  
  if (!tableMatch) {
    console.log("   ⚠️ No assignment table found (class might not have assignments yet)");
    return { assignments: [], categories: [], performance: [], summative: [] };
  }
  
  const tableContent = tableMatch[1];
  
  // Parse rows
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = [...tableContent.matchAll(rowRegex)];
  
  console.log(`   Found ${rows.length} rows in assignment table`);
  
  // Skip header row, parse data rows
  for (let i = 1; i < rows.length; i++) {
    const rowHtml = rows[i][1];
    
    // Extract cells
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [...rowHtml.matchAll(cellRegex)].map(match => {
      return match[1].replace(/<[^>]+>/g, '').trim();
    });
    
    if (cells.length < 4) continue;
    
    // Parse assignment data
    // Typical structure: Date Assigned | Date Due | Assignment | Category | Score | Total Points | Weight
    const dateAssigned = cells[0] || "";
    const dateDue = cells[1] || "";
    const title = cells[2] || "";
    const category = cells[3] || "";
    const score = cells[4] || "";
    const totalPoints = cells[5] || "";
    const weight = cells[6] || "";
    
    assignments.push({
      id: `assignment_${i}`,
      title,
      category,
      dateAssigned,
      dateDue,
      score,
      totalPoints,
      weight,
      notes: "",
    });
  }
  
  console.log(`   ✅ Parsed ${assignments.length} assignments`);
  
  // Parse category grades (Performance vs Summative)
  // Look for category average table
  const categoryRegex = /<table[^>]*id=["']plnMain_rpClassAverage["'][^>]*>([\s\S]*?)<\/table>/i;
  const categoryMatch = html.match(categoryRegex);
  
  if (categoryMatch) {
    const categoryContent = categoryMatch[1];
    const categoryRows = [...categoryContent.matchAll(rowRegex)];
    
    for (let i = 1; i < categoryRows.length; i++) {
      const rowHtml = categoryRows[i][1];
      const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match => {
        return match[1].replace(/<[^>]+>/g, '').trim();
      });
      
      if (cells.length >= 3) {
        const category = cells[0] || "";
        const grade = cells[1] || "";
        const weight = cells[2] || "";
        
        categories.push({ category, grade, weight });
      }
    }
  }
  
  console.log(`   ✅ Found ${categories.length} grade categories`);
  
  // Separate into Performance and Summative
  const performanceCategories = ["Homework", "Classwork", "Participation", "Daily", "Practice"];
  const summativeCategories = ["Test", "Exam", "Quiz", "Project", "Assessment", "Final"];
  
  const performance = assignments.filter(a => 
    performanceCategories.some(cat => a.category.toLowerCase().includes(cat.toLowerCase()))
  );
  
  const summative = assignments.filter(a =>
    summativeCategories.some(cat => a.category.toLowerCase().includes(cat.toLowerCase()))
  );
  
  console.log(`   📊 Performance assignments: ${performance.length}`);
  console.log(`   📊 Summative assignments: ${summative.length}`);
  
  return {
    assignments,
    categories,
    performance,
    summative,
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Converts a numeric grade to a letter grade
 */
function calculateLetterGrade(grade: number): string {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}