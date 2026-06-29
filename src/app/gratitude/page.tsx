"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  HiOutlineHeart,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineShare,
  HiOutlineCalendar,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineCheck,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const PROMPTS = [
  "What blessing did you enjoy today?",
  "Who made your day better recently?",
  "What ability or skill are you thankful for?",
  "What beautiful thing did you see today?",
  "What food or drink brought you joy?",
  "Who taught you something valuable?",
  "What comfort do you have that others don't?",
];

interface GratitudeEntry {
  id: string;
  date: string;
  prompt: string;
  what: string;
  who: string;
  why: string;
}

const STORAGE_KEY = "gratitude_entries";

function getTodayPrompt(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return PROMPTS[dayOfYear % PROMPTS.length];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

function calcStreak(entries: GratitudeEntry[]): { current: number; longest: number } {
  const uniqueDates = Array.from(
    new Set(entries.map((e) => e.date.split("T")[0]))
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
    if (diff === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export default function GratitudePage() {
  const { t } = useTranslation();
  usePageTitle(t("gratitude.title"));
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {}
  }, []);

  const todayPrompt = useMemo(() => getTodayPrompt(), []);
  const streaks = useMemo(() => calcStreak(entries), [entries]);

  const weekDates = useMemo(() => getWeekDates(), []);
  const weekEntries = useMemo(
    () =>
      entries.filter((e) => weekDates.includes(e.date.split("T")[0])),
    [entries, weekDates]
  );

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries]
  );

  const handleSave = () => {
    if (!what.trim()) return;
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      prompt: todayPrompt,
      what: what.trim(),
      who: who.trim(),
      why: why.trim(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setWhat("");
    setWho("");
    setWhy("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleShare = (entry: GratitudeEntry) => {
    const text = `Grateful for: ${entry.what}${entry.who ? `\nThankful to: ${entry.who}` : ""}${entry.why ? `\nWhy: ${entry.why}` : ""}\n\n"If you are grateful, I will surely increase you." — Quran 14:7`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white">
            {t("gratitude.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t("gratitude.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-5 text-center"
        >
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wider">
            {t("gratitude.todayPrompt")}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {todayPrompt}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5"
        >
          <div className="text-center text-xs text-emerald-700 dark:text-emerald-300 italic leading-relaxed">
            &ldquo;If you are grateful, I will surely increase you.&rdquo;
            <br />
            <span className="font-semibold not-italic">— Quran 14:7</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineHeart className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {entries.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("gratitude.total")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineFire className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {streaks.current}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("gratitude.streak")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineStar className="w-5 h-5 text-emerald dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {streaks.longest}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("gratitude.best")}</div>
          </div>
        </motion.div>

        {streaks.current >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-4 text-center"
          >
            <span className="text-sm font-medium text-emerald dark:text-emerald-400">
              🔥 {streaks.current} {t("gratitude.daysInRow")}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineCalendar className="w-4 h-4 text-emerald dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("gratitude.thisWeek")}
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
              {weekEntries.length} / 7 days
            </span>
          </div>
          <div className="flex gap-1.5">
            {weekDates.map((date, i) => {
              const hasEntry = entries.some(
                (e) => e.date.split("T")[0] === date
              );
              const d = new Date(date + "T12:00:00");
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
              return (
                <div key={date} className="flex-1 text-center">
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
                    {dayName}
                  </div>
                  <div
                    className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      hasEntry
                        ? "bg-emerald/10 text-emerald dark:bg-emerald/20 dark:text-emerald-400"
                        : "bg-gray-50 dark:bg-gray-700/50 text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    {hasEntry ? <HiOutlineCheck className="w-3.5 h-3.5" /> : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300 transition-all shadow-lg shadow-emerald/20"
        >
          <HiOutlinePlus className="w-5 h-5" />
          {t("gratitude.newGratitudeEntry")}
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
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("gratitude.newEntry")}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {t("gratitude.prompt")} {todayPrompt}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("gratitude.what")}
                  </label>
                  <textarea
                    value={what}
                    onChange={(e) => setWhat(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t("gratitude.promptPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("gratitude.who")}
                  </label>
                  <input
                    type="text"
                    value={who}
                    onChange={(e) => setWho(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t("gratitude.namePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("gratitude.why")}
                  </label>
                  <textarea
                    value={why}
                    onChange={(e) => setWhy(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t("gratitude.whyPlaceholder")}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  disabled={!what.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saved ? (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      {t("gratitude.saved")}
                    </>
                  ) : (
                    t("gratitude.save")
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sortedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("gratitude.pastEntries")}
            </h2>
            <div className="space-y-3">
              {sortedEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(entry.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleShare(entry)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald hover:bg-emerald/5 dark:hover:bg-emerald/10 transition-colors"
                        title="Share"
                      >
                        <HiOutlineShare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >
                        <HiOutlineX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/15 rounded-lg px-3 py-1.5">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {entry.prompt}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {entry.what}
                  </p>

                  {entry.who && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{t("gratitude.thankfulTo")}</span> {entry.who}
                    </p>
                  )}

                  {entry.why && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{t("gratitude.whyLabel")}</span> {entry.why}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {entries.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4 opacity-50">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("gratitude.startJournal")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
