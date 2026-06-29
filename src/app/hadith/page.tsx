"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineDocumentText,
  HiOutlineFilter,
  HiOutlineBookOpen,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineInformationCircle,
  HiOutlineEye,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

interface Hadith {
  number: number;
  narrator: string;
  source: string;
  text: string;
  category: string;
}

const HADITHS: Hadith[] = [
  { number: 1, narrator: "Umar ibn al-Khattab", source: "Sahih Bukhari", text: "Islam is built on five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakat, making the Hajj pilgrimage, and fasting in Ramadan.", category: "Pillars" },
  { number: 2, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'The best among you are those who learn the Quran and teach it.'", category: "Quran" },
  { number: 3, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.'", category: "Character" },
  { number: 4, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'The strong person is not the one who can wrestle, but the one who controls himself when angry.'", category: "Character" },
  { number: 5, narrator: "Anas ibn Malik", source: "Sahih Bukhari", text: "The Prophet said: 'Make things easy and do not make them difficult, and give glad tidings and do not drive people away.'", category: "Leadership" },
  { number: 6, narrator: "Anas ibn Malik", source: "Sahih Bukhari", text: "The Prophet said: 'None of you truly believes until he loves for his brother what he loves for himself.'", category: "Faith" },
  { number: 7, narrator: "Hakim ibn Hizam", source: "Sahih Muslim", text: "The Prophet said: 'Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.'", category: "Time" },
  { number: 8, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'The world is a prison for the believer and a paradise for the disbeliever.'", category: "World" },
  { number: 9, narrator: "Abdullah ibn Amr", source: "Sahih Muslim", text: "The Prophet said: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.'", category: "Consistency" },
  { number: 10, narrator: "Aisha", source: "Sahih Bukhari", text: "The Prophet said: 'The best among you are those who have the best character.'", category: "Character" },
  { number: 11, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.'", category: "Hereafter" },
  { number: 12, narrator: "Ibn Abbas", source: "Sahih Bukhari", text: "The Prophet said: 'Reflect on the blessings of Allah and do not reflect on Allah Himself, for you will never be able to count His blessings.'", category: "Gratitude" },
  { number: 13, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Allah does not look at your appearance or your wealth, but rather at your hearts and your deeds.'", category: "Faith" },
  { number: 14, narrator: "Abu Dharr", source: "Sahih Muslim", text: "The Prophet said: 'Every good deed is charity. Indeed, it is a good deed to meet your brother with a cheerful face and to pour what is left in your bucket into your neighbor's container.'", category: "Charity" },
  { number: 15, narrator: "Jabir ibn Abdullah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent. Whoever believes in Allah and the Last Day, let him be generous to his neighbor. Whoever believes in Allah and the Last Day, let him be generous to his guest.'", category: "Faith" },
  { number: 16, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'The example of those who spend their wealth in the way of Allah is that of a grain that sprouts seven spikes, with each spike bearing a hundred grains. And Allah multiplies [His reward] for whom He wills.'", category: "Charity" },
  { number: 17, narrator: "Aisha", source: "Sahih Muslim", text: "The Prophet said: 'The most perfect of the believers in faith are those with the best character.'", category: "Character" },
  { number: 18, narrator: "Abu Sa'id al-Khudri", source: "Sahih Muslim", text: "The Prophet said: 'No fatigue, illness, anxiety, sorrow, harm, or sadness afflicts a Muslim, except that Allah expiates some of his sins because of it.'", category: "Patience" },
  { number: 19, narrator: "Abdullah ibn Umar", source: "Sahih Bukhari", text: "The Prophet said: 'The believer who mixes with people and endures their harm is better than the one who does not mix with people and does not endure their harm.'", category: "Patience" },
  { number: 20, narrator: "Anas ibn Malik", source: "Sahih Muslim", text: "The Prophet said: 'The rights of a Muslim over another Muslim are six: when you meet him, give him salam; when he invites you, accept; when he seeks your advice, advise him; when he sneezes and praises Allah, say Yarhamukallah; when he is sick, visit him; and when he dies, follow his funeral.'", category: "Brotherhood" },
  { number: 21, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Allah said: 'I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever conceived.'", category: "Hereafter" },
  { number: 22, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'Allah created mercy and divided it into one hundred parts. He kept ninety-nine parts with Himself and sent down one part to the earth. From that one part comes all the compassion that creatures show to one another.'", category: "Mercy" },
  { number: 23, narrator: "Umar ibn al-Khattab", source: "Sahih Bukhari", text: "The Prophet said: 'Actions are judged by intentions, and every person will get what they intended.'", category: "Intention" },
  { number: 24, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever fasts during Ramadan out of sincere faith and hoping for Allah's reward, his previous sins will be forgiven.'", category: "Worship" },
  { number: 25, narrator: "Anas ibn Malik", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever prays Isha in congregation, it is as if he prayed half the night. And whoever prays Fajr in congregation, it is as if he prayed the whole night.'", category: "Prayer" },
  { number: 26, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'When you hear the adhan, repeat what the muadhin says.'", category: "Prayer" },
  { number: 27, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever establishes prayers, his prayers will be a light and proof and salvation for him on the Day of Judgment.'", category: "Prayer" },
  { number: 28, narrator: "Jabir ibn Abdullah", source: "Sahih Muslim", text: "The Prophet said: 'Whoever says 'SubhanAllah' (Glory be to Allah) after each prayer 33 times, and 'Alhamdulillah' (Praise be to Allah) 33 times, and 'Allahu Akbar' (Allah is Greatest) 33 times, completing one hundred, his sins will be forgiven even if they are like the foam of the sea.'", category: "Dhikr" },
  { number: 29, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'Shall I not tell you of something better than the rank of prayer, fasting, and charity?' They said: 'Yes.' He said: 'It is putting things right between people.'", category: "Character" },
  { number: 30, narrator: "Abu Darda", source: "Sahih Muslim", text: "The Prophet said: 'Shall I not inform you of something more excellent in degree than prayer, fasting, and charity?' They said: 'Yes.' He said: 'It is putting things right between people, spoiling that which is right, and causing corruption.'", category: "Character" },
  { number: 31, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'If someone reminds you of Allah when you see him, then you should let him be good company.'", category: "Companionship" },
  { number: 32, narrator: "Ibn Masud", source: "Sahih Muslim", text: "The Prophet said: 'The best among you are those who are best to their families, and I am the best of you to my family.'", category: "Family" },
  { number: 33, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever is charitable and fears Allah, Allah will make his path easy and give him prosperity from sources he never expected.'", category: "Charity" },
  { number: 34, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'Do not be envious of one another; do not hate one another; do not turn away from one another; and be, O servants of Allah, brothers.'", category: "Brotherhood" },
  { number: 35, narrator: "Anas ibn Malik", source: "Sahih Bukhari", text: "The Prophet said: 'None of you will believe until you love for your brother what you love for yourself.'", category: "Faith" },
  { number: 36, narrator: "Abu Hurairah", source: "Sahih Bukhari", text: "The Prophet said: 'Whoever believes in Allah and the Last Day should speak a good word or remain silent.'", category: "Character" },
  { number: 37, narrator: "Abu Sa'id al-Khudri", source: "Sahih Bukhari", text: "The Prophet said: 'The world is beautiful and verdant, and verily Allah has made you His stewards in it.'", category: "Stewardship" },
  { number: 38, narrator: "Aisha", source: "Sahih Muslim", text: "The Prophet said: 'The most loved of deeds to Allah are those done consistently, even if they are small.'", category: "Consistency" },
  { number: 39, narrator: "Abu Hurairah", source: "Sahih Muslim", text: "The Prophet said: 'When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.'", category: "Legacy" },
  { number: 40, narrator: "Anas ibn Malik", source: "Sahih Bukhari", text: "The Prophet said: 'The most complete of the believers in faith are those with the best character, and the best of you are those who are best to their women.'", category: "Character" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Pillars: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Quran: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Character: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Leadership: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Faith: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Time: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  World: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Consistency: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Hereafter: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  Gratitude: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  Charity: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Patience: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  Brotherhood: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Mercy: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  Intention: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  Worship: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Prayer: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Dhikr: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Companionship: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Family: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Stewardship: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Legacy: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

const CATEGORIES = Array.from(new Set(HADITHS.map((h) => h.category))).sort();

export default function HadithPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [readHadiths, setReadHadiths] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-hadith");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFavorites(new Set(data.favorites || []));
        setReadHadiths(new Set(data.readHadiths || []));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const data = {
      favorites: Array.from(favorites),
      readHadiths: Array.from(readHadiths),
    };
    localStorage.setItem("quran-companion-hadith", JSON.stringify(data));
  }, [favorites, readHadiths]);

  const toggleFavorite = (number: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        newSet.add(number);
      }
      return newSet;
    });
  };

  const markAsRead = (number: number) => {
    setReadHadiths((prev) => {
      const newSet = new Set(prev);
      newSet.add(number);
      return newSet;
    });
  };

  const dailyHadith = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return HADITHS[dayOfYear % HADITHS.length];
  }, []);

  const filteredHadiths = useMemo(() => {
    return HADITHS.filter((hadith) => {
      const matchesSearch =
        searchQuery === "" ||
        hadith.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hadith.source.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || hadith.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const shareHadith = (hadith: Hadith) => {
    const text = `Hadith #${hadith.number}\n\n${hadith.text}\n\n— ${hadith.narrator}\nSource: ${hadith.source}\n\n#Hadith #Islam`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <HiOutlineDocumentText className="w-8 h-8 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("hadith.title")}
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
          {t("hadith.subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineInformationCircle className="w-5 h-5" />
          <h2 className="font-semibold">{t("hadith.dailyHadith")}</h2>
        </div>
        <p className="text-emerald-50 leading-relaxed mb-3">
          {dailyHadith.text}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-emerald-200 text-sm">
            — {dailyHadith.narrator}
            <span className="text-emerald-300 ml-2">• {dailyHadith.source}</span>
          </div>
          <button
            onClick={() => shareHadith(dailyHadith)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <HiOutlineShare className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative"
      >
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t("hadith.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlineX className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlineFilter className="w-4 h-4" />
            {t("hadith.categories")}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredHadiths.length} {t("hadith.hadithsCount")}
          </span>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === "All"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t("common.all")}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-[var(--accent)] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="space-y-4">
        {filteredHadiths.map((hadith, index) => (
          <motion.div
            key={hadith.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 relative ${
              readHadiths.has(hadith.number)
                ? "border-l-4 border-l-green-500"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-200 dark:text-gray-700">
                  #{hadith.number}
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {hadith.narrator}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {hadith.source}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    CATEGORY_COLORS[hadith.category] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {hadith.category}
                </span>
              </div>
            </div>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
              {hadith.text}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(hadith.number)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.has(hadith.number)
                    ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <HiOutlineHeart
                  className={`w-5 h-5 ${
                    favorites.has(hadith.number) ? "fill-current" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => shareHadith(hadith)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <HiOutlineShare className="w-5 h-5" />
              </button>
              <button
                onClick={() => markAsRead(hadith.number)}
                className={`p-2 rounded-lg transition-colors ${
                  readHadiths.has(hadith.number)
                    ? "bg-green-100 dark:bg-green-900/30 text-green-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <HiOutlineEye
                  className={`w-5 h-5 ${
                    readHadiths.has(hadith.number) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredHadiths.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HiOutlineSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t("hadith.noResults")}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {HADITHS.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("hadith.totalHadiths")}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{favorites.size}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Favorites</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{readHadiths.size}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Read</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-center py-8"
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          &ldquo;The Prophet ﷺ said: &apos;Whoever learns knowledge relating to
          my Sunnah and then acts upon it, Allah will raise him in rank.&apos;&rdquo;
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          — Sunan Ibn Majah
        </p>
      </motion.div>
    </div>
  );
}
