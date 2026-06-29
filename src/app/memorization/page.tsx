"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineCheckCircle, HiOutlineBookOpen, HiOutlineStar, HiOutlineRefresh } from "react-icons/hi";

const SURAH_AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,38,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,48,28,28,20,56,40,31,50,40,46,42,29,36,25,22,17,19,26,30,20,15,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6,3,1,8,8,11,11,8,3,7,3,6,3,5,4,5,6,3,1];
const SURAH_NAMES = ["Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Gafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Ad-Dalat","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];
const SURAH_INFO = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: SURAH_NAMES[i],
  ayahCount: SURAH_AYAH_COUNTS[i],
}));

type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

export default function MemorizationPage() {
  const { t } = useTranslation();
  const { memorizationProgress, setMemorizationProgress } = useApp();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const getSurahData = (num: number) => {
    return memorizationProgress.find((s) => s.surahNumber === num);
  };

  const getMasteryLevel = (memorized: number, total: number): MasteryLevel => {
    const pct = total > 0 ? memorized / total : 0;
    if (pct === 0) return "new";
    if (pct < 0.5) return "learning";
    if (pct < 1) return "reviewing";
    return "mastered";
  };

  const toggleAyah = (surahNumber: number) => {
    const info = SURAH_INFO[surahNumber - 1];
    const existing = getSurahData(surahNumber);
    const current = existing?.memorizedAyahs || 0;
    const next = current >= info.ayahCount ? 0 : current + 1;
    const updated = memorizationProgress.filter((s) => s.surahNumber !== surahNumber);
    if (next > 0) {
      updated.push({
        surahNumber, name: info.name, nameArabic: info.name, totalAyahs: info.ayahCount,
        memorizedAyahs: next, lastPracticed: new Date().toISOString(), nextReview: new Date(Date.now() + 86400000).toISOString(),
        reviewCount: (existing?.reviewCount || 0) + 1, masteryLevel: getMasteryLevel(next, info.ayahCount),
      });
    }
    setMemorizationProgress(updated);
  };

  const stats = useMemo(() => {
    const total = 6236;
    const memorized = memorizationProgress.reduce((s, p) => s + p.memorizedAyahs, 0);
    const mastered = memorizationProgress.filter((p) => p.masteryLevel === "mastered").length;
    return { total, memorized, percentage: total > 0 ? Math.round((memorized / total) * 100) : 0, mastered };
  }, [memorizationProgress]);

  const filtered = SURAH_INFO.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && String(s.number) !== search) return false;
    const data = getSurahData(s.number);
    const level = data ? data.masteryLevel : "new";
    if (filter !== "all" && level !== filter) return false;
    return true;
  });

  const masteryColors: Record<MasteryLevel, string> = {
    new: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
    learning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    reviewing: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    mastered: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
              <HiOutlineBookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("memorization.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("memorization.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("memorization.memorizedAyahs"), value: stats.memorized, icon: HiOutlineBookOpen },
              { label: t("memorization.progress"), value: `${stats.percentage}%`, icon: HiOutlineCheckCircle },
              { label: t("memorization.mastered"), value: stats.mastered, icon: HiOutlineStar },
              { label: t("memorization.totalAyahs"), value: stats.total, icon: HiOutlineRefresh },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4">
                <s.icon className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-1 mb-6 flex gap-1 overflow-x-auto">
            {["all", "new", "learning", "reviewing", "mastered"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f ? "bg-[var(--accent)] text-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                {t(`memorization.${f === "all" ? "allSurahs" : f}`)}
              </button>
            ))}
          </div>

          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("tafsir.search")}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((surah) => {
              const data = getSurahData(surah.number);
              const memorized = data?.memorizedAyahs || 0;
              const pct = surah.ayahCount > 0 ? Math.round((memorized / surah.ayahCount) * 100) : 0;
              const level = data?.masteryLevel || "new";
              return (
                <motion.div key={surah.number} whileHover={{ scale: 1.02 }} onClick={() => toggleAyah(surah.number)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">#{surah.number}</span>
                      <h3 className="font-medium text-gray-900 dark:text-white">{surah.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${masteryColors[level]}`}>
                      {t(`memorization.${level}`)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div className="bg-[var(--accent)] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{memorized}/{surah.ayahCount} ayahs</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
