"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineStar,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

interface GlossaryTerm {
  term: string;
  arabic: string;
  meaning: string;
  category: string;
}

const TERMS: GlossaryTerm[] = [
  { term: "Allah", arabic: "الله", meaning: "The one true God, the Creator of all things.", category: "Core" },
  { term: "Islam", arabic: "الإسلام", meaning: "Submission to the will of Allah. The religion revealed to Prophet Muhammad ﷺ.", category: "Core" },
  { term: "Iman", arabic: "الإيمان", meaning: "Faith. Belief in Allah, His angels, books, messengers, the Last Day, and divine decree.", category: "Core" },
  { term: "Quran", arabic: "القرآن", meaning: "The final revelation from Allah to Prophet Muhammad ﷺ. The holy book of Islam.", category: "Core" },
  { term: "Sunnah", arabic: "السنة", meaning: "The way of life of Prophet Muhammad ﷺ. The second source of Islamic law.", category: "Core" },
  { term: "Hadith", arabic: "الحديث", meaning: "A recorded saying, action, or approval of Prophet Muhammad ﷺ.", category: "Core" },
  { term: "Salah", arabic: "الصلاة", meaning: "The five daily prayers. One of the five pillars of Islam.", category: "Worship" },
  { term: "Zakat", arabic: "الزكاة", meaning: "Obligatory charity. 2.5% of wealth given annually. One of the five pillars.", category: "Worship" },
  { term: "Sawm", arabic: "الصيام", meaning: "Fasting during Ramadan. One of the five pillars of Islam.", category: "Worship" },
  { term: "Hajj", arabic: "الحج", meaning: "Pilgrimage to Makkah. One of the five pillars of Islam.", category: "Worship" },
  { term: "Shahada", arabic: "الشهادة", meaning: "The declaration of faith: 'There is no god but Allah, Muhammad is His messenger.'", category: "Worship" },
  { term: "Dua", arabic: "دعاء", meaning: "Supplication. Calling upon Allah for help, guidance, or needs.", category: "Worship" },
  { term: "Dhikr", arabic: "ذكر", meaning: "Remembrance of Allah. Repeating phrases like SubhanAllah, Alhamdulillah.", category: "Worship" },
  { term: "Tafsir", arabic: "تفسير", meaning: "Explanation and interpretation of the Quran.", category: "Knowledge" },
  { term: "Tajweed", arabic: "تجويد", meaning: "The rules of Quranic recitation. Proper pronunciation and articulation.", category: "Knowledge" },
  { term: "Hifdh", arabic: "حفظ", meaning: "Memorization of the Quran. Those who memorize it are called Hafiz.", category: "Knowledge" },
  { term: "Ilm", arabic: "علم", meaning: "Knowledge. The pursuit of knowledge is a duty in Islam.", category: "Knowledge" },
  { term: "Tawbah", arabic: "توبة", meaning: "Repentance. Returning to Allah after sinning.", category: "Spiritual" },
  { term: "Tawakkul", arabic: "توكل", meaning: "Reliance on Allah. Trusting in Allah's plan while taking action.", category: "Spiritual" },
  { term: "Sabr", arabic: "صبر", meaning: "Patience. Enduring hardship with faith and perseverance.", category: "Spiritual" },
  { term: "Shukr", arabic: "شكر", meaning: "Gratitude. Thanking Allah for His blessings.", category: "Spiritual" },
  { term: "Taqwa", arabic: "تقوى", meaning: "God-consciousness. Being aware of Allah in all actions.", category: "Spiritual" },
  { term: "Ihsan", arabic: "إحسان", meaning: "Excellence in worship. Worshipping Allah as if you see Him.", category: "Spiritual" },
  { term: "Barakah", arabic: "بركة", meaning: "Blessing. An increase in goodness from Allah.", category: "Spiritual" },
  { term: "Rahmah", arabic: "رحمة", meaning: "Mercy. Allah's vast mercy encompasses all things.", category: "Spiritual" },
  { term: "Kaaba", arabic: "الكعبة", meaning: "The sacred house in Makkah. The direction of prayer for Muslims.", category: "Places" },
  { term: "Makkah", arabic: "مكة", meaning: "The holiest city in Islam. Birthplace of Prophet Muhammad ﷺ.", category: "Places" },
  { term: "Madinah", arabic: "المدينة", meaning: "The city of the Prophet. Second holiest city in Islam.", category: "Places" },
  { term: "Jannah", arabic: "الجنة", meaning: "Paradise. The eternal reward for the righteous.", category: "Afterlife" },
  { term: "Jahannam", arabic: "جهنم", meaning: "Hellfire. The punishment for disbelievers and sinners.", category: "Afterlife" },
  { term: "Akhirah", arabic: "الآخرة", meaning: "The Hereafter. The life after death.", category: "Afterlife" },
  { term: "Qiyamah", arabic: "القيامة", meaning: "The Day of Resurrection. When all will be judged.", category: "Afterlife" },
  { term: "Malaikah", arabic: "ملائكة", meaning: "Angels. Created from light, they worship and serve Allah.", category: "Creations" },
  { term: "Jinn", arabic: "جن", meaning: "Beings created from smokeless fire. They have free will.", category: "Creations" },
  { term: "Shaytan", arabic: "الشيطان", meaning: "Satan. The enemy of humanity who whispers evil.", category: "Creations" },
  { term: "Rizq", arabic: "رزق", meaning: "Provision. Sustenance from Allah.", category: "Life" },
  { term: "Qadr", arabic: "قدر", meaning: "Divine decree. Allah's plan and predestination.", category: "Life" },
  { term: "Ummah", arabic: "أمة", meaning: "Nation. The global community of Muslims.", category: "Community" },
  { term: "Masjid", arabic: "مسجد", meaning: "Mosque. A place of worship for Muslims.", category: "Places" },
  { term: "Khatib", arabic: "خطيب", meaning: "The person who delivers the Friday sermon.", category: "Community" },
  { term: "Imam", arabic: "إمام", meaning: "Leader of prayer. Also a religious scholar.", category: "Community" },
  { term: "Muadhin", arabic: "مؤذن", meaning: "The person who calls the adhan (call to prayer).", category: "Community" },
  { term: "Sahabah", arabic: "صحابة", meaning: "Companions of Prophet Muhammad ﷺ.", category: "History" },
  { term: "Tabi'in", arabic: "تابعون", meaning: "Followers. Those who followed the companions.", category: "History" },
  { term: "Fiqh", arabic: "فقه", meaning: "Islamic jurisprudence. Understanding and applying Islamic law.", category: "Knowledge" },
  { term: "Aqidah", arabic: "عقيدة", meaning: "Islamic creed. Beliefs about Allah and the unseen.", category: "Knowledge" },
  { term: "Sirah", arabic: "سيرة", meaning: "Biography. The life story of Prophet Muhammad ﷺ.", category: "Knowledge" },
  { term: "Umrah", arabic: "عمرة", meaning: "Minor pilgrimage to Makkah. Can be performed anytime.", category: "Worship" },
  { term: "Zakat al-Fitr", arabic: "زكاة الفطر", meaning: "Charity given at the end of Ramadan before Eid prayer.", category: "Worship" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Core: { bg: "bg-emerald/10 dark:bg-emerald/20", text: "text-emerald dark:text-emerald-400" },
  Worship: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  Spiritual: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  Knowledge: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400" },
  Places: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
  Afterlife: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
  Creations: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
  Life: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
  Community: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  History: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400" },
};

const ALL_CATEGORIES = ["All", ...Array.from(new Set(TERMS.map((t) => t.category)))];
const FAVORITES_KEY = "glossary_favorites";

function getDailyTerm(): GlossaryTerm {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TERMS[dayOfYear % TERMS.length];
}

export default function GlossaryPage() {
  const { t } = useTranslation();
  usePageTitle("Islamic Glossary");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const dailyTerm = useMemo(() => getDailyTerm(), []);

  const filteredTerms = useMemo(() => {
    let result = TERMS;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (showFavoritesOnly) {
      result = result.filter((t) => favorites.has(t.term));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.arabic.includes(q) ||
          t.meaning.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [activeCategory, search, favorites, showFavoritesOnly]);

  const alphabeticalIndex = useMemo(() => {
    const letters = new Set(filteredTerms.map((t) => t.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [filteredTerms]);

  const toggleFavorite = (term: string) => {
    const updated = new Set(favorites);
    if (updated.has(term)) {
      updated.delete(term);
    } else {
      updated.add(term);
    }
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(updated)));
  };

  const toggleExpand = (term: string) => {
    setExpanded(expanded === term ? null : term);
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
            {t("glossary.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("glossary.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineStar className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-emerald dark:text-emerald-400 uppercase tracking-wider">
              {t("glossary.termOfDay")}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {dailyTerm.term}
            </span>
            <span className="text-lg text-gray-500 dark:text-gray-400" dir="rtl">
              {dailyTerm.arabic}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {dailyTerm.meaning}
          </p>
          <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[dailyTerm.category]?.bg} ${CATEGORY_COLORS[dailyTerm.category]?.text}`}>
            {dailyTerm.category}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("glossary.search")}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              showFavoritesOnly
                ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <HiOutlineHeart className="w-3.5 h-3.5" />
            {t("common.favorites")}
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const colors = CATEGORY_COLORS[cat] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" };
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat
                    ? cat === "All"
                      ? "bg-emerald/10 text-emerald dark:bg-emerald/20 dark:text-emerald-400"
                      : `${colors.bg} ${colors.text}`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {cat === "All" ? t("common.all") : cat}
              </button>
            );
          })}
        </motion.div>

        {alphabeticalIndex.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-1"
          >
            {alphabeticalIndex.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-emerald/10 hover:text-emerald dark:hover:bg-emerald/20 dark:hover:text-emerald-400 transition-colors"
              >
                {letter}
              </a>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-50">📚</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("glossary.noResults")}
              </p>
            </div>
          ) : (
            (() => {
              let currentLetter = "";
              return filteredTerms.map((term) => {
                const firstLetter = term.term[0].toUpperCase();
                const showLetterHeader = firstLetter !== currentLetter;
                if (showLetterHeader) currentLetter = firstLetter;

                const colors = CATEGORY_COLORS[term.category] || { bg: "bg-gray-100", text: "text-gray-600" };
                const isExpanded = expanded === term.term;
                const isFav = favorites.has(term.term);

                return (
                  <div key={term.term}>
                    {showLetterHeader && (
                      <div
                        id={`letter-${firstLetter}`}
                        className="pt-4 pb-1 sticky top-20 z-10"
                      >
                        <span className="text-lg font-bold text-emerald dark:text-emerald-400">
                          {firstLetter}
                        </span>
                      </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                      <button
                        onClick={() => toggleExpand(term.term)}
                        className="w-full flex items-center gap-4 p-4 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {term.term}
                            </span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                              {term.category}
                            </span>
                          </div>
                          <span className="text-lg text-gray-500 dark:text-gray-400" dir="rtl">
                            {term.arabic}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(term.term);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              isFav
                                ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                                : "text-gray-400 hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            <HiOutlineHeart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          {isExpanded ? (
                            <HiOutlineChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <HiOutlineChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                  {term.meaning}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              });
            })()
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4"
        >
          {TERMS.length} {t("glossary.stats")} · {favorites.size} {t("glossary.favorited")}
        </motion.div>
      </div>
    </div>
  );
}
