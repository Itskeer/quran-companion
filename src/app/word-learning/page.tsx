"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { HiOutlineCollection, HiOutlineInformationCircle } from "react-icons/hi";

const SURAH_LIST = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: ["Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Gafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Ad-Dalat","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"],
}));

export default function WordLearningPage() {
  const { t } = useTranslation();
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [verseText, setVerseText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVerse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`);
      const data = await res.json();
      if (data.code === 200) {
        const text = data.data.text;
        setVerseText(text);
        setWords(text.split(/\s+/).filter(Boolean));
        setSelectedWord(null);
      }
    } catch { /* empty */ }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <HiOutlineCollection className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("wordByWord.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("wordByWord.subtitle")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("tafsir.selectSurah")}</label>
                <select value={surah} onChange={(e) => { setSurah(Number(e.target.value)); setAyah(1); }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white">
                  {SURAH_LIST.map((s) => (<option key={s.number} value={s.number}>{s.number}. {s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("tafsir.selectAyah")}</label>
                <select value={ayah} onChange={(e) => setAyah(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white">
                  {Array.from({ length: 286 }, (_, i) => (<option key={i + 1} value={i + 1}>{t("quranReader.ayah")} {i + 1}</option>))}
                </select>
              </div>
            </div>
            <button onClick={fetchVerse} disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium disabled:opacity-50">
              {loading ? t("tafsir.loading") : t("wordByWord.selectVerse")}
            </button>
          </div>

          {words.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t("wordByWord.tapWord")}</h3>
              <p className="text-2xl leading-loose text-right text-gray-900 dark:text-white mb-6" dir="rtl">
                {words.map((word, i) => (
                  <span key={i} onClick={() => setSelectedWord(selectedWord === i ? null : i)}
                    className={`cursor-pointer px-2 py-1 rounded-lg mx-1 transition-all ${selectedWord === i ? "bg-[var(--accent)]/20 ring-2 ring-[var(--accent)]" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {word}
                  </span>
                ))}
              </p>

              <AnimatePresence>
                {selectedWord !== null && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineInformationCircle className="w-5 h-5 text-[var(--accent)]" />
                      <span className="font-medium text-gray-900 dark:text-white text-lg">{words[selectedWord]}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("wordByWord.position")} {selectedWord + 1} / {words.length}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {!verseText && !loading && (
            <div className="text-center py-16">
              <HiOutlineCollection className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t("tafsir.noTafsir")}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
