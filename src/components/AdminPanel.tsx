/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Users, FileQuestion, BookOpen, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { Question, Course, Assessment } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'courses' | 'assessments'>('users');
  const [users, setUsers] = useState<{ username: string; role: string; domainOfInterest: string }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for adding/editing questions
  const [showQForm, setShowQForm] = useState(false);
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [qDomain, setQDomain] = useState('Python');
  const [qQuestion, setQQuestion] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qAnswerIndex, setQAnswerIndex] = useState(0);

  // Form states for adding/editing courses
  const [showCForm, setShowCForm] = useState(false);
  const [editingCId, setEditingCId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cDomain, setCDomain] = useState('Python');
  const [cLevel, setCLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [cDesc, setCDesc] = useState('');
  const [cUrl, setCUrl] = useState('');

  const loadData = () => {
    setLoading(true);
    setErrorMsg(null);
    Promise.all([
      fetch('/api/users').then(res => res.json()),
      fetch('/api/questions').then(res => res.json()),
      fetch('/api/courses').then(res => res.json()),
      fetch('/api/assessments').then(res => res.json())
    ])
      .then(([userData, questionData, courseData, assessmentData]) => {
        setUsers(userData);
        setQuestions(questionData);
        setCourses(courseData);
        setAssessments(assessmentData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admin details:', err);
        setErrorMsg('Error loading details from Express server.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // --- Question CRUD Actions ---
  const handleOpenAddQ = () => {
    setEditingQId(null);
    setQDomain('Python');
    setQQuestion('');
    setQOptions(['', '', '', '']);
    setQAnswerIndex(0);
    setShowQForm(true);
  };

  const handleOpenEditQ = (q: Question) => {
    setEditingQId(q.id);
    setQDomain(q.domain);
    setQQuestion(q.question);
    setQOptions([...q.options]);
    setQAnswerIndex(q.answerIndex);
    setShowQForm(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qQuestion.trim() || qOptions.some(o => !o.trim())) {
      setErrorMsg('Please specify values for all question options and text.');
      return;
    }

    const payload = {
      domain: qDomain,
      question: qQuestion,
      options: qOptions,
      answerIndex: qAnswerIndex
    };

    const url = editingQId ? `/api/questions/${editingQId}` : '/api/questions';
    const method = editingQId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerSuccess(editingQId ? 'Question updated' : 'New Question published');
        setShowQForm(false);
        loadData();
      } else {
        throw new Error('Server returned save failure.');
      }
    } catch (err) {
      setErrorMsg('Error saving question. Ensure backend is running.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerSuccess('Question removed safely.');
        loadData();
      }
    } catch (err) {
      setErrorMsg('Failed to delete question item from repository.');
    }
  };

  // --- Course CRUD Actions ---
  const handleOpenAddC = () => {
    setEditingCId(null);
    setCTitle('');
    setCDomain('Python');
    setCLevel('Beginner');
    setCDesc('');
    setCUrl('');
    setShowCForm(true);
  };

  const handleOpenEditC = (c: Course) => {
    setEditingCId(c.id);
    setCTitle(c.title);
    setCDomain(c.domain);
    setCLevel(c.level);
    setCDesc(c.description);
    setCUrl(c.url);
    setShowCForm(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim() || !cDesc.trim()) {
      setErrorMsg('Title and Description are required parameters.');
      return;
    }

    const payload = {
      title: cTitle,
      domain: cDomain,
      level: cLevel,
      description: cDesc,
      url: cUrl || 'https://google.com'
    };

    const url = editingCId ? `/api/courses/${editingCId}` : '/api/courses';
    const method = editingCId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerSuccess(editingCId ? 'Course mapping updated' : 'Course details registered');
        setShowCForm(false);
        loadData();
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      setErrorMsg('Failed to preserve Course detail configurations.');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this recommended course item from catalog?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerSuccess('Recommended course deleted.');
        loadData();
      }
    } catch (err) {
      setErrorMsg('Could not drop the selected course detail from platform database.');
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-container">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Admin Operations Center
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Real-time management array of technical quizzing databases, recommended courses catalog, registered user bases, and analytics logs.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          id="exit-admin-btn"
        >
          Exit Admin Center
        </button>
      </div>

      {/* Notifications banner alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3.5 px-4 rounded-xl flex items-center gap-2" id="admin-success-alert">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs py-3.5 px-4 rounded-xl flex items-center gap-2" id="admin-error-alert">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation tabs row */}
      <div className="flex border-b border-gray-200" id="admin-panel-navigation-tabs">
        <button
          onClick={() => { setActiveTab('users'); setErrorMsg(null); }}
          className={`px-5 py-3 text-xs font-medium border-b-2 -mb-px transition ${
            activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          id="tab-users"
        >
          Registered Users ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('questions'); setErrorMsg(null); }}
          className={`px-5 py-3 text-xs font-medium border-b-2 -mb-px transition ${
            activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          id="tab-questions"
        >
          MCQ Bank ({questions.length})
        </button>
        <button
          onClick={() => { setActiveTab('courses'); setErrorMsg(null); }}
          className={`px-5 py-3 text-xs font-medium border-b-2 -mb-px transition ${
            activeTab === 'courses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          id="tab-courses"
        >
          Course Catalog ({courses.length})
        </button>
        <button
          onClick={() => { setActiveTab('assessments'); setErrorMsg(null); }}
          className={`px-5 py-3 text-xs font-medium border-b-2 -mb-px transition ${
            activeTab === 'assessments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          id="tab-assessments"
        >
          Assessment Records ({assessments.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20" id="admin-loading-spinner">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: USERS LIST */}
          {activeTab === 'users' && (
            <div className="bg-white border text-gray-800 rounded-xl overflow-hidden shadow-sm" id="admin-users-list">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                    <th className="p-4">Username</th>
                    <th className="p-4">Academic Role</th>
                    <th className="p-4">Domain Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold text-gray-950">{u.username}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{u.domainOfInterest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: QUESTIONS LIST */}
          {activeTab === 'questions' && (
            <div className="space-y-4" id="admin-questions-tab">
              <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100 rounded-xl">
                <span className="text-xs text-gray-500">Add or synchronize questions for 6 special engineering domains.</span>
                <button
                  onClick={handleOpenAddQ}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm transition"
                  id="add-question-btn"
                >
                  <Plus className="w-4 h-4" />
                  Add New Question
                </button>
              </div>

              {showQForm && (
                <div className="bg-gray-50 border border-indigo-100 rounded-xl p-6" id="add-question-form">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">{editingQId ? 'Edit Question Record' : 'Create Live Technical MCQ'}</h4>
                  <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">DomainSpecialization</label>
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={qDomain}
                          onChange={(e) => setQDomain(e.target.value)}
                        >
                          <option>Python</option>
                          <option>Java</option>
                          <option>DBMS</option>
                          <option>Data Structures</option>
                          <option>Web Development</option>
                          <option>Artificial Intelligence</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Target Answer Index (0-3)</label>
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={qAnswerIndex}
                          onChange={(e) => setQAnswerIndex(Number(e.target.value))}
                        >
                          <option value={0}>A / Option 1</option>
                          <option value={1}>B / Option 2</option>
                          <option value={2}>C / Option 3</option>
                          <option value={3}>D / Option 4</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Question string context</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none"
                        value={qQuestion}
                        onChange={(e) => setQQuestion(e.target.value)}
                        placeholder="e.g. Which of the following normalizations addresses transitive keys dependencies?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Option Selections List</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {qOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2 items-center">
                            <span className="font-mono text-gray-400 font-bold">{String.fromCharCode(65 + oIdx)}</span>
                            <input
                              type="text"
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const copy = [...qOptions];
                                copy[oIdx] = e.target.value;
                                setQOptions(copy);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowQForm(false)}
                        className="py-1.5 px-4 rounded-lg bg-white border text-gray-600 font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      >
                        Save Question
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white border rounded-xl overflow-hidden shadow-sm" id="questions-dashboard">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Domain</th>
                      <th className="p-4">Question Core</th>
                      <th className="p-4">Answer Map</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-semibold text-indigo-700">{q.domain}</td>
                        <td className="p-4 max-w-sm font-sans">{q.question}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded font-mono text-[10px]">
                            {String.fromCharCode(65 + q.answerIndex)}: {q.options[q.answerIndex]}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditQ(q)}
                            className="p-1 text-gray-500 hover:text-indigo-600 transition inline-block"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition inline-block"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COURSES LIST */}
          {activeTab === 'courses' && (
            <div className="space-y-4" id="admin-courses-tab">
              <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100 rounded-xl">
                <span className="text-xs text-gray-500">Edit course curriculums displayed matching skill tiers.</span>
                <button
                  onClick={handleOpenAddC}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm transition"
                  id="add-course-btn"
                >
                  <Plus className="w-4 h-4" />
                  Add Course Details
                </button>
              </div>

              {showCForm && (
                <div className="bg-gray-50 border border-indigo-100 rounded-xl p-6" id="add-course-form">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">{editingCId ? 'Modify Course Record' : 'Add Rec Course'}</h4>
                  <form onSubmit={handleSaveCourse} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Course Title</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={cTitle}
                          onChange={(e) => setCTitle(e.target.value)}
                          placeholder="e.g. Intro to Spring boot Frameworks"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={cDomain}
                          onChange={(e) => setCDomain(e.target.value)}
                        >
                          <option>Python</option>
                          <option>Java</option>
                          <option>DBMS</option>
                          <option>Data Structures</option>
                          <option>Web Development</option>
                          <option>Artificial Intelligence</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Target Proficiency Level</label>
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={cLevel}
                          onChange={(e) => setCLevel(e.target.value as any)}
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={cDesc}
                          onChange={(e) => setCDesc(e.target.value)}
                          placeholder="Provide details about core curricula items taught in this class."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reference URL Link</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 outline-none"
                          value={cUrl}
                          onChange={(e) => setCUrl(e.target.value)}
                          placeholder="e.g. https://spring.io/projects"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCForm(false)}
                        className="py-1.5 px-4 rounded-lg bg-white border text-gray-600 font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      >
                        Save Course
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fadeIn" id="courses-dashboard">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Track</th>
                      <th className="p-4">Difficulty</th>
                      <th className="p-4">Title</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-semibold text-indigo-700">{c.domain}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            c.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {c.level}
                          </span>
                        </td>
                        <td className="p-4 font-sans font-medium text-gray-800">{c.title}</td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditC(c)}
                            className="p-1 text-gray-500 hover:text-indigo-600 transition inline-block"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition inline-block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: HISTORIC RECORDS */}
          {activeTab === 'assessments' && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm" id="admin-assessments-tab">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Candidate Student</th>
                    <th className="p-4">Specialization Domain</th>
                    <th className="p-4">Score Metric</th>
                    <th className="p-4">Calculated Level</th>
                    <th className="p-4">Date Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assessments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No competency assessment records submitted yet.
                      </td>
                    </tr>
                  ) : (
                    assessments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-semibold text-gray-950">{a.userId}</td>
                        <td className="p-4 font-medium text-indigo-700">{a.domain}</td>
                        <td className="p-4 font-mono font-bold text-gray-800">{a.score} / {a.totalQuestions} ({a.percentage}%)</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.skillLevel === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                            a.skillLevel === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                            'bg-violet-50 text-violet-700'
                          }`}>
                            {a.skillLevel}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-[10px]">{new Date(a.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
