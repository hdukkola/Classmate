"""
EXAMPLE PYTHON API FOR POWERSCHOOL HAC INTEGRATION
This is a complete working example you can copy and customize!

QUICK START:
1. Save this file as "app.py"
2. Install requirements: pip install flask flask-cors
3. Run locally: python app.py
4. Test: Visit http://localhost:5000/api/grades in your browser
5. Deploy to Render.com when ready!

NOTE: This example uses MOCK data. Replace the mock functions
with your actual HAC scraping code.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os

# ============================================
# FLASK APP SETUP
# ============================================

app = Flask(__name__)

# Enable CORS so your React app can talk to this API
# In production, you'd want to restrict this to your specific domain
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Change to your React app URL in production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ============================================
# MOCK HAC DATA (Replace with real scraping)
# ============================================

# In a real app, you'd store sessions in Redis or a database
# For this example, we'll use a simple in-memory dict
sessions = {}

def mock_hac_login(username, password, district_url):
    """
    Replace this with your actual HAC login code
    Example using a real HAC library:
    
    from hac_scraper import HACClient
    client = HACClient()
    success = client.login(username, password, district_url)
    if success:
        return client.get_student_info()
    return None
    """
    
    # Mock successful login
    if username and password:
        return {
            'student_id': '12345',
            'student_name': 'Alex Johnson',
            'grade_level': '11'
        }
    return None

def mock_get_grades(student_id):
    """
    Replace this with actual HAC grade fetching
    """
    return {
        'classes': [
            {
                'id': '1',
                'name': 'AP Calculus BC',
                'teacher': 'Mrs. Johnson',
                'grade': 97,
                'credits': 1.0,
                'room': 'Math 205',
                'period': '1'
            },
            {
                'id': '2',
                'name': 'AP Physics C',
                'teacher': 'Mr. Rodriguez',
                'grade': 94,
                'credits': 1.0,
                'room': 'Science 304',
                'period': '2'
            },
            {
                'id': '3',
                'name': 'English Literature',
                'teacher': 'Ms. Thompson',
                'grade': 88,
                'credits': 1.0,
                'room': 'English 102',
                'period': '3'
            },
            {
                'id': '4',
                'name': 'AP US History',
                'teacher': 'Mr. Chen',
                'grade': 92,
                'credits': 1.0,
                'room': 'History 201',
                'period': '4'
            },
            {
                'id': '5',
                'name': 'Spanish IV',
                'teacher': 'Señora Martinez',
                'grade': 90,
                'credits': 1.0,
                'room': 'Lang 105',
                'period': '5'
            },
            {
                'id': '6',
                'name': 'AP Computer Science',
                'teacher': 'Dr. Williams',
                'grade': 96,
                'credits': 1.0,
                'room': 'Tech 401',
                'period': '6'
            }
        ]
    }

def mock_get_upcoming(student_id):
    """
    Replace with actual upcoming assignments fetching
    """
    return {
        'upcoming': [
            {
                'className': 'AP Calculus BC',
                'assignment': 'Final Exam',
                'dueDate': 'Dec 15',
                'weight': '30%',
                'category': 'Tests'
            },
            {
                'className': 'English Literature',
                'assignment': 'Final Essay',
                'dueDate': 'Dec 18',
                'weight': '25%',
                'category': 'Essays'
            },
            {
                'className': 'AP Physics C',
                'assignment': 'Lab Final Report',
                'dueDate': 'Dec 20',
                'weight': '20%',
                'category': 'Labs'
            },
            {
                'className': 'AP US History',
                'assignment': 'DBQ Final',
                'dueDate': 'Dec 16',
                'weight': '35%',
                'category': 'Essays'
            }
        ]
    }

def mock_get_recent(student_id):
    """
    Replace with actual recent grades fetching
    """
    return {
        'recent': [
            {
                'className': 'AP Calculus BC',
                'assignment': 'Midterm Exam',
                'grade': '92%',
                'date': 'Dec 1'
            },
            {
                'className': 'English Literature',
                'assignment': 'Shakespeare Essay',
                'grade': '88%',
                'date': 'Nov 28'
            },
            {
                'className': 'AP Physics C',
                'assignment': 'Lab Report #3',
                'grade': '94%',
                'date': 'Nov 25'
            }
        ]
    }

def mock_get_class_assignments(student_id, class_id):
    """
    Replace with actual class assignments fetching
    """
    return {
        'assignments': [
            {
                'id': 'a1',
                'name': 'Midterm Exam',
                'score': 92,
                'maxScore': 100,
                'percentage': 92,
                'weight': 30,
                'dueDate': '2024-12-01',
                'category': 'Tests',
                'graded': True
            },
            {
                'id': 'a2',
                'name': 'Homework Set 5',
                'score': 95,
                'maxScore': 100,
                'percentage': 95,
                'weight': 10,
                'dueDate': '2024-11-28',
                'category': 'Homework',
                'graded': True
            },
            {
                'id': 'a3',
                'name': 'Quiz 8',
                'score': 88,
                'maxScore': 100,
                'percentage': 88,
                'weight': 15,
                'dueDate': '2024-11-25',
                'category': 'Quizzes',
                'graded': True
            }
        ]
    }

# ============================================
# API ROUTES
# ============================================

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'PowerSchool HAC API is running!',
        'version': '1.0.0',
        'endpoints': [
            'POST /api/login',
            'GET /api/grades',
            'GET /api/assignments/upcoming',
            'GET /api/assignments/recent',
            'GET /api/classes/<class_id>/assignments'
        ]
    })

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    """
    Login to PowerSchool HAC
    
    Request Body:
    {
        "username": "student_username",
        "password": "student_password",
        "districtUrl": "https://hac.yourdistrict.org"
    }
    
    Response:
    {
        "success": true,
        "sessionToken": "abc123...",
        "studentId": "12345",
        "studentName": "Alex Johnson"
    }
    """
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        district_url = data.get('districtUrl')
        
        if not all([username, password, district_url]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Attempt login (replace with real HAC login)
        student_info = mock_hac_login(username, password, district_url)
        
        if not student_info:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Create session token (in production, use JWT or similar)
        session_token = f"session_{student_info['student_id']}_{datetime.now().timestamp()}"
        sessions[session_token] = student_info
        
        return jsonify({
            'success': True,
            'sessionToken': session_token,
            'studentId': student_info['student_id'],
            'studentName': student_info['student_name']
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/grades', methods=['GET'])
def get_grades():
    """
    Get all classes and grades
    
    Headers:
    Authorization: Bearer <session_token>
    
    Response:
    {
        "classes": [
            {
                "id": "1",
                "name": "AP Calculus BC",
                "teacher": "Mrs. Johnson",
                "grade": 97,
                ...
            }
        ]
    }
    """
    
    try:
        # Get session token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing authorization'}), 401
        
        session_token = auth_header.split('Bearer ')[1]
        
        # Validate session (in production, verify JWT)
        if session_token not in sessions:
            return jsonify({'error': 'Invalid session'}), 401
        
        student_info = sessions[session_token]
        student_id = student_info['student_id']
        
        # Fetch grades (replace with real HAC scraping)
        grades_data = mock_get_grades(student_id)
        
        return jsonify(grades_data)
        
    except Exception as e:
        print(f"Get grades error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/assignments/upcoming', methods=['GET'])
def get_upcoming():
    """
    Get upcoming assignments
    
    Headers:
    Authorization: Bearer <session_token>
    
    Response:
    {
        "upcoming": [
            {
                "className": "AP Calculus BC",
                "assignment": "Final Exam",
                "dueDate": "Dec 15",
                "weight": "30%"
            }
        ]
    }
    """
    
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing authorization'}), 401
        
        session_token = auth_header.split('Bearer ')[1]
        
        if session_token not in sessions:
            return jsonify({'error': 'Invalid session'}), 401
        
        student_info = sessions[session_token]
        student_id = student_info['student_id']
        
        upcoming_data = mock_get_upcoming(student_id)
        
        return jsonify(upcoming_data)
        
    except Exception as e:
        print(f"Get upcoming error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/assignments/recent', methods=['GET'])
def get_recent():
    """
    Get recent graded assignments
    
    Headers:
    Authorization: Bearer <session_token>
    
    Response:
    {
        "recent": [
            {
                "className": "AP Calculus BC",
                "assignment": "Midterm Exam",
                "grade": "92%",
                "date": "Dec 1"
            }
        ]
    }
    """
    
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing authorization'}), 401
        
        session_token = auth_header.split('Bearer ')[1]
        
        if session_token not in sessions:
            return jsonify({'error': 'Invalid session'}), 401
        
        student_info = sessions[session_token]
        student_id = student_info['student_id']
        
        recent_data = mock_get_recent(student_id)
        
        return jsonify(recent_data)
        
    except Exception as e:
        print(f"Get recent error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/classes/<class_id>/assignments', methods=['GET'])
def get_class_assignments(class_id):
    """
    Get assignments for a specific class
    
    Headers:
    Authorization: Bearer <session_token>
    
    Response:
    {
        "assignments": [...]
    }
    """
    
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing authorization'}), 401
        
        session_token = auth_header.split('Bearer ')[1]
        
        if session_token not in sessions:
            return jsonify({'error': 'Invalid session'}), 401
        
        student_info = sessions[session_token]
        student_id = student_info['student_id']
        
        assignments_data = mock_get_class_assignments(student_id, class_id)
        
        return jsonify(assignments_data)
        
    except Exception as e:
        print(f"Get class assignments error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    # Get port from environment variable (for deployment)
    port = int(os.environ.get('PORT', 5000))
    
    # Debug mode - set to False in production!
    debug = os.environ.get('DEBUG', 'True') == 'True'
    
    print(f"🚀 Starting PowerSchool HAC API on port {port}")
    print(f"📍 Local URL: http://localhost:{port}")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=port,
        debug=debug
    )
