# AI-Based Skill Assessment and Course Recommendation System 

A fully complete, enterprise-grade  engineering project. It contains **two** distinct cutting-edge architectures:
1. **Interactive Live Demonstration (React 19 + Express full-stack + Server-Side Gemini 3.5 AI)**: Running instantly inside your AI Studio Workspace build previews. Uses advanced Large Language models for real-time qualitative skill-gap analysis, custom roadmapping, and downloadable performance reports.
2. **Local Academic Submission Stack (Python 3.10+ Flask + Scikit-learn RandomForestClassifier + ReportLab PDFs + MySQL)**: Standard desktop execution codebase for local compilation, model pickle generation, and project file submission.

---

## 📂 Project Folder Structure
```
python-project/
│
├── requirements.txt            # Python package dependencies (Flask, Scikit-learn, etc.)
├── app.py                      # Flask core router, session manager, and MVC controller
│
├── database/
│   └── db_setup.sql            # Core MySQL database schema tables and administrator seed
│
├── models/
│   └── models.py               # SQLAlchemy Class Models mapping Users, Questions, and courses
│
├── ai/
│   ├── train_model.py          # Synthetic dataset builder, feature standardizer and RF trainer
│   ├── recommendation_model.pkl # Picked Random Forest Classifier binary
│   └── scaler.pkl              # Pickled Standard Scaler transform matrix
│
├── utils/
│   └── pdf_generator.py        # ReportLab utility building PDF metrics certificates
│
├── templates/                  # Bootstrap 5 HTML views
│   ├── login.html              
│   ├── dashboard.html          
│   ├── quiz.html               
│   └── admin.html              
│
└── README.md                   # Setup manual for academic execution
```

---

## 🛠️ Local Python Submission Stack Instructions

Follow these step-by-step instructions to compile and launch the project on your local operating system (Windows, MacOS, or Linux):

### Prerequisite Setup
Ensure you have **Python 3.10 or higher** and **MySQL Server (v8.0+)** installed.

### 1. Create Virtual Environment
Open your system terminal or command line prompt inside the `python-project/` folder and initialize a sandboxed environment:
```bash
# Initialize venv
python -m venv venv

# Activate on Windows:
venv\Scripts\activate

# Activate on Linux/MacOS:
source venv/bin/activate
```

### 2. Install Package Dependencies
Install Scikit-learn, Flask-SQLAlchemy, ReportLab, and SQL connectivity drivers:
```bash
pip install -r requirements.txt
```

### 3. Establish Database in MySQL
1. Launch your MySQL Command Line Prompt:
   ```bash
   mysql -u root -p
   ```
2. Paste and run the configurations inside `database/db_setup.sql`:
   ```sql
   SOURCE database/db_setup.sql;
   ```
   *(This creates the `skill_assessment_db` and seeds the default admin log credentials)*

### 4. Train Scikit-Learn RandomForestClassifier (Build PKL Files)
To generate the Machine Learning assets used to classify candidate assessment scores based on continuous average vectors, execute:
```bash
python ai/train_model.py
```
This prints the validation accuracy metrics and writes `ai/recommendation_model.pkl` and `ai/scaler.pkl` to the directory.

### 5. Launch the Local Flask Web Application
Update the SQL database connection strings in `app.py` or run out-of-the-box using the SQLite compiler option:
```bash
python app.py
```
Open your web browser and navigate to:
**`http://127.0.0.1:5000`**

### 🔓 Login credentials (Academic Sandbox)
* **Student account**: Username `student` | Password `student`
* **Admin account**: Username `admin` | Password `admin`

---

## 📊 Key Highlights of the Architectural Designs

### 1. Machine Learning Engine (Scikit-Learn Classifier)
The scoring evaluation runs on an ensemble **RandomForestClassifier** with 120 base tree estimators. It consumes:
* Cumulative assessment score out of 10.
* Historical continuity score average.
* Specialized domain index (Python, Java, DBMS, DSA, WebDev, AI).
* Asserted student background interest level.

The classifier predicts the proficiency level (**Beginner, Intermediate, Advanced**) and returns course catalog recommendations linked directly via SQLAlchemy DB constraints.

### 2. ReportLab PDF Generation
The PDF certificate is rendered dynamically at runtime. It features:
* Header certification blocks.
* Structured meta-tables with candidate scores and difficulty classification.
* Comprehensive qualitative diagnosis and diagnostic up-skilling roadmaps.

---

## 🌐 AI Studio Workspace Cloud Live Preview
Our active browser workspace utilizes **React 19, Tailwind CSS, Recharts analytics indicators, and server-side Google Gemini 3.5 AI** to deliver an incredibly high-end, responsive preview. Complete assessments, manage questions, and trigger PDF browser print reports securely!
