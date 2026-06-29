"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineClock, HiOutlineRefresh } from "react-icons/hi";

const PLAN_OPTIONS = [
  { type: "30day" as const, name: "30-Day Plan", nameAr: "خطة 30 يوم", desc: "Read Quran in 30 days", ayahsPerDay: 208 },
  { type: "60day" as const, name: "60-Day Plan", nameAr: "خطة 60 يوم", desc: "Read Quran in 60 days", ayahsPerDay: 104 },
  { type: "custom" as const, name: "Custom Plan", nameAr: "خطة مخصصة", desc: "Choose your own pace", ayahsPerDay: 50 },
];

export default function ReadingPlanPage() {
  const { t } = useTranslation();
  const { readingPlan, setReadingPlan } = useApp();

  const createPlan = (type: "30day" | "60day" | "custom") => {
    const days = type === "30day" ? 30 : type === "60day" ? 60 : 90;
    const ayahsPerDay = type === "30day" ? 208 : type === "60day" ? 104 : 70;
    const totalAyahs = 6236;
    const ayahsPerSurah = Math.ceil(totalAyahs / days);
    const progress = [];
    let ayahCounter = 0;
    for (let d = 1; d <= days; d++) {
      const start = ayahCounter;
      const end = Math.min(start + ayahsPerDay, totalAyahs);
      ayahCounter = end;
      progress.push({ day: d, surahStart: 1, ayahStart: start + 1, surahEnd: 114, ayahEnd: end, completed: false });
    }
    setReadingPlan({
      id: Date.now().toString(), name: PLAN_OPTIONS.find((p) => p.type === type)?.name || "Custom Plan",
      type, totalDays: days, currentDay: 1, startDate: new Date().toISOString(), dailyGoal: ayahsPerDay,
      progress, completed: false,
    });
  };

  const markComplete = () => {
    if (!readingPlan) return;
    const updated = { ...readingPlan };
    updated.progress[updated.currentDay - 1] = { ...updated.progress[updated.currentDay - 1], completed: true };
    if (updated.currentDay < updated.totalDays) updated.currentDay++;
    else updated.completed = true;
    setReadingPlan(updated);
  };

  const stats = useMemo(() => {
    if (!readingPlan) return { completed: 0, remaining: 0, percentage: 0 };
    const completed = readingPlan.progress.filter((p) => p.completed).length;
    return { completed, remaining: readingPlan.totalDays - completed, percentage: Math.round((completed / readingPlan.totalDays) * 100) };
  }, [readingPlan]);

  if (!readingPlan) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                <HiOutlineCalendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("readingPlan.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("readingPlan.subtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLAN_OPTIONS.map((opt) => (
                <motion.div key={opt.type} whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 text-center cursor-pointer"
                  onClick={() => createPlan(opt.type)}>
                  <HiOutlineCalendar className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{opt.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{opt.desc}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">~{opt.ayahsPerDay} ayahs/day</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                <HiOutlineCalendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{readingPlan.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("readingPlan.currentDay")} {readingPlan.currentDay}/{readingPlan.totalDays}</p>
              </div>
            </div>
            <button onClick={() => setReadingPlan(null)} className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">{t("readingPlan.resetPlan")}</button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
              <HiOutlineCheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("readingPlan.completed")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
              <HiOutlineClock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.remaining}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("readingPlan.remaining")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
              <HiOutlineRefresh className="w-6 h-6 text-[var(--accent)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.percentage}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("readingPlan.progress")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 mb-6">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div className="bg-[var(--accent)] h-4 rounded-full transition-all" style={{ width: `${stats.percentage}%` }} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t("readingPlan.ayahsPerDay")}: {readingPlan.dailyGoal}</p>
          </div>

          {!readingPlan.completed && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={markComplete}
              className="w-full py-4 bg-[var(--accent)] text-white dark:text-gray-900 rounded-2xl font-bold text-lg mb-8">
              {t("readingPlan.resumePlan")}
            </motion.button>
          )}

          {readingPlan.completed && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center mb-8">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{t("readingPlan.planComplete")}</p>
            </div>
          )}

          <div className="grid grid-cols-7 gap-2">
            {readingPlan.progress.map((day) => (
              <div key={day.day}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all ${day.completed ? "bg-green-500 text-white" : day.day === readingPlan.currentDay ? "bg-[var(--accent)] text-white ring-2 ring-[var(--accent)]/50" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"}`}>
                {day.day}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
