"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { fiqhTopics } from "@/data/fiqhBasics";
import { HiOutlineBookOpen } from "react-icons/hi";

const CATEGORIES = [...new Set(fiqhTopics.map((f) => f.category))];

export default function FiqhPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = fiqhTopics.filter((f) => {
    if (category !== "all" && f.category !== category) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.rulings.some((r) => r.question.toLowerCase().includes(search.toLowerCase()) || r.answer.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl"><HiOutlineBookOpen className="w-7 h-7 text-teal-600 dark:text-teal-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("fiqh.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("fiqh.subtitle")}</p>
            </div>
          </div>

          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("fiqh.searchPlaceholder")}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white mb-4" />

          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            <button onClick={() => setCategory("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${category === "all" ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{t("fiqh.prayer")}</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize ${category === cat ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{cat}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((topic, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{topic.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{topic.category}</p>
                  </div>
                  <motion.span animate={{ rotate: expanded === i ? 180 : 0 }} className="text-gray-400">▾</motion.span>
                </button>
                {expanded === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/50">
                    {topic.rulings.map((r, j) => (
                      <div key={j} className="py-3 border-b border-gray-50 dark:border-gray-700/30 last:border-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{r.question}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.answer}</p>
                        {r.source && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Source: {r.source}</p>}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
