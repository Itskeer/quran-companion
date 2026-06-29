"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import type { AdhkarItem } from "@/data/adhkar";
import { HiOutlineCheckCircle, HiOutlineRefresh, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export default function AdhkarPage() {
  const { t } = useTranslation();
  const [timeType, setTimeType] = useState<"morning" | "evening">("morning");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const adhkarList = timeType === "morning" ? morningAdhkar : eveningAdhkar;

  const getRemaining = useCallback((item: AdhkarItem) => {
    return Math.max(0, item.count - (counts[item.id] || 0));
  }, [counts]);

  const isComplete = useCallback((item: AdhkarItem) => {
    return (counts[item.id] || 0) >= item.count;
  }, [counts]);

  const allComplete = adhkarList.every((item) => isComplete(item));

  const completedCount = adhkarList.filter((item) => isComplete(item)).length;
  const totalCount = adhkarList.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const incrementCount = (id: string) => {
    setCounts((prev) => {
      const item = adhkarList.find((a) => a.id === id);
      if (!item) return prev;
      const current = prev[id] || 0;
      if (current >= item.count) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const resetCounts = () => setCounts({});

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
              <HiOutlineSun className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("adhkar.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("adhkar.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => { setTimeType("morning"); resetCounts(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${timeType === "morning" ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
              <HiOutlineSun className="w-5 h-5" /> {t("adhkar.morning")}
            </button>
            <button onClick={() => { setTimeType("evening"); resetCounts(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${timeType === "evening" ? "bg-indigo-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
              <HiOutlineMoon className="w-5 h-5" /> {t("adhkar.evening")}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("adhkar.completed")}: {completedCount}/{totalCount}</span>
              <span className="text-sm font-medium text-[var(--accent)]">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-[var(--accent)] h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {allComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center mb-6">
              <HiOutlineCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{t("adhkar.sessionComplete")}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {adhkarList.map((item) => {
              const remaining = getRemaining(item);
              const done = isComplete(item);
              const currentCount = counts[item.id] || 0;
              return (
                <motion.div key={item.id} layout
                  className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 transition-all ${done ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-700/50"}`}>
                  <p className="text-xl leading-loose text-right text-gray-900 dark:text-white mb-3" dir="rtl">{item.arabic}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">{item.transliteration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.translation}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{item.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{currentCount}/{item.count}</span>
                      {!done ? (
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => incrementCount(item.id)}
                          className="w-10 h-10 rounded-full bg-[var(--accent)] text-white dark:text-gray-900 flex items-center justify-center font-bold text-lg">
                          {remaining}
                        </motion.button>
                      ) : (
                        <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
