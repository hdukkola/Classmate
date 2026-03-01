# PowerSchool HAC API Integration Guide

## 📋 Overview

This guide explains how to integrate your Python PowerSchool HAC API with the ClassMate React app.

## 🏗️ Architecture

```
[React Frontend] <----> [Python Backend API] <----> [PowerSchool HAC]
  (This App)           (Your Python Server)        (School System)
```

## 🚀 Setup Steps

### 1. Deploy Your Python API

Your Python API needs to be hosted on a server that's accessible from the internet. Options include:

- **Heroku** (easiest for beginners)
- **Railway** (modern, simple)
- **AWS EC2** (more control)
- **Digital Ocean** (flexible)
- **Render** (free tier available)
- **PythonAnywhere** (Python-specific hosting)

### 2. Required API Endpoints

Your Python backend should expose these endpoints:

```python
# Authentication
POST /api/login
{
  "username": "student_username",
  "password": "student_password",
  "district_url": "https://hac.yourdistrict.org"
}
Response: { "session_token": "...", "student_id": "..." }

# Get Classes/Grades
GET /api/grades
Headers: { "Authorization": "Bearer <session_token>" }
Response: {
  "classes": [
    {
      "id": "1",
      "name": "AP Calculus BC",
      "teacher": "Mrs. Johnson",
      "grade": 97,
      "credits": 1.0,
      "room": "Math 205",
      "period": "1",
      "assignments": [...]
    }
  ]
}

# Get Assignments for a Class
GET /api/classes/{class_id}/assignments
Headers: { "Authorization": "Bearer <session_token>" }
Response: {
  "assignments": [
    {
      "id": "a1",
      "name": "Midterm Exam",
      "score": 92,
      "maxScore": 100,
      "weight": 30,
      "dueDate": "2024-12-15",
      "category": "Tests"
    }
  ]
}

# Get Upcoming Assignments
GET /api/assignments/upcoming
Headers: { "Authorization": "Bearer <session_token>" }
Response: {
  "upcoming": [
    {
      "className": "AP Calculus BC",
      "assignmentName": "Final Exam",
      "dueDate": "Dec 15",
      "weight": "30%"
    }
  ]
}
```

### 3. Frontend Integration in ClassMate

#### a. Create API Service File

Create `/src/app/services/hacApi.ts`:

```typescript
const API_BASE_URL = "https://your-python-api.herokuapp.com/api";

// Store session token in localStorage
export async function loginToHAC(username: string, password: string, districtUrl: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, district_url: districtUrl }),
  });
  
  if (!response.ok) throw new Error("Login failed");
  
  const data = await response.json();
  localStorage.setItem("hac_session_token", data.session_token);
  localStorage.setItem("hac_student_id", data.student_id);
  return data;
}

export async function fetchGrades() {
  const token = localStorage.getItem("hac_session_token");
  if (!token) throw new Error("Not logged in");
  
  const response = await fetch(`${API_BASE_URL}/grades`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error("Failed to fetch grades");
  return response.json();
}

export async function fetchUpcomingAssignments() {
  const token = localStorage.getItem("hac_session_token");
  if (!token) throw new Error("Not logged in");
  
  const response = await fetch(`${API_BASE_URL}/assignments/upcoming`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error("Failed to fetch upcoming assignments");
  return response.json();
}
```

#### b. Update Home.tsx to use real data

```typescript
import { useEffect, useState } from "react";
import { fetchGrades, fetchUpcomingAssignments } from "../services/hacApi";

// Inside Home component:
const [upcomingGrades, setUpcomingGrades] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    try {
      const [gradesData, upcomingData] = await Promise.all([
        fetchGrades(),
        fetchUpcomingAssignments()
      ]);
      
      // Update state with real data
      setUpcomingGrades(upcomingData.upcoming);
      // Update classes state too
    } catch (error) {
      console.error("Failed to load HAC data:", error);
      // Fall back to mock data
    } finally {
      setIsLoading(false);
    }
  }
  
  loadData();
}, []);
```

#### c. Add Login Screen

Create `/src/app/screens/Login.tsx`:

```typescript
import { useState } from "react";
import { useNavigate } from "react-router";
import { loginToHAC } from "../services/hacApi";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [districtUrl, setDistrictUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setIsLoading(true);
    try {
      await loginToHAC(username, password, districtUrl);
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Login UI here
  );
}
```

## 🔐 Security Considerations

### ⚠️ CRITICAL: Never Store Credentials in Frontend

- **DO NOT** hardcode API keys, passwords, or tokens in React code
- **DO NOT** commit `.env` files with sensitive data to Git
- Store session tokens in `localStorage` (temporary)
- Clear tokens on logout

### Python Backend Security

Your Python API should:
- Use HTTPS only (not HTTP)
- Implement rate limiting to prevent abuse
- Hash/encrypt stored credentials
- Use environment variables for secrets
- Implement session expiration (e.g., 1 hour)
- Add CORS headers to allow your frontend domain

Example Python CORS setup:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-classmate-app.com"])
```

## 📝 Example Python API Structure

Here's a basic Flask example:

```python
from flask import Flask, request, jsonify
import requests
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
SECRET_KEY = "your-secret-key"  # Use environment variable!

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    district_url = data.get("district_url")
    
    # Use your HAC scraping library here
    # Example: hac_client.login(username, password, district_url)
    
    # Generate session token
    token = jwt.encode({
        "student_id": student_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({
        "session_token": token,
        "student_id": student_id
    })

@app.route("/api/grades", methods=["GET"])
def get_grades():
    token = request.headers.get("Authorization").split(" ")[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        student_id = payload["student_id"]
        
        # Fetch grades from HAC using your library
        grades_data = fetch_from_hac(student_id)
        
        return jsonify(grades_data)
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Session expired"}), 401
```

## 🧪 Testing

1. **Test Python API independently** using Postman or curl
2. **Test with mock data first** in React before connecting to real API
3. **Handle errors gracefully** - show user-friendly messages
4. **Add loading states** - show spinners while fetching data

## 📊 Data Flow Example

```
1. User logs in on Login screen
   ↓
2. React calls loginToHAC()
   ↓
3. Python API authenticates with PowerSchool
   ↓
4. Session token stored in localStorage
   ↓
5. Home screen calls fetchGrades()
   ↓
6. Python API fetches from PowerSchool
   ↓
7. Data displayed in ClassMate UI
```

## 🚨 Common Issues & Solutions

### CORS Errors
**Problem:** Browser blocks requests to Python API
**Solution:** Add CORS headers in Python backend

### 401 Unauthorized
**Problem:** Session token expired or invalid
**Solution:** Implement token refresh or redirect to login

### Slow Loading
**Problem:** API calls take too long
**Solution:** Add loading states and cache data in localStorage

## 📌 Next Steps

1. Deploy your Python API to a hosting service
2. Get the public URL (e.g., `https://myapp.herokuapp.com`)
3. Create `/src/app/services/hacApi.ts` with that URL
4. Update API_BASE_URL to your deployed URL
5. Test login flow
6. Update Home.tsx to fetch real data
7. Add error handling and loading states

## 💡 Important Notes

- **Privacy**: Inform users you're storing their HAC credentials
- **FERPA Compliance**: Handle student data responsibly
- **Rate Limiting**: Don't spam PowerSchool servers
- **Caching**: Cache data to reduce API calls
- **Error Messages**: Be helpful when things fail

---

Need help? Common Python HAC libraries:
- `powerschool-api` (unofficial)
- Custom web scraping with `BeautifulSoup`
- `selenium` for JavaScript-heavy HAC sites
