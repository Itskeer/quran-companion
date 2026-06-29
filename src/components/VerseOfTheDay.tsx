"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { verses } from "@/data/verses";
import ThemeBadge from "./ThemeBadge";

export default function VerseOfTheDay() {
  const verse = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return verses[dayOfYear % verses.length];
  }, []);

  if (!verse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌙</span>
        <span className="text-xs font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 px-3 py-1 rounded-full">
          Verse of the Day
        </span>
      </div>
      <div className="text-right mb-4">
        <p className="text-2xl leading-[2.2] text-gray-900 dark:text-white tracking-wider">
          {verse.arabic}
        </p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-3">
        {verse.translation}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {verse.surah} · Ayah {verse.ayahNumber}
        </span>
        <div className="flex gap-1.5">
          {verse.themes.slice(0, 2).map((t) => (
            <ThemeBadge key={t} theme={t} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
