"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { istighfarData } from "@/data/istighfarData";
import { HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineTrendingUp } from "react-icons/hi";

export default function IstighfarPage() {
  const { t } = useTranslation();
  const { istighfarHistory, setIstighfarHistory } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [count, setCount] = useState(() => {
    const todayEntry = istighfarHistory.find((e) => e.date === today);
    return todayEntry?.count || 0;
  });
  const [target, setTarget] = useState(() => {
    const todayEntry = istighfarHistory.find((e) => e.date === today);
    return todayEntry?.target || 100;
  });
  const [selectedDua, setSelectedDua] = useState(0);

  const saveProgress = (newCount: number, newTarget: number) => {
    const updated = istighfarHistory.filter((e) => e.date !== today);
    updated.unshift({ id: today, date: today, count: newCount, target: newTarget });
    setIstighfarHistory(updated);
  };

  const increment = () => {
    const next = count + 1;
    setCount(next);
    saveProgress(next, target);
  };

  const reset = () => {
    setCount(0);
    saveProgress(0, target);
  };

  const streak = useMemo(() => {
    let s = 0;
    const dates = istighfarHistory.map((e) => e.date).sort().reverse();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      d.setDate(d.getDate() - i);
      if (d.toISOString().split("T")[0] === dates[i] && istighfarHistory.find((e) => e.date === dates[i])?.count) s++;
      else break;
    }
    return s;
  }, [istighfarHistory]);

  const percentage = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl">
              <HiOutlineTrendingUp className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("istighfar.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("istighfar.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{streak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("istighfar.streak")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
              <p className="text-3xl font-bold text-[var(--accent)]">{percentage}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("istighfar.completed")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-8">
            <div className="text-center mb-6">
              <div className="w-48 h-48 mx-auto relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-700" />
                  <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
                    className="text-[var(--accent)]" strokeDasharray={`${2 * Math.PI * 54}`} strokeDashoffset={`${2 * Math.PI * 54 * (1 - percentage / 100)}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{count}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/ {target}</span>
                </div>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.9 }} onClick={increment}
              className="w-full py-5 bg-[var(--accent)] text-white dark:text-gray-900 rounded-2xl font-bold text-xl mb-4">
              {t("istighfar.counter")}
            </motion.button>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{t("istighfar.dailyTarget")}</label>
                <input type="number" value={target} onChange={(e) => { const v = Number(e.target.value); setTarget(v); saveProgress(count, v); }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-sm" />
              </div>
              <button onClick={reset} className="self-end p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                <HiOutlineRefresh className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t("istighfar.supplications")}</h3>
          <div className="space-y-3">
            {istighfarData.map((dua, i) => (
              <motion.div key={dua.id} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDua(selectedDua === i ? -1 : i)}
                className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 cursor-pointer transition-all ${selectedDua === i ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-gray-100 dark:border-gray-700/50"}`}>
                <p className="text-lg leading-relaxed text-right text-gray-900 dark:text-white mb-2" dir="rtl">{dua.arabic}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{dua.transliteration}</p>
                {selectedDua === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{dua.translation}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{dua.source}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {istighfarHistory.length > 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t("istighfar.history")}</h3>
              <div className="space-y-2">
                {istighfarHistory.slice(0, 7).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700/50">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.count}/{entry.target}</span>
                      {entry.count >= entry.target && <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
