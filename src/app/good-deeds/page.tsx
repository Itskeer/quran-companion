"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineGift,
  HiOutlineFlag,
  HiOutlineCollection,
  HiOutlineChartBar,
} from "react-icons/hi";

type DeedCategory = "Charity" | "Kindness" | "Prayer" | "Knowledge" | "Family" | "Other";

interface GoodDeed {
  id: string;
  description: string;
  category: DeedCategory;
  date: string;
}

const STORAGE_KEY = "good-deed-jar";

const CATEGORIES: { name: DeedCategory; emoji: string; color: string; bg: string }[] = [
  { name: "Charity", emoji: "💰", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  { name: "Kindness", emoji: "❤️", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
  { name: "Prayer", emoji: "🕌", color: "text-emerald dark:text-emerald-400", bg: "bg-emerald/10 dark:bg-emerald/20" },
  { name: "Knowledge", emoji: "📚", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Family", emoji: "👨‍👩‍👧‍👦", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Other", emoji: "⭐", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700" },
];

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];

const SUGGESTIONS = [
  "Give a compliment to someone today",
  "Help a neighbor with their groceries",
  "Call a family member you haven't spoken to",
  "Donate to a charity",
  "Read a page of Quran",
  "Teach someone something new",
  "Make dua for someone",
  "Share a smile with a stranger",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function calcStreak(deeds: GoodDeed[]): { current: number; longest: number } {
  const uniqueDates = Array.from(
    new Set(deeds.map((d) => d.date.split("T")[0]))
  ).sort().reverse();

  if (uniqueDates.length === 0) return { current: 0, longest: 0 };

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let current = 0;
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    current = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) current++;
      else break;
    }
  }

  let longest = 0;
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const curr = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export default function GoodDeedsPage() {
  usePageTitle("Good Deed Jar");
  const { t } = useTranslation();
  const [deeds, setDeeds] = useState<GoodDeed[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DeedCategory>("Kindness");
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState<number | null>(null);
  const [suggestion] = useState(() => SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDeeds(JSON.parse(stored));
    } catch {}
  }, []);

  const streaks = useMemo(() => calcStreak(deeds), [deeds]);
  const weekDates = useMemo(() => getWeekDates(), []);
  const weekDeeds = useMemo(
    () => deeds.filter((d) => weekDates.includes(d.date.split("T")[0])),
    [deeds, weekDates]
  );

  const categoryBreakdown = useMemo(() => {
    const counts: Record<DeedCategory, number> = {
      Charity: 0, Kindness: 0, Prayer: 0, Knowledge: 0, Family: 0, Other: 0,
    };
    deeds.forEach((d) => { counts[d.category]++; });
    return counts;
  }, [deeds]);

  const weeklyAvg = useMemo(() => {
    const totalWeekDeeds = weekDeeds.length;
    const daysActive = new Set(weekDeeds.map((d) => d.date.split("T")[0])).size;
    return daysActive > 0 ? (totalWeekDeeds / daysActive).toFixed(1) : "0";
  }, [weekDeeds]);

  const sortedDeeds = useMemo(
    () => [...deeds].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [deeds]
  );

  const recentDeeds = useMemo(() => sortedDeeds.slice(0, 50), [sortedDeeds]);

  const handleSave = () => {
    if (!description.trim()) return;
    const newDeed: GoodDeed = {
      id: Date.now().toString(),
      description: description.trim(),
      category,
      date: new Date().toISOString(),
    };
    const updated = [newDeed, ...deeds];
    setDeeds(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setDescription("");
    setShowForm(false);

    const newTotal = updated.length;
    const hitMilestone = MILESTONES.find((m) => newTotal === m);
    if (hitMilestone) {
      setLastMilestone(hitMilestone);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deeds.filter((d) => d.id !== id);
    setDeeds(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleShare = () => {
    const text = `I have ${deeds.length} good deeds in my jar! Alhamdulillah! 🌟\n\n"Whoever does a good deed will have the reward of ten like it." — Quran 6:160`;
    if (navigator.share) {
      navigator.share({ title: "My Good Deeds", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] pointer-events-none"
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                    y: -20,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{
                    y: typeof window !== "undefined" ? window.innerHeight + 20 : 800,
                    rotate: Math.random() * 720 - 360,
                    scale: [1, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 1.5,
                    ease: "easeOut",
                  }}
                  className="absolute text-2xl"
                  style={{ left: `${Math.random() * 100}%` }}
                >
                  {["🌟", "✨", "🎉", "💚", "🎊", "⭐"][i % 6]}
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
                  <p className="text-5xl mb-3">🎉</p>
                  <p className="text-2xl font-bold text-emerald mb-1">{t("goodDeeds.milestone")}</p>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {lastMilestone} {t("goodDeeds.milestoneCount")}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">{t("goodDeeds.mayAllahAccept")}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white">{t("goodDeeds.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("goodDeeds.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="mx-auto max-w-sm">
            <div className="relative">
              <svg viewBox="0 0 200 260" className="w-full h-auto">
                <defs>
                  <linearGradient id="jarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                <rect x="50" y="10" width="100" height="20" rx="4" fill="url(#lidGrad)" />
                <path
                  d="M40 30 L40 230 Q40 250 60 250 L140 250 Q160 250 160 230 L160 30 Z"
                  fill="url(#jarGrad)"
                  stroke="#059669"
                  strokeWidth="2"
                />
                {deeds.slice(0, 20).map((_, i) => {
                  const row = Math.floor(i / 4);
                  const col = i % 4;
                  return (
                    <motion.rect
                      key={i}
                      x={60 + col * 22}
                      y={200 - row * 25}
                      width="18"
                      height="18"
                      rx="3"
                      fill={["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa", "#fb923c"][i % 6]}
                      opacity="0.7"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 0.7,
                        scale: 1,
                        y: [200 - row * 25, 200 - row * 25 - 3, 200 - row * 25],
                      }}
                      transition={{
                        delay: i * 0.05,
                        y: {
                          repeat: Infinity,
                          duration: 2 + Math.random(),
                          ease: "easeInOut",
                        },
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="text-center mt-4">
            <motion.div
              key={deeds.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <p className="text-5xl font-bold text-emerald dark:text-emerald-400">{deeds.length}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("goodDeeds.label")}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineFire className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{streaks.current}</div>
            <div className="text-xs text-gray-500">{t("goodDeeds.streak")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineChartBar className="w-5 h-5 text-emerald mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{weeklyAvg}</div>
            <div className="text-xs text-gray-500">{t("goodDeeds.dailyAvg")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineStar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{streaks.longest}</div>
            <div className="text-xs text-gray-500">{t("goodDeeds.bestStreak")}</div>
          </div>
        </motion.div>

        {streaks.current >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-4 text-center"
          >
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              🔥 {streaks.current} {t("goodDeeds.streakMessage")}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineCollection className="w-4 h-4 text-emerald" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t("goodDeeds.weeklyActivity")}</h3>
            <span className="text-xs text-gray-400 ml-auto">{weekDeeds.length} / 7 days</span>
          </div>
          <div className="flex gap-1.5">
            {weekDates.map((date) => {
              const count = deeds.filter((d) => d.date.split("T")[0] === date).length;
              const d = new Date(date + "T12:00:00");
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
              return (
                <div key={date} className="flex-1 text-center">
                  <div className="text-[10px] text-gray-400 mb-1">{dayName}</div>
                  <div
                    className={`h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      count > 0
                        ? "bg-emerald/10 text-emerald"
                        : "bg-gray-50 dark:bg-gray-700/50 text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    {count > 0 ? count : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-gradient-to-br from-emerald/5 to-teal-50 dark:from-emerald/10 dark:to-teal-900/20 rounded-2xl border border-emerald/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
              <HiOutlineSparkles className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald mb-0.5">{t("goodDeeds.tryThisToday")}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.bg} rounded-xl p-3 text-center`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <p className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-300">{cat.name}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{categoryBreakdown[cat.name]}</p>
            </div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 transition-all shadow-lg shadow-emerald/20"
        >
          <HiOutlinePlus className="w-5 h-5" />
          {t("goodDeeds.add")}
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium text-emerald border border-emerald/30 hover:bg-emerald/5 transition-all"
        >
          <HiOutlineShare className="w-4 h-4" />
          {t("goodDeeds.shareProgress")}
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("goodDeeds.newGoodDeed")}</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("goodDeeds.description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 resize-none placeholder-gray-400"
                    placeholder="e.g., Gave food to a homeless person, helped a neighbor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("goodDeeds.selectCategory")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                          category === cat.name
                            ? "border-emerald bg-emerald/5 text-emerald font-medium"
                            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  disabled={!description.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <HiOutlineCheck className="w-4 h-4" />
                  {t("goodDeeds.saveDeed")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {recentDeeds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HiOutlineFlag className="w-5 h-5 text-emerald" />
              {t("goodDeeds.recent")}
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentDeeds.map((deed, i) => {
                const catInfo = CATEGORIES.find((c) => c.name === deed.category);
                return (
                  <motion.div
                    key={deed.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 flex items-start gap-3"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{catInfo?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{deed.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catInfo?.bg} ${catInfo?.color}`}>
                          {deed.category}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(deed.date)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(deed.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {deeds.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4 opacity-50">🏺</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {t("goodDeeds.empty")}
            </p>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald/5 to-teal-50 dark:from-emerald/10 dark:to-teal-900/20 border border-emerald/10 max-w-sm mx-auto">
              <p className="text-xs text-emerald font-medium mb-1">💡 {t("goodDeeds.quickIdea")}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
            </div>
          </motion.div>
        )}

        <div className="pb-8 text-center">
          <p className="text-xs text-gray-400 italic">
            &ldquo;{t("goodDeeds.quote")}&rdquo;
            <br />— Quran 99:7
          </p>
        </div>
      </div>
    </div>
  );
}
