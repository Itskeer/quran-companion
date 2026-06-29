"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReadingStats } from "@/hooks/useReadingStats";
import { useApp } from "@/context/AppProviders";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
} from "react-icons/hi";

const SURAH_NAMES: Record<number, string> = {
  1: "Al-Fatihah",
  2: "Al-Baqarah",
  3: "Aal-E-Imran",
  4: "An-Nisa",
  5: "Al-Maidah",
  6: "Al-Anam",
  7: "Al-Araf",
  8: "Al-Anfal",
  9: "At-Tawbah",
  10: "Yunus",
  11: "Hud",
  12: "Yusuf",
  13: "Ar-Ra'd",
  14: "Ibrahim",
  15: "Al-Hijr",
  16: "An-Nahl",
  17: "Al-Isra",
  18: "Al-Kahf",
  19: "Maryam",
  20: "Taha",
  21: "Al-Anbiya",
  22: "Al-Hajj",
  23: "Al-Muminun",
  24: "An-Nur",
  25: "Al-Furqan",
  26: "Ash-Shuara",
  27: "An-Naml",
  28: "Al-Qasas",
  29: "Al-Ankabut",
  30: "Ar-Rum",
  31: "Luqman",
  32: "As-Sajdah",
  33: "Al-Ahzab",
  34: "Saba",
  35: "Fatir",
  36: "Ya-Sin",
  37: "As-Saffat",
  38: "Sad",
  39: "Az-Zumar",
  40: "Ghafir",
  41: "Fussilat",
  42: "Ash-Shura",
  43: "Az-Zukhruf",
  44: "Ad-Dukhan",
  45: "Al-Jathiyah",
  46: "Al-Ahqaf",
  47: "Muhammad",
  48: "Al-Fath",
  49: "Al-Hujurat",
  50: "Qaf",
  51: "Adh-Dhariyat",
  52: "At-Tur",
  53: "An-Najm",
  54: "Al-Qamar",
  55: "Ar-Rahman",
  56: "Al-Waqiah",
  57: "Al-Hadid",
  58: "Al-Mujadila",
  59: "Al-Hashr",
  60: "Al-Mumtahanah",
  61: "As-Saf",
  62: "Al-Jumuah",
  63: "Al-Munafiqun",
  64: "At-Taghabun",
  65: "At-Talaq",
  66: "At-Tahrim",
  67: "Al-Mulk",
  68: "Al-Qalam",
  69: "Al-Haqqah",
  70: "Al-Maarij",
  71: "Nuh",
  72: "Al-Jinn",
  73: "Al-Muzzammil",
  74: "Al-Muddaththir",
  75: "Al-Qiyamah",
  76: "Al-Insan",
  77: "Al-Mursalat",
  78: "An-Naba",
  79: "An-Naziat",
  80: "Abasa",
  81: "At-Takwir",
  82: "Al-Infitar",
  83: "Al-Mutaffifin",
  84: "Al-Inshiqaq",
  85: "Al-Buruj",
  86: "At-Tariq",
  87: "Al-Ala",
  88: "Al-Ghashiyah",
  89: "Al-Fajr",
  90: "Al-Balad",
  91: "Ash-Shams",
  92: "Al-Lail",
  93: "Ad-Duha",
  94: "Ash-Sharh",
  95: "At-Tin",
  96: "Al-Alaq",
  97: "Al-Qadr",
  98: "Al-Bayyinah",
  99: "Az-Zalzalah",
  100: "Al-Adiyat",
  101: "Al-Qariah",
  102: "At-Takathur",
  103: "Al-Asr",
  104: "Al-Humazah",
  105: "Al-Fil",
  106: "Quraysh",
  107: "Al-Maun",
  108: "Al-Kawthar",
  109: "Al-Kafirun",
  110: "An-Nasr",
  111: "Al-Masad",
  112: "Al-Ikhlas",
  113: "Al-Falaq",
  114: "An-Nas",
};

function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
      className="text-3xl font-bold text-gray-900 dark:text-white"
    >
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

export default function StatsPage() {
  const { t } = useTranslation();
  const stats = useReadingStats();
  const { readingSessions, dailyProgress } = useApp();

  const weeklyData = useMemo(() => {
    const now = new Date();
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en", { weekday: "short" });
      const count = readingSessions.filter((s) =>
        s.date.startsWith(dateStr)
      ).length;
      days.push({ label: dayLabel, count });
    }
    return days;
  }, [readingSessions]);

  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), 1);

  const topSurahs = stats.favoriteSurahs.slice(0, 5);
  const maxSurahCount = Math.max(...topSurahs.map((s) => s.count), 1);

  const dailyProgressHistory = useMemo(() => {
    return [...dailyProgress]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14);
  }, [dailyProgress]);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {t("stats.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("stats.trackJourney")}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <HiOutlineBookOpen className="w-5 h-5" />,
            label: t("stats.versesRead"),
            value: stats.totalVersesRead,
            color: "text-emerald dark:text-emerald-400",
          },
          {
            icon: <HiOutlineClock className="w-5 h-5" />,
            label: t("stats.minutesSpent"),
            value: stats.totalTimeSpent,
            color: "text-blue-500",
          },
          {
            icon: <HiOutlineFire className="w-5 h-5" />,
            label: t("stats.currentStreak"),
            value: stats.currentStreak,
            suffix: ` ${t("dhikr.days")}`,
            color: "text-amber-500",
          },
          {
            icon: <HiOutlineTrendingUp className="w-5 h-5" />,
            label: t("stats.longestStreak"),
            value: stats.longestStreak,
            suffix: ` ${t("dhikr.days")}`,
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5"
          >
            <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t("stats.thisWeek")}
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((day, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height:
                      day.count > 0
                        ? `${Math.max((day.count / maxWeeklyCount) * 100, 8)}%`
                        : "4px",
                  }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${
                    day.count > 0
                      ? "bg-emerald dark:bg-emerald-400"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                />
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {readingSessions.length} {t("stats.totalSessions")}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t("stats.favoriteSurahs")}
          </h2>
          {topSurahs.length === 0 ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t("stats.startReading")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topSurahs.map((surah, i) => (
                <div key={surah.surahNumber} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                      {SURAH_NAMES[surah.surahNumber] || `Surah ${surah.surahNumber}`}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-2 shrink-0">
                      {surah.count}x
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(surah.count / maxSurahCount) * 100}%`,
                      }}
                      transition={{
                        delay: 0.4 + i * 0.1,
                        duration: 0.6,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald to-teal-400 dark:from-emerald-400 dark:to-teal-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t("stats.dailyProgressHistory")}
        </h2>
        {dailyProgressHistory.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("stats.noDailyProgress")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dailyProgressHistory.map((day) => {
              let completed = 0;
              if (day.versesRead > 0) completed++;
              if (day.duasMade > 0) completed++;
              if (day.dhikrDone > 0) completed++;
              if (day.checkedIn) completed++;
              const percent = Math.round((completed / 4) * 100);

              return (
                <div
                  key={day.date}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="w-16 shrink-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(
                        "en",
                        { month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-emerald dark:bg-emerald-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 w-8 text-right shrink-0">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
