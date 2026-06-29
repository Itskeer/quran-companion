"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { getQuizQuestions } from "@/services/quizService";
import { useApp } from "@/context/AppProviders";
import { HiOutlineAcademicCap, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const CATEGORIES = ["quran", "hadith", "seerah", "fiqh", "99names", "general"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export default function QuizPage() {
  const { t } = useTranslation();
  const { quizHistory, addQuizResult } = useApp();
  const [phase, setPhase] = useState<"select" | "play" | "result">("select");
  const [category, setCategory] = useState<string>("quran");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const startQuiz = () => {
    const q = getQuizQuestions(category, difficulty, 10);
    setQuestions(q);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setPhase("play");
  };

  const answer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        const score = newAnswers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0);
        addQuizResult({
          id: Date.now().toString(), date: new Date().toISOString().split("T")[0],
          category, score, total: questions.length, difficulty, timeTaken: 0,
        });
        setPhase("result");
      }
    }, 1000);
  };

  const score = answers.reduce((s, a, i) => s + (a === questions[i]?.correctIndex ? 1 : 0), 0);

  if (phase === "select") {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl"><HiOutlineAcademicCap className="w-7 h-7 text-cyan-600 dark:text-cyan-400" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("quiz.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("quiz.subtitle")}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t("quiz.quran")}</h3>
              <div className="flex flex-wrap gap-2 mb-4">{CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${category === c ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>{t(`quiz.${c === "99names" ? "names99" : c}`)}</button>
              ))}</div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t("quiz.difficulty")}</h3>
              <div className="flex gap-2 mb-4">{DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${difficulty === d ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>{t(`quiz.${d}`)}</button>
              ))}</div>
              <button onClick={startQuiz} className="w-full py-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium mt-4">{t("quiz.startQuiz")}</button>
            </div>
            {quizHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t("quiz.bestScore")}</h3>
                {quizHistory.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{r.category} · {r.difficulty}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{r.score}/{r.total}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
            <p className="text-5xl mb-4">{score / questions.length >= 0.7 ? "🎉" : "📚"}</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{score}/{questions.length}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t("quiz.score")}</p>
            <button onClick={() => setPhase("select")} className="px-6 py-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium">{t("quiz.tryAgain")}</button>
          </motion.div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t("quiz.question")} {current + 1} {t("quiz.of")} {questions.length}</span>
            <span className="text-sm font-medium text-[var(--accent)]">{score} {t("quiz.correct")}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-6"><div className="bg-[var(--accent)] h-2 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">{q.question}</p>
            <div className="space-y-3">{q.options.map((opt: string, i: number) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === selected;
              let cls = "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white";
              if (selected !== null) { if (isCorrect) cls = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"; else if (isSelected) cls = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"; }
              return <button key={i} onClick={() => answer(i)} disabled={selected !== null} className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${cls}`}>{opt}</button>;
            })}</div>
          </div>
          {selected !== null && q.explanation && <p className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">{q.explanation}</p>}
        </motion.div>
      </div>
    </div>
  );
}
