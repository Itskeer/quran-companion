"use client";
import { motion } from "framer-motion";
import { Mood } from "@/types";

interface MoodCardProps {
  mood: Mood;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

export default function MoodCard({ mood, selected, onToggle, index }: MoodCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 min-w-[130px] ${
        selected
          ? "border-emerald bg-emerald/5 dark:bg-emerald/10 shadow-lg shadow-emerald/10"
          : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
      }`}
    >
      <span className="text-3xl">{mood.emoji}</span>
      <span
        className={`text-sm font-medium ${
          selected
            ? "text-emerald dark:text-emerald-400"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {mood.label}
      </span>
      {selected && (
        <motion.div
          layoutId="checkmark"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald rounded-full flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
