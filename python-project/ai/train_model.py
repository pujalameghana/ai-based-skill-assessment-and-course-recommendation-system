# python-project/ai/train_model.py
import os
import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def train_and_save_model():
    print("Generating synthetic student assessment records dataset...")
    # Seed for reproducibility
    np.random.seed(42)
    n_samples = 1500

    # Fields:
    # 1. score (0 to 10 out of 10)
    # 2. previous_avg_score (0.0 to 10.0)
    # 3. interest_level (1: Low academic drive, 2: Medium specialized, 3: High enthusiast)
    # 4. domain_encoded (0: Python, 1: Java, 2: DBMS, 3: DSA, 4: WebDev, 5: AI)
    
    scores = np.random.randint(0, 11, size=n_samples)
    prev_scores = np.clip(scores + np.random.normal(0, 1.5, size=n_samples), 0, 10)
    interests = np.random.choice([1, 2, 3], size=n_samples, p=[0.2, 0.5, 0.3])
    domains = np.random.randint(0, 6, size=n_samples)

    # Output Label: skill_level
    # 0 = Beginner, 1 = Intermediate, 2 = Advanced
    skill_levels = []
    for i in range(n_samples):
        total_eval = scores[i] * 0.6 + prev_scores[i] * 0.3 + interests[i] * 0.7
        if total_eval >= 9.0:
            skill_levels.append(2) # Advanced
        elif total_eval >= 4.5:
            skill_levels.append(1) # Intermediate
        else:
            skill_levels.append(0) # Beginner

    df = pd.DataFrame({
        'score': scores,
        'previous_avg_score': prev_scores,
        'interest_level': interests,
        'domain_encoded': domains,
        'skill_level': skill_levels
    })

    X = df[['score', 'previous_avg_score', 'interest_level', 'domain_encoded']]
    y = df['skill_level']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize inputs
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Random Forest Classifier
    print("Fitting Scikit-Learn RandomForestClassifier model...")
    model = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=42)
    model.fit(X_train_scaled, y_train)

    accuracy = model.score(X_test_scaled, y_test)
    print(f"Model Training completed. Validation Accuracy: {accuracy * 100:.2f}%")

    # Create destination directories if they don't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), '../static/models'), exist_ok=True)
    os.makedirs(os.path.dirname(__file__), exist_ok=True)

    # Save variables using pickle
    model_path = os.path.join(os.path.dirname(__file__), 'recommendation_model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)

    print(f"File pickled and dumped safely at:\n- {model_path}\n- {scaler_path}")

if __name__ == "__main__":
    train_and_save_model()
