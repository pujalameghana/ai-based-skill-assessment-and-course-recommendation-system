import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { defaultQuestions, defaultCourses } from "./src/defaultData";
import { Question, Course, Assessment } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini features will run in fallback rule-based mode.");
}

// Simple helper to hash strings (Simulating Werkzeug-style secure hashing)
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// In-Memory Database (Acts as clean persistent or memory storage)
let usersList = [
  { username: "admin", passwordHash: simpleHash("admin"), role: "admin", domainOfInterest: "Artificial Intelligence" }, // password: admin
  { username: "student", passwordHash: simpleHash("student"), role: "student", domainOfInterest: "Python" } // password: student
];

let questionsList: Question[] = [...defaultQuestions];
let coursesList: Course[] = [...defaultCourses];
let assessmentsList: Assessment[] = [];

// Ensure database folders/local backups aren't required but are nice
// --- REST API ENDPOINTS ---

// Auth Routes
app.post("/api/auth/register", (req, res) => {
  const { username, password, domainOfInterest } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const exists = usersList.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Username already registered" });
  }

  const newUser = {
    username,
    passwordHash: simpleHash(password),
    role: "student",
    domainOfInterest: domainOfInterest || "Python"
  };
  usersList.push(newUser);
  res.json({ success: true, user: { username: newUser.username, role: newUser.role, domainOfInterest: newUser.domainOfInterest } });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = usersList.find(u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === simpleHash(password));
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  res.json({ success: true, user: { username: user.username, role: user.role, domainOfInterest: user.domainOfInterest } });
});

app.get("/api/users", (req, res) => {
  const list = usersList.map(u => ({ username: u.username, role: u.role, domainOfInterest: u.domainOfInterest }));
  res.json(list);
});

// Questions (Admin/Quiz)
app.get("/api/questions", (req, res) => {
  res.json(questionsList);
});

app.post("/api/questions", (req, res) => {
  const newQ = req.body;
  if (!newQ.domain || !newQ.question || !newQ.options || typeof newQ.answerIndex !== "number") {
    return res.status(400).json({ error: "Invalid question structure" });
  }
  newQ.id = "q_" + Date.now();
  questionsList.push(newQ);
  res.json({ success: true, question: newQ });
});

app.put("/api/questions/:id", (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const index = questionsList.findIndex(q => q.id === id);
  if (index === -1) return res.status(404).json({ error: "Question not found" });

  questionsList[index] = { ...questionsList[index], ...updated, id };
  res.json({ success: true, question: questionsList[index] });
});

app.delete("/api/questions/:id", (req, res) => {
  const { id } = req.params;
  questionsList = questionsList.filter(q => q.id !== id);
  res.json({ success: true });
});

// Courses (Admin/Recommendations)
app.get("/api/courses", (req, res) => {
  res.json(coursesList);
});

app.post("/api/courses", (req, res) => {
  const newC = req.body;
  if (!newC.title || !newC.domain || !newC.level || !newC.description) {
    return res.status(400).json({ error: "Invalid course structure" });
  }
  newC.id = "c_" + Date.now();
  coursesList.push(newC);
  res.json({ success: true, course: newC });
});

app.put("/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const index = coursesList.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Course not found" });

  coursesList[index] = { ...coursesList[index], ...updated, id };
  res.json({ success: true, course: coursesList[index] });
});

app.delete("/api/courses/:id", (req, res) => {
  const { id } = req.params;
  coursesList = coursesList.filter(c => c.id !== id);
  res.json({ success: true });
});

// History & Assessments
app.get("/api/assessments/:username", (req, res) => {
  const { username } = req.params;
  const list = assessmentsList.filter(a => a.userId === username);
  res.json(list);
});

app.get("/api/assessments", (req, res) => {
  res.json(assessmentsList);
});

// Evaluate Skill Quiz using REAL GEMINI AI (Fallback to local scoring and statistical logic if no Key)
app.post("/api/assessments/evaluate", async (req, res) => {
  const { userId, domain, score, totalQuestions, userInterests, previousScores } = req.body;

  const percentage = Math.round((score / totalQuestions) * 100);

  // Classify Skill Level based on Assessment Score (0-3 Beginner, 4-7 Intermediate, 8-10 Advanced)
  // This functions as our core classifier criteria matching the RandomForest outline
  let skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  if (percentage >= 80) {
    skillLevel = 'Advanced';
  } else if (percentage >= 40) {
    skillLevel = 'Intermediate';
  }

  // Find relevant courses in domain for this skill level
  const recommendedCourses = coursesList.filter(c => c.domain === domain && c.level === skillLevel);

  // Generate robust detailed skill gap parameters with Gemini AI!
  let strengths: string[] = [];
  let weakAreas: string[] = [];
  let suggestions: string[] = [];
  let learningPath: { stepNum: number; title: string; desc: string }[] = [];

  const defaultPrompt = `The developer student scored ${score}/${totalQuestions} (${percentage}%) in a technical quiz for ${domain}.
Previous scores history: [${(previousScores || []).join(', ')}].
Interests expressed: "${userInterests || 'Software engineering, building applications'}".
Generate personalized assessment evaluation in JSON.
Format target properties:
{
  "strengths": ["string", "string"],
  "weakAreas": ["string", "string"],
  "suggestions": ["string", "string"],
  "learningPath": [{"stepNum": 1, "title": "string", "desc": "string"}]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: defaultPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key strengths highlighted based on the quiz score level and domains."
              },
              weakAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Skill gap areas that the user should prioritize or practice."
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Immediate personalized action steps for rapid technical upskilling."
              },
              learningPath: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNum: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    desc: { type: Type.STRING }
                  },
                  required: ["stepNum", "title", "desc"]
                },
                description: "A customized 5-step roadmap tailored specifically to bridge the current assessment status."
              }
            },
            required: ["strengths", "weakAreas", "suggestions", "learningPath"]
          }
        }
      });

      const responseText = response.text || "";
      const resultObj = JSON.parse(responseText.trim());
      strengths = resultObj.strengths || [];
      weakAreas = resultObj.weakAreas || [];
      suggestions = resultObj.suggestions || [];
      learningPath = resultObj.learningPath || [];
    } catch (err) {
      console.error("Gemini Parsing error, loading smart rule-based generator: ", err);
      // Fallback rule provider below
    }
  }

  // Backup Rule-Based Generator (if Gemini fails or key is missing)
  if (strengths.length === 0) {
    if (skillLevel === 'Beginner') {
      strengths = [`Interest in starting ${domain}`, "Fundamental language conceptualization"];
      weakAreas = ["Problem solving with complex datasets", "Syntactic depth", "System design integration"];
      suggestions = [
        "Take high-reputation Beginner modules to clear basic structural concepts.",
        "Solve daily simple code exercises on loops and variables.",
        "Build 3 mini-applications from scratch using vanilla modules."
      ];
      learningPath = [
        { stepNum: 1, title: `${domain} Syntax Essentials`, desc: "Focus thoroughly on operations, parameters, variables, and clean files." },
        { stepNum: 2, title: "Modular Architecture", desc: "Separate logical functions, scope blocks, structures, and exceptions." },
        { stepNum: 3, title: "Data Storage Connect", desc: "Integrate dictionaries, datasets, query arrays, and files." },
        { stepNum: 4, title: "Full Frameworks", desc: "Migrate scripts to full REST web modules or functional components." },
        { stepNum: 5, title: "Deployment Prep", desc: "Build validation hooks and host online on scalable hosting servers." }
      ];
    } else if (skillLevel === 'Intermediate') {
      strengths = ["Solid grip of procedural operations", "Ability to write working structural procedures", "Decent query accuracy"];
      weakAreas = ["Optimization and O(Log N) efficiency patterns", "Advanced OOP principles", "Memory lifecycle management"];
      suggestions = [
        "Refactor your working models for efficient runtime complexities.",
        "Investigate custom design patterns and interface constructs.",
        "Practice building intermediate full-stack server endpoints daily."
      ];
      learningPath = [
        { stepNum: 1, title: "Deep-Dive Optimization", desc: "Study memory profiling, O(N) complexity metrics, and performance leaks." },
        { stepNum: 2, title: "Advanced OOP & Collections", desc: "Utilize factories, structural decorators, functional mapping, and generators." },
        { stepNum: 3, title: "Database Normalization", desc: "Reduce redundant sets, implement third normal checks, and optimize slow indices." },
        { stepNum: 4, title: "Secure APIs", desc: "Mount password encryption, JWT tokens, and CORS policy rules." },
        { stepNum: 5, title: "Production Deployment", desc: "Configure server runtimes, environment variables, and Docker container services." }
      ];
    } else {
      strengths = ["Exceptional procedural and modular understanding", "High-scoring logical analysis capabilities", "Full conceptual understanding"];
      weakAreas = ["Architecture scalability limitations", "Distributed message pipes", "Machine learning generalization overfitting safety"];
      suggestions = [
        "Explore distributed cloud clusters, load balancing patterns.",
        "Contribute actively to robust open-source repositories.",
        "Design scalable system designs that support microservices and concurrency."
      ];
      learningPath = [
        { stepNum: 1, title: "Advanced System Design", desc: "Deconstruct multi-tier scalable backend services and global loads." },
        { stepNum: 2, title: "Distributed Message Passing", desc: "Connect message queues, pub-sub systems, and cache layers." },
        { stepNum: 3, title: "DevOps Orchestration", desc: "Write CI/CD integrations, unit mock coverages, and auto-build triggers." },
        { stepNum: 4, title: "Production Tuning", desc: "Optimize server memory allocations, run thread pool pools, and stream large files." },
        { stepNum: 5, title: "Machine Learning / AI Tech", desc: "Build advanced neural backpropagation networks and Gemini interactions." }
      ];
    }
  }

  const newAssessment: Assessment = {
    id: "as_" + Date.now(),
    userId: userId || "student",
    domain,
    score,
    totalQuestions,
    percentage,
    skillLevel,
    timestamp: new Date().toISOString(),
    strengths,
    weakAreas,
    suggestions,
    learningPath,
    recommendedCourses
  };

  assessmentsList.push(newAssessment);
  res.json({ success: true, assessment: newAssessment });
});

// Vite Middleware for development execution
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI-Based Skill Assessment Server loaded successfully on port ${PORT}`);
  });
}

startServer();
