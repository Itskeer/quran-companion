"use client";

import { quizQuestions, type QuizQuestion } from "@/data/quizQuestions";
import type { QuizResult } from "@/types";

const QUIZ_HISTORY_KEY = "quran-companion-quiz-history";

export function getQuizQuestions(
  category?: string,
  difficulty?: string,
  count: number = 10
): QuizQuestion[] {
  let filtered = [...quizQuestions];

  if (category && category !== "all") {
    filtered = filtered.filter((q) => q.category === category);
  }

  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }

  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, count);
}

export function calculateScore(
  answers: number[],
  questions: QuizQuestion[]
): { score: number; total: number; percentage: number } {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correctIndex) {
      correct++;
    }
  }
  return {
    score: correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
  };
}

export function getQuizHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  const history = getQuizHistory();
  history.push(result);

  try {
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage full or unavailable
  }
}
