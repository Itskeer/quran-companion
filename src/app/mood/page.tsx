"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import MoodCard from "@/components/MoodCard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

export default function MoodPage() {
  const { t } = useTranslation();
  usePageTitle(t("mood.title"));
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleMood = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    const params = new URLSearchParams();
    params.set("moods", selected.join(","));
    if (note.trim()) params.set("note", note.trim());
    router.push(`/processing?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-3">
            {t("mood.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("mood.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {moods.map((mood, i) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              selected={selected.includes(mood.id)}
              onToggle={() => toggleMood(mood.id)}
              index={i}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("mood.placeholder")}
            className="w-full p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald outline-none transition-all"
            rows={3}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium text-sm transition-all ${
              selected.length > 0
                ? "bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 shadow-lg shadow-emerald/20 hover:shadow-xl hover:shadow-emerald/25 cursor-pointer"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("mood.continue")}
            <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
