"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { arabicAlphabet, arabicBasicWords, arabicNumbers } from "@/data/arabicBasics";
import { HiOutlineAcademicCap } from "react-icons/hi";

const TABS = ["alphabet", "words", "numbers"] as const;
const WORD_CATEGORIES = [...new Set(arabicBasicWords.map((w) => w.category))];

export default function ArabicLearningPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"alphabet" | "words" | "numbers">("alphabet");
  const [wordCategory, setWordCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  const filteredWords = wordCategory === "all" ? arabicBasicWords : arabicBasicWords.filter((w) => w.category === wordCategory);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
              <HiOutlineAcademicCap className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("arabicLearning.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("arabicLearning.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {TABS.map((tabKey) => (
              <button key={tabKey} onClick={() => setTab(tabKey)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === tabKey ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
                {t(`arabicLearning.${tabKey}`)}
              </button>
            ))}
          </div>

          {tab === "alphabet" && (
            <>
              {selectedLetter !== null && arabicAlphabet[selectedLetter] && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6 text-center">
                  <p className="text-6xl text-gray-900 dark:text-white mb-2">{arabicAlphabet[selectedLetter].letter}</p>
                  <p className="text-xl font-medium text-gray-900 dark:text-white">{arabicAlphabet[selectedLetter].name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{arabicAlphabet[selectedLetter].transliteration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("arabicLearning.exampleWord")}: {arabicAlphabet[selectedLetter].word} — {arabicAlphabet[selectedLetter].wordMeaning}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{arabicAlphabet[selectedLetter].type} letter</span>
                </motion.div>
              )}
              <div className="grid grid-cols-7 gap-3">
                {arabicAlphabet.map((letter, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedLetter(selectedLetter === i ? null : i)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${selectedLetter === i ? "bg-[var(--accent)] text-white dark:text-gray-900 ring-2 ring-[var(--accent)]/50" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-900 dark:text-white"}`}>
                    <span className="text-2xl">{letter.letter}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{letter.transliteration}</span>
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {tab === "words" && (
            <>
              <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
                <button onClick={() => setWordCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${wordCategory === "all" ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>All</button>
                {WORD_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setWordCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize ${wordCategory === cat ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{cat}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredWords.map((word, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
                    <p className="text-3xl text-gray-900 dark:text-white mb-1">{word.arabic}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{word.transliteration}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{word.english}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{word.french}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "numbers" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {arabicNumbers.map((num, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 text-center">
                  <p className="text-4xl text-gray-900 dark:text-white mb-1">{num.eastern}</p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">{num.western}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{num.transliteration}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
