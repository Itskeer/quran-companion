"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { useApp } from "@/context/AppProviders";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";

export default function HistoryPage() {
  const { t } = useTranslation();
  usePageTitle(t("history.title"));
  const { checkIns } = useApp();
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    if (checkIns.length === 0) return null;
    const total = checkIns.length;
    const moodCounts: Record<string, number> = {};
    checkIns.forEach((c) => {
      moodCounts[c.moodId] = (moodCounts[c.moodId] || 0) + 1;
    });
    const topMoodId = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];
    const topMood = moods.find((m) => m.id === topMoodId);
    const weekAgo = now - 7 * 86400000;
    const thisWeek = checkIns.filter(
      (c) => new Date(c.date).getTime() >= weekAgo
    ).length;
    return { total, topMood: topMood?.label || "Unknown", topMoodEmoji: topMood?.emoji || "?", thisWeek };
  }, [checkIns, now]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">
            {t("history.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("history.subtitle")}
          </p>
        </motion.div>

        {!stats ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <p className="text-gray-400 dark:text-gray-500">
              {t("history.noCheckIns")}
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            >
              {[
                { label: t("history.totalCheckIns"), value: stats.total },
                { label: t("history.thisWeek"), value: stats.thisWeek },
                { label: t("history.mostFrequent"), value: stats.topMoodEmoji },
                { label: t("history.topMood"), value: stats.topMood },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 text-center"
                >
                  <div className="text-2xl font-bold text-dark dark:text-white mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-dark dark:text-white">{t("history.timeline")}</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {checkIns.slice(0, 20).map((c, i) => {
                  const mood = moods.find((m) => m.id === c.moodId);
                  return (
                    <motion.div
                      key={c.date + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-2xl">{mood?.emoji || "?"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark dark:text-white truncate">
                          {mood?.label || t("history.unknown")}
                        </p>
                        {c.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {c.note}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        {new Date(c.date).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
