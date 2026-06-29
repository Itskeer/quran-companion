"use client";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GeometricPattern from "@/components/GeometricPattern";
import { useApp } from "@/context/AppProviders";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTranslation } from "@/i18n/useTranslation";
import { getCurrentHijriDate } from "@/services/hijriCalendar";
import {
  calculatePrayerTimes,
  getNextPrayer,
  getTimeUntilPrayer,
} from "@/services/prayerTimes";
import { verses } from "@/data/verses";
import { duas } from "@/data/duas";
import {
  HiOutlineHeart,
  HiOutlineBookOpen,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineMoon,
  HiOutlineStar,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineCalendar,
} from "react-icons/hi";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getNextRamadan(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const ramadanStart = new Date(year, 1, 18);
  if (now > ramadanStart) {
    return new Date(year + 1, 1, 7);
  }
  return ramadanStart;
}

function getEidAlFitr(): Date {
  const ramadan = getNextRamadan();
  return new Date(ramadan.getTime() + 30 * 24 * 60 * 60 * 1000);
}

function getEidAlAdha(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const eidAdha = new Date(year, 4, 26);
  if (now > eidAdha) {
    return new Date(year + 1, 4, 15);
  }
  return eidAdha;
}

function getDaysRemaining(target: Date): number {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function isCurrentlyRamadan(): boolean {
  const now = new Date();
  const ramadan = getNextRamadan();
  const eid = getEidAlFitr();
  return now >= ramadan && now < eid;
}

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 6) return "home.greeting.night";
  if (hour < 12) return "home.greeting.morning";
  if (hour < 17) return "home.greeting.afternoon";
  if (hour < 21) return "home.greeting.evening";
  return "home.greeting.night";
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-100 dark:text-gray-800"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="text-emerald-500 dark:text-emerald-400"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {percent}%
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          Daily Goal
        </span>
      </div>
    </div>
  );
}

const quickActions = [
  { icon: "📖", labelKey: "nav.quran", href: "/quran", color: "from-emerald-500 to-emerald-600" },
  { icon: "🤲", labelKey: "nav.duas", href: "/duas", color: "from-blue-500 to-blue-600" },
  { icon: "📿", labelKey: "nav.dhikr", href: "/dhikr", color: "from-amber-500 to-amber-600" },
  { icon: "🕌", labelKey: "nav.prayer", href: "/prayer-times", color: "from-purple-500 to-purple-600" },
  { icon: "🧭", labelKey: "nav.qibla", href: "/qibla", color: "from-teal-500 to-teal-600" },
  { icon: "💰", labelKey: "nav.zakat", href: "/zakat", color: "from-yellow-500 to-yellow-600" },
  { icon: "📜", labelKey: "nav.hadith", href: "/hadith", color: "from-rose-500 to-rose-600" },
  { icon: "📚", labelKey: "nav.stories", href: "/stories", color: "from-indigo-500 to-indigo-600" },
  { icon: "✨", labelKey: "nav.names", href: "/99-names", color: "from-cyan-500 to-cyan-600" },
  { icon: "📅", labelKey: "nav.seerah", href: "/seerah", color: "from-orange-500 to-orange-600" },
  { icon: "🕌", labelKey: "nav.prophets", href: "/prophets", color: "from-green-500 to-green-600" },
  { icon: "🌙", labelKey: "nav.ramadan", href: "/ramadan", color: "from-violet-500 to-violet-600" },
  { icon: "🎯", labelKey: "nav.goals", href: "/goals", color: "from-pink-500 to-pink-600" },
  { icon: "📝", labelKey: "nav.gratitude", href: "/gratitude", color: "from-lime-500 to-lime-600" },
  { icon: "📖", labelKey: "nav.glossary", href: "/glossary", color: "from-sky-500 to-sky-600" },
  { icon: "📚", labelKey: "nav.reading", href: "/reading-modes", color: "from-fuchsia-500 to-fuchsia-600" },
];

const featureHighlights = [
  { name: "Quran Reader", desc: "Read all 114 Surahs with translations", icon: <HiOutlineBookOpen className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
  { name: "Dua Library", desc: "102+ authentic duas for every occasion", icon: <HiOutlineHeart className="w-6 h-6" />, color: "from-blue-500 to-indigo-500" },
  { name: "Dhikr Counter", desc: "Track your daily remembrance", icon: <HiOutlineSparkles className="w-6 h-6" />, color: "from-amber-500 to-orange-500" },
  { name: "Prayer Times", desc: "Accurate times for your location", icon: <HiOutlineClock className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
  { name: "Qibla Compass", desc: "Find the direction of prayer", icon: <HiOutlineLocationMarker className="w-6 h-6" />, color: "from-teal-500 to-cyan-500" },
  { name: "Zakat Calculator", desc: "Calculate your annual obligation", icon: <HiOutlineCash className="w-6 h-6" />, color: "from-yellow-500 to-amber-500" },
  { name: "99 Names", desc: "Learn the beautiful names of Allah", icon: <HiOutlineStar className="w-6 h-6" />, color: "from-cyan-500 to-blue-500" },
  { name: "Seerah", desc: "The prophetic biography timeline", icon: <HiOutlineCalendar className="w-6 h-6" />, color: "from-orange-500 to-red-500" },
];

export default function HomePage() {
  const {
    readingSessions,
    dhikrSessions,
    readingProgress,
  } = useApp();
  const { completionPercent, versesRead, duasMade, dhikrDone, checkedIn } =
    useDailyProgress();
  const geo = useGeolocation();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("user_name");
    if (saved) setUserName(saved);
  }, []);

  const hijri = useMemo(() => getCurrentHijriDate(), []);

  const verseOfTheDay = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return verses[dayOfYear % verses.length];
  }, []);

  const duaOfTheDay = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const rng = seededRandom(dayOfYear);
    return duas[Math.floor(rng() * duas.length)];
  }, []);

  const nextPrayer = useMemo(() => {
    if (!geo.latitude || !geo.longitude || geo.loading) return null;
    try {
      const times = calculatePrayerTimes(new Date(), {
        method: "MWL",
        latitude: geo.latitude,
        longitude: geo.longitude,
      });
      const next = getNextPrayer(times);
      const timeUntil = getTimeUntilPrayer(next);
      return { name: next.name, time: next.time, timeUntil };
    } catch {
      return null;
    }
  }, [geo]);

  const streak = useMemo(() => {
    const dates = new Set(
      readingSessions.map((s) => s.date.split("T")[0])
    );
    const sorted = Array.from(dates).sort().reverse();
    if (sorted.length === 0) return 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const curr = new Date(sorted[i - 1]);
      const prev = new Date(sorted[i]);
      const diff =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else break;
    }
    return count;
  }, [readingSessions]);

  const today = new Date();
  const gregorianDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ramadanDays = getDaysRemaining(getNextRamadan());
  const eidFitrDays = getDaysRemaining(getEidAlFitr());
  const eidAdhaDays = getDaysRemaining(getEidAlAdha());
  const inRamadan = isCurrentlyRamadan();

  const visibleActions = showAllActions ? quickActions : quickActions.slice(0, 8);

  const lastReading = useMemo(() => {
    if (readingSessions.length === 0) return null;
    const last = readingSessions[readingSessions.length - 1];
    const surah = verses.find((v) => v.surahNumber === last.surahNumber);
    return surah ? `Surah ${surah.surah}, Ayah ${last.ayahEnd}` : null;
  }, [readingSessions]);

  if (!mounted) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <GeometricPattern className="absolute inset-0" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern className="absolute inset-0" />

      <div className="relative z-10 min-h-screen px-4 pt-24 pb-20 max-w-5xl mx-auto space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #047857 30%, #d97706 70%, #f59e0b 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 text-8xl rotate-12">&#9776;</div>
            <div className="absolute bottom-4 left-8 text-7xl -rotate-12">&#9776;</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-20">&#9776;</div>
          </div>
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/15 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-white/10 rounded-full" />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/80 text-sm font-medium mb-2"
            >
              {t(getGreetingKey())}, {userName || t("home.dearMuslim")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
            >
              {t("home.greeting.default")}{userName ? `, ${userName}` : ""}!
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <div className="flex items-center gap-2 text-white/90">
                <HiOutlineMoon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {hijri.dayName}, {hijri.formatted}
                </span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
              <div className="flex items-center gap-2 text-white/80">
                <HiOutlineCalendar className="w-4 h-4" />
                <span className="text-sm">{gregorianDate}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Ramadan & Eid Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {inRamadan ? (
            <div className="sm:col-span-3 relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <div className="absolute top-2 right-4 text-5xl opacity-30 animate-pulse">&#127769;</div>
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl"
                >
                  &#127769;
                </motion.span>
                <div>
                  <h3 className="text-xl font-bold">{t("home.ramadanMubarak")}</h3>
                  <p className="text-white/80 text-sm">{ramadanDays} {t("home.nightsRemaining")}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                <div className="absolute top-2 right-2 text-4xl opacity-30">&#127769;</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">&#127769;</span>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                    Countdown
                  </span>
                </div>
                <div className="text-2xl font-bold mt-2">{ramadanDays}</div>
                <div className="text-sm text-white/80">{t("home.daysUntilRamadan")}</div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <div className="absolute top-2 right-2 text-4xl opacity-30">&#127769;</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">&#127769;</span>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                    Eid
                  </span>
                </div>
                <div className="text-2xl font-bold mt-2">{eidFitrDays}</div>
                <div className="text-sm text-white/80">{t("home.eidAlFitr")} {t("home.inDays")} {eidFitrDays} {t("home.days")}</div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
                <div className="absolute top-2 right-2 text-4xl opacity-30">&#128038;</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">&#128038;</span>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                    Eid
                  </span>
                </div>
                <div className="text-2xl font-bold mt-2">{eidAdhaDays}</div>
                <div className="text-sm text-white/80">{t("home.eidAlAdha")} {t("home.inDays")} {eidAdhaDays} {t("home.days")}</div>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("home.quickActions")}
            </h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
            <AnimatePresence>
              {visibleActions.map((action, i) => (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  layout
                >
                  <Link
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 hover:scale-105 transition-all duration-200 group"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {t(action.labelKey)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={() => setShowAllActions(!showAllActions)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            {showAllActions ? t("home.showLess") : t("home.showMore")}
            <motion.div
              animate={{ rotate: showAllActions ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiOutlineChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Verse of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineBookOpen className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              {t("home.verseOfDay")}
            </span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-right text-xl leading-[2.2] text-gray-900 dark:text-white mb-4 font-arabic"
            dir="rtl"
          >
            {verseOfTheDay.arabic}
          </motion.p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            {verseOfTheDay.translation}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {verseOfTheDay.surah} ({verseOfTheDay.surahNumber}:{verseOfTheDay.ayahNumber})
              </span>
            </div>
            <Link
              href={`/quran/surah/${verseOfTheDay.surahNumber}`}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
                {t("home.readFullSurah")}
              <HiOutlineChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Dua of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineHeart className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
              {t("home.duaOfDay")}
            </span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-right text-xl leading-[2.2] text-gray-900 dark:text-white mb-3 font-arabic"
            dir="rtl"
          >
            {duaOfTheDay.arabic}
          </motion.p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-3">
            {duaOfTheDay.translation}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {duaOfTheDay.source}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {duaOfTheDay.category}
              </span>
              <Link
                href={`/duas?category=${encodeURIComponent(duaOfTheDay.category)}`}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {t("home.viewDua")}
                <HiOutlineChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Reading Progress + Next Prayer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reading Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineBookOpen className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {t("home.readingProgress")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing percent={completionPercent} />
              <div className="flex-1 space-y-2">
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      &#128293;
                    </motion.span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {streak} {t("home.dayStreak")}
                    </span>
                  </div>
                )}
                {lastReading && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("home.lastRead")}: {lastReading}
                  </p>
                )}
                <Link
                  href="/quran"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
                >
                  {t("home.continueReading")}
                  <HiOutlineChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Next Prayer Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineClock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {t("home.nextPrayer")}
              </h3>
            </div>
            {nextPrayer ? (
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {nextPrayer.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {nextPrayer.time} &middot; in {nextPrayer.timeUntil}
                </div>
                <Link
                  href="/prayer-times"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors"
                >
                  View Schedule
                  <HiOutlineChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Enable location to see prayer times
                </div>
                <Link
                  href="/prayer-times"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors"
                >
                  Set Location
                  <HiOutlineChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Feature Highlights Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("nav.about")}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">Swipe to browse</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {featureHighlights.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.4 }}
                className="flex-shrink-0 w-64 snap-start"
              >
                <div className="h-full p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Summary Mini Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              icon: <HiOutlineBookOpen className="w-5 h-5" />,
              label: "Verses Read",
              value: versesRead,
              color: "text-emerald-500 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
            },
            {
              icon: <HiOutlineHeart className="w-5 h-5" />,
              label: "Duas Made",
              value: duasMade,
              color: "text-blue-500 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              icon: <HiOutlineSparkles className="w-5 h-5" />,
              label: "Dhikr Done",
              value: dhikrDone,
              color: "text-amber-500 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-500/10",
            },
            {
              icon: <HiOutlineStar className="w-5 h-5" />,
              label: "Checked In",
              value: checkedIn ? "Yes" : "No",
              color: "text-purple-500 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-purple-500/10",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.bg} rounded-2xl p-4 text-center`}
            >
              <div className={`${item.color} flex justify-center mb-2`}>
                {item.icon}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
