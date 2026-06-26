/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Sparkles, Award } from 'lucide-react';
import { Question, Assessment } from '../types';

interface QuizProps {
  username: string;
  onAssessmentComplete: (assessment: Assessment) => void;
  onBack: () => void;
}

const DOMAINS = [
  { name: 'Python', desc: 'Variables, dictionaries, functional generators, and advanced application frameworks.' },
  { name: 'Java', desc: 'Object-oriented patterns, standard collections, thread concurrency, and virtual runtimes.' },
  { name: 'DBMS', desc: 'Relational algebra, ACID transaction constraints, column indexes, and normalization normal forms.' },
  { name: 'Data Structures', desc: 'BST nodes, stacks, hash tables, Dijkstra shortest paths, and complexity optimizations.' },
  { name: 'Web Development', desc: 'HTML5 standards, flexbox structures, client routers, and secure CORS Express APIs.' },
  { name: 'Artificial Intelligence', desc: 'Random Forest models, distance classifier arrays, dropout parameters, and neural training.' }
];

export default function Quiz({ username, onAssessmentComplete, onBack }: QuizProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [evaluating, setEvaluating] = useState(false);
  const [interestsText, setInterestsText] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all questions from Server
  useEffect(() => {
    setLoadingQuestions(true);
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoadingQuestions(false);
      })
      .catch(err => {
        console.error('Failed to retrieve quiz questions:', err);
        setLoadingQuestions(false);
        setError('Error loading questions from server. Please try again.');
      });
  }, []);

  const startQuizForDomain = (domain: string) => {
    setSelectedDomain(domain);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setError(null);
  };

  const domainQuestions = questions.filter(q => q.domain === selectedDomain);

  const handleSelectOption = (index: number) => {
    if (!domainQuestions[currentIdx]) return;
    const qId = domainQuestions[currentIdx].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: index
    }));
  };

  const handleSubmitQuiz = async () => {
    if (domainQuestions.length === 0) return;
    setEvaluating(true);
    setError(null);

    // Calculate score
    let score = 0;
    domainQuestions.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns !== undefined && userAns === q.answerIndex) {
        score += 1;
      }
    });

    try {
      const res = await fetch('/api/assessments/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: username,
          domain: selectedDomain,
          score,
          totalQuestions: domainQuestions.length,
          userInterests: interestsText || "Software Development and modern technology skills",
          previousScores: [] // Can be populated dynamically
        })
      });

      if (!res.ok) {
        throw new Error('Server returned error status during evaluation');
      }

      const data = await res.json();
      if (data.success && data.assessment) {
        onAssessmentComplete(data.assessment);
      } else {
        throw new Error('Incomplete data response');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failure conducting AI assessment evaluation. Please retry.');
    } finally {
      setEvaluating(false);
    }
  };

  if (!selectedDomain) {
    return (
      <div className="space-y-6" id="domain-selector-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
              Select Domain of Interest
            </h2>
            <p className="text-gray-500 text-sm mt-1">Select one core specialization domain to launch your interactive AI skill assessment.</p>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            id="back-to-dashboard-btn"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Interests specification bar */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100/50 rounded-xl p-5 mb-6" id="interests-form-section">
          <label className="block text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Customize with Your Special Background & Interest Areas (Optional)
          </label>
          <input
            type="text"
            className="w-full bg-white border border-indigo-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 font-sans shadow-sm"
            placeholder="e.g. Building ML APIs, frontend UI, data analytics, cloud-server security..."
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
            id="interests-textbox"
          />
          <p className="text-xs text-indigo-600/70 mt-1">Our server-side Gemini AI model parses these inputs to customize learning pathways and suggestions!</p>
        </div>

        {loadingQuestions ? (
          <div className="flex flex-col items-center justify-center py-20" id="loading-questions-placeholder">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">Fetching technical questions array...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="domain-bento-grid">
            {DOMAINS.map((dom, i) => (
              <motion.div
                key={dom.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition duration-200 flex flex-col justify-between group"
                id={`domain-card-${dom.name.toLowerCase().replace(' ', '-')}`}
              >
                <div>
                  <div className="p-3 bg-indigo-50 rounded-lg w-fit text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold font-sans text-gray-900 text-lg mb-2">{dom.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">{dom.desc}</p>
                </div>
                <button
                  onClick={() => startQuizForDomain(dom.name)}
                  className="w-full py-2 px-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-100 rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center gap-2 transition duration-200"
                  id={`start-quiz-btn-${dom.name.toLowerCase().replace(' ', '-')}`}
                >
                  Start Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active quiz session View
  if (domainQuestions.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center max-w-md mx-auto my-10 space-y-4" id="no-questions-error-card">
        <HelpCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-bold text-gray-900 text-lg">No Questions Found</h3>
        <p className="text-xs text-gray-500">The questions store for {selectedDomain} appeared blank. Ensure questions are seed listed.</p>
        <button
          onClick={() => setSelectedDomain(null)}
          className="text-xs bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition"
          id="back-domain-selector-btn"
        >
          Select Another Domain
        </button>
      </div>
    );
  }

  const currentQ = domainQuestions[currentIdx];
  const totalQuestionsCount = domainQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((currentIdx / totalQuestionsCount) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="active-quiz-container">
      {/* Quiz Session Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Active AI Assessment
          </p>
          <h2 className="text-xl font-bold font-sans text-gray-900">
            {selectedDomain} Technical Competency
          </h2>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
              setSelectedDomain(null);
            }
          }}
          className="text-xs font-medium text-gray-500 hover:text-red-500 transition px-3 py-1.5 border border-gray-200 hover:border-red-100 rounded-lg"
          id="exit-quiz-btn"
        >
          Exit Assessment
        </button>
      </div>

      {/* Progress slider bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2" id="quiz-progress-bar-container">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span>Question {currentIdx + 1} of {totalQuestionsCount}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent || 3}%` }}
          ></div>
        </div>
      </div>

      {/* Main Single Question Card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -15 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-6"
        id={`question-card-${currentIdx}`}
      >
        <div className="space-y-4">
          <span className="inline-block bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold px-2.5 py-1 rounded">
            Question #{currentIdx + 1}
          </span>
          <h3 className="font-sans font-medium text-gray-900 text-lg leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options Stack */}
        <div className="space-y-3" id="quiz-options-list">
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = selectedAnswers[currentQ.id] === optIndex;
            return (
              <button
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-sans flex items-center justify-between transition-all duration-150 group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium scale-[1.01] shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
                id={`option-btn-${optIndex}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border font-sans ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-gray-300 text-gray-500 group-hover:border-gray-400 group-hover:bg-gray-100'
                  }`}>
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 animate-scaleIn" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation and Submission Buttons Row */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-white border border-gray-200 text-xs text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          id="prev-question-btn"
        >
          Previous
        </button>

        {currentIdx < totalQuestionsCount - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            disabled={selectedAnswers[currentQ.id] === undefined}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            id="next-question-btn"
          >
            Next Question
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={evaluating || selectedAnswers[currentQ.id] === undefined}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-1.5 disabled:opacity-50"
            id="submit-assessment-btn"
          >
            {evaluating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI Model Analyzing...
              </>
            ) : (
              <>
                Submit & Evaluate With Gemini AI
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs font-medium p-4 border border-red-200 rounded-xl mt-4" id="quiz-error-box">
          {error}
        </div>
      )}
    </div>
  );
}
