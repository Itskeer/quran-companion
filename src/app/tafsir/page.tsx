"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { HiOutlineBookOpen, HiOutlineSearch, HiOutlineChevronDown } from "react-icons/hi";

const SURAH_NAMES = ["Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Ad-Dalat","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];
const SURAH_AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,38,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,48,28,28,20,56,40,31,50,40,46,42,29,36,25,22,17,19,26,30,20,15,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6,3,1,8,8,11,11,8,3,7,3,6,3,5,4,5,6,3,1];
const SURAH_LIST = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: SURAH_NAMES[i],
  ayahCount: SURAH_AYAH_COUNTS[i],
}));

export default function TafsirPage() {
  const { t } = useTranslation();
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [tafsirText, setTafsirText] = useState("");
  const [verseText, setVerseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);
  const [search, setSearch] = useState("");
  const maxAyah = SURAH_LIST[surah - 1]?.ayahCount || 7;

  const fetchTafsir = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,ar-tafsir-ibn-kathir`
      );
      const data = await res.json();
      if (data.code === 200) {
        setVerseText(data.data[0]?.text || "");
        setTafsirText(data.data[1]?.text || "");
      }
    } catch { /* empty */ }
    setLoading(false);
  };

  const filtered = SURAH_LIST.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || String(s.number) === search
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
              <HiOutlineBookOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("tafsir.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("tafsir.subtitle")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("tafsir.selectSurah")}</label>
                <button onClick={() => setShowSurahList(!showSurahList)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white">
                  <span>{surah}. {SURAH_LIST[surah - 1]?.name}</span>
                  <HiOutlineChevronDown className="w-4 h-4" />
                </button>
                {showSurahList && (
                  <div className="absolute z-20 top-full mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl">
                    <div className="p-2 sticky top-0 bg-white dark:bg-gray-800">
                      <input value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                        placeholder={t("tafsir.search")} />
                    </div>
                    {filtered.map((s) => (
                      <button key={s.number} onClick={() => { setSurah(s.number); setAyah(1); setShowSurahList(false); setSearch(""); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                        {s.number}. {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("tafsir.selectAyah")}</label>
                <select value={ayah} onChange={(e) => setAyah(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white">
                  {Array.from({ length: maxAyah }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{t("quranReader.ayah")} {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={fetchTafsir} disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium disabled:opacity-50">
              {loading ? t("tafsir.loading") : t("tafsir.expand")}
            </button>
          </div>

          {verseText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t("tafsir.arabicTafsir")}</h3>
              <p className="text-2xl leading-loose text-right text-gray-900 dark:text-white font-arabic" dir="rtl">{verseText}</p>
            </motion.div>
          )}

          {tafsirText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t("tafsir.source")} — Ibn Kathir</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{tafsirText}</p>
            </motion.div>
          )}

          {!verseText && !loading && (
            <div className="text-center py-16">
              <HiOutlineBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t("tafsir.noTafsir")}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
