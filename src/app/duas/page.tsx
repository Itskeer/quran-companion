"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { duas, duaCategories, searchDuas } from "@/data/duas";
import { useApp } from "@/context/AppProviders";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/i18n/useTranslation";
import { Dua, CustomDua } from "@/types";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineClipboard,
  HiOutlinePlay,
  HiOutlineShare,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineBookOpen,
  HiOutlineStar,
  HiOutlineTrash,
} from "react-icons/hi";

type Tab = "all" | "favorites" | "custom" | "learn";

function getDuaOfDay(): Dua {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return duas[seed % duas.length];
}

const playDuaAudio = (arabic: string) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(arabic);
  utterance.lang = "ar-SA";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

const shareDuaAsImage = async (dua: Dua | CustomDua) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, 1920);
  grad.addColorStop(0, "#0F5132");
  grad.addColorStop(1, "#064E3B");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 60;
  patternCanvas.height = 60;
  const pctx = patternCanvas.getContext("2d")!;
  pctx.strokeStyle = "rgba(255,255,255,0.05)";
  pctx.lineWidth = 1;
  pctx.beginPath();
  pctx.arc(30, 30, 20, 0, Math.PI * 2);
  pctx.stroke();
  const pattern = ctx.createPattern(patternCanvas, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, 1080, 1920);
  }

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(540, 300, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "120px serif";
  ctx.textAlign = "center";
  ctx.fillText("﷽", 540, 320);

  const wrapArabicText = (text: string, maxWidth: number, fontSize: number): string[] => {
    ctx.font = `${fontSize}px serif`;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const arabicLines = wrapArabicText(dua.arabic, 900, 48);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "48px serif";
  ctx.textAlign = "center";

  const arabicStartY = 450;
  const arabicLineHeight = 72;
  for (let i = 0; i < arabicLines.length; i++) {
    ctx.fillText(arabicLines[i], 540, arabicStartY + i * arabicLineHeight);
  }

  const translationStartY = arabicStartY + arabicLines.length * arabicLineHeight + 60;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "28px sans-serif";

  const wrapTranslation = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const transLines = wrapTranslation(dua.translation, 800);
  for (let i = 0; i < transLines.length; i++) {
    ctx.fillText(transLines[i], 540, translationStartY + i * 38);
  }

  const sourceY = translationStartY + transLines.length * 38 + 40;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "italic 24px sans-serif";
  const duaSource = "source" in dua ? dua.source : "Custom Dua";
  ctx.fillText(`— ${duaSource}`, 540, sourceY);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("Quran Companion", 540, 1850);

  const dividerGrad = ctx.createLinearGradient(340, sourceY + 30, 740, sourceY + 30);
  dividerGrad.addColorStop(0, "rgba(255,255,255,0)");
  dividerGrad.addColorStop(0.5, "rgba(255,255,255,0.3)");
  dividerGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = dividerGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(340, sourceY + 30);
  ctx.lineTo(740, sourceY + 30);
  ctx.stroke();

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );
  const file = new File([blob], "dua.png", { type: "image/png" });
  if (navigator.share) {
    try {
      await navigator.share({ files: [file] });
    } catch {}
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dua.png";
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default function DuasPage() {
  const { t } = useTranslation();
  usePageTitle(t("duas.title"));
  const { toast } = useToast();
  const {
    duaFavorites,
    toggleDuaFavorite,
    isDuaFavorited,
    customDuas,
    addCustomDua,
    removeCustomDua,
    duaReminders,
    addDuaReminder,
    removeDuaReminder,
    duaLearning,
    updateDuaLearning,
  } = useApp();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReminderFor, setShowReminderFor] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState("08:00");

  const [newDuaArabic, setNewDuaArabic] = useState("");
  const [newDuaTranslation, setNewDuaTranslation] = useState("");
  const [newDuaTransliteration, setNewDuaTransliteration] = useState("");
  const [newDuaNotes, setNewDuaNotes] = useState("");
  const [newDuaCategory, setNewDuaCategory] = useState("Forgiveness");

  const [learnIndex, setLearnIndex] = useState(0);
  const [learnInput, setLearnInput] = useState("");
  const [learnRevealed, setLearnRevealed] = useState(false);

  const [duaCounts, setDuaCounts] = useState<Record<string, number>>({});

  const duaOfDay = useMemo(() => getDuaOfDay(), []);

  const filtered = useMemo(() => {
    let results: (Dua | CustomDua)[] = [...duas];

    if (activeTab === "favorites") {
      const favIds = duaFavorites.map((f) => f.duaId);
      results = results.filter((d) => favIds.includes(d.id));
    } else if (activeTab === "custom") {
      results = [...customDuas];
    }

    if (activeCategory && activeTab !== "custom") {
      results = results.filter((d) => "category" in d && d.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) =>
          d.arabic.includes(query) ||
          d.translation.toLowerCase().includes(q) ||
          ("source" in d && d.source.toLowerCase().includes(q)) ||
          ("category" in d && d.category.toLowerCase().includes(q))
      );
    }

    return results;
  }, [query, activeCategory, activeTab, duaFavorites, customDuas]);

  const handleCreateDua = useCallback(() => {
    if (!newDuaArabic.trim() || !newDuaTranslation.trim()) {
      toast(t("duas.fillFields"), "info");
      return;
    }
    const newDua: CustomDua = {
      id: `custom-dua-${Date.now()}`,
      arabic: newDuaArabic.trim(),
      translation: newDuaTranslation.trim(),
      transliteration: newDuaTransliteration.trim() || undefined,
      notes: newDuaNotes.trim() || undefined,
      category: newDuaCategory,
      createdAt: new Date().toISOString(),
    };
    addCustomDua(newDua);
    setNewDuaArabic("");
    setNewDuaTranslation("");
    setNewDuaTransliteration("");
    setNewDuaNotes("");
    setShowCreateForm(false);
    toast(t("duas.saved"), "success");
  }, [newDuaArabic, newDuaTranslation, newDuaTransliteration, newDuaNotes, newDuaCategory, addCustomDua, toast, t]);

  const handleCopyDua = async (dua: Dua | CustomDua) => {
    const source = "source" in dua ? dua.source : t("duas.customDua");
    try {
      await navigator.clipboard.writeText(`${dua.arabic}\n\n${dua.translation}\n\n— ${source}`);
      toast(t("duas.copied"), "success");
    } catch {}
  };

  const handleShareDua = async (dua: Dua | CustomDua) => {
    const source = "source" in dua ? dua.source : t("duas.customDua");
    const text = `${dua.arabic}\n\n${dua.translation}\n\n— ${source}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast(t("duas.copied"), "success");
      } catch {}
    }
  };

  const handleSetReminder = useCallback(
    (duaId: string, duaName: string) => {
      const existing = duaReminders.find((r) => r.duaId === duaId);
      if (existing) {
        removeDuaReminder(existing.id);
        toast(t("duas.reminderRemoved"), "success");
      } else {
        addDuaReminder({
          id: `reminder-${Date.now()}`,
          duaId,
          title: duaName,
          time: reminderTime,
          days: [0, 1, 2, 3, 4, 5, 6],
          enabled: true,
        });
        toast(`${t("duas.reminderSet")} ${reminderTime}`, "success");
      }
      setShowReminderFor(null);
    },
    [duaReminders, addDuaReminder, removeDuaReminder, reminderTime, toast, t]
  );

  const incrementCount = useCallback(
    (duaId: string, target: number = 3) => {
      setDuaCounts((prev) => {
        const current = prev[duaId] || 0;
        if (current >= target) return prev;
        return { ...prev, [duaId]: current + 1 };
      });
    },
    []
  );

  const learnDuas = useMemo(() => {
    if (activeCategory) {
      return duas.filter((d) => d.category === activeCategory);
    }
    return duas;
  }, [activeCategory]);

  const currentLearnDua = learnDuas[learnIndex % learnDuas.length];

  const handleLearnCheck = () => {
    if (!learnRevealed) {
      setLearnRevealed(true);
      const isCorrect = learnInput.trim() === currentLearnDua.arabic;
      updateDuaLearning(currentLearnDua.id, isCorrect);
    } else {
      setLearnRevealed(false);
      setLearnInput("");
      setLearnIndex((i) => (i + 1) % learnDuas.length);
    }
  };

  const getReminderForDua = (duaId: string) => {
    return duaReminders.find((r) => r.duaId === duaId);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: t("duas.all"), icon: <HiOutlineBookOpen className="w-4 h-4" /> },
    { id: "favorites", label: t("duas.favorites"), icon: <HiOutlineHeart className="w-4 h-4" /> },
    { id: "custom", label: t("duas.custom"), icon: <HiOutlinePencil className="w-4 h-4" /> },
    { id: "learn", label: t("duas.learn"), icon: <HiOutlineStar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">
            {t("duas.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("duas.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-emerald to-emerald-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineStar className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-emerald-100">{t("home.duaOfDay")}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-noto-arabic text-right leading-relaxed mb-3">
              {duaOfDay.arabic}
            </p>
            <p className="text-sm text-emerald-100 mb-2">{duaOfDay.translation}</p>
            <p className="text-xs text-emerald-200 italic">— {duaOfDay.source}</p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => playDuaAudio(duaOfDay.arabic)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              >
                <HiOutlinePlay className="w-3.5 h-3.5" />
                {t("duas.listen")}
              </button>
              <button
                onClick={() => handleCopyDua(duaOfDay)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              >
                <HiOutlineClipboard className="w-3.5 h-3.5" />
                {t("common.copy")}
              </button>
              <button
                onClick={() => shareDuaAsImage(duaOfDay)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              >
                <HiOutlineShare className="w-3.5 h-3.5" />
                {t("common.share")}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4"
        >
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("duas.search")}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald transition-all"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              !activeCategory
                ? "bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t("duas.all")}
          </button>
          {duaCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-emerald dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "learn" ? (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  {t("duas.duaLearning")}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {learnIndex + 1} / {learnDuas.length}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-xs font-medium text-gold bg-gold/5 px-3 py-1 rounded-full mb-3 inline-block">
                  {currentLearnDua.category}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  {currentLearnDua.translation}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  — {currentLearnDua.source}
                </p>
              </div>

              {learnRevealed ? (
                <div className="mb-6">
                  <div className="bg-emerald/5 dark:bg-emerald/10 border border-emerald/20 rounded-xl p-4 mb-4">
                    <p className="text-2xl font-noto-arabic text-dark dark:text-white text-right leading-relaxed">
                      {currentLearnDua.arabic}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    {duaLearning.find((l) => l.duaId === currentLearnDua.id)?.mastered
                      ? t("duas.correct")
                      : t("duas.keepPracticing")}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Type the Arabic text from memory:
                  </label>
                  <textarea
                    value={learnInput}
                    onChange={(e) => setLearnInput(e.target.value)}
                    placeholder="Write the Arabic dua here..."
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 resize-none font-noto-arabic text-right text-lg"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleLearnCheck}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900 hover:bg-emerald/90 transition-colors"
                >
                  {learnRevealed ? (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      Next
                    </>
                  ) : (
                    <>
                      <HiOutlineEye className="w-4 h-4" />
                      Reveal
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setLearnRevealed(false);
                    setLearnInput("");
                    setLearnIndex((i) => (i + 1) % learnDuas.length);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div
              key={`${activeTab}-${activeCategory || "all"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {filtered.map((dua, i) => {
                const isFav = isDuaFavorited(dua.id);
                const hasReminder = !!getReminderForDua(dua.id);
                const count = duaCounts[dua.id] || 0;
                const source = "source" in dua ? dua.source : "Custom Dua";
                const category = "category" in dua ? dua.category : "Custom";
                return (
                  <motion.div
                    key={dua.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <button
                          onClick={() => {
                            toggleDuaFavorite(dua.id);
                            toast(
                              isFav ? "Removed from favorites" : "Saved to favorites",
                              "success"
                            );
                          }}
                          className={`p-2 rounded-xl transition-all active:scale-90 ${
                            isFav
                              ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                              : "text-gray-400 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <HiOutlineHeart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-gold bg-gold/5 px-2.5 py-1 rounded-full">
                            {category}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowReminderFor(showReminderFor === dua.id ? null : dua.id)
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                hasReminder
                                  ? "text-emerald bg-emerald/10"
                                  : "text-gray-400 hover:text-emerald hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              <HiOutlineBell className="w-4 h-4" />
                            </button>
                            {showReminderFor === dua.id && (
                              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 w-48">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                                  Set reminder time
                                </p>
                                <input
                                  type="time"
                                  value={reminderTime}
                                  onChange={(e) => setReminderTime(e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white text-xs outline-none mb-2"
                                />
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleSetReminder(dua.id, dua.translation.slice(0, 40))}
                                    className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium bg-emerald text-white hover:bg-emerald/90 transition-colors"
                                  >
                                    {hasReminder ? "Remove" : "Set"}
                                  </button>
                                  <button
                                    onClick={() => setShowReminderFor(null)}
                                    className="px-2 py-1.5 rounded-lg text-[10px] font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 text-right">
                        <p className="text-xl sm:text-2xl leading-[2] font-noto-arabic text-gray-900 dark:text-white tracking-wider">
                          {dua.arabic}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                        {dua.translation}
                      </p>

                      {"transliteration" in dua && dua.transliteration && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-2">
                          {dua.transliteration}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-4">
                        — {source}
                      </p>

                      {"notes" in dua && dua.notes && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                          {dua.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-700 flex-wrap">
                        <button
                          onClick={() => playDuaAudio(dua.arabic)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-emerald dark:text-emerald-400 bg-emerald/5 dark:bg-emerald/10 hover:bg-emerald/10 dark:hover:bg-emerald/20 transition-colors"
                        >
                          <HiOutlinePlay className="w-3.5 h-3.5" />
                          Play
                        </button>
                        <button
                          onClick={() => handleCopyDua(dua)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <HiOutlineClipboard className="w-3.5 h-3.5" />
                          Copy
                        </button>
                        <button
                          onClick={() => shareDuaAsImage(dua)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <HiOutlineShare className="w-3.5 h-3.5" />
                          Share
                        </button>
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => incrementCount(dua.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-emerald dark:text-emerald-400 font-bold">
                              {count}
                            </span>
                            / 3
                          </button>
                          {activeTab === "custom" && (
                            <button
                              onClick={() => {
                                removeCustomDua(dua.id);
                                toast("Custom dua removed", "success");
                              }}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <HiOutlineTrash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-400 dark:text-gray-500">
                {activeTab === "favorites"
                  ? "No favorite duas yet. Tap the heart to save duas."
                  : activeTab === "custom"
                  ? "No custom duas yet. Create your first dua!"
                  : "No duas found matching your search."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Create Dua
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Arabic Text *
                  </label>
                  <textarea
                    value={newDuaArabic}
                    onChange={(e) => setNewDuaArabic(e.target.value)}
                    placeholder="أدخل النص العربي هنا..."
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 resize-none font-noto-arabic text-right text-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Translation *
                  </label>
                  <textarea
                    value={newDuaTranslation}
                    onChange={(e) => setNewDuaTranslation(e.target.value)}
                    placeholder="Enter the translation..."
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Transliteration (optional)
                  </label>
                  <input
                    type="text"
                    value={newDuaTransliteration}
                    onChange={(e) => setNewDuaTransliteration(e.target.value)}
                    placeholder="Romanized pronunciation..."
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={newDuaNotes}
                    onChange={(e) => setNewDuaNotes(e.target.value)}
                    placeholder="Personal notes about this dua..."
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Category
                  </label>
                  <select
                    value={newDuaCategory}
                    onChange={(e) => setNewDuaCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white outline-none focus:ring-2 focus:ring-emerald/30"
                  >
                    {duaCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleCreateDua}
                  className="w-full py-3 rounded-xl text-sm font-medium bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900 hover:bg-emerald/90 transition-colors mt-2"
                >
                  Save Dua
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setShowCreateForm(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 shadow-lg shadow-emerald/30 flex items-center justify-center hover:bg-emerald/90 transition-all active:scale-95"
        aria-label="Create dua"
      >
        <HiOutlinePlus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

function HiOutlineEye({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
