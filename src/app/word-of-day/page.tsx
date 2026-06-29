"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { getWordOfDay } from "@/services/wordOfDayService";
import { HiOutlineSparkles, HiOutlineShare } from "react-icons/hi";

export default function WordOfDayPage() {
  const { t } = useTranslation();
  const word = getWordOfDay();

  const share = () => {
    if (navigator.share) navigator.share({ title: t("wordOfDay.title"), text: `${word.arabic} (${word.transliteration}) — ${word.meaning}` });
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl"><HiOutlineSparkles className="w-7 h-7 text-violet-600 dark:text-violet-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("wordOfDay.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("wordOfDay.subtitle")}</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 dark:from-[var(--accent)]/20 dark:to-transparent rounded-3xl border border-[var(--accent)]/20 p-8 text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium mb-4">{t("wordOfDay.dailyWord")}</span>
            <p className="text-6xl text-gray-900 dark:text-white mb-3">{word.arabic}</p>
            <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-2">{word.transliteration}</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">{word.meaning}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs capitalize mb-4">{word.category}</span>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("wordOfDay.example")}</p>
              <p className="text-gray-700 dark:text-gray-300">{word.example}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{word.exampleTranslation}</p>
            </div>
          </motion.div>

          <button onClick={share} className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
            <HiOutlineShare className="w-5 h-5" /> {t("wordOfDay.share")}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
