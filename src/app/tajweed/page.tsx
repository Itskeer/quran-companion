"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { tajweedRules } from "@/data/tajweedRules";
import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";

const CATEGORIES = ["all", "pronunciation", "elongation", "nasalization", "stops", "special"];

export default function TajweedPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = tajweedRules.filter((r) => {
    if (category !== "all" && r.category !== category) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.nameArabic.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
              <div className="w-7 h-7 bg-red-500 rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("tajweed.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("tajweed.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${category === c ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
                {c === "all" ? t("tajweed.rules") : t(`tajweed.${c}`)}
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("tafsir.search")}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t("tajweed.colorGuide")}</h3>
            <div className="flex flex-wrap gap-3">
              {tajweedRules.slice(0, 6).map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((rule) => (
              <motion.div key={rule.id} layout
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <button onClick={() => setExpanded(expanded === rule.id ? null : rule.id)}
                  className="w-full flex items-center gap-4 p-5 text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: rule.color + "20" }}>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: rule.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{rule.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{rule.nameArabic}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {t(`tajweed.${rule.category}`)}
                  </span>
                  {expanded === rule.id ? <HiOutlineChevronUp className="w-5 h-5 text-gray-400" /> : <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                <AnimatePresence>
                  {expanded === rule.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/50 pt-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{rule.description}</p>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 mb-3">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("tajweed.examples")}</p>
                          <div className="flex flex-wrap gap-2">
                            {rule.examples.map((ex, i) => (
                              <span key={i} className="px-3 py-1 rounded-lg text-lg" style={{ backgroundColor: rule.color + "15", color: rule.color }}>{ex}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{t("tajweed.tips")}:</strong> {rule.tips}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
