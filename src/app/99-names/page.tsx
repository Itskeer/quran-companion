"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineX,
  HiOutlineStar,
} from "react-icons/hi";

const NAMES = [
  { number: 1, arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", description: "The One who has vast mercy and blesses all creation abundantly." },
  { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", description: "The One who sends repeated mercy to the believers." },
  { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", description: "The One with complete dominion and sovereignty." },
  { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Holy One", description: "The One free from all imperfections and defects." },
  { number: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace", description: "The One who is free from every flaw and grants safety." },
  { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", description: "The One who grants security and protection." },
  { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector", description: "The One who witnesses all things and protects them." },
  { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Mighty", description: "The One with complete power and strength." },
  { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller", description: "The One who compels and restores what is broken." },
  { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme", description: "The One who is far above anything in creation." },
  { number: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator", description: "The One who brings everything into existence." },
  { number: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver", description: "The One who creates with wisdom and purpose." },
  { number: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner", description: "The One who gives distinctive forms to creation." },
  { number: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiver", description: "The One who repeatedly forgives sins." },
  { number: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer", description: "The One who dominates all creation." },
  { number: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower", description: "The One who gives freely and abundantly." },
  { number: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider", description: "The One who sustains and provides for all." },
  { number: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener", description: "The One who opens doors of mercy and provision." },
  { number: 19, arabic: "اَلْعَلِيْمُ", transliteration: "Al-Alim", meaning: "The All-Knowing", description: "The One with complete knowledge of all things." },
  { number: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Restrainer", description: "The One who withholds and restricts." },
  { number: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Reliever", description: "The One who expands and liberates." },
  { number: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser", description: "The One who humbles the proud." },
  { number: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter", description: "The One who raises ranks and status." },
  { number: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Giver of Honor", description: "The One who honors and empowers." },
  { number: 25, arabic: "الْمُذِلُّ", transliteration: "Al-Muzill", meaning: "The Humiliator", description: "The One who humbles those who disobey." },
  { number: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing", description: "The One who hears all sounds and whispers." },
  { number: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing", description: "The One who sees all things, manifest and hidden." },
  { number: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge", description: "The One who judges with perfect justice." },
  { number: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just", description: "The One who establishes justice for all." },
  { number: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One", description: "The One who is kind and gentle in His actions." },
  { number: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The All-Aware", description: "The One who knows the innermost secrets." },
  { number: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing", description: "The One who is patient and does not punish immediately." },
  { number: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent", description: "The One who is supreme in glory and majesty." },
  { number: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The Forgiving", description: "The One who forgives sins of all kinds." },
  { number: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative", description: "The One who rewards small deeds greatly." },
  { number: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High", description: "The One who is above all His creation." },
  { number: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Greatest", description: "The One who is greater than everything." },
  { number: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver", description: "The One who protects and preserves all things." },
  { number: 39, arabic: "الْمُقِيتُ", transliteration: "Al-Muqit", meaning: "The Sustainer", description: "The One who provides the means of sustenance." },
  { number: 40, arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner", description: "The One who takes account of all deeds." },
  { number: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic", description: "The One who possesses greatness and majesty." },
  { number: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous", description: "The One whose generosity is endless." },
  { number: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful", description: "The One who watches over His creation." },
  { number: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive", description: "The One who answers prayers." },
  { number: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing", description: "The One whose knowledge and mercy are vast." },
  { number: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise", description: "The One whose wisdom is perfect." },
  { number: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving", description: "The One who loves His righteous servants." },
  { number: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious", description: "The One whose glory is perfect." },
  { number: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector", description: "The One who raises the dead to life." },
  { number: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness", description: "The One who witnesses everything." },
  { number: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth", description: "The One who is absolutely true and real." },
  { number: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee", description: "The One who manages all affairs." },
  { number: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawwyy", meaning: "The Strong", description: "The One with unbreakable strength." },
  { number: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm", description: "The One with unwavering firmness." },
  { number: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Wali", meaning: "The Friend", description: "The One who is close to the righteous." },
  { number: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy", description: "The One who deserves all praise." },
  { number: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Counter", description: "The One who counts all things." },
  { number: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator", description: "The One who originates creation." },
  { number: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer", description: "The One who restores creation." },
  { number: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life", description: "The One who gives life to the dead." },
  { number: 61, arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Causer of Death", description: "The One who causes death." },
  { number: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living", description: "The One who is eternally alive." },
  { number: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Sustaining", description: "The One who sustains all creation." },
  { number: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder", description: "The One who finds what is lost." },
  { number: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble", description: "The One whose essence is noble." },
  { number: 66, arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", meaning: "The One", description: "The One who is absolutely unique." },
  { number: 67, arabic: "اَلصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal", description: "The One who is self-sufficient and eternal." },
  { number: 68, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Capable", description: "The One with unlimited power." },
  { number: 69, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Omnipotent", description: "The One with supreme power." },
  { number: 70, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter", description: "The One who brings forward." },
  { number: 71, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer", description: "The One who delays things." },
  { number: 72, arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: "The First", description: "The One who existed before all else." },
  { number: 73, arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: "The Last", description: "The One who will remain after all else." },
  { number: 74, arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest", description: "The One whose signs are clear." },
  { number: 75, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden", description: "The One who knows the unseen." },
  { number: 76, arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor", description: "The One who governs all things." },
  { number: 77, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted", description: "The One who is far above imperfection." },
  { number: 78, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness", description: "The One who is kind and generous." },
  { number: 79, arabic: "التَّوَّابُ", transliteration: "At-Tawwab", meaning: "The Acceptor of Repentance", description: "The One who accepts repentance repeatedly." },
  { number: 80, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger", description: "The One who justly punishes wrongdoers." },
  { number: 81, arabic: "العَفُوُّ", transliteration: "Al-Afuww", meaning: "The Pardoner", description: "The One who pardons and overlooks sins." },
  { number: 82, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate", description: "The One who is extremely kind and merciful." },
  { number: 83, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "The Owner of All Dominion", description: "The One who owns all sovereignty." },
  { number: 84, arabic: "ذُو الْجَلَالِ وَالإِكْرَامِ", transliteration: "Dhul-Jalali wal-Ikram", meaning: "The Lord of Majesty and Honor", description: "The One who possesses glory and honor." },
  { number: 85, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable", description: "The One who establishes justice." },
  { number: 86, arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer", description: "The One who gathers all creation." },
  { number: 87, arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient", description: "The One who is free from need." },
  { number: 88, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher", description: "The One who enriches those in need." },
  { number: 89, arabic: "اَلْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer", description: "The One who prevents harm." },
  { number: 90, arabic: "الضَّارَّ", transliteration: "Ad-Darr", meaning: "The Distresser", description: "The One who creates trials and tests." },
  { number: 91, arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Benefiter", description: "The One who brings benefit." },
  { number: 92, arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light", description: "The One who is the light of the heavens and earth." },
  { number: 93, arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide", description: "The One who guides to the straight path." },
  { number: 94, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Originator", description: "The One who creates without precedent." },
  { number: 95, arabic: "اَلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting", description: "The One who endures forever." },
  { number: 96, arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor", description: "The One who inherits all things." },
  { number: 97, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to Right Path", description: "The One who guides to the right way." },
  { number: 98, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient", description: "The One who is extremely patient." },
  { number: 99, arabic: "اللَّهُ", transliteration: "Allah", meaning: "The God", description: "The One who deserves all worship." },
];

function getDailyName(): (typeof NAMES)[0] {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = (seed * 2654435761) % NAMES.length;
  return NAMES[index < 0 ? index + NAMES.length : index];
}

function NameCard({
  name,
  isExpanded,
  onToggle,
  isFavorite,
  onToggleFavorite,
  t,
}: {
  name: (typeof NAMES)[0];
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  t: (key: string) => string;
}) {
  return (
    <motion.div
      layout
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 ${
        isExpanded
          ? "ring-2 ring-emerald-500 shadow-lg"
          : "hover:shadow-md hover:ring-1 hover:ring-emerald-200"
      }`}
      whileHover={{ y: -2 }}
      transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.2 } }}
    >
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`rounded-full p-1.5 transition-colors ${
            isFavorite
              ? "bg-red-50 text-red-500"
              : "bg-gray-50 text-gray-300 hover:text-red-400"
          }`}
        >
          <HiOutlineHeart className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 flex items-start justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
          {name.number}
        </span>
      </div>

      <div className="mb-3 text-center">
        <p
          className="mb-2 text-2xl leading-relaxed text-gray-800 md:text-3xl"
          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
        >
          {name.arabic}
        </p>
        <p className="text-sm italic text-gray-500">{name.transliteration}</p>
        <p className="mt-1 text-sm font-semibold text-gray-700">{name.meaning}</p>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 pt-3">
              <p className="mb-3 text-sm leading-relaxed text-gray-600">
                {name.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors ${
                  isFavorite
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <HiOutlineHeart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? t("names.removeReflection") : t("names.reflectOn")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NamesPage() {
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("name-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("name-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const dailyName = useMemo(() => getDailyName(), []);

  const filteredNames = useMemo(() => {
    let result = NAMES;
    if (showFavoritesOnly) {
      result = result.filter((n) => favorites.includes(n.number));
    }
    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter(
      (n) =>
        n.arabic.includes(search) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [search, favorites, showFavoritesOnly]);

  const toggleFavorite = (num: number) => {
    setFavorites((prev) =>
      prev.includes(num) ? prev.filter((f) => f !== num) : [...prev, num]
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #f0fdf4 0%, #ffffff 30%, #f8fafc 100%)",
      }}
    >
      {/* Geometric pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(#059669 0% 25%, transparent 0% 50%)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p
            className="mb-2 text-4xl text-emerald-800 md:text-5xl"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            أسماء الله الحسنى
          </p>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("names.title")}
          </h1>
          <p className="text-lg text-gray-500">
            {t("names.subtitle")}
          </p>
        </motion.div>

        {/* Daily Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineStar className="h-5 w-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-200">
              {t("names.dailyName")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="text-center md:text-left">
              <p
                className="mb-1 text-4xl"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                {dailyName.arabic}
              </p>
              <p className="text-lg font-semibold text-emerald-100">
                {dailyName.transliteration}
              </p>
              <p className="text-emerald-200">{dailyName.meaning}</p>
              <p className="mt-2 max-w-lg text-sm text-emerald-100/80">
                {dailyName.description}
              </p>
            </div>
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
              #{dailyName.number}
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("names.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-all ${
              showFavoritesOnly
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-500"
            }`}
          >
            <HiOutlineHeart
              className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`}
            />
            {showFavoritesOnly ? t("names.showingFavorites") : t("names.favorites")}
          </button>
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredNames.length} {filteredNames.length === 1 ? t("names.nameFound") : t("names.namesFound")}
          </p>
          {favorites.length > 0 && (
            <p className="text-sm text-gray-500">
              {favorites.length} {t("names.reflected")}
            </p>
          )}
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredNames.map((name) => (
              <NameCard
                key={name.number}
                name={name}
                isExpanded={expandedIndex === name.number}
                onToggle={() =>
                  setExpandedIndex(
                    expandedIndex === name.number ? null : name.number
                  )
                }
                isFavorite={favorites.includes(name.number)}
                onToggleFavorite={() => toggleFavorite(name.number)}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredNames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <HiOutlineSearch className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg text-gray-500">{t("names.noNames")}</p>
            <p className="text-sm text-gray-400">
              {t("names.tryDifferent")}
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-gray-100 pt-8 text-center"
        >
          <p
            className="mb-1 text-2xl text-gray-600"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
          </p>
          <p className="text-sm text-gray-400">
            &ldquo;And to Allah belong the most beautiful names, so invoke Him
            by them.&rdquo; &mdash; Quran 7:180
          </p>
        </motion.div>
      </div>
    </div>
  );
}
