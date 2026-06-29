"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { anxietyDuas } from "@/data/anxietyDuas";
import { HiOutlineHeart } from "react-icons/hi";

const CATEGORIES = [...new Set(anxietyDuas.map((d) => d.category))];

export default function AnxietyDuasPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = category === "all" ? anxietyDuas : anxietyDuas.filter((d) => d.category === category);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl"><HiOutlineHeart className="w-7 h-7 text-blue-600 dark:text-blue-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("anxietyDuas.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("anxietyDuas.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            <button onClick={() => setCategory("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${category === "all" ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize ${category === cat ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{t(`anxietyDuas.${cat}`)}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((dua, i) => (
              <motion.div key={i} layout className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4">
                  <p className="text-2xl text-gray-900 dark:text-white text-center mb-3 leading-relaxed">{dua.arabic}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">{dua.transliteration}</p>
                </button>
                {expanded === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="pt-3 space-y-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">{t("anxietyDuas.meaning")}:</strong> {dua.translation}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">{t("anxietyDuas.when")}:</strong> {dua.situation}</p>
                      <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 capitalize">{dua.category}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
