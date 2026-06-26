/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  domain: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Course {
  id: string;
  title: string;
  domain: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
}

export interface Assessment {
  id: string;
  userId: string;
  domain: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  timestamp: string;
  strengths: string[];
  weakAreas: string[];
  suggestions: string[];
  learningPath: { stepNum: number; title: string; desc: string }[];
  recommendedCourses: Course[];
}

export interface UserProfile {
  username: string;
  domainOfInterest: string;
  createdAt: string;
}
