"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineShare,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const TABS = ["Articles", "Videos", "Events", "Daily Hadith"] as const;
type Tab = (typeof TABS)[number];

const ARTICLES = [
  {
    id: "1",
    title: "The Benefits of Reciting Quran Daily",
    excerpt:
      "Discover the spiritual and mental benefits of making Quran recitation a daily habit in your life.",
    readTime: "5 min read",
    category: "Quran",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    id: "2",
    title: "Understanding the 99 Names of Allah",
    excerpt:
      "Explore the beautiful names of Allah and their profound meanings that shape our relationship with the Creator.",
    readTime: "8 min read",
    category: "Knowledge",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "3",
    title: "The Importance of Dua in Islam",
    excerpt:
      "Learn how dua serves as a direct connection with Allah and the etiquette of making supplications.",
    readTime: "4 min read",
    category: "Worship",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "4",
    title: "How to Build a Consistent Prayer Habit",
    excerpt:
      "Practical tips for establishing and maintaining your five daily prayers with khushoo and focus.",
    readTime: "6 min read",
    category: "Lifestyle",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "5",
    title: "The Virtues of Ramadan",
    excerpt:
      "A comprehensive guide to the blessings and spiritual opportunities that Ramadan brings to believers.",
    readTime: "7 min read",
    category: "Ramadan",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    id: "6",
    title: "Charity in Islam: A Complete Guide",
    excerpt:
      "Everything you need to know about sadaqah, zakat, and the spirit of generosity in Islam.",
    readTime: "5 min read",
    category: "Zakat",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    id: "7",
    title: "The Story of Prophet Yusuf (AS)",
    excerpt:
      "The inspiring and detailed story of Prophet Yusuf, his patience, and Allah's divine plan.",
    readTime: "10 min read",
    category: "Stories",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    id: "8",
    title: "Maintaining Spiritual Health",
    excerpt:
      "How to keep your heart healthy, increase iman, and stay connected to Allah in daily life.",
    readTime: "4 min read",
    category: "Wellness",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    id: "9",
    title: "The Power of Istighfar",
    excerpt:
      "Understanding the profound impact of seeking forgiveness and how it transforms your life.",
    readTime: "3 min read",
    category: "Worship",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "10",
    title: "Islamic Finance Basics",
    excerpt:
      "An introduction to halal investing, avoiding riba, and managing wealth according to Islamic principles.",
    readTime: "6 min read",
    category: "Finance",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
];

const VIDEOS = [
  {
    id: "1",
    title: "How to Pray Salah - Step by Step",
    duration: "15:30",
    channel: "Quran Companion",
  },
  {
    id: "2",
    title: "Surah Al-Mulk - Full Recitation",
    duration: "10:45",
    channel: "Mishary Alafasy",
  },
  {
    id: "3",
    title: "Understanding Tawheed",
    duration: "22:10",
    channel: "Islamic Knowledge",
  },
  {
    id: "4",
    title: "The Seerah of Prophet Muhammad ﷺ",
    duration: "45:00",
    channel: "Seerah Series",
  },
  {
    id: "5",
    title: "Dua for Every Occasion",
    duration: "18:20",
    channel: "Daily Dua",
  },
  {
    id: "6",
    title: "Tafsir of Surah Al-Baqarah",
    duration: "55:00",
    channel: "Tafsir Series",
  },
];

const EVENTS = [
  {
    id: "1",
    name: "Ramadan Preparation Workshop",
    date: "Mar 1",
    location: "Local Mosque",
  },
  {
    id: "2",
    name: "Quran Recitation Competition",
    date: "Mar 15",
    location: "Islamic Center",
  },
  {
    id: "3",
    name: "Islamic Finance Seminar",
    date: "Mar 22",
    location: "Community Hall",
  },
  {
    id: "4",
    name: "Youth Iman Conference",
    date: "Apr 5",
    location: "Convention Center",
  },
  {
    id: "5",
    name: "Charity Drive",
    date: "Apr 10",
    location: "City-wide",
  },
  {
    id: "6",
    name: "Hajj Information Session",
    date: "May 1",
    location: "Mosque",
  },
  {
    id: "7",
    name: "Islamic Art Exhibition",
    date: "May 15",
    location: "Museum",
  },
  {
    id: "8",
    name: "Community Iftar",
    date: "During Ramadan",
    location: "Local Mosque",
  },
];

const HADITH = [
  {
    id: "1",
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih Bukhari",
  },
  {
    id: "2",
    text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "Sahih Bukhari",
  },
  {
    id: "3",
    text: "The strong person is not the one who can wrestle, but the one who controls himself when angry.",
    source: "Sahih Bukhari",
  },
  {
    id: "4",
    text: "Make things easy and do not make them difficult, and give glad tidings and do not drive people away.",
    source: "Sahih Bukhari",
  },
  {
    id: "5",
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih Bukhari",
  },
  {
    id: "6",
    text: "The world is a prison for the believer and a paradise for the disbeliever.",
    source: "Sahih Muslim",
  },
  {
    id: "7",
    text: "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.",
    source: "Hakim",
  },
  {
    id: "8",
    text: "Verily, with hardship comes ease.",
    source: "Quran 94:6",
  },
  {
    id: "9",
    text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.",
    source: "Sahih Bukhari",
  },
  {
    id: "10",
    text: "He who does not thank people does not thank Allah.",
    source: "Sunan Abu Dawud",
  },
  {
    id: "11",
    text: "The believer is not one who eats his fill while his neighbor goes hungry.",
    source: "Bayhaqi",
  },
  {
    id: "12",
    text: "Modesty is a branch of faith.",
    source: "Sahih Muslim",
  },
  {
    id: "13",
    text: "Seek knowledge from the cradle to the grave.",
    source: "Ibn Majah",
  },
  {
    id: "14",
    text: "The ink of the scholar is holier than the blood of the martyr.",
    source: "Tabarani",
  },
  {
    id: "15",
    text: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.",
    source: "Sahih Muslim",
  },
  {
    id: "16",
    text: "Cleanliness is half of faith.",
    source: "Sahih Muslim",
  },
  {
    id: "17",
    text: "The world is beautiful and verdant, and verily Allah has made you His stewards in it.",
    source: "Sahih Muslim",
  },
  {
    id: "18",
    text: "Do not be people without minds of your own, saying that if others treat you well you will treat them well, and that if they do wrong you will do wrong. Instead, accustom yourselves to do good if people do good, and not to do wrong even if they do wrong.",
    source: "Abu Dawud",
  },
  {
    id: "19",
    text: "The best of you are those who are best to their wives.",
    source: "Tirmidhi",
  },
  {
    id: "20",
    text: "When a man dies, his deeds come to an end except for three: ongoing charity, knowledge that is benefited from, and a righteous child who prays for him.",
    source: "Sahih Muslim",
  },
  {
    id: "21",
    text: "Whoever believes in Allah and the Last Day should speak a good word or remain silent.",
    source: "Sahih Bukhari",
  },
  {
    id: "22",
    text: "The world is a temptation and the best of it is a righteous woman.",
    source: "Sahih Muslim",
  },
  {
    id: "23",
    text: "No one eats better food than that which he earns with his own hands.",
    source: "Sahih Bukhari",
  },
  {
    id: "24",
    text: "The generous one is close to Allah, close to people, close to Paradise, and far from the Fire.",
    source: "Tirmidhi",
  },
  {
    id: "25",
    text: "He who goes to his mother, for him are two doors that are opened in Paradise.",
    source: "Sahih Bukhari",
  },
  {
    id: "26",
    text: "Whoever spent two things in the way of Allah, he will be called upon from the gates of Paradise.",
    source: "Sahih Bukhari",
  },
  {
    id: "27",
    text: "The best of you are those who feed others.",
    source: "Ahmad",
  },
  {
    id: "28",
    text: "It is better for a person to have a needle filled with poison inserted in his head than to touch a woman who is not permissible for him.",
    source: "Tabarani",
  },
  {
    id: "29",
    text: "The world is cursed, and everything in it is cursed, except for the remembrance of Allah and what is associated with it.",
    source: "Tirmidhi",
  },
  {
    id: "30",
    text: "Allah does not look at your appearance or possessions, but He looks at your hearts and your deeds.",
    source: "Sahih Muslim",
  },
];

function getTodayHadith() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return HADITH[dayOfYear % HADITH.length];
}

export default function NewsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("Articles");
  const [hadithIndex, setHadithIndex] = useState(
    HADITH.indexOf(getTodayHadith())
  );

  const todayHadith = HADITH[hadithIndex];

  const handleShareHadith = () => {
    const text = `"${todayHadith.text}"\n\n— ${todayHadith.source}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert(t("news.hadithCopied"));
    }
  };

  const cycleHadith = (dir: number) => {
    setHadithIndex((prev) => (prev + dir + HADITH.length) % HADITH.length);
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {t("news.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("news.subtitle")}
        </p>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {([
          ["Articles", t("news.articles")],
          ["Videos", t("news.videos")],
          ["Events", t("news.events")],
          ["Daily Hadith", t("news.dailyHadith")],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === key
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Articles Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "Articles" && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${article.color}`}
                  >
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <HiOutlineClock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Videos Tab */}
        {activeTab === "Videos" && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-[var(--accent)] ml-1" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{video.channel}</span>
                    <span className="font-medium">{video.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === "Events" && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[var(--accent)]">
                    {event.date.split(" ")[1]?.split("-")[0] || "?"}
                  </span>
                  <span className="text-[10px] text-[var(--accent)] uppercase font-medium">
                    {event.date.split(" ")[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {event.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <HiOutlineCalendar className="w-3 h-3" />
                    {event.date} · {event.location}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Daily Hadith Tab */}
        {activeTab === "Daily Hadith" && (
          <motion.div
            key="hadith"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-5">
                <HiOutlineStar className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <p className="text-lg md:text-xl text-gray-900 dark:text-white leading-relaxed mb-6 font-serif">
                &ldquo;{todayHadith.text}&rdquo;
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                — {todayHadith.source}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => cycleHadith(-1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("news.previous")}
                </button>
                <button
                  onClick={handleShareHadith}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <HiOutlineShare className="w-4 h-4" />
                  {t("common.share")}
                </button>
                <button
                  onClick={() => cycleHadith(1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("news.next")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HADITH.slice(0, 6).map((h) => (
                <div
                  key={h.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => setHadithIndex(HADITH.indexOf(h))}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                    &ldquo;{h.text}&rdquo;
                  </p>
                  <p className="text-xs text-gray-400">{h.source}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
