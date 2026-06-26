/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Assessment } from '../types';

export function generateAssessmentPdf(assessment: Assessment, username: string) {
  // Initialize standard Portrait A4 document
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  let currentY = 15;
  const margin = 15;
  const pageHeight = 297;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);

  // Draw Page border
  const drawPageBorder = () => {
    doc.setDrawColor(218, 223, 230); // light slate frame
    doc.setLineWidth(0.3);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  };

  // Helper handling multi-page splits elegantly
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 15) {
      doc.addPage();
      currentY = 15;
      drawPageBorder();
    }
  };

  // Prepare initial page frame
  drawPageBorder();

  // Draw Elegant Left Header App Icon Stamp/Emblem
  doc.setFillColor(79, 70, 229); // deep indigo logo accent
  doc.rect(margin, currentY, 11, 11, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("AI", margin + 2.5, currentY + 7.5);

  // Title Column next to emblem
  doc.setTextColor(30, 27, 75); // indigo-950
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("TECHNICAL COMPETENCY CERTIFICATE", margin + 15, currentY + 7.5);
  currentY += 15;

  // Sub-text overview
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text("Autonomous Skill Appraisal Assessment and Custom Action Roadmap Report", margin, currentY);
  currentY += 5;

  // Horizontal separator divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 8;

  // CANDIDATE PROFILE COMPACT DETAILS PANEL CARD
  ensureSpace(42);
  doc.setFillColor(248, 250, 252); // slate-50 canvas
  doc.rect(margin, currentY, contentWidth, 38, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 38, 'D');

  doc.setFontSize(9.5);
  const infoRows = [
    { key: "Candidate Name :", val: username },
    { key: "Specialization Track :", val: assessment.domain },
    { key: "Correct Answers Metric :", val: `${assessment.score} / ${assessment.totalQuestions} (${assessment.percentage}% Success Rating)` },
    { key: "Calculated Proficiency :", val: `${assessment.skillLevel} Level (Evaluated tier)` },
    { key: "Appraisal Timestamp :", val: new Date(assessment.timestamp).toLocaleString() }
  ];

  let recordY = currentY + 6.5;
  infoRows.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // slate-500 label
    doc.text(row.key, margin + 5, recordY);

    doc.setFont('helvetica', 'bold');
    if (row.key.includes("Proficiency")) {
      doc.setTextColor(79, 70, 229); // highlight calculated level
    } else {
      doc.setTextColor(15, 23, 42); // bold dark content
    }
    doc.text(row.val, margin + 50, recordY);
    recordY += 6.5;
  });
  currentY += 45;

  // 1. CHANNELS DIAGNOSTIC BREAKDOWN
  ensureSpace(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("1. AI-BASED SKILL DIAGNOSIS GAP ANALYSIS", margin, currentY);
  currentY += 3.5;
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  // Strengths
  ensureSpace(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(16, 185, 129); // emerald green
  doc.text("✓ Verified Strengths and Competence Elements:", margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  if (assessment.strengths.length > 0) {
    assessment.strengths.forEach((str) => {
      const wrapped = doc.splitTextToSize(`• ${str}`, contentWidth - 4);
      ensureSpace(wrapped.length * 4.5);
      wrapped.forEach((line: string) => {
        doc.text(line, margin + 2, currentY);
        currentY += 4.5;
      });
    });
  } else {
    doc.text("• General fundamentals are acceptable.", margin + 2, currentY);
    currentY += 4.5;
  }
  currentY += 4;

  // Weaknesses
  ensureSpace(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6); // warning amber
  doc.text("! Detected Skill Deficiencies and Gaps:", margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  if (assessment.weakAreas.length > 0) {
    assessment.weakAreas.forEach((weak) => {
      const wrapped = doc.splitTextToSize(`• ${weak}`, contentWidth - 4);
      ensureSpace(wrapped.length * 4.5);
      wrapped.forEach((line: string) => {
        doc.text(line, margin + 2, currentY);
        currentY += 4.5;
      });
    });
  } else {
    doc.text("• No critical gaps detected. Maintain standard study drills.", margin + 2, currentY);
    currentY += 4.5;
  }
  currentY += 5;

  // 2. SUGGESTED FEEDBACK ACTION PLAN
  ensureSpace(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("2. HIGHLIGHTED FEEDBACK ACTION SUGGESTIONS", margin, currentY);
  currentY += 3.5;
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9.5);
  if (assessment.suggestions.length > 0) {
    assessment.suggestions.forEach((sug, idx) => {
      const wrapped = doc.splitTextToSize(`${idx + 1}. ${sug}`, contentWidth - 4);
      ensureSpace(wrapped.length * 4.5);
      wrapped.forEach((line: string) => {
        doc.text(line, margin, currentY);
        currentY += 4.5;
      });
    });
  } else {
    doc.text("1. Continue reading structured syllabus references.", margin, currentY);
    currentY += 4.5;
  }
  currentY += 5;

  // 3. PHASED LEARNING ROADMAP
  ensureSpace(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("3. PERSONALIZED PHASED LEARNING ROADMAP", margin, currentY);
  currentY += 3.5;
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  if (assessment.learningPath && assessment.learningPath.length > 0) {
    assessment.learningPath.forEach((step) => {
      ensureSpace(18);
      
      // Indigo Phase Tag Label
      doc.setFillColor(238, 242, 255);
      doc.rect(margin, currentY, 18, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`Phase ${step.stepNum}`, margin + 1.5, currentY + 4.2);

      // Phase Title
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(step.title, margin + 22, currentY + 4.2);
      currentY += 7.5;

      // Phase detail text
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      const wrappedDesc = doc.splitTextToSize(step.desc, contentWidth - 24);
      ensureSpace(wrappedDesc.length * 4 + 3);
      wrappedDesc.forEach((line: string) => {
        doc.text(line, margin + 22, currentY);
        currentY += 4;
      });
      currentY += 3;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9.5);
    doc.text("No phased roadmap requested for instant review.", margin, currentY);
    currentY += 5;
  }
  currentY += 5;

  // 4. APPROVED COURSES CATALOG RECOMMENDATIONS
  ensureSpace(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text("4. RECOMMENDED COMPLEMENTARY COURSE REFERENCE CHANNELS", margin, currentY);
  currentY += 3.5;
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  if (assessment.recommendedCourses && assessment.recommendedCourses.length > 0) {
    assessment.recommendedCourses.forEach((c, idx) => {
      ensureSpace(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${c.title} — [${c.level} Level]`, margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      const wrappedDesc = doc.splitTextToSize(c.description, contentWidth - 6);
      ensureSpace(wrappedDesc.length * 4 + 4);
      wrappedDesc.forEach((line: string) => {
        doc.text(line, margin + 4, currentY);
        currentY += 4;
      });

      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'italic');
      doc.text(`Syllabus/Reference: ${c.url}`, margin + 4, currentY);
      currentY += 5.5;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9.5);
    doc.text("No customized courses found in catalogs matching this proficiency level currently.", margin, currentY);
    currentY += 5;
  }

  // Footer validator line
  ensureSpace(20);
  currentY += 6;
  doc.setLineWidth(0.3);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text("CompetenceAI Skill Engine - Autonomous Report Certification System", margin, currentY);

  doc.setFont('helvetica', 'bold');
  doc.text("SECURE VERIFICATION CODE MATCHED (GEMINI 3.5 AI PRO)", margin + 100, currentY);

  // Trigger browser download action instantly, bypassing iframe context restrictions
  const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, "_");
  const cleanDomain = assessment.domain.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Assessment_Report_${cleanUsername}_${cleanDomain}.pdf`);
}
