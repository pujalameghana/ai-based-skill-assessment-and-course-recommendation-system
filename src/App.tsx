/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, LogOut, Award, User, Layers, Shield, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { Assessment } from './types';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; domainOfInterest: string } | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [view, setView] = useState<'dashboard' | 'quiz' | 'admin'>('dashboard');

  // Login page form inputs
  const [isRegister, setIsRegister] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [interestDomain, setInterestDomain] = useState('Artificial Intelligence');
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Restore session on load from client LocalStorage (or verify dynamically)
  useEffect(() => {
    const saved = localStorage.getItem('ai_assess_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
      } catch (err) {
        localStorage.removeItem('ai_assess_user');
      }
    }
  }, []);

  // Sync assessments list whenever a student authenticates or submits a quiz
  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      fetch(`/api/assessments/${currentUser.username}`)
        .then(res => res.json())
        .then(data => {
          setAssessments(data);
          if (data.length > 0) {
            setSelectedAssessment(data[data.length - 1]);
          }
        })
        .catch(err => console.error('Error fetching student assessment lists:', err));
    }
  }, [currentUser, view]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? { username: authUsername.trim(), password: authPassword, domainOfInterest: interestDomain }
      : { username: authUsername.trim(), password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication aborted by server.');
      }

      if (isRegister) {
        setAuthSuccess('Account registered. Please log in with your credentials.');
        setIsRegister(false);
        setAuthPassword('');
      } else if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('ai_assess_user', JSON.stringify(data.user));
        setAuthUsername('');
        setAuthPassword('');
        setView(data.user.role === 'admin' ? 'admin' : 'dashboard');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failure connecting to database client.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAssessments([]);
    setSelectedAssessment(null);
    setView('dashboard');
    localStorage.removeItem('ai_assess_user');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative overflow-hidden" id="auth-root">
        {/* Ambient atmospheric design circles */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Ribbon */}
        <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold tracking-tight text-slate-800 text-sm">CompetenceAI</span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 bg-white border px-3 py-1.5 rounded-full shadow-sm">
            B.Tech Submission Ready
          </span>
        </header>

        {/* Primary container */}
        <main className="max-w-md w-full mx-auto p-6 flex-grow flex items-center justify-center relative z-10 print:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-xl space-y-6"
            id="auth-card"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isRegister ? 'Create Candidate Account' : 'Gateway Auth'}
              </h2>
              <p className="text-slate-400 text-xs">
                {isRegister ? 'Register your profile to begin tracking learning statistics.' : 'Sign in to access your skills assessment dashboard.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4" id="auth-form-submit">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Candidate Name / Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    placeholder="e.g. pujalameghana"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    id="username-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    id="password-input"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Major Domain of Interest</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={interestDomain}
                    onChange={(e) => setInterestDomain(e.target.value)}
                    id="interest-domain-select"
                  >
                    <option>Python</option>
                    <option>Java</option>
                    <option>DBMS</option>
                    <option>Data Structures</option>
                    <option>Web Development</option>
                    <option>Artificial Intelligence</option>
                  </select>
                </div>
              )}

              {authError && (
                <div className="text-xs font-medium text-red-600 bg-red-50 p-3 border border-red-100 rounded-xl" id="auth-error-output">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="text-xs font-medium text-emerald-600 bg-emerald-50 p-3 border border-emerald-100 rounded-xl" id="auth-success-output">
                  {authSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                id="auth-submit-btn"
              >
                {isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register Student Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Enter Assessment Portal
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold leading-none"
                id="toggle-auth-mode"
              >
                {isRegister ? 'Already registered? Gateway Login' : 'First time here? Create Student Account'}
              </button>
            </div>

            {/* Quick Login Helper Panel */}
            <div className="border-t border-slate-100 pt-4 font-mono text-[10px] space-y-1 bg-slate-50 rounded-2xl p-4 border flex flex-col justify-content-center">
              <span className="font-sans font-bold text-slate-600 block mb-1">Academic Quick Login (Dev Sandbox):</span>
              <div className="flex justify-between items-center text-slate-500">
                <span>Student login:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthUsername('student');
                    setAuthPassword('student');
                  }}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold px-2 py-0.5 rounded transition"
                >
                  student / student
                </button>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Admin login:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthUsername('admin');
                    setAuthPassword('admin');
                  }}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold px-2 py-0.5 rounded transition"
                >
                  admin / admin
                </button>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer info (Hides when printed) */}
        <footer className="p-6 text-center text-slate-400 text-[10px] w-full print:hidden">
          Skill Assessment and Dynamic Roadmapping Engine &copy; 2026
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans print:bg-white" id="main-portal-root">
      {/* Header Ribbon (Hides in physical printed formats) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 print:hidden" id="app-main-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold tracking-tight text-slate-900 text-sm">CompetenceAI</span>
            </div>

            {/* Quick dashboard tabs */}
            {currentUser.role === 'student' && (
              <div className="flex items-center gap-2 border-l pl-6 border-slate-200 text-xs">
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${
                    view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id="nav-dashboard"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setView('quiz')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${
                    view === 'quiz' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id="nav-quiz"
                >
                  Assessments
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser.role === 'admin' && (
              <span className="text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                SYSTEM ADMINISTRATOR
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pr-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>{currentUser.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 px-3 border border-gray-200 hover:border-red-100 text-xs font-semibold rounded-lg text-slate-500 hover:text-red-500 transition flex items-center gap-1.5"
              id="logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Subview Container */}
      <main className="max-w-7xl mx-auto px-6 py-8" id="subview-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {view === 'dashboard' && (
              <Dashboard
                username={currentUser.username}
                domainOfInterest={currentUser.domainOfInterest}
                assessments={assessments}
                onStartQuiz={() => setView('quiz')}
                onSelectAssessment={setSelectedAssessment}
                selectedAssessment={selectedAssessment}
              />
            )}

            {view === 'quiz' && (
              <Quiz
                username={currentUser.username}
                onAssessmentComplete={(a) => {
                  setSelectedAssessment(a);
                  setView('dashboard');
                }}
                onBack={() => setView('dashboard')}
              />
            )}

            {view === 'admin' && (
              <AdminPanel
                onBack={() => {
                  if (currentUser.role === 'student') {
                    setView('dashboard');
                  } else {
                    handleLogout();
                  }
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
