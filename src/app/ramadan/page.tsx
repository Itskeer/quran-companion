"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineStar,
  HiOutlineHeart,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineX,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const RAMADAN_DAILY_CONTENT = [
  "The month of mercy begins. Start with a pure intention.",
  "Patience is the key to Jannah. Be patient today.",
  "Give charity today, even if it's small.",
  "The Quran was revealed in this blessed month. Read a page today.",
  "Your sins can be forgiven. Make sincere repentance.",
  "Feed a fasting person and share in their reward.",
  "Increase your dhikr today. SubhanAllah, Alhamdulillah, Allahu Akbar.",
  "Forgive those who have wronged you.",
  "Make dua for others and Allah will answer yours.",
  "Laylatul Qadr is better than a thousand months. Seek it.",
  "Be generous to your family today.",
  "Pray the night prayer. Even two rak'ahs.",
  "Share knowledge with someone today.",
  "Be kind to your neighbors.",
  "Avoid backbiting. Guard your tongue.",
  "Give water to a fasting person for Iftar.",
  "Read the Quran with understanding.",
  "Help someone in need today.",
  "Make istighfar abundantly. seeking forgiveness.",
  "Reflect on Allah's blessings upon you.",
  "Be the best version of yourself.",
  "Strengthen your ties of kinship.",
  "Donate to the poor and needy.",
  "Reflect on the meaning of La ilaha illallah.",
  "Pray for the Ummah today.",
  "Increase your charity in these last days.",
  "The gates of Jannah are open. Earn your place.",
  "Laylatul Qadr may be tonight. Pray with sincerity.",
  "Be grateful for every moment of worship.",
  "Make your intention pure for Allah alone.",
  "Prepare for Eid with joy and gratitude.",
  "The month of Quran is ending. Continue your connection.",
  "Fast with your eyes, tongue, and limbs.",
  "Seek Allah's mercy before the month ends.",
  "Make dua to witness another Ramadan.",
  "Give your best in these final days.",
  "The night of decree is near. Don't miss it.",
  "Allah's mercy is boundless. Turn to Him.",
  "Complete your Quran reading goal.",
  "Thank Allah for the opportunity to fast.",
];

const RAMADAN_DUAS = [
  {
    arabic: "اللَّهُمَّ بَلِّغْنَا رَمَضَانَ",
    english: "O Allah, let me reach Ramadan",
    benefit: "To be blessed with witnessing Ramadan",
  },
  {
    arabic: "اللَّهُمَّ تَقَبَّلْ صِيَامِي",
    english: "O Allah, accept my fasting",
    benefit: "For acceptance of worship",
  },
  {
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي",
    english: "O Allah, forgive my sins",
    benefit: "For forgiveness of sins",
  },
  {
    arabic: "اللَّهُمَّ اجْعَلْنَا مِنَ الْمُقَبَّلِينَ",
    english: "O Allah, make us among those who are accepted",
    benefit: "To be among the accepted servants",
  },
  {
    arabic: "اللَّهُمَّ ادْخِلْنِي جَنَّتَكَ مَعَ الْأَبْرَارِ",
    english: "O Allah, admit me to Paradise with the righteous",
    benefit: "For Paradise in the hereafter",
  },
  {
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    english: "O Allah, protect me from the Hellfire",
    benefit: "For protection from punishment",
  },
  {
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي رَمَضَانَ",
    english: "O Allah, bless us in Ramadan",
    benefit: "For blessings in the month",
  },
  {
    arabic: "اللَّهُمَّ زِدْنَا إِيمَانًا وَيَقِينًا",
    english: "O Allah, increase us in faith and certainty",
    benefit: "For strengthening faith",
  },
  {
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ",
    english: "O Allah, guide me to the truth in matters of dispute",
    benefit: "For guidance in matters of disagreement",
  },
  {
    arabic: "اللَّهُمَّ اجْعَلْ خَيْرَ أَعْمَالِنَا آخِرَهَا وَخَيْرَ أَيَّامِنَا يَوْمَ نَلْقَاكَ",
    english: "O Allah, make the best of our deeds their last and the best of our days the day we meet You",
    benefit: "For a good ending",
  },
];

const CATEGORIES = ["All", "Worship", "Charity", "Patience", "Gratitude", "Dua"];

interface LaylatulQadrTracker {
  [key: number]: boolean;
}

interface SadaqahEntry {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export default function RamadanPage() {
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState(1);
  const [laylatulQadr, setLaylatulQadr] = useState<LaylatulQadrTracker>({});
  const [sadaqahEntries, setSadaqahEntries] = useState<SadaqahEntry[]>([]);
  const [sadaqahAmount, setSadaqahAmount] = useState("");
  const [sadaqahDesc, setSadaqahDesc] = useState("");
  const [quranProgress, setQuranProgress] = useState(0);
  const [goodDeeds, setGoodDeeds] = useState(0);
  const [openDuaIndex, setOpenDuaIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [nextRamadanDate, setNextRamadanDate] = useState<Date | null>(null);
  const [daysUntilRamadan, setDaysUntilRamadan] = useState<number | null>(null);
  const [isInRamadan, setIsInRamadan] = useState(false);
  const [ramadanDay, setRamadanDay] = useState(0);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    const ramadanStart = new Date(year, 1, 28);
    const ramadanEnd = new Date(year, 2, 29);

    if (today >= ramadanStart && today <= ramadanEnd) {
      setIsInRamadan(true);
      const diffTime = today.getTime() - ramadanStart.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setRamadanDay(Math.min(diffDays, 30));
    } else if (today < ramadanStart) {
      const diffTime = ramadanStart.getTime() - today.getTime();
      setDaysUntilRamadan(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      const nextYear = year + 1;
      const nextStart = new Date(nextYear, 1, 28);
      const diffTime = nextStart.getTime() - today.getTime();
      setDaysUntilRamadan(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-ramadan");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setLaylatulQadr(data.laylatulQadr || {});
        setSadaqahEntries(data.sadaqahEntries || []);
        setQuranProgress(data.quranProgress || 0);
        setGoodDeeds(data.goodDeeds || 0);
        setCurrentDay(data.currentDay || 1);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const data = {
      laylatulQadr,
      sadaqahEntries,
      quranProgress,
      goodDeeds,
      currentDay,
    };
    localStorage.setItem("quran-companion-ramadan", JSON.stringify(data));
  }, [laylatulQadr, sadaqahEntries, quranProgress, goodDeeds, currentDay]);

  const toggleLaylatulQadr = (night: number) => {
    setLaylatulQadr((prev) => ({
      ...prev,
      [night]: !prev[night],
    }));
  };

  const addSadaqah = () => {
    if (!sadaqahAmount || parseFloat(sadaqahAmount) <= 0) return;
    const newEntry: SadaqahEntry = {
      id: Date.now(),
      amount: parseFloat(sadaqahAmount),
      description: sadaqahDesc || "Sadaqah",
      date: new Date().toLocaleDateString(),
    };
    setSadaqahEntries((prev) => [...prev, newEntry]);
    setSadaqahAmount("");
    setSadaqahDesc("");
  };

  const removeSadaqah = (id: number) => {
    setSadaqahEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const incrementGoodDeeds = () => {
    setGoodDeeds((prev) => prev + 1);
  };

  const decrementGoodDeeds = () => {
    setGoodDeeds((prev) => Math.max(0, prev - 1));
  };

  const incrementQuranProgress = () => {
    setQuranProgress((prev) => Math.min(30, prev + 1));
  };

  const decrementQuranProgress = () => {
    setQuranProgress((prev) => Math.max(0, prev - 1));
  };

  const totalSadaqah = sadaqahEntries.reduce((sum, e) => sum + e.amount, 0);

  const daysPrayed = Object.values(laylatulQadr).filter(Boolean).length;

  const contentForDay = RAMADAN_DAILY_CONTENT[currentDay - 1] || RAMADAN_DAILY_CONTENT[0];

  const shareContent = (text: string) => {
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-4xl font-bold text-emerald-100 mb-2">
            {t("ramadan.mubarak")}
          </h1>
          <p className="text-emerald-300/80 text-lg">
            {t("ramadan.acceptPrayer")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-900/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50 text-center"
        >
          {isInRamadan ? (
            <div>
              <p className="text-emerald-300/80 text-sm mb-1">{t("ramadan.currentlyInRamadan")}</p>
              <p className="text-4xl font-bold text-emerald-100">
                {t("ramadan.dayCount")} {ramadanDay} {t("ramadan.of30")}
              </p>
              <div className="w-full bg-emerald-800/50 rounded-full h-3 mt-4">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-3 rounded-full transition-all"
                  style={{ width: `${(ramadanDay / 30) * 100}%` }}
                />
              </div>
              <p className="text-emerald-400/60 text-xs mt-2">
                {30 - ramadanDay} {t("ramadan.daysRemaining")}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-emerald-300/80 text-sm mb-1">{t("ramadan.nextRamadanIn")}</p>
              <p className="text-4xl font-bold text-emerald-100">
                {daysUntilRamadan} {t("ramadan.days")}
              </p>
              <p className="text-emerald-400/60 text-xs mt-2">
                {t("ramadan.prepareHeart")}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5" />
              {t("ramadan.dailyContent")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDay((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50 transition-colors"
              >
                <HiOutlineMinus className="w-4 h-4" />
              </button>
              <span className="text-emerald-200 text-sm font-medium w-16 text-center">
                {t("ramadan.dayCount")} {currentDay}
              </span>
              <button
                onClick={() => setCurrentDay((p) => Math.min(30, p + 1))}
                className="p-2 rounded-lg bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50 transition-colors"
              >
                <HiOutlinePlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-emerald-900/30 rounded-xl p-6 text-center">
            <p className="text-3xl mb-3">📖</p>
            <p className="text-emerald-100 text-lg leading-relaxed">
              {contentForDay}
            </p>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mt-4">
            {Array.from({ length: 30 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentDay(i + 1)}
                className={`w-full aspect-square rounded-lg text-xs font-medium transition-all ${
                  currentDay === i + 1
                    ? "bg-emerald-500 text-white"
                    : i + 1 <= ramadanDay
                    ? "bg-emerald-700/50 text-emerald-200"
                    : "bg-emerald-900/30 text-emerald-400/50 hover:bg-emerald-800/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
        >
          <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
            <HiOutlineStar className="w-5 h-5 text-yellow-400" />
            {t("ramadan.laylatulQadr")}
          </h2>
          <p className="text-emerald-300/70 text-sm mb-4">
            {t("ramadan.markNights")}
          </p>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }, (_, i) => {
              const night = i + 21;
              const isOdd = night % 2 !== 0;
              return (
                <button
                  key={night}
                  onClick={() => toggleLaylatulQadr(night)}
                  className={`relative p-4 rounded-xl text-center transition-all ${
                    laylatulQadr[night]
                      ? "bg-yellow-500/20 border-2 border-yellow-400 text-yellow-200"
                      : isOdd
                      ? "bg-emerald-800/30 border-2 border-emerald-600/50 text-emerald-300"
                      : "bg-emerald-900/20 border-2 border-emerald-800/30 text-emerald-400/50"
                  }`}
                >
                  {laylatulQadr[night] && (
                    <HiOutlineCheck className="absolute top-1 right-1 w-4 h-4 text-yellow-400" />
                  )}
                  <p className="text-sm font-bold">{night}</p>
                  {isOdd && (
                    <p className="text-[10px] text-yellow-400/80 mt-1">⭐</p>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-emerald-400/60 text-xs mt-4 text-center">
            {daysPrayed} {t("ramadan.nightsPrayed")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
          >
            <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
              <HiOutlineBookOpen className="w-5 h-5" />
              {t("ramadan.quranGoal")}
            </h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-100">
                {quranProgress}/30
              </p>
              <p className="text-emerald-300/70 text-sm mb-3">{t("ramadan.juzCompleted")}</p>
              <div className="w-full bg-emerald-800/50 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-4 rounded-full transition-all"
                  style={{ width: `${(quranProgress / 30) * 100}%` }}
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={decrementQuranProgress}
                  className="p-2 rounded-lg bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50 transition-colors"
                >
                  <HiOutlineMinus className="w-4 h-4" />
                </button>
                <button
                  onClick={incrementQuranProgress}
                  className="p-2 rounded-lg bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50 transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
          >
            <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
              <HiOutlineHeart className="w-5 h-5 text-red-400" />
              {t("ramadan.goodDeedsCounter")}
            </h2>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-100">{goodDeeds}</p>
              <p className="text-emerald-300/70 text-sm mb-3">{t("ramadan.goodDeedsLabel")}</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={decrementGoodDeeds}
                  className="p-3 rounded-xl bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50 transition-colors"
                >
                  <HiOutlineMinus className="w-6 h-6" />
                </button>
                <button
                  onClick={incrementGoodDeeds}
                  className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
                >
                  <HiOutlinePlus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
        >
          <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
            <HiOutlineCurrencyDollar className="w-5 h-5 text-green-400" />
            {t("ramadan.sadaqahTracker")}
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="number"
              placeholder={t("ramadan.amount")}
              value={sadaqahAmount}
              onChange={(e) => setSadaqahAmount(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-600/50 bg-emerald-900/30 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 transition-colors placeholder:text-emerald-500/50"
            />
            <input
              type="text"
              placeholder={t("ramadan.descLabel")}
              value={sadaqahDesc}
              onChange={(e) => setSadaqahDesc(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-600/50 bg-emerald-900/30 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 transition-colors placeholder:text-emerald-500/50"
            />
            <button
              onClick={addSadaqah}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mb-4 p-4 bg-emerald-800/30 rounded-xl">
            <p className="text-emerald-300/70 text-sm">{t("ramadan.totalSadaqah")}</p>
            <p className="text-2xl font-bold text-emerald-100">
              ${totalSadaqah.toFixed(2)}
            </p>
          </div>
          {sadaqahEntries.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sadaqahEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg"
                >
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">
                      ${entry.amount.toFixed(2)} - {entry.description}
                    </p>
                    <p className="text-emerald-400/60 text-xs">{entry.date}</p>
                  </div>
                  <button
                    onClick={() => removeSadaqah(entry.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-emerald-400 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30"
        >
          <h2 className="text-lg font-semibold text-emerald-100 flex items-center gap-2 mb-4">
            <HiOutlineDocumentText className="w-5 h-5" />
            {t("ramadan.duas")}
          </h2>
          <div className="space-y-3">
            {RAMADAN_DUAS.map((dua, index) => (
              <div key={index} className="bg-emerald-900/30 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setOpenDuaIndex(openDuaIndex === index ? null : index)
                  }
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <p className="text-emerald-100 font-medium">{dua.english}</p>
                    <p className="text-emerald-400/60 text-xs mt-1">{dua.benefit}</p>
                  </div>
                  {openDuaIndex === index ? (
                    <HiOutlineChevronUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <HiOutlineChevronDown className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openDuaIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-2xl text-emerald-100 text-center leading-relaxed" dir="rtl">
                          {dua.arabic}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => shareContent(`${dua.arabic}\n\n${dua.english}`)}
                            className="flex-1 py-2 rounded-lg bg-emerald-800/50 text-emerald-200 text-sm hover:bg-emerald-700/50 transition-colors"
                          >
                            {t("ramadan.share")}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(dua.arabic);
                            }}
                            className="flex-1 py-2 rounded-lg bg-emerald-800/50 text-emerald-200 text-sm hover:bg-emerald-700/50 transition-colors"
                          >
                            {t("ramadan.copyArabic")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-center py-8"
        >
          <p className="text-emerald-300/60 text-sm italic">
            &ldquo;The month of Ramadan is that in which the Quran was revealed,
            a guidance for the people and clear proofs of guidance and criterion.&rdquo;
          </p>
          <p className="text-emerald-400/40 text-xs mt-2">Quran 2:185</p>
        </motion.div>
      </div>
    </div>
  );
}
