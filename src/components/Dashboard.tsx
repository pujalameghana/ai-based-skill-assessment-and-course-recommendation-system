/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, Trophy, BookOpen, AlertCircle, ArrowRight, Download, Activity, FileText, Calendar } from 'lucide-react';
import { Assessment, Course } from '../types';
import { generateAssessmentPdf } from '../utils/generateClientPdf';

interface DashboardProps {
  username: string;
  domainOfInterest: string;
  assessments: Assessment[];
  onStartQuiz: () => void;
  onSelectAssessment: (assessment: Assessment) => void;
  selectedAssessment: Assessment | null;
}

export default function Dashboard({
  username,
  domainOfInterest,
  assessments,
  onStartQuiz,
  onSelectAssessment,
  selectedAssessment
}: DashboardProps) {

  // Sort assessments by timestamp ascending for plotting line graph
  const chartData = [...assessments]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((a) => ({
      date: new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: a.score,
      percentage: a.percentage,
      domain: a.domain
    }));

  const latestAssessment = selectedAssessment || (assessments.length > 0 ? assessments[assessments.length - 1] : null);

  const handlePrint = () => {
    if (latestAssessment) {
      generateAssessmentPdf(latestAssessment, username);
    }
  };

  return (
    <div className="space-y-8" id="student-dashboard-root">
      {/* Upper Welcome Jumbotron */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden" id="welcome-jumbotron">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative space-y-6 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 font-mono text-xs rounded-full border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini 3.5 AI Model
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-sans font-extrabold tracking-tight">
              Welcome back, <span className="text-indigo-400 font-bold">{username}</span>!
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Accelerate your engineering learning potential. Your primary specialization track is set to <span className="text-white font-bold underline decoration-indigo-400 decoration-2">{domainOfInterest}</span>. Start a Quiz to map out your skill level, identify gaps, and receive courses customized by AI.
            </p>
          </div>
          <button
            onClick={onStartQuiz}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-xs font-bold py-3 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-indigo-500/30 font-sans"
            id="launch-assessment-btn"
          >
            Launch Competency Assessment
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-grid-layout">
        
        {/* Left Side: Score Trends & History Logs (Takes up 1 Col) */}
        <div className="space-y-6 lg:col-span-1" id="left-sidebar-metrics">
          
          {/* Recharts Analytics Trend Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Competency Score Trends
            </h3>
            {chartData.length > 1 ? (
              <div className="h-44 w-full" id="recharts-trend-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#818cf8' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 bg-slate-50 border border-dashed rounded-xl flex items-center justify-center p-4 text-center" id="empty-charts-box">
                <p className="text-gray-400 text-xs font-medium leading-relaxed">
                  Take at least two assessments to trigger real-time competency regression modeling.
                </p>
              </div>
            )}
          </div>

          {/* Assessment History list */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Assessment History Log
            </h3>
            {assessments.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs" id="empty-history-box">
                No assessments taken yet. Launch your first assessment!
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1" id="history-scroll-panel">
                {assessments.map((a) => {
                  const isCurSelected = latestAssessment?.id === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => onSelectAssessment(a)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans flex items-center justify-between transition-all duration-150 ${
                        isCurSelected
                          ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500/20'
                          : 'border-gray-100 bg-white hover:bg-gray-50/50 hover:border-gray-200'
                      }`}
                      id={`assessment-log-btn-${a.id}`}
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 block">{a.domain} Assessment</span>
                        <span className="text-gray-400 block text-[10px]">
                          {new Date(a.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-mono font-bold text-indigo-700 block text-xs">{a.score}/{a.totalQuestions} ({a.percentage}%)</span>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          a.skillLevel === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                          a.skillLevel === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                          'bg-violet-50 text-violet-700'
                        }`}>
                          {a.skillLevel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Assessment Gap Analysis & AI Learning Path (Takes up 2 Cols) */}
        <div className="lg:col-span-2 space-y-6" id="right-results-analysis-container">
          {latestAssessment ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 print:bg-white print:border-none print:shadow-none"
              id="print-report-wrapper"
            >
              {/* Outer controls panel (Hides when printed) */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Detailed Skill Assessment Report</h3>
                    <p className="text-gray-400 text-[10px]">AI-Generated gap analysis and personalized courses matching this record.</p>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-95"
                  id="trigger-print-btn"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF Report
                </button>
              </div>

              {/* PRINT CONTAINER BODY (Formatted nicely to fit perfectly on standard pdf/A4 page) */}
              <div className="bg-white border border-gray-200/60 rounded-3xl p-8 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none" id="pdf-report-content">
                
                {/* PDF Header Block */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-6 print:pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider block">AI-Based Skill Competency Certificate</span>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{latestAssessment.domain} Competency Report</h2>
                    <p className="text-gray-400 text-xs">Student: <span className="text-gray-700 font-semibold">{username}</span> | Evaluated: {new Date(latestAssessment.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <span className="text-[10px] text-gray-400 block font-mono">STATUS: VALIDATED</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold leading-none ${
                        latestAssessment.skillLevel === 'Beginner' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        latestAssessment.skillLevel === 'Intermediate' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-violet-50 text-violet-800 border border-violet-200'
                    }`}>
                      {latestAssessment.skillLevel} Proficiency
                    </span>
                  </div>
                </div>

                {/* Score Stats Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="score-stats-grid">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] uppercase font-semibold block">Total Correct Answers</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-extrabold text-indigo-950 font-mono">{latestAssessment.score}</span>
                      <span className="text-gray-400 text-xs">/ {latestAssessment.totalQuestions} MCQs</span>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] uppercase font-semibold block">Accuracy Percentage</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-extrabold text-indigo-950 font-mono">{latestAssessment.percentage}%</span>
                    </div>
                  </div>
                  <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-1000">
                    <span className="text-indigo-900 text-[10px] uppercase font-semibold block">AI Assigned Tier</span>
                    <div className="flex items-center gap-1.5 mt-1 text-indigo-950">
                      <Trophy className="w-5 h-5 text-indigo-600" />
                      <span className="text-lg font-bold font-sans">{latestAssessment.skillLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Skill Gap Analysis: Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="gap-analysis-columns">
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-bold text-emerald-800 flex items-center gap-1.5 font-sans border-b pb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Demonstrated Key Strengths
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-600 font-sans" id="strengths-list">
                      {latestAssessment.strengths.map((str, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-500 font-bold select-none">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-bold text-amber-800 flex items-center gap-1.5 font-sans border-b pb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Skill Gap Areas / Weaknesses
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-600 font-sans" id="weakness-list">
                      {latestAssessment.weakAreas.map((weak, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-amber-500 font-bold select-none">!</span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Improvement Suggestions */}
                <div className="space-y-3 bg-gradient-to-r from-violet-50/40 to-indigo-50/40 border border-violet-100/60 p-6 rounded-2xl" id="suggestions-box">
                  <h4 className="text-xs uppercase font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Up-Skilling Action Suggestions
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed font-sans" id="suggestions-list">
                    {latestAssessment.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-indigo-600 font-bold">{idx + 1}.</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learning Path Generation Visualization */}
                <div className="space-y-4" id="learning-path-generation">
                  <div className="border-b pb-2">
                    <h4 className="text-xs uppercase font-bold text-gray-900">Custom learning path roadmap</h4>
                    <p className="text-gray-400 text-[10px]">Step-by-step path tailored to bridge identified skill weaknesses.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3" id="roadmap-timeline">
                    {latestAssessment.learningPath.map((step) => (
                      <div key={step.stepNum} className="relative bg-slate-50 border border-gray-100 rounded-xl p-4 space-y-1 flex flex-col justify-between hover:border-indigo-100 transition duration-150">
                        <div>
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center mb-2 shadow-sm">
                            {step.stepNum}
                          </div>
                          <h5 className="font-bold text-gray-950 text-xs font-sans line-clamp-1">{step.title}</h5>
                          <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matching course recommendation block (Hides links on PDF, lists text beautifully) */}
                <div className="space-y-4" id="recommended-courses-section">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-indigo-950 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Custom Course Recommendations
                      </h4>
                      <p className="text-gray-400 text-[10px] mt-0.5">Highly targeted courses catalog matching the "{latestAssessment.skillLevel}" calculated tier.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="courses-recommendations-grid">
                    {latestAssessment.recommendedCourses.length > 0 ? (
                      latestAssessment.recommendedCourses.map((c) => (
                        <div key={c.id} className="border border-gray-100 p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:shadow-sm hover:border-indigo-100/50 transition bg-white">
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider">{c.domain} · {c.level}</span>
                            <h5 className="font-bold text-gray-950 text-sm leading-tight">{c.title}</h5>
                            <p className="text-xs text-gray-500 leading-normal line-clamp-2">{c.description}</p>
                          </div>
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-800 mt-2 print:hidden"
                          >
                            Explore Syllabus
                            <ArrowRight className="w-3" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-400 text-xs">
                        No courses registered in active database for {latestAssessment.domain} at {latestAssessment.skillLevel} level.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <div className="bg-white border rounded-3xl p-16 text-center shadow-xs" id="empty-results-jumbo">
              <Trophy className="w-16 h-16 text-indigo-100 mx-auto mb-4" />
              <h3 className="text-lg font-sans font-bold text-gray-900 leading-tight">No Active Appraisal</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                Choose from available engineering domains and complete your quiz to trigger the AI Skill Assessment and generate detailed PDFs.
              </p>
              <button
                onClick={onStartQuiz}
                className="mt-6 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow-sm transition"
              >
                Start Quiz Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
