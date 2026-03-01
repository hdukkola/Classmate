# 🎓 Complete Beginner's Guide to Integrating PowerSchool HAC API

## 📌 What You Have Right Now

✅ Your app is **ALREADY WORKING** with mock (fake) data!  
✅ The "Upcoming Grades" section is showing sample assignments  
✅ Everything is displaying correctly

## 🤔 Understanding the Pieces

Think of your app like a restaurant:

```
┌─────────────────────────────────────────────┐
│  YOUR REACT APP (The Restaurant)            │
│  • Shows pretty menus (UI)                  │
│  • Takes orders (user clicks)               │
│  • Serves food (displays data)              │
└─────────────────────────────────────────────┘
                    ↕️
        (Waiter brings food from kitchen)
                    ↕️
┌─────────────────────────────────────────────┐
│  YOUR PYTHON API (The Kitchen)              │
│  • Cooks the food (fetches HAC data)        │
│  • Follows recipes (your Python code)       │
└─────────────────────────────────────────────┘
                    ↕️
        (Kitchen gets ingredients)
                    ↕️
┌─────────────────────────────────────────────┐
│  POWERSCHOOL HAC (The Grocery Store)        │
│  • Has all the ingredients (real grades)    │
│  • Needs credentials to shop there          │
└─────────────────────────────────────────────┘
```

## 🎯 STEP-BY-STEP: From Zero to Hero

### ✅ **Phase 1: You're Already Here! (Mock Data)**

Your app already works with fake data. This is PERFECT for development!

**What's happening:**
- File: `/src/app/services/hacApi.ts`
- Line 9: `const USE_MOCK_DATA = true;`
- This means your app shows fake grades without needing a server

**You can test everything RIGHT NOW!** The app works perfectly.

---

### 🔧 **Phase 2: Set Up Your Python API** (When You're Ready)

You said you have a Python API. Here's what you need to do:

#### Option A: I Already Have Python Code

**1. Your Python API needs these endpoints:**

```python
# Example using Flask (a Python web framework)

from flask import Flask, request, jsonify
from flask_cors import CORS
import your_hac_library  # Your PowerSchool scraping code

app = Flask(__name__)
CORS(app)  # Allow your React app to talk to this

# LOGIN ENDPOINT
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    # Use your HAC library to log in
    # ... your code here ...
    
    return jsonify({
        'sessionToken': 'abc123',
        'studentId': '12345',
        'studentName': 'Alex Johnson'
    })

# GET GRADES ENDPOINT
@app.route('/api/grades', methods=['GET'])
def get_grades():
    # Use your HAC library to fetch grades
    # ... your code here ...
    
    return jsonify({
        'classes': [
            {
                'id': '1',
                'name': 'AP Calculus BC',
                'teacher': 'Mrs. Johnson',
                'grade': 97,
                'credits': 1.0,
                'room': 'Math 205',
                'period': '1'
            }
            # ... more classes ...
        ]
    })

# GET UPCOMING ASSIGNMENTS
@app.route('/api/assignments/upcoming', methods=['GET'])
def get_upcoming():
    return jsonify({
        'upcoming': [
            {
                'className': 'AP Calculus BC',
                'assignment': 'Final Exam',
                'dueDate': 'Dec 15',
                'weight': '30%'
            }
            # ... more upcoming ...
        ]
    })

# GET RECENT GRADES
@app.route('/api/assignments/recent', methods=['GET'])
def get_recent():
    return jsonify({
        'recent': [
            {
                'className': 'AP Calculus BC',
                'assignment': 'Midterm Exam',
                'grade': '92%',
                'date': 'Dec 1'
            }
            # ... more recent ...
        ]
    })

if __name__ == '__main__':
    app.run(port=5000)
```

**2. Install Flask (if you haven't):**

```bash
pip install flask flask-cors
```

**3. Run your Python server locally:**

```bash
python your_api_file.py
```

Your API will run at: `http://localhost:5000`

#### Option B: I Don't Have Python Code Yet

**Popular Python libraries for HAC:**
- `powerschool-api` (GitHub search)
- Build your own with `requests` + `BeautifulSoup`
- Use `selenium` for JavaScript-heavy sites

---

### 🌐 **Phase 3: Deploy Your Python API to the Internet**

Your Python code runs on YOUR computer. To let your app access it from anywhere, you need to put it online.

#### **🔥 Easiest Option: Render.com (FREE)**

1. **Create account:** https://render.com
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repo** (push your Python code to GitHub first)
4. **Configure:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py` (or whatever your file is called)
5. **Click "Create Web Service"**
6. **Copy your URL:** `https://your-app.onrender.com`

#### **Other Easy Options:**

| Platform | Free Tier | Good For |
|----------|-----------|----------|
| **Render** | ✅ Yes | Beginners (easiest!) |
| **Railway** | ✅ Limited | Fast deployment |
| **Heroku** | ⚠️ Paid now | Was popular |
| **PythonAnywhere** | ✅ Yes | Python-specific |
| **Vercel** | ⚠️ Node.js only | Not for Python |

---

### 🔗 **Phase 4: Connect React App to Your API**

Once your Python API is online, you have a URL like:
`https://your-api.onrender.com`

**Update ONE line in your React app:**

1. Open `/src/app/services/hacApi.ts`
2. Find line 9: `const API_BASE_URL = "https://your-python-api-url.com/api";`
3. Change it to: `const API_BASE_URL = "https://your-api.onrender.com/api";`
4. Find line 10: `const USE_MOCK_DATA = true;`
5. Change it to: `const USE_MOCK_DATA = false;`

**That's it!** Your app will now fetch REAL data!

---

## 🧪 **Testing Your Setup**

### Test Your Python API Directly

Before connecting to React, test your Python API:

**Using curl (Terminal/Command Prompt):**

```bash
# Test login
curl -X POST https://your-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Test get grades
curl https://your-api.onrender.com/api/grades
```

**Using a Browser:**
Just visit: `https://your-api.onrender.com/api/grades`

You should see JSON data!

---

## 🔒 About Firebase

You mentioned you have Firebase. Here's what Firebase CAN and CANNOT do:

### ✅ Firebase CAN Do:
- **Authentication:** Log users in/out
- **Database:** Store grades data (Firestore)
- **Storage:** Store files
- **Hosting:** Host your React app

### ❌ Firebase CANNOT Do:
- **Run Python code** (Firebase Functions only supports Node.js/JavaScript)
- **Directly scrape PowerSchool** (you need a server for that)

### 🤝 Can You Use Both?

**YES!** Here's a hybrid approach:

1. **Python Server (Render)** → Scrapes PowerSchool HAC
2. **Firebase Firestore** → Caches the grade data
3. **React App** → Reads from Firebase (super fast!)

**Benefits:**
- Firebase is FAST (no waiting for HAC)
- Firebase is FREE for small apps
- Only hit HAC once per hour (not every page load)

---

## 🎨 **Using Firebase + Python (Advanced)**

If you want to combine them:

```
1. Python API scrapes HAC every hour
2. Python API saves to Firebase Firestore
3. React app reads from Firestore (instant!)
4. Add Firebase Auth for user login
```

**Python code to save to Firebase:**

```python
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Save grades to Firestore
def save_grades_to_firebase(student_id, grades_data):
    db.collection('students').document(student_id).set({
        'classes': grades_data,
        'lastUpdated': firestore.SERVER_TIMESTAMP
    })
```

**React code to read from Firebase:**

```typescript
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const docRef = doc(db, 'students', studentId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const grades = docSnap.data().classes;
}
```

---

## 🚨 **Common Beginner Mistakes**

### ❌ **Mistake 1:** "I copied Python code into my React app"
**Why it fails:** Python ≠ JavaScript. They're different languages.
**Solution:** Keep Python on a server, React talks to it via HTTP.

### ❌ **Mistake 2:** "My API works locally but not online"
**Why it fails:** `localhost` only works on your computer.
**Solution:** Deploy to Render/Railway so it has a public URL.

### ❌ **Mistake 3:** "CORS error in browser"
**Why it fails:** Browser security blocks cross-origin requests.
**Solution:** Add CORS headers in Python (see Flask example above).

### ❌ **Mistake 4:** "My credentials are in my code"
**Why it fails:** Security risk! Don't commit passwords to GitHub.
**Solution:** Use environment variables:

```python
import os
HAC_USERNAME = os.environ.get('HAC_USERNAME')
HAC_PASSWORD = os.environ.get('HAC_PASSWORD')
```

---

## 📋 **Quick Checklist**

### Phase 1: Development (You Are Here!)
- [x] App works with mock data
- [x] UI displays correctly
- [x] No server needed yet

### Phase 2: Python API
- [ ] Write Python code to scrape HAC
- [ ] Create Flask/FastAPI endpoints
- [ ] Test locally at `localhost:5000`
- [ ] Add CORS headers

### Phase 3: Deploy
- [ ] Create Render.com account
- [ ] Push code to GitHub
- [ ] Deploy to Render
- [ ] Get public URL

### Phase 4: Connect
- [ ] Update `API_BASE_URL` in hacApi.ts
- [ ] Change `USE_MOCK_DATA` to `false`
- [ ] Test in React app
- [ ] Celebrate! 🎉

---

## 🆘 **Need Help? Debug Guide**

### Problem: "Cannot reach my API"
**Check:**
- Is your Python server running?
- Did you deploy it online?
- Is the URL correct in `hacApi.ts`?
- Open browser DevTools → Network tab to see errors

### Problem: "CORS error"
**Solution:** Add to your Python code:
```python
from flask_cors import CORS
CORS(app)
```

### Problem: "Data not showing"
**Check:**
- Open browser console (F12)
- Look for error messages
- Check Network tab to see API responses
- Verify your API returns correct JSON format

---

## 🎯 **What to Do RIGHT NOW**

### If you just want to see it working:
✅ **DO NOTHING!** Your app already works with mock data.

### If you want to connect to real HAC:
1. ✅ Test your Python code locally first
2. ✅ Make sure it can log into HAC and get grades
3. ✅ Create the 4 endpoints (login, grades, upcoming, recent)
4. ✅ Deploy to Render.com
5. ✅ Update the URL in `hacApi.ts`

### If you're stuck:
1. Start with mock data (already done!)
2. Work on Python code separately
3. Test Python code locally
4. Then connect them later

---

## 💡 **Pro Tips**

1. **Start Simple:** Get ONE endpoint working before adding all features
2. **Test Separately:** Make sure Python works before connecting to React
3. **Use Mock Data:** Perfect for building UI without a server
4. **Add Logging:** `console.log()` in React, `print()` in Python
5. **Check Network Tab:** Browser DevTools shows all API calls
6. **Read Errors:** Error messages usually tell you exactly what's wrong

---

## 📚 **Resources**

- **Flask Tutorial:** https://flask.palletsprojects.com/
- **Render Deploy Guide:** https://render.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **CORS Explained:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## ✨ **Summary**

1. **Your app ALREADY WORKS** with mock data
2. **When ready**, build Python API with 4 endpoints
3. **Deploy** Python API to Render.com (free!)
4. **Update** one line in `hacApi.ts` with your API URL
5. **Change** `USE_MOCK_DATA` from `true` to `false`
6. **Done!** Your app now shows real grades

**You don't need to do this right now.** The app is fully functional with mock data for testing and development!

---

**Questions? Check the file `/API_INTEGRATION_GUIDE.md` for technical details!**
