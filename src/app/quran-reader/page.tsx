"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAudio } from "@/hooks/useAudio";
import { useApp } from "@/context/AppProviders";
import {
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
  HiOutlineFastForward,
  HiOutlineRewind,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineX,
  HiOutlineAdjustments,
  HiOutlineShare,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const SURAH_NAMES = [
  "", "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra",
  "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun",
  "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut",
  "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin",
  "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura",
  "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad",
  "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm",
  "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah",
  "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun",
  "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam",
  "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil",
  "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba",
  "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin",
  "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah",
  "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", "Ad-Duha",
  "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah",
  "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr",
  "Al-Humazah", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kauthar",
  "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas",
];

const SURAH_NAMES_AR = [
  "", "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
  "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء",
  "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون",
  "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت",
  "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس",
  "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى",
  "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد",
  "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم",
  "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة",
  "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون",
  "التغابن", "الطلاق", "التحريم", "الملك", "القلم",
  "الحاقة", "المعارج", "نوح", "الجن", "المزمل",
  "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ",
  "النازعات", "عبس", "التكوير", "الإنفتار", "المطففين",
  "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية",
  "الفجر", "البلد", "الشمس", "الليل", "الضحى",
  "الشرح", "التين", "العلق", "القدر", "البينة",
  "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر",
  "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر",
  "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس",
];

const SURAH_MEANINGS = [
  "", "The Opening", "The Cow", "The Family of Imran", "The Women", "The Table Spread",
  "The Cattle", "The Heights", "The Spoils of War", "The Repentance", "Jonah",
  "Hud", "Joseph", "The Thunder", "Abraham", "The Rocky Tract", "The Bee", "The Night Journey",
  "The Cave", "Mary", "Ta-Ha", "The Prophets", "The Pilgrimage", "The Believers",
  "The Light", "The Criterion", "The Poets", "The Ant", "The Stories", "The Spider",
  "The Romans", "Luqman", "The Prostration", "The Combined Forces", "Sheba", "Originator",
  "Ya-Sin", "Those Ranged in Ranks", "The Letter Sad", "The Troops", "The Forgiver",
  "The Explained in Detail", "The Consultation", "The Copper", "The Smoke", "The Crouching",
  "The Wind-Curved Sandhills", "Muhammad", "The Victory", "The Rooms", "The Letter Qaf",
  "The Winnowing Winds", "The Mount", "The Star", "The Moon", "The Beneficent",
  "The Inevitable", "The Iron", "The Pleading Woman", "The Exile", "She Who is to be Examined",
  "The Congregation", "The Hypocrites", "Mutual Disillusion", "The Divorce", "The Prohibition",
  "The Sovereignty", "The Pen", "The Inevitable", "The Stairways", "Noah",
  "The Jinn", "The Enshrouded One", "The Cloaked One", "The Resurrection", "The Man",
  "The Emissaries", "The Tidings", "The Nightcomers", "The Overthrowing", "The Defrauding",
  "The Cleaving", "The Mansions of the Stars", "The Morning Star", "The Most High", "The Overwhelming",
  "The Dawn", "The City", "The Sun", "The Night", "The Morning Hours",
  "The Relief", "The Fig", "The Clot", "The Power", "The Clear Evidence",
  "The Earthquake", "The Chargers", "The Calamity", "The Rivalry", "Time",
  "The Traducer", "The Elephant", "Quraish", "The Small Kindnesses", "The Abundance",
  "The Disbelievers", "The Triumph", "The Palm Fiber", "The Sincerity", "The Daybreak",
  "Mankind",
];

const SURAH_AYAH_COUNTS: number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 110, 98,
  135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
  53, 89, 59, 37, 35, 38, 28, 28, 20, 56, 40, 56, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 5, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6,
  3, 5, 4, 5, 3, 6, 3, 5, 4, 5, 6, 12, 11, 6, 3, 5, 4, 7, 3, 6, 3, 5,
  4, 5, 3, 7, 5, 5, 8, 18, 12, 13, 11, 11, 8, 5, 5, 8, 3, 6, 3, 5, 4, 5,
  3, 7, 5, 5, 9, 12, 12, 7, 4,
];

const STORAGE_KEY = "quran-reader-progress";
const FONT_SIZE_KEY = "quran-reader-font-size";
const READING_MODE_KEY = "quran-reader-mode";

type ReadingMode = "light" | "dark" | "sepia";

interface ReaderProgress {
  surahNumber: number;
  ayahNumber: number;
  lastRead: string;
}

interface SurahVerse {
  numberInSurah: number;
  text: string;
  translation: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  verses: SurahVerse[];
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuranReaderPage() {
  const { t } = useTranslation();
  usePageTitle(t("quranReader.title"));
  const audio = useAudio();
  const { readingProgress, getProgressBySurah, setProgressForSurah } = useApp();

  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(FONT_SIZE_KEY);
      return stored ? parseInt(stored) : 32;
    } catch { return 32; }
  });
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    try {
      const stored = localStorage.getItem(READING_MODE_KEY);
      return (stored as ReadingMode) || "light";
    } catch { return "light"; }
  });
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [mounted, setMounted] = useState(false);

  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p: ReaderProgress = JSON.parse(saved);
        setSelectedSurah(p.surahNumber);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(READING_MODE_KEY, readingMode);
  }, [readingMode]);

  const latestProgress = useMemo(() => {
    return getProgressBySurah(selectedSurah);
  }, [selectedSurah, getProgressBySurah, readingProgress]);

  const fetchSurah = useCallback(async (surahNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`
      );
      const data = await res.json();
      if (data.code === 200) {
        const arabicAyahs = data.data[0].ayahs;
        const enAyahs = data.data[1].ayahs;
        const verses: SurahVerse[] = arabicAyahs.map((a: { numberInSurah: number; text: string }, i: number) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          translation: enAyahs[i]?.text || "",
        }));
        setSurahData({
          number: surahNumber,
          name: data.data[0].name,
          englishName: data.data[0].englishName,
          verses,
        });
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSurah(selectedSurah);
  }, [selectedSurah, fetchSurah]);

  const saveProgress = useCallback((ayahNum: number) => {
    const progress: ReaderProgress = {
      surahNumber: selectedSurah,
      ayahNumber: ayahNum,
      lastRead: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    setProgressForSurah(selectedSurah, ayahNum, 0);
  }, [selectedSurah, setProgressForSurah]);

  useEffect(() => {
    if (!surahData || !autoScroll) return;
    if (audio.isPlaying) {
      const verseEl = verseRefs.current.get(audio.currentAyah);
      if (verseEl) {
        verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [audio.currentAyah, audio.isPlaying, surahData, autoScroll]);

  useEffect(() => {
    if (audio.isPlaying && audio.currentSurah === selectedSurah) {
      saveProgress(audio.currentAyah);
    }
  }, [audio.currentAyah, audio.isPlaying, selectedSurah, saveProgress]);

  useEffect(() => {
    setShowMiniPlayer(audio.isPlaying);
  }, [audio.isPlaying]);

  const handlePlayAyah = (ayahNumber: number) => {
    if (audio.isPlaying && audio.currentSurah === selectedSurah && audio.currentAyah === ayahNumber) {
      audio.pause();
    } else {
      audio.play(selectedSurah, ayahNumber);
    }
  };

  const handleContinue = () => {
    if (!latestProgress) return;
    setSelectedSurah(latestProgress.surahNumber);
    setTimeout(() => {
      const el = verseRefs.current.get(latestProgress.ayahNumber);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    audio.setSpeed(next);
  };

  const cycleRepeat = () => {
    const modes: ("off" | "one" | "all")[] = ["off", "one", "all"];
    const idx = modes.indexOf(repeatMode);
    const next = modes[(idx + 1) % modes.length];
    setRepeatMode(next);
    audio.setRepeatMode(next);
  };

  const handleShare = () => {
    if (!surahData) return;
    const text = `Reading Surah ${surahData.englishName} (${surahData.name})\n${surahData.verses.length} ayahs\n\n"Indeed, it is We who sent down the reminder and indeed, We will be its guardian." — Quran 15:9`;
    if (navigator.share) {
      navigator.share({ title: `Surah ${surahData.englishName}`, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const getBgClass = () => {
    switch (readingMode) {
      case "dark": return "bg-gray-950 text-white";
      case "sepia": return "bg-[#f5e6c8] text-gray-900";
      default: return "bg-cream dark:bg-gray-900 text-gray-900 dark:text-white";
    }
  };

  const getCardBg = () => {
    switch (readingMode) {
      case "dark": return "bg-gray-900 border-gray-800";
      case "sepia": return "bg-[#ede0c8] border-[#d4c4a0]";
      default: return "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700";
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen pt-24 pb-32 px-4 transition-colors ${getBgClass()}`}>
      <div className="max-w-3xl mx-auto" ref={scrollRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{t("quranReader.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("quranReader.subtitle")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedSurah}
                onChange={(e) => {
                  setSelectedSurah(Number(e.target.value));
                  setShowToc(false);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald/30 appearance-none cursor-pointer"
              >
                {SURAH_NAMES.slice(1).map((name, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}. {name} ({SURAH_NAMES_AR[i + 1]}) — {SURAH_AYAH_COUNTS[i]} {t("quran.ayahs")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFontSize((s) => Math.max(20, s - 2))}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={t("reading.fontDecrease")}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(56, s + 2))}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={t("reading.fontIncrease")}
              >
                A+
              </button>
              <button
                onClick={() => {
                  const modes: ReadingMode[] = ["light", "dark", "sepia"];
                  const idx = modes.indexOf(readingMode);
                  setReadingMode(modes[(idx + 1) % modes.length]);
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  readingMode === "dark"
                    ? "bg-gray-800 border-gray-700 text-yellow-400"
                    : readingMode === "sepia"
                    ? "bg-[#ede0c8] border-[#d4c4a0] text-amber-700"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600"
                }`}
                title={`${t("reading.readingMode")}: ${readingMode}`}
              >
                {readingMode === "dark" ? <HiOutlineSun className="w-5 h-5" /> : readingMode === "sepia" ? <HiOutlineAdjustments className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowToc(!showToc)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  showToc ? "bg-emerald text-white border-emerald" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600"
                }`}
                title={t("quranReader.tableOfContents")}
              >
                {showToc ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {latestProgress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald/10 to-teal-50 dark:from-emerald/10 dark:to-emerald/5 border border-emerald/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                  <HiOutlineBookOpen className="w-5 h-5 text-emerald" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("quranReader.continueReading")}</p>
                  <p className="text-xs text-gray-500">
                    {SURAH_NAMES[latestProgress.surahNumber]}, Ayah {latestProgress.ayahNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="px-3 py-1.5 rounded-xl bg-emerald text-white text-xs font-medium hover:bg-emerald/90 transition-colors"
              >
                {t("quranReader.resume")}
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className={`rounded-2xl border p-4 max-h-96 overflow-y-auto ${getCardBg()}`}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <HiOutlineBookOpen className="w-4 h-4 text-emerald" />
                  {t("quranReader.tableOfContents")}
                </h3>
                <div className="space-y-1">
                  {SURAH_NAMES.slice(1).map((name, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        setSelectedSurah(i + 1);
                        setShowToc(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedSurah === i + 1
                          ? "bg-emerald/10 text-emerald font-medium"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500">
                          {i + 1}
                        </span>
                        <div className="text-left">
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-gray-400">{SURAH_MEANINGS[i + 1]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{SURAH_NAMES_AR[i + 1]}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">{SURAH_AYAH_COUNTS[i]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {surahData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-6 p-5 rounded-2xl border ${getCardBg()}`}
          >
            <div className="text-center">
              <p className="text-3xl font-serif text-emerald mb-2">{surahData.name}</p>
              <p className="text-lg font-medium mb-1">{surahData.englishName}</p>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <span>{surahData.verses.length} {t("quran.ayahs")}</span>
                <span>•</span>
                <span>{selectedSurah <= 114 ? SURAH_MEANINGS[selectedSurah] : ""}</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald">
                <HiOutlineRefresh className="w-3 h-3" />
                <span>{t("quranReader.bismillah")}</span>
              </div>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">{t("quranReader.loadingSurah")}</p>
          </div>
        )}

        {surahData && !loading && (
          <div className="space-y-4">
            {surahData.verses.map((verse, i) => {
              const isCurrentlyPlaying =
                audio.isPlaying &&
                audio.currentSurah === selectedSurah &&
                audio.currentAyah === verse.numberInSurah;

              return (
                <motion.div
                  key={verse.numberInSurah}
                  ref={(el) => {
                    if (el) verseRefs.current.set(verse.numberInSurah, el);
                    else verseRefs.current.delete(verse.numberInSurah);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                    getCardBg()
                  } ${isCurrentlyPlaying ? "ring-2 ring-emerald" : ""}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-medium text-emerald bg-emerald/10 px-3 py-1 rounded-full">
                      {verse.numberInSurah}
                    </span>
                    <button
                      onClick={() => handlePlayAyah(verse.numberInSurah)}
                      className={`p-2 rounded-xl transition-all active:scale-90 ${
                        isCurrentlyPlaying
                          ? "text-emerald bg-emerald/10"
                          : "text-gray-400 hover:text-emerald hover:bg-emerald/5"
                      }`}
                      title={t("quranReader.playAudio")}
                    >
                      {isCurrentlyPlaying ? (
                        <HiOutlinePause className="w-4 h-4" />
                      ) : (
                        <HiOutlinePlay className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="text-right mb-4">
                    <p
                      className="leading-[2.2] tracking-wider font-serif"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {verse.text}
                    </p>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed">
                    {verse.translation}
                  </p>

                  {verse.numberInSurah < surahData.verses.length && (
                    <div className="flex items-center justify-center mt-4 text-gray-300 dark:text-gray-700">
                      <span className="text-xs">─── ✦ ───</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && surahData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 mb-16 text-center"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald/5 to-teal-50 dark:from-emerald/10 dark:to-emerald/5 border border-emerald/10">
              <p className="text-2xl font-serif text-emerald mb-2">{t("quranReader.subhanAllah")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("quranReader.completedSurah")} {surahData.englishName}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                {selectedSurah < 114 && (
                  <button
                    onClick={() => {
                      setSelectedSurah(selectedSurah + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald text-white text-sm font-medium hover:bg-emerald/90 transition-colors"
                  >
                    {t("quranReader.nextSurah")}
                  </button>
                )}
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t("quranReader.backToTop")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showMiniPlayer && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="mx-auto max-w-4xl px-4 pb-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald">{audio.currentAyah}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {SURAH_NAMES[audio.currentSurah]} — Ayah {audio.currentAyah}
                    </p>
                    <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald rounded-full"
                        style={{
                          width: audio.duration > 0
                            ? `${(audio.currentTime / audio.duration) * 100}%`
                            : "0%",
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-gray-400">{formatTime(audio.currentTime)}</span>
                      <span className="text-[10px] text-gray-400">{formatTime(audio.duration)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={audio.prev}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quranReader.previous")}
                    >
                      <HiOutlineRewind className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        audio.isPlaying
                          ? audio.pause()
                          : audio.play(audio.currentSurah, audio.currentAyah)
                      }
                      className="w-10 h-10 rounded-full bg-emerald text-white flex items-center justify-center hover:bg-emerald/90 transition-colors shadow-lg shadow-emerald/20"
                    >
                      {audio.isPlaying ? (
                        <HiOutlinePause className="w-5 h-5" />
                      ) : (
                        <HiOutlinePlay className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={audio.next}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quranReader.nextAyah")}
                    >
                      <HiOutlineFastForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cycleSpeed}
                      className="px-2 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quranReader.playbackSpeed")}
                    >
                      {speed}x
                    </button>
                    <button
                      onClick={cycleRepeat}
                      className={`p-2 rounded-xl transition-colors ${
                        repeatMode !== "off"
                          ? "text-emerald bg-emerald/10"
                          : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      title={`${t("quranReader.repeat")}: ${repeatMode}`}
                    >
                      <HiOutlineRefresh className="w-4 h-4" />
                    </button>
                    <button
                      onClick={audio.stop}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quranReader.stop")}
                    >
                      <HiOutlineStop className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowMiniPlayer(false)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showMiniPlayer && audio.isPlaying && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setShowMiniPlayer(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald text-white shadow-lg shadow-emerald/30 flex items-center justify-center hover:bg-emerald/90 transition-colors"
        >
          <HiOutlinePlay className="w-5 h-5 ml-0.5" />
        </motion.button>
      )}
    </div>
  );
}
