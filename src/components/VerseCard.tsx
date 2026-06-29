"use client";
import { motion } from "framer-motion";
import { Verse } from "@/types";
import { useApp } from "@/context/AppProviders";
import { useToast } from "@/context/ToastContext";
import { shareContent, copyToClipboard } from "@/services/nativeBridge";
import ThemeBadge from "./ThemeBadge";
import {
  HiOutlineBookOpen,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlinePlay,
} from "react-icons/hi";

interface VerseCardProps {
  verse: Verse;
  index: number;
}

export default function VerseCard({ verse, index }: VerseCardProps) {
  const { toggleFavorite, isFavorited } = useApp();
  const { toast } = useToast();
  const favorited = isFavorited("verses", verse.id);

  const handleFavorite = () => {
    toggleFavorite("verses", verse.id);
    toast(favorited ? "Removed from favorites" : "Saved to favorites", "favorite");
  };

  const handleShare = async () => {
    const text = `${verse.arabic}\n\n${verse.translation}\n\n— ${verse.surah} (${verse.ayahNumber})`;
    try { await shareContent("Quran Verse", text); } catch {
      try { await copyToClipboard(text); toast("Verse copied to clipboard", "copy"); } catch {}
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 px-3 py-1 rounded-full">
              {verse.surah} | Ayah {verse.ayahNumber}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-xl transition-all active:scale-90 ${
                favorited
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-400 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <HiOutlineHeart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        <div className="mb-5 text-right">
          <p className="text-2xl sm:text-3xl leading-[2] font-noto-arabic text-gray-900 dark:text-white tracking-wider">
            {verse.arabic}
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {verse.translation}
        </p>

        {verse.tafsir && (
          <div className="mb-4 p-4 bg-cream dark:bg-gray-900/50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Brief Tafsir</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{verse.tafsir}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {verse.themes.map((theme) => (
            <ThemeBadge key={theme} theme={theme} />
          ))}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 hover:bg-emerald/10 dark:hover:bg-emerald/20 transition-colors">
            <HiOutlineBookOpen className="w-3.5 h-3.5" />
            Read More
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <HiOutlinePlay className="w-3.5 h-3.5" />
            Listen
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-auto">
            <HiOutlineShare className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
