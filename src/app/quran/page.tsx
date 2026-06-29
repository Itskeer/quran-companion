"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { verses, searchVerses } from "@/data/verses";
import { getSurah, QuranSurah, QuranVerse } from "@/services/quranApi";
import { useAudio } from "@/hooks/useAudio";
import { searchQuran, SearchResult } from "@/services/quranSearch";
import { shareContent, copyToClipboard } from "@/services/nativeBridge";
import { useApp } from "@/context/AppProviders";
import { useToast } from "@/context/ToastContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Bookmark } from "@/types";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineClipboard,
  HiOutlineBookOpen,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineBookmark,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
  HiOutlineFastForward,
  HiOutlineRewind,
  HiOutlineX,
  HiOutlineViewList,
  HiOutlineDocumentText,
} from "react-icons/hi";

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

const SURAH_AYAH_COUNTS: number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 110, 98,
  135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
  53, 89, 59, 37, 35, 38, 28, 28, 20, 56, 40, 56, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 5, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6,
  3, 5, 4, 5, 3, 6, 3, 5, 4, 5, 6, 12, 11, 6, 3, 5, 4, 7, 3, 6, 3, 5,
  4, 5, 3, 7, 5, 5, 8, 18, 12, 13, 11, 11, 8, 5, 5, 8, 3, 6, 3, 5, 4, 5,
  3, 7, 5, 5, 9, 12, 12, 7, 4,
];

export default function QuranPage() {
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkNote,
    readingProgress,
    getProgressBySurah,
    setProgressForSurah,
  } = useApp();
  const { toast } = useToast();
  const audio = useAudio();
  const { t } = useTranslation();
  usePageTitle(t("quran.pageTitle"));

  const [query, setQuery] = useState("");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [darkReader, setDarkReader] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [surahFilter, setSurahFilter] = useState<number | null>(null);
  const [apiSurah, setApiSurah] = useState<QuranSurah | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [useApi, setUseApi] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [showContinueBanner, setShowContinueBanner] = useState(true);
  const [bookmarkingVerseId, setBookmakingVerseId] = useState<string | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [comparingVerseId, setComparingVerseId] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<Record<string, { asad?: string; sahih?: string }>>({});
  const [viewMode, setViewMode] = useState<"surah" | "juz">("surah");
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  const verseRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fontSizeMap = { small: "text-lg", medium: "text-2xl", large: "text-3xl" };

  const allApiVersesRef = useRef<QuranVerse[]>([]);

  useEffect(() => {
    setShowMiniPlayer(audio.isPlaying);
  }, [audio.isPlaying]);

  const surahList = useMemo(() => {
    const fromMock = [...new Set(verses.map((v) => v.surahNumber))];
    const list: { number: number; name: string; arabicName: string }[] = fromMock.map((n) => ({
      number: n,
      name: SURAH_NAMES[n] || `Surah ${n}`,
      arabicName: SURAH_NAMES_AR[n] || "",
    }));
    if (useApi) {
      return Array.from({ length: 114 }, (_, i) => ({
        number: i + 1,
        name: SURAH_NAMES[i + 1] || `Surah ${i + 1}`,
        arabicName: SURAH_NAMES_AR[i + 1] || "",
      }));
    }
    return list;
  }, [useApi]);

  const latestProgress = useMemo(() => {
    if (!surahFilter) return null;
    return getProgressBySurah(surahFilter);
  }, [surahFilter, getProgressBySurah, readingProgress]);

  const filteredMock = useMemo(() => {
    let result = query.trim() ? searchVerses(query) : verses;
    if (surahFilter) result = result.filter((v) => v.surahNumber === surahFilter);
    return result;
  }, [query, surahFilter]);

  const apiSearchResults = useMemo(() => {
    if (!query.trim() || !apiSurah) return null;
    return searchQuran(allApiVersesRef.current, query);
  }, [query, apiSurah]);

  const displayVerses = useMemo(() => {
    if (searchResults) {
      return searchResults.map((r) => r.verse);
    }
    if (useApi && apiSurah) {
      return apiSurah.verses;
    }
    if (!useApi && surahFilter) {
      return filteredMock;
    }
    if (!useApi && query.trim()) {
      return filteredMock;
    }
    return [];
  }, [searchResults, useApi, apiSurah, filteredMock, surahFilter, query]);

  const juzVerses = useMemo(() => {
    if (viewMode !== "juz" || !apiSurah) return null;
    return apiSurah.verses.filter((v) => v.juz === selectedJuz);
  }, [viewMode, apiSurah, selectedJuz]);

  const juzGroupedVerses = useMemo(() => {
    if (viewMode !== "juz" || !apiSurah) return null;
    const groups: Record<number, QuranVerse[]> = {};
    for (const v of apiSurah.verses) {
      if (!groups[v.juz]) groups[v.juz] = [];
      groups[v.juz].push(v);
    }
    return groups;
  }, [viewMode, apiSurah]);

  const availableJuz = useMemo(() => {
    if (!apiSurah) return [];
    const juzSet = new Set(apiSurah.verses.map((v) => v.juz));
    return Array.from(juzSet).sort((a, b) => a - b);
  }, [apiSurah]);

  useEffect(() => {
    if (!useApi || !surahFilter) {
      setApiSurah(null);
      allApiVersesRef.current = [];
      return;
    }
    let cancelled = false;
    setLoadingSurah(true);
    getSurah(surahFilter).then((s) => {
      if (!cancelled) {
        setApiSurah(s);
        allApiVersesRef.current = s.verses;
        setLoadingSurah(false);
      }
    }).catch(() => {
      if (!cancelled) setLoadingSurah(false);
    });
    return () => { cancelled = true; };
  }, [useApi, surahFilter]);

  useEffect(() => {
    if (!apiSurah || !query.trim()) {
      setSearchResults(null);
      return;
    }
    const results = searchQuran(allApiVersesRef.current, query);
    setSearchResults(results.length > 0 ? results : null);
  }, [query, apiSurah]);

  const saveProgress = useCallback((surahNum: number, ayahNum: number) => {
    if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
    progressSaveTimer.current = setTimeout(() => {
      setProgressForSurah(surahNum, ayahNum, 0);
    }, 1500);
  }, [setProgressForSurah]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !surahFilter) return;

    const handleScroll = () => {
      const verseDivs = Array.from(verseRefs.current.entries());
      let closest: { key: string; top: number } | null = null;

      for (const [key, el] of verseDivs) {
        const rect = el.getBoundingClientRect();
        const top = Math.abs(rect.top - 100);
        if (!closest || top < closest.top) {
          closest = { key, top };
        }
      }

      if (closest) {
        const match = closest.key.match(/q-(\d+)-(\d+)/);
        if (match) {
          saveProgress(parseInt(match[1]), parseInt(match[2]));
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [surahFilter, saveProgress]);

  const scrollToVerse = (verseId: string) => {
    const el = verseRefs.current.get(verseId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyText = async (text: string) => {
    try {
      await copyToClipboard(text);
      toast(t("quran.copied"), "copy");
    } catch { /* silent */ }
  };

  const shareText = async (verse: { arabic: string; translation: string; surah: string; ayahNumber: number }) => {
    const text = `${verse.arabic}\n\n${verse.translation}\n\n— ${verse.surah} (${verse.ayahNumber})`;
    try {
      await shareContent(t("quran.quranVerse"), text);
    } catch {
      copyText(text);
    }
  };

  const handlePlayVerse = (surahNumber: number, ayahNumber: number) => {
    if (audio.isPlaying && audio.currentSurah === surahNumber && audio.currentAyah === ayahNumber) {
      audio.pause();
    } else {
      audio.play(surahNumber, ayahNumber);
    }
  };

  const handleBookmark = (verse: QuranVerse) => {
    const verseId = `q-${verse.ayahNumber}`;
    const existing = bookmarks.find((b) => b.verseId === verseId);
    if (existing) {
      removeBookmark(existing.id);
      toast(t("quran.bookmarkRemoved"), "info");
    } else {
      setBookmakingVerseId(verseId);
      setBookmarkNote("");
    }
  };

  const confirmBookmark = (verse: QuranVerse) => {
    const verseId = `q-${verse.ayahNumber}`;
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      verseId,
      surahNumber: verse.surahNumber,
      ayahNumber: verse.ayahNumber,
      arabic: verse.arabic,
      translation: verse.translation,
      note: bookmarkNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addBookmark(newBookmark);
    setBookmakingVerseId(null);
    setBookmarkNote("");
    toast(t("quran.bookmarked"), "favorite");
  };

  const handleCompare = async (verse: QuranVerse) => {
    const verseId = `q-${verse.ayahNumber}`;
    if (comparingVerseId === verseId) {
      setComparingVerseId(null);
      return;
    }
    setComparingVerseId(verseId);

    if (comparisonData[verseId]) return;

    try {
      const [asadRes, sahihRes] = await Promise.allSettled([
        fetch(`https://api.alquran.cloud/v1/ayah/${verse.ayahNumber}/en.asad`),
        fetch(`https://api.alquran.cloud/v1/ayah/${verse.ayahNumber}/en.sahih`),
      ]);

      const asad = asadRes.status === "fulfilled" && asadRes.value.ok
        ? (await asadRes.value.json()).data.text
        : undefined;
      const sahih = sahihRes.status === "fulfilled" && sahihRes.value.ok
        ? (await sahihRes.value.json()).data.text
        : undefined;

      setComparisonData((prev) => ({ ...prev, [verseId]: { asad, sahih } }));
    } catch {
      setComparisonData((prev) => ({ ...prev, [verseId]: {} }));
    }
  };

  const isBookmarked = (verseId: string) => bookmarks.some((b) => b.verseId === verseId);
  const getBookmark = (verseId: string) => bookmarks.find((b) => b.verseId === verseId);

  const getSurahInfo = (surahNumber: number) => {
    const name = SURAH_NAMES[surahNumber] || `Surah ${surahNumber}`;
    const arabicName = SURAH_NAMES_AR[surahNumber] || "";
    const ayahCount = SURAH_AYAH_COUNTS[surahNumber - 1] || 0;
    const isMakki = surahNumber % 2 === 1;
    return { name, arabicName, ayahCount, revelationType: isMakki ? "Makki" : "Madani" as const };
  };

  const VerseCard = ({ verse, index }: { verse: QuranVerse & { tafsir?: string }; index: number }) => {
    const verseId = `q-${verse.ayahNumber}`;
    const bookmarked = isBookmarked(verseId);
    const bookmark = getBookmark(verseId);
    const expanded = expandedId === verseId;
    const comparing = comparingVerseId === verseId;
    const isCurrentlyPlaying = audio.isPlaying && audio.currentSurah === verse.surahNumber && audio.currentAyah === verse.ayahNumber;
    const showBookmarkInput = bookmarkingVerseId === verseId;

    const setRef = useCallback((el: HTMLDivElement | null) => {
      if (el) verseRefs.current.set(verseId, el);
      else verseRefs.current.delete(verseId);
    }, [verseId]);

    return (
      <motion.div
        ref={setRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.02, 0.5) }}
        data-verse-id={verseId}
        className={`rounded-2xl border transition-all ${
          darkReader
            ? "bg-gray-900 border-gray-800"
            : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
        } ${isCurrentlyPlaying ? "ring-2 ring-emerald dark:ring-emerald-400" : ""}`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 px-3 py-1 rounded-full">
              {verse.ayahNumber}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePlayVerse(verse.surahNumber, verse.ayahNumber)}
                className={`p-2 rounded-xl transition-all active:scale-90 ${
                  isCurrentlyPlaying
                    ? "text-emerald bg-emerald/10"
                    : "text-gray-400 hover:text-emerald hover:bg-emerald/5"
                }`}
                title={t("quran.playAudio")}
              >
                {isCurrentlyPlaying ? (
                  <HiOutlinePause className="w-4 h-4" />
                ) : (
                  <HiOutlinePlay className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleBookmark(verse)}
                className={`p-2 rounded-xl transition-all active:scale-90 ${
                  bookmarked
                    ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "text-gray-400 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700"
                }`}
                title={bookmarked ? t("quran.removeBookmark") : t("quran.bookmarkVerse")}
              >
                <HiOutlineBookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => copyText(verse.arabic)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                title={t("quran.copyArabic")}
              >
                <HiOutlineClipboard className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareText(verse)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                title={t("quran.shareVerse")}
              >
                <HiOutlineShare className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCompare(verse)}
                className={`p-2 rounded-xl transition-all active:scale-90 ${
                  comparing
                    ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-400 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                }`}
                title={t("quran.compareTranslations")}
              >
                <HiOutlineDocumentText className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-right mb-4">
            <p className={`${fontSizeMap[fontSize]} leading-[2.2] text-gray-900 dark:text-white tracking-wider`}>
              {verse.arabic}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{verse.translation}</p>

          {bookmarked && bookmark?.note && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">{t("quran.note")}</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">{bookmark.note}</p>
            </div>
          )}

          <AnimatePresence>
            {showBookmarkInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2">{t("quran.addNote")}</p>
                  <textarea
                    value={bookmarkNote}
                    onChange={(e) => setBookmarkNote(e.target.value)}
                    placeholder={t("quran.notePlaceholder")}
                    className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-amber-300"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => confirmBookmark(verse)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors"
                    >
                      {t("quran.save")}
                    </button>
                    <button
                      onClick={() => { setBookmakingVerseId(null); setBookmarkNote(""); }}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t("quran.cancel")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {comparing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-3">{t("quran.translationComparison")}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("quran.asad")}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comparisonData[verseId]?.asad || (
                          <span className="text-gray-400 italic">{t("quran.loading")}</span>
                        )}
                      </p>
                    </div>
                    <div className="border-t border-blue-100 dark:border-blue-800/30 pt-3">
                      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t("quran.sahihInternational")}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comparisonData[verseId]?.sahih || (
                          <span className="text-gray-400 italic">{t("quran.loading")}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {verse.tafsir && (
            <>
              <button
                onClick={() => setExpandedId(expanded ? null : verseId)}
                className="flex items-center gap-1 mt-3 text-xs text-gray-400 hover:text-emerald transition-colors"
              >
                {expanded ? t("quran.hideTafsir") : t("quran.showTafsir")}
                {expanded ? <HiOutlineChevronUp className="w-3 h-3" /> : <HiOutlineChevronDown className="w-3 h-3" />}
              </button>
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 p-4 rounded-xl bg-cream dark:bg-gray-900/50">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t("quran.tafsir")}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{verse.tafsir}</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen pt-24 pb-32 px-4 transition-colors ${darkReader ? "bg-gray-950" : ""}`}>
      <div className="max-w-4xl mx-auto" ref={scrollContainerRef}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">{t("quran.pageTitle")}</h1>
              <p className="text-gray-500 dark:text-gray-400">{t("quran.pageSubtitle")}</p>
            </div>
            <button
              onClick={() => setUseApi(!useApi)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                useApi ? "bg-emerald text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}
            >
              {useApi ? t("quran.fullQuran") : t("quran.demoMode")}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {useApi && surahFilter && latestProgress && showContinueBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald/10 to-teal-50 dark:from-emerald/10 dark:to-emerald/5 border border-emerald/20 dark:border-emerald/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                    <HiOutlineBookOpen className="w-5 h-5 text-emerald dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">{t("quran.continueReading")}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Surah {SURAH_NAMES[surahFilter]}, Ayah {latestProgress.ayahNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const verseId = `q-${latestProgress.surahNumber}-${latestProgress.ayahNumber}`;
                      scrollToVerse(verseId);
                      setShowContinueBanner(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald text-white text-xs font-medium hover:bg-emerald/90 transition-colors"
                  >
                    {t("quran.resume")}
                  </button>
                  <button
                    onClick={() => setShowContinueBanner(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("quran.searchPlaceholder")}
                disabled={useApi && !surahFilter}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={surahFilter || ""}
                onChange={(e) => {
                  setSurahFilter(e.target.value ? Number(e.target.value) : null);
                  setQuery("");
                  setSearchResults(null);
                  setShowContinueBanner(true);
                  setComparingVerseId(null);
                  setBookmakingVerseId(null);
                }}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald/30 appearance-none cursor-pointer"
              >
                <option value="">{t("quran.allSurahs")}</option>
                {surahList.map((s) => (
                  <option key={s.number} value={s.number}>{s.number}. {s.name}</option>
                ))}
              </select>
              {useApi && surahFilter && (
                <div className="flex rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setViewMode("surah")}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      viewMode === "surah"
                        ? "bg-emerald text-white"
                        : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t("quran.surah")}
                  </button>
                  <button
                    onClick={() => setViewMode("juz")}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      viewMode === "juz"
                        ? "bg-emerald text-white"
                        : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t("quran.juz")}
                  </button>
                </div>
              )}
              {useApi && surahFilter && viewMode === "juz" && (
                <select
                  value={selectedJuz}
                  onChange={(e) => setSelectedJuz(Number(e.target.value))}
                  className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald/30 appearance-none cursor-pointer"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                    <option key={j} value={j}>Juz {j}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setFontSize((s) => s === "small" ? "medium" : s === "medium" ? "large" : "small")}
                className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlineBookOpen className="w-5 h-5 inline mr-1" />{fontSize}
              </button>
              <button
                onClick={() => setDarkReader(!darkReader)}
                className={`p-3 rounded-2xl border transition-colors ${
                  darkReader
                    ? "bg-emerald text-white border-emerald"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600"
                }`}
              >
                {darkReader ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {useApi && surahFilter && apiSurah && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-emerald dark:text-emerald-400">{apiSurah.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-dark dark:text-white">{apiSurah.englishName}</h2>
                  <span className="text-base text-emerald dark:text-emerald-400 font-arabic">{apiSurah.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{apiSurah.verses.length} {t("quran.ayahs")}</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">|</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    getSurahInfo(apiSurah.number).revelationType === "Makki"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                  }`}>
                    {getSurahInfo(apiSurah.number).revelationType}
                  </span>
                  {latestProgress && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("quran.lastRead")} {latestProgress.ayahNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {useApi && surahFilter && loadingSurah && (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">{t("quran.loadingApi")}</p>
          </div>
        )}

        {useApi && surahFilter && viewMode === "juz" && juzGroupedVerses && !loadingSurah && (
          <div className="space-y-6">
            {availableJuz
              .filter((j) => j === selectedJuz)
              .map((juz) => (
                <div key={juz}>
                  <div className="flex items-center gap-2 mb-3">
                    <HiOutlineViewList className="w-4 h-4 text-emerald dark:text-emerald-400" />
                    <h3 className="text-sm font-semibold text-dark dark:text-white">Juz {juz}</h3>
                    <span className="text-xs text-gray-400">
                      ({juzGroupedVerses[juz]?.length || 0} ayahs)
                    </span>
                  </div>
                  <div className="space-y-4">
                    {juzGroupedVerses[juz]?.map((v, i) => (
                      <VerseCard key={v.id} verse={v} index={i} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {useApi && surahFilter && viewMode === "surah" && apiSurah && !loadingSurah && (
          <div className="space-y-4">
            {apiSurah.verses.map((v, i) => (
              <VerseCard key={v.id} verse={v} index={i} />
            ))}
          </div>
        )}

        {!useApi && (
          <div className="space-y-4">
            {filteredMock.length > 0 ? (
              filteredMock.map((verse, i) => (
                <VerseCard
                  key={verse.id}
                  verse={{
                    id: verse.id,
                    surah: verse.surah,
                    surahNumber: verse.surahNumber,
                    ayahNumber: verse.ayahNumber,
                    arabic: verse.arabic,
                    translation: verse.translation,
                    juz: verse.juz || 0,
                    page: verse.page || 0,
                    tafsir: verse.tafsir,
                  }}
                  index={i}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400">{t("quran.noVerses")}</p>
              </div>
            )}
          </div>
        )}

        {useApi && !surahFilter && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineBookOpen className="w-8 h-8 text-emerald dark:text-emerald-400" />
            </div>
            <p className="text-gray-400 mb-2">{t("quran.selectSurah")}</p>
            <p className="text-xs text-gray-500">{t("quran.featuredSurahs")}</p>
          </div>
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
                    <span className="text-xs font-bold text-emerald dark:text-emerald-400">
                      {audio.currentAyah}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark dark:text-white truncate">
                      {SURAH_NAMES[audio.currentSurah] || `Surah ${audio.currentSurah}`} - Ayah {audio.currentAyah}
                    </p>
                    <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
                        style={{
                          width: audio.duration > 0
                            ? `${(audio.currentTime / audio.duration) * 100}%`
                            : "0%"
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
                      title={t("quran.previous")}
                    >
                      <HiOutlineRewind className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => audio.isPlaying ? audio.pause() : audio.play(audio.currentSurah, audio.currentAyah)}
                      className="w-10 h-10 rounded-full bg-emerald text-white flex items-center justify-center hover:bg-emerald/90 transition-colors shadow-lg shadow-emerald/20"
                      title={audio.isPlaying ? t("quran.pause") : t("quran.play")}
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
                      title={t("quran.next")}
                    >
                      <HiOutlineFastForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={audio.stop}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quran.stop")}
                    >
                      <HiOutlineStop className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowMiniPlayer(false)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t("quran.closePlayer")}
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

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
