"use client";
import { motion } from "framer-motion";
import { Dua } from "@/types";
import { useApp } from "@/context/AppProviders";
import { useToast } from "@/context/ToastContext";
import { HiOutlineHeart, HiOutlineClipboard, HiOutlinePlay, HiOutlineShare } from "react-icons/hi";

interface DuaCardProps {
  dua: Dua;
  index: number;
}

export default function DuaCard({ dua, index }: DuaCardProps) {
  const { toggleFavorite, isFavorited } = useApp();
  const { toast } = useToast();
  const favorited = isFavorited("duas", dua.id);

  const handleFavorite = () => {
    toggleFavorite("duas", dua.id);
    toast(favorited ? "Removed from favorites" : "Saved to favorites", "favorite");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${dua.arabic}\n\n${dua.translation}\n\n— ${dua.source}`);
      toast("Dua copied to clipboard", "copy");
    } catch {}
  };

  const handleShare = async () => {
    const text = `${dua.arabic}\n\n${dua.translation}\n\n— ${dua.source}`;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); toast("Dua copied to clipboard", "copy"); } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-medium text-gold bg-gold/5 px-3 py-1 rounded-full">
            {dua.category}
          </span>
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

        <div className="mb-4 text-right">
          <p className="text-2xl sm:text-3xl leading-[2.2] font-noto-arabic text-gray-900 dark:text-white tracking-wider">
            {dua.arabic}
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {dua.translation}
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">
          — {dua.source}
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 hover:bg-emerald/10 dark:hover:bg-emerald/20 transition-colors">
            <HiOutlinePlay className="w-3.5 h-3.5" />
            Listen
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlineClipboard className="w-3.5 h-3.5" />
            Copy
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-auto"
          >
            <HiOutlineShare className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
