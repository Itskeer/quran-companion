"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineEye,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineLibrary,
  HiOutlineMoon,
  HiOutlineVolumeUp,
  HiOutlineX,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineCog,
  HiOutlineSparkles,
} from "react-icons/hi";

interface ReadingMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  settings: ModeSettings;
}

interface ModeSettings {
  fontSize: number;
  autoScroll: boolean;
  sleepTimer: number;
  showTranslation: boolean;
  showTafsir: boolean;
}

const DEFAULT_SETTINGS: ModeSettings = {
  fontSize: 24,
  autoScroll: false,
  sleepTimer: 0,
  showTranslation: true,
  showTafsir: false,
};

const READING_MODES: ReadingMode[] = [
  {
    id: "focus",
    title: "Focus Mode",
    description: "Distraction-free reading. Just Quran text on screen.",
    icon: <HiOutlineEye className="w-8 h-8" />,
    gradient: "from-blue-500 to-blue-600",
    features: ["Full screen", "No distractions", "Press ESC to exit", "Custom font size"],
    settings: { ...DEFAULT_SETTINGS },
  },
  {
    id: "tilawah",
    title: "Tilawah Mode",
    description: "Beautiful Quran recitation experience with large Arabic text.",
    icon: <HiOutlineBookOpen className="w-8 h-8" />,
    gradient: "from-emerald-500 to-emerald-600",
    features: ["Large Arabic text", "Audio playback", "Auto-scroll", "Swipe navigation"],
    settings: { ...DEFAULT_SETTINGS, fontSize: 32, autoScroll: true },
  },
  {
    id: "study",
    title: "Study Mode",
    description: "Side-by-side Arabic, English, and Tafsir notes.",
    icon: <HiOutlineAcademicCap className="w-8 h-8" />,
    gradient: "from-amber-500 to-amber-600",
    features: ["Arabic + English", "Tafsir notes", "Verse-by-verse", "Bookmarks"],
    settings: { ...DEFAULT_SETTINGS, showTranslation: true, showTafsir: true },
  },
  {
    id: "memorization",
    title: "Memorization Mode",
    description: "Hifdh helper with progressive difficulty levels.",
    icon: <HiOutlineLibrary className="w-8 h-8" />,
    gradient: "from-purple-500 to-purple-600",
    features: ["Fill in blanks", "Progressive difficulty", "Track progress", "Spaced repetition"],
    settings: { ...DEFAULT_SETTINGS, fontSize: 28 },
  },
  {
    id: "bedtime",
    title: "Bedtime Mode",
    description: "Dark theme with large text and sleep timer.",
    icon: <HiOutlineMoon className="w-8 h-8" />,
    gradient: "from-indigo-600 to-indigo-700",
    features: ["Dark theme", "Sleep timer", "Blue light filter", "Large text"],
    settings: { ...DEFAULT_SETTINGS, fontSize: 28, sleepTimer: 30 },
  },
  {
    id: "commute",
    title: "Commute Mode",
    description: "Audio-only focus with simple controls.",
    icon: <HiOutlineVolumeUp className="w-8 h-8" />,
    gradient: "from-orange-500 to-orange-600",
    features: ["Audio only", "Simple controls", "Background play", "Queue management"],
    settings: { ...DEFAULT_SETTINGS },
  },
];

const SAMPLE_VERSES = [
  { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", english: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "All praise is due to Allah, Lord of the worlds." },
  { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", english: "The Entirely Merciful, the Especially Merciful." },
  { arabic: "مَالِكِ يَوْمِ الدِّينِ", english: "Sovereign of the Day of Recompense." },
  { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "It is You we worship and You we ask for help." },
  { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", english: "Guide us to the straight path." },
  { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." },
];

export default function ReadingModesPage() {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, ModeSettings>>({});
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [memorizationLevel, setMemorizationLevel] = useState(1);
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());
  const [sleepTimerActive, setSleepTimerActive] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-reading-modes");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSettings(data.settings || {});
        setMemorizationLevel(data.memorizationLevel || 1);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const data = { settings, memorizationLevel };
    localStorage.setItem("quran-companion-reading-modes", JSON.stringify(data));
  }, [settings, memorizationLevel]);

  const updateSettings = useCallback(
    (modeId: string, key: keyof ModeSettings, value: number | boolean) => {
      setSettings((prev) => ({
        ...prev,
        [modeId]: {
          ...(prev[modeId] || DEFAULT_SETTINGS),
          [key]: value,
        },
      }));
    },
    []
  );

  const getSettings = (modeId: string): ModeSettings => {
    return settings[modeId] || DEFAULT_SETTINGS;
  };

  const nextVerse = () => {
    setCurrentVerseIndex((prev) =>
      prev < SAMPLE_VERSES.length - 1 ? prev + 1 : prev
    );
  };

  const prevVerse = () => {
    setCurrentVerseIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const toggleWordReveal = (wordIndex: number) => {
    setRevealedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordIndex)) {
        newSet.delete(wordIndex);
      } else {
        newSet.add(wordIndex);
      }
      return newSet;
    });
  };

  const resetMemorization = () => {
    setRevealedWords(new Set());
  };

  const hideWords = (text: string, level: number): string[] => {
    const words = text.split(" ");
    const blankRatio = Math.min(0.8, level * 0.15);
    return words.map((word, i) => {
      const shouldHide = (i + 1) % Math.max(1, Math.round(1 / blankRatio)) === 0;
      return shouldHide && !revealedWords.has(i) ? "___" : word;
    });
  };

  useEffect(() => {
    if (activeMode) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setActiveMode(null);
        }
        if (e.key === "ArrowRight") {
          nextVerse();
        }
        if (e.key === "ArrowLeft") {
          prevVerse();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeMode]);

  const renderModePreview = (mode: ReadingMode) => {
    const modeSettings = getSettings(mode.id);

    switch (mode.id) {
      case "focus":
        return (
          <div className="bg-blue-900/30 rounded-xl p-4 text-center">
            <p className="text-blue-100 text-lg leading-relaxed">
              {SAMPLE_VERSES[0].arabic}
            </p>
            {modeSettings.showTranslation && (
              <p className="text-blue-300/70 text-sm mt-2">
                {SAMPLE_VERSES[0].english}
              </p>
            )}
          </div>
        );
      case "tilawah":
        return (
          <div className="bg-emerald-900/30 rounded-xl p-6 text-center">
            <p className="text-emerald-100 text-3xl leading-relaxed" dir="rtl">
              {SAMPLE_VERSES[0].arabic}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="p-2 bg-emerald-700/50 rounded-full text-emerald-200">
                <HiOutlineVolumeUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case "study":
        return (
          <div className="bg-amber-900/30 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-amber-100 text-xl" dir="rtl">
                  {SAMPLE_VERSES[0].arabic}
                </p>
              </div>
              <div>
                <p className="text-amber-200 text-sm">
                  {SAMPLE_VERSES[0].english}
                </p>
                <p className="text-amber-400/60 text-xs mt-2">
                  Tafsir: This is the opening verse of Surah Al-Fatihah...
                </p>
              </div>
            </div>
          </div>
        );
      case "memorization":
        const words = hideWords(SAMPLE_VERSES[0].arabic, memorizationLevel);
        return (
          <div className="bg-purple-900/30 rounded-xl p-4 text-center">
            <p className="text-purple-100 text-xl leading-relaxed" dir="rtl">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`mx-1 ${
                    word === "___"
                      ? "text-purple-400 underline decoration-dotted"
                      : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              {words.map((word, i) =>
                word === "___" ? (
                  <button
                    key={i}
                    onClick={() => toggleWordReveal(i)}
                    className="w-8 h-8 rounded bg-purple-700/50 text-purple-200 text-xs"
                  >
                    {revealedWords.has(i)
                      ? SAMPLE_VERSES[0].arabic.split(" ")[i]
                      : "?"}
                  </button>
                ) : null
              )}
            </div>
          </div>
        );
      case "bedtime":
        return (
          <div className="bg-indigo-950 rounded-xl p-6 text-center">
            <p className="text-indigo-100 text-2xl leading-relaxed" dir="rtl">
              {SAMPLE_VERSES[0].arabic}
            </p>
            <p className="text-indigo-300/60 text-sm mt-3">
              Sleep timer: {modeSettings.sleepTimer} min
            </p>
          </div>
        );
      case "commute":
        return (
          <div className="bg-orange-900/30 rounded-xl p-4 text-center">
            <div className="w-16 h-16 bg-orange-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiOutlineVolumeUp className="w-8 h-8 text-orange-200" />
            </div>
            <p className="text-orange-100 text-sm">Audio playing...</p>
            <div className="flex justify-center gap-3 mt-3">
              <button className="p-2 bg-orange-700/50 rounded-full text-orange-200">
                <HiOutlinePlay className="w-4 h-4" />
              </button>
              <button className="p-2 bg-orange-700/50 rounded-full text-orange-200">
                <HiOutlineStop className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderModeSettings = (mode: ReadingMode) => {
    const modeSettings = getSettings(mode.id);

    return (
      <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
        <h4 className="text-white/80 text-sm font-medium flex items-center gap-2">
          <HiOutlineCog className="w-4 h-4" /> {t("reading.settings")}
        </h4>

        <div>
          <label className="text-white/60 text-xs mb-1 block">
            {t("reading.fontSize")}: {modeSettings.fontSize}px
          </label>
          <input
            type="range"
            min="16"
            max="48"
            value={modeSettings.fontSize}
            onChange={(e) =>
              updateSettings(mode.id, "fontSize", parseInt(e.target.value))
            }
            className="w-full accent-white/50"
          />
        </div>

        {(mode.id === "tilawah" || mode.id === "focus") && (
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">{t("reading.autoScroll")}</span>
            <button
              onClick={() =>
                updateSettings(mode.id, "autoScroll", !modeSettings.autoScroll)
              }
              className={`w-10 h-6 rounded-full transition-colors ${
                modeSettings.autoScroll ? "bg-white/30" : "bg-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  modeSettings.autoScroll ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {mode.id === "bedtime" && (
          <div>
            <label className="text-white/60 text-xs mb-1 block">
              {t("reading.sleepTimer")}: {modeSettings.sleepTimer} min
            </label>
            <div className="flex gap-2">
              {[0, 15, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => updateSettings(mode.id, "sleepTimer", min)}
                  className={`flex-1 py-1 rounded text-xs transition-colors ${
                    modeSettings.sleepTimer === min
                      ? "bg-white/30 text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {min === 0 ? "Off" : `${min}m`}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode.id === "memorization" && (
          <div>
            <label className="text-white/60 text-xs mb-1 block">
              {t("reading.difficultyLevel")}: {memorizationLevel}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setMemorizationLevel(level)}
                  className={`flex-1 py-1 rounded text-xs transition-colors ${
                    memorizationLevel === level
                      ? "bg-white/30 text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  L{level}
                </button>
              ))}
            </div>
          </div>
        )}

        {(mode.id === "study" || mode.id === "focus") && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">{t("reading.showTranslation")}</span>
              <button
                onClick={() =>
                  updateSettings(
                    mode.id,
                    "showTranslation",
                    !modeSettings.showTranslation
                  )
                }
                className={`w-10 h-6 rounded-full transition-colors ${
                  modeSettings.showTranslation ? "bg-white/30" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    modeSettings.showTranslation ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {mode.id === "study" && (
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">{t("reading.showTafsir")}</span>
                <button
                  onClick={() =>
                    updateSettings(mode.id, "showTafsir", !modeSettings.showTafsir)
                  }
                  className={`w-10 h-6 rounded-full transition-colors ${
                    modeSettings.showTafsir ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      modeSettings.showTafsir ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderFullScreenMode = () => {
    if (!activeMode) return null;

    const mode = READING_MODES.find((m) => m.id === activeMode);
    if (!mode) return null;

    const modeSettings = getSettings(mode.id);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex flex-col ${
          mode.id === "bedtime"
            ? "bg-indigo-950"
            : mode.id === "focus"
            ? "bg-gray-900"
            : mode.id === "tilawah"
            ? "bg-gradient-to-b from-emerald-950 to-gray-900"
            : mode.id === "study"
            ? "bg-gradient-to-b from-amber-950 to-gray-900"
            : mode.id === "memorization"
            ? "bg-gradient-to-b from-purple-950 to-gray-900"
            : "bg-gradient-to-b from-orange-950 to-gray-900"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-white font-semibold">{mode.title}</h2>
          <button
            onClick={() => setActiveMode(null)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 overflow-hidden">
          {mode.id === "memorization" ? (
            <div className="text-center max-w-2xl">
              <p
                className="text-white leading-relaxed mb-6"
                style={{ fontSize: `${modeSettings.fontSize}px` }}
                dir="rtl"
              >
                {hideWords(SAMPLE_VERSES[currentVerseIndex].arabic, memorizationLevel).map(
                  (word, i) => (
                    <span
                      key={i}
                      className={`mx-1 ${
                        word === "___"
                          ? "text-purple-400 underline decoration-dotted cursor-pointer hover:text-purple-300"
                          : ""
                      }`}
                      onClick={() => word === "___" && toggleWordReveal(i)}
                    >
                      {word === "___"
                        ? revealedWords.has(i)
                          ? SAMPLE_VERSES[currentVerseIndex].arabic.split(" ")[i]
                          : "___"
                        : word}
                    </span>
                  )
                )}
              </p>
              {modeSettings.showTranslation && (
                <p className="text-white/60 text-lg">
                  {SAMPLE_VERSES[currentVerseIndex].english}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center max-w-2xl">
              <p
                className="text-white leading-relaxed mb-6"
                style={{ fontSize: `${modeSettings.fontSize}px` }}
                dir="rtl"
              >
                {SAMPLE_VERSES[currentVerseIndex].arabic}
              </p>
              {modeSettings.showTranslation && (
                <p className="text-white/70 text-lg mb-4">
                  {SAMPLE_VERSES[currentVerseIndex].english}
                </p>
              )}
              {mode.id === "study" && modeSettings.showTafsir && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl text-left">
                  <p className="text-white/50 text-sm">
                    Tafsir: This verse is from Surah Al-Fatihah, the opening
                    chapter of the Holy Quran. It is recited in every unit of
                    prayer and is considered one of the most important verses.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 flex items-center justify-between">
          <button
            onClick={prevVerse}
            disabled={currentVerseIndex === 0}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
          >
            <HiOutlineChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            {mode.id === "tilawah" && (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <HiOutlinePause className="w-8 h-8" />
                  ) : (
                    <HiOutlinePlay className="w-8 h-8" />
                  )}
                </button>
                <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <HiOutlineVolumeUp className="w-6 h-6" />
                </button>
              </>
            )}

            {mode.id === "commute" && (
              <div className="flex items-center gap-4">
                <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <HiOutlineRefresh className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <HiOutlinePause className="w-8 h-8" />
                  ) : (
                    <HiOutlinePlay className="w-8 h-8" />
                  )}
                </button>
                <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <HiOutlineStop className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={nextVerse}
            disabled={currentVerseIndex === SAMPLE_VERSES.length - 1}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
          >
            <HiOutlineChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center pb-4">
          <p className="text-white/40 text-xs">
            {currentVerseIndex + 1} / {SAMPLE_VERSES.length}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <HiOutlineSparkles className="w-8 h-8 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("reading.title")}
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
          {t("reading.chooseMode")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {READING_MODES.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${mode.gradient} p-6 text-white`}>
              <div className="flex items-center gap-3 mb-2">
                {mode.icon}
                <h2 className="text-xl font-semibold">{mode.title}</h2>
              </div>
              <p className="text-white/80 text-sm">{mode.description}</p>
            </div>

            <div className="p-6">
              {renderModePreview(mode)}

              <ul className="mt-4 space-y-2">
                {mode.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <HiOutlineCheck className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {renderModeSettings(mode)}

              <button
                onClick={() => setActiveMode(mode.id)}
                className={`w-full mt-6 py-3 rounded-xl bg-gradient-to-r ${mode.gradient} text-white font-semibold hover:opacity-90 transition-opacity`}
              >
                {t("reading.start")} {mode.title}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>{renderFullScreenMode()}</AnimatePresence>
    </div>
  );
}
