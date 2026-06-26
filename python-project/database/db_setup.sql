-- AI-Based Skill Assessment and Course Recommendation Database Schema
-- Suitable for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS skill_assessment_db;
USE skill_assessment_db;

-- 1. Users Table (Authentication Credentials)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table (Domain and Interests Info)
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    domain_of_interest VARCHAR(100) NOT NULL,
    bio TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Courses Table (Catalog)
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL, -- Beginner, Intermediate, Advanced
    description TEXT NOT NULL,
    url VARCHAR(255)
);

-- 4. Questions Table (Quiz MCQs)
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL -- A, B, C, or D
);

-- 5. Assessments Table (Score Histories)
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage FLOAT NOT NULL,
    skill_level VARCHAR(50) NOT NULL, -- Predicted Beginner, Intermediate, Advanced
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Recommendations Table (AI Saved Recommendations)
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    course_id INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Seed initial basic administrator profile (password: adminPass)
-- Password Hash generated using Werkzeug: pbkdf2:sha256:260000$admin_hash_example
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', 'pbkdf2:sha256:600000$SgCOE1cR0g2O$89ddb7f0e08f52ef0f048d2e8fc8ef0db017b2b3b0d2d3126f58f4a13bfd3fef', 'admin')
ON DUPLICATE KEY UPDATE username='admin';
