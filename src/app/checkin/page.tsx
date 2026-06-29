"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { useApp } from "@/context/AppProviders";
import { usePageTitle } from "@/hooks/usePageTitle";
import { CheckIn } from "@/types";
import { useTranslation } from "@/i18n/useTranslation";
import { HiOutlineArrowRight } from "react-icons/hi";

export default function CheckInPage() {
  const { t } = useTranslation();
  usePageTitle(t("checkin.title"));
  const { addCheckIn, checkIns } = useApp();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const weekCheckIns = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return checkIns.filter((c) => new Date(c.date) >= sevenDaysAgo);
  }, [checkIns]);

  const handleSave = () => {
    if (!selectedMood) return;
    const checkIn: CheckIn = {
      date: new Date().toISOString(),
      moodId: selectedMood,
      note: note.trim() || undefined,
    };
    addCheckIn(checkIn);
    setSaved(true);
    setTimeout(() => {
      setSelectedMood(null);
      setNote("");
      setSaved(false);
    }, 2000);
  };

  const getMoodEmoji = (id: string) => moods.find((m) => m.id === id)?.emoji || "?";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-3">
            {t("checkin.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("checkin.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {moods.map((mood, i) => (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedMood(mood.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all min-w-[80px] ${
                  selectedMood === mood.id
                    ? "border-emerald bg-emerald/5 dark:bg-emerald/10"
                    : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span
                  className={`text-xs font-medium ${
                    selectedMood === mood.id
                      ? "text-emerald dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("checkin.notePlaceholder")}
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald outline-none transition-all text-sm"
            rows={3}
          />

          <div className="text-center">
            <button
              onClick={handleSave}
              disabled={!selectedMood}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-medium text-sm transition-all ${
                selectedMood && !saved
                  ? "bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 shadow-lg shadow-emerald/20 hover:shadow-xl cursor-pointer"
                  : saved
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saved ? t("checkin.saved") : t("checkin.saveButton")}
              {!saved && <HiOutlineArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {weekCheckIns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
              {t("checkin.thisWeek")}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-end gap-2 h-24">
                {weekCheckIns.slice(0, 7).reverse().map((c, i) => (
                  <motion.div
                    key={c.date}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{getMoodEmoji(c.moodId)}</span>
                    <div
                      className="w-full rounded-lg bg-emerald/20 dark:bg-emerald-400/20"
                      style={{ height: `${Math.max(20, 60 - i * 5)}px` }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.date).toLocaleDateString("en", { weekday: "short" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
