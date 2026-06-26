# python-project/app.py
import os
import pickle
import numpy as np
from flask import Flask, render_react, render_template, request, jsonify, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import db, User, Profile, Course, Question, Assessment, Recommendation
from utils.pdf_generator import generate_assessment_pdf

app = Flask(__name__)
app.config['SECRET_KEY'] = 'b_tech_and_mca_project_secret_key_12345'
# Using lightweight local SQLite file for immediate out-of-the-box execution (User can easily configure MySQL credentials below)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///skill_recommendation.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB and Login Systems
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# ML Models Loader (Random Forest Classifier)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ai/recommendation_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'ai/scaler.pkl')

ml_model = None
ml_scaler = None

def load_ml_assets():
    global ml_model, ml_scaler
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            with open(MODEL_PATH, 'rb') as f:
                ml_model = pickle.load(f)
            with open(SCALER_PATH, 'rb') as f:
                ml_scaler = pickle.load(f)
            print("AI ML Assets successfully loaded in memory.")
        else:
            print("WARNING: ML Assets recommendation_model.pkl / scaler.pkl not generated/compiled yet. Run train_model.py first.")
    except Exception as e:
        print(f"Failed to load AI ML Assets. Falling back: {e}")

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create database tables and seed basic questions/courses
@app.before_request
def setup_db_tables():
    # Only run DB creation on first call
    if not os.path.exists('sqlite:///skill_recommendation.db'):
        db.create_all()
        # Seed initial courses if empty
        if Course.query.count() == 0:
            seed_initial_data()
        load_ml_assets()

# Seed mock questions & courses
def seed_initial_data():
    python_courses = [
        Course(title="Python Basics", domain="Python", level="Beginner", description="Master loops, variables and operators.", url="https://python.org"),
        Course(title="Flask Backend APIs", domain="Python", level="Intermediate", description="Object-Oriented syntax and Express-style backends.", url="https://flask.palletsprojects.com"),
        Course(title="Scikit-Learn Machine Learning", domain="Python", level="Advanced", description="Build neural networks & Random Forest systems.", url="https://scikit-learn.org")
    ]
    db.session.bulk_save_objects(python_courses)

    # Seed mock admin questions
    mock_questions = [
        Question(domain="Python", question="Mutable collections in Python?", option_a="Tuple", option_b="String", option_c="List", option_d="FrozenSet", correct_option="C"),
        Question(domain="Python", question="Which keyword returns dynamic generators?", option_a="yield", option_b="return", option_c="emit", option_d="break", correct_option="A"),
        # Add additional items as necessary
    ]
    db.session.bulk_save_objects(mock_questions)
    
    # Base admin credential seed
    admin_usr = User(username='admin', password_hash=generate_password_hash('admin', method='scrypt'), role='admin')
    student_usr = User(username='student', password_hash=generate_password_hash('student', method='scrypt'), role='student')
    db.session.add_all([admin_usr, student_usr])
    db.session.commit()
    print("Database seeding completed.")

# --- ROUTING ENDPOINTS ---
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        action = request.form.get('action') # login or register
        username = request.form.get('username')
        password = request.form.get('password')
        interest = request.form.get('interest', 'Python')

        if action == 'register':
            exist = User.query.filter_by(username=username).first()
            if exist:
                flash('Username already exists!')
                return redirect(url_for('login'))
            
            pwd_hash = generate_password_hash(password, method='scrypt')
            u = User(username=username, password_hash=pwd_hash, role='student')
            db.session.add(u)
            db.session.commit()

            prof = Profile(user_id=u.id, domain_of_interest=interest)
            db.session.add(prof)
            db.session.commit()
            flash('Registration successful! Please login.')
            return redirect(url_for('login'))
        
        else: # login
            u = User.query.filter_by(username=username).first()
            if u and check_password_hash(u.password_hash, password):
                login_user(u)
                return redirect(url_for('dashboard'))
            flash('Invalid username or password!')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'admin':
        return render_template('admin.html', users=User.query.all(), courses=Course.query.all(), questions=Question.query.all())
    
    profile = Profile.query.filter_by(user_id=current_user.id).first()
    interest = profile.domain_of_interest if profile else 'Python'
    assessments = Assessment.query.filter_by(user_id=current_user.id).all()
    latest = assessments[-1] if assessments else None
    
    return render_template('dashboard.html', interest=interest, assessments=assessments, latest=latest)

@app.route('/quiz/<domain>', methods=['GET', 'POST'])
@login_required
def quiz(domain):
    questions = Question.query.filter_by(domain=domain).all()
    if request.method == 'POST':
        # Score computation
        score = 0
        for q in questions:
            ans = request.form.get(f'q_{q.id}')
            if ans and ans.upper() == q.correct_option.upper():
                score += 1

        total = len(questions) if len(questions) > 0 else 10
        percent = (score / total) * 100

        # AI Prediction Engine via Pickled RandomForest Models!
        skill_level = "Beginner"
        if ml_model and ml_scaler:
            try:
                # Features shape: ['score', 'previous_avg_score', 'interest_level', 'domain_encoded']
                domain_enc_map = {"Python": 0, "Java": 1, "DBMS": 2, "Data Structures": 3, "Web Development": 4, "Artificial Intelligence": 5}
                dom_val = domain_enc_map.get(domain, 0)
                # Query previous scores average
                prev_recs = Assessment.query.filter_by(user_id=current_user.id).all()
                p_avg = np.mean([r.score for r in prev_recs]) if prev_recs else score
                
                features = np.array([[score, p_avg, 2, dom_val]]) # interest level default=2
                scaled_features = ml_scaler.transform(features)
                pred_index = ml_model.predict(scaled_features)[0]
                
                skill_classes = ["Beginner", "Intermediate", "Advanced"]
                skill_level = skill_classes[pred_index]
            except Exception as e:
                print(f"Prediction failed, falling back: {e}")

        # Basic fallback score classifier if ML fails/not trained
        if skill_level == "Beginner":
            if percent >= 80:
                skill_level = "Advanced"
            elif percent >= 45:
                skill_level = "Intermediate"

        assessment_log = Assessment(
            user_id=current_user.id,
            domain=domain,
            score=score,
            total_questions=total,
            percentage=percent,
            skill_level=skill_level
        )
        db.session.add(assessment_log)
        db.session.commit()

        # Link Recommended courses to Database Assessment relations
        matches = Course.query.filter_by(domain=domain, level=skill_level).all()
        for c in matches:
            rec = Recommendation(assessment_id=assessment_log.id, course_id=c.id)
            db.session.add(rec)
        db.session.commit()

        flash(f'Quiz completed! Your score: {score}/{total}. AI skill prediction: {skill_level}')
        return redirect(url_for('dashboard'))

    return render_template('quiz.html', questions=questions, domain=domain)

@app.route('/download-report/<int:assessment_id>')
@login_required
def download_report(assessment_id):
    a = Assessment.query.get_or_404(assessment_id)
    if a.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    filename = f"reports/assessment_report_{assessment_id}.pdf"
    generate_assessment_pdf(
        filename=filename,
        username=current_user.username,
        domain=a.domain,
        score=a.score,
        total_questions=a.total_questions,
        percentage=a.percentage,
        skill_level=a.skill_level
    )
    # Stream file to downloads
    from flask import send_file
    return send_file(filename, as_attachment=True)

# Admin CRUD
@app.route('/admin/add-course', methods=['POST'])
@login_required
def add_course():
    if current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    title = request.form.get('title')
    dom = request.form.get('domain')
    lvl = request.form.get('level')
    desc = request.form.get('description')
    url = request.form.get('url')

    c = Course(title=title, domain=dom, level=lvl, description=desc, url=url)
    db.session.add(c)
    db.session.commit()
    flash('Course mapped successfully!')
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    load_ml_assets()
    app.run(debug=True, port=5000)
