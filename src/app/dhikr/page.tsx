"use client";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApp } from "@/context/AppProviders";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/i18n/useTranslation";
import Celebration from "@/components/Celebration";
import { CustomDhikr } from "@/types";
import {
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineShare,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlineTrash,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlinePencil,
} from "react-icons/hi";

type Tab = "counter" | "adhkar" | "custom" | "history";

interface DhikrPresetDef {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
}

const presets: DhikrPresetDef[] = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", transliteration: "Subhanallah", translation: "Glory be to Allah", count: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", translation: "Praise be to Allah", count: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest", count: 34 },
  { id: "lailahaillallah", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallah wahdahu la shareeka lah", translation: "There is no god but Allah alone with no partner", count: 100 },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah", count: 100 },
  { id: "salawat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", transliteration: "Allahumma salli ala Muhammad", translation: "O Allah, send blessings upon Muhammad", count: 10 },
  { id: "subhanallahiladheem", arabic: "سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ", transliteration: "Subhanallahiladheem wa bihamdihi", translation: "Glory be to Allah the Almighty and praise be to Him", count: 33 },
  { id: "hasbiyallah", arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ", transliteration: "Hasbiyallah la ilaha illa huwa alayhi tawakkalt", translation: "Sufficient for me is Allah, there is no god but Him, in Him I trust", count: 7 },
];

const morningAdhkar = [
  { id: "ma1", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "We have entered the morning and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah alone with no partner.", count: 1 },
  { id: "ma2", arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.", count: 1 },
  { id: "ma3", arabic: "سُبْحَانَ اللَّهِ", translation: "Glory be to Allah", count: 33 },
  { id: "ma4", arabic: "الْحَمْدُ لِلَّهِ", translation: "Praise be to Allah", count: 33 },
  { id: "ma5", arabic: "اللَّهُ أَكْبَرُ", translation: "Allah is the Greatest", count: 34 },
  { id: "ma6", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "There is no god but Allah alone with no partner. To Him belongs the dominion and all praise.", count: 1 },
  { id: "ma7", arabic: "أَسْتَغْفِرُ اللَّهَ", translation: "I seek forgiveness from Allah", count: 100 },
  { id: "ma8", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", translation: "In the name of Allah, with whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, the All-Knowing.", count: 3 },
  { id: "ma9", arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ", translation: "O Allah, grant me well-being in my body. O Allah, grant me well-being in my hearing. O Allah, grant me well-being in my sight. There is no god but You.", count: 3 },
  { id: "ma10", arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", translation: "Sufficient for me is Allah, there is no god but Him, in Him I trust, and He is the Lord of the Mighty Throne.", count: 1 },
];

const eveningAdhkar = [
  { id: "ea1", arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "We have entered the evening and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah alone with no partner.", count: 1 },
  { id: "ea2", arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", translation: "O Allah, by You we enter the evening, by You we live, by You we die, and to You is the final return.", count: 1 },
  { id: "ea3", arabic: "سُبْحَانَ اللَّهِ", translation: "Glory be to Allah", count: 33 },
  { id: "ea4", arabic: "الْحَمْدُ لِلَّهِ", translation: "Praise be to Allah", count: 33 },
  { id: "ea5", arabic: "اللَّهُ أَكْبَرُ", translation: "Allah is the Greatest", count: 34 },
  { id: "ea6", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "There is no god but Allah alone with no partner. To Him belongs the dominion and all praise.", count: 1 },
  { id: "ea7", arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", count: 3 },
  { id: "ea8", arabic: "اللَّهُمَّ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ", translation: "O Allah, grant me well-being in this world and the Hereafter. O Allah, I ask You for well-being.", count: 3 },
];

const playTickSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
};

export default function DhikrPage() {
  const { t } = useTranslation();
  usePageTitle(t("dhikr.pageTitle"));
  const { toast } = useToast();
  const {
    dhikrSessions,
    addDhikrSession,
    dhikrStreak,
    updateDhikrStreak,
    customDhikrs,
    addCustomDhikr,
    removeCustomDhikr,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>("counter");
  const [activePreset, setActivePreset] = useState(presets[0].id);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [celebrate, setCelebrate] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const [customFormArabic, setCustomFormArabic] = useState("");
  const [customFormTransliteration, setCustomFormTransliteration] = useState("");
  const [customFormTranslation, setCustomFormTranslation] = useState("");
  const [customFormTarget, setCustomFormTarget] = useState(33);

  const [adhkarCounts, setAdhkarCounts] = useState<Record<string, number>>({});

  const today = new Date().toISOString().split("T")[0];

  const todaySessions = useMemo(
    () => dhikrSessions.filter((s) => s.date === today),
    [dhikrSessions, today]
  );

  const thisWeekSessions = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    return dhikrSessions.filter((s) => s.date >= weekAgo);
  }, [dhikrSessions]);

  const doVibrate = useCallback(() => {
    if (hapticEnabled) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  }, [hapticEnabled]);

  const activePresetDef = presets.find((p) => p.id === activePreset);
  const currentCount = counts[activePreset] || 0;
  const target = activePresetDef?.count || 33;
  const progress = Math.min(currentCount / target, 1);

  const increment = useCallback(() => {
    const next = (counts[activePreset] || 0) + 1;
    if (next > target) return;
    if (next >= target) {
      setCelebrate(true);
      addDhikrSession({
        id: `dhikr-${Date.now()}`,
        presetId: activePreset,
        arabic: activePresetDef?.arabic || "",
        translation: activePresetDef?.translation || "",
        target,
        completed: target,
        date: today,
      });
      updateDhikrStreak();
    }
    setCounts((prev) => ({
      ...prev,
      [activePreset]: Math.min(next, target),
    }));
    doVibrate();
    if (soundEnabled) playTickSound();
  }, [counts, activePreset, target, activePresetDef, doVibrate, soundEnabled, addDhikrSession, updateDhikrStreak, today]);

  const reset = useCallback(() => {
    setCounts((prev) => ({ ...prev, [activePreset]: 0 }));
  }, [activePreset]);

  const incrementCustom = useCallback(
    (dhikrId: string, targetCount: number) => {
      const next = (counts[dhikrId] || 0) + 1;
      if (next > targetCount) return;
      setCounts((prev) => ({ ...prev, [dhikrId]: Math.min(next, targetCount) }));
      doVibrate();
      if (soundEnabled) playTickSound();
      if (next >= targetCount) {
        setCelebrate(true);
        const dhikr = customDhikrs.find((d) => d.id === dhikrId);
        if (dhikr) {
          addDhikrSession({
            id: `dhikr-${Date.now()}`,
            presetId: dhikrId,
            arabic: dhikr.arabic,
            translation: dhikr.translation,
            target: targetCount,
            completed: targetCount,
            date: today,
          });
          updateDhikrStreak();
        }
      }
    },
    [counts, doVibrate, soundEnabled, customDhikrs, addDhikrSession, updateDhikrStreak, today]
  );

  const incrementAdhkar = useCallback(
    (adhkarId: string, targetCount: number) => {
      const next = (adhkarCounts[adhkarId] || 0) + 1;
      if (next > targetCount) return;
      setAdhkarCounts((prev) => ({ ...prev, [adhkarId]: Math.min(next, targetCount) }));
      doVibrate();
      if (soundEnabled) playTickSound();
    },
    [adhkarCounts, doVibrate, soundEnabled]
  );

  const resetAdhkar = useCallback(() => {
    setAdhkarCounts({});
  }, []);

  const handleCreateCustom = useCallback(() => {
    if (!customFormArabic.trim() || !customFormTranslation.trim()) {
      toast(t("dhikr.fillArabicTranslation"), "info");
      return;
    }
    addCustomDhikr({
      id: `custom-dhikr-${Date.now()}`,
      arabic: customFormArabic.trim(),
      transliteration: customFormTransliteration.trim() || undefined,
      translation: customFormTranslation.trim(),
      targetCount: customFormTarget,
      createdAt: new Date().toISOString(),
    });
    setCustomFormArabic("");
    setCustomFormTransliteration("");
    setCustomFormTranslation("");
    setCustomFormTarget(33);
    toast(t("dhikr.customDhikrCreated"), "success");
  }, [customFormArabic, customFormTransliteration, customFormTranslation, customFormTarget, addCustomDhikr, toast]);

  const handleShareCount = useCallback(
    (arabic: string, count: number, targetCount: number) => {
      const text = `I completed ${arabic} ${count} times today! 🌙`;
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text).then(() => {
          toast(t("dhikr.copiedToClipboard"), "success");
        });
      }
    },
    [toast]
  );

  const renderAdhkarList = (items: typeof morningAdhkar, title: string) => {
    const totalTarget = items.reduce((sum, item) => sum + item.count, 0);
    const totalDone = items.reduce((sum, item) => sum + Math.min(adhkarCounts[item.id] || 0, item.count), 0);
    const overallProgress = totalTarget > 0 ? totalDone / totalTarget : 0;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-3 flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            {totalDone}/{totalTarget}
          </span>
        </h3>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const done = Math.min(adhkarCounts[item.id] || 0, item.count);
            const itemProgress = item.count > 0 ? done / item.count : 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => incrementAdhkar(item.id, item.count)}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center text-emerald dark:text-emerald-400 font-bold text-lg active:scale-95 transition-transform"
                  >
                    {done}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-noto-arabic text-dark dark:text-white text-right leading-relaxed mb-1">
                      {item.arabic}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.translation}
                    </p>
                    <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
                        animate={{ width: `${itemProgress * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {done} / {item.count}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={resetAdhkar}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {t("dhikr.resetAll")}
        </button>
      </div>
    );
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "counter", label: t("dhikr.counter"), icon: <HiOutlineFire className="w-4 h-4" /> },
    { id: "adhkar", label: t("dhikr.presets"), icon: <HiOutlineClock className="w-4 h-4" /> },
    { id: "custom", label: t("dhikr.custom"), icon: <HiOutlinePencil className="w-4 h-4" /> },
    { id: "history", label: t("dhikr.history"), icon: <HiOutlineClock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <Celebration show={celebrate} onDone={() => setCelebrate(false)} />
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">
            {t("dhikr.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dhikr.subtitle")}
          </p>
        </motion.div>

        {dhikrStreak.current > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <HiOutlineFire className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {dhikrStreak.current} {t("dhikr.dayStreak")}
              </span>
              {dhikrStreak.current >= 7 && (
                <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-full">
                  🔥
                </span>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6"
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
          {activeTab === "counter" && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activePreset === p.id
                        ? "bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {p.translation}
                  </button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={currentCount > 0 ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.15 }}
                  onClick={increment}
                  className="cursor-pointer select-none mx-auto"
                >
                  <div className="relative w-64 h-64 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
                        className="text-emerald dark:text-emerald-400 transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
                      <p className="text-2xl font-noto-arabic text-dark dark:text-white mb-1 leading-relaxed px-4">
                        {activePresetDef?.arabic}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {activePresetDef?.translation}
                      </p>
                      <p className="text-4xl font-bold text-emerald dark:text-emerald-400">
                        {currentCount}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        / {target}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <HiOutlineRefresh className="w-4 h-4" />
                    {t("dhikr.reset")}
                  </button>
                  <button
                    onClick={increment}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900 hover:bg-emerald/90 transition-colors shadow-lg shadow-emerald/20"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    {t("dhikr.count")}
                  </button>
                  {currentCount >= target && (
                    <button
                      onClick={() =>
                        handleShareCount(activePresetDef?.arabic || "", currentCount, target)
                      }
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald dark:text-emerald-400 bg-emerald/10 hover:bg-emerald/20 transition-colors"
                    >
                      <HiOutlineShare className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      soundEnabled
                        ? "text-emerald bg-emerald/10"
                        : "text-gray-400 bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {soundEnabled ? (
                      <HiOutlineVolumeUp className="w-3.5 h-3.5" />
                    ) : (
                      <HiOutlineVolumeOff className="w-3.5 h-3.5" />
                    )}
                    {t("dhikr.sound")}
                  </button>
                  <button
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      hapticEnabled
                        ? "text-emerald bg-emerald/10"
                        : "text-gray-400 bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {hapticEnabled ? "📳" : "📴"}
                    {t("dhikr.haptic")}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "adhkar" && (
            <motion.div
              key="adhkar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderAdhkarList(morningAdhkar, t("dhikr.morning"))}
              {renderAdhkarList(eveningAdhkar, t("dhikr.evening"))}
            </motion.div>
          )}

          {activeTab === "custom" && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6">
                <h3 className="font-medium text-dark dark:text-white mb-4 text-sm">
                  {t("dhikr.createCustom")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      {t("dhikr.arabicText")}
                    </label>
                    <textarea
                      value={customFormArabic}
                      onChange={(e) => setCustomFormArabic(e.target.value)}
                      placeholder="أدخل النص العربي..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 resize-none font-noto-arabic text-right"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      {t("dhikr.transliterationOptional")}
                    </label>
                    <input
                      type="text"
                      value={customFormTransliteration}
                      onChange={(e) => setCustomFormTransliteration(e.target.value)}
                      placeholder="Romanized pronunciation..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      {t("dhikr.translationLabel")}
                    </label>
                    <input
                      type="text"
                      value={customFormTranslation}
                      onChange={(e) => setCustomFormTranslation(e.target.value)}
                      placeholder="English translation..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                      {t("dhikr.targetCount")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={customFormTarget}
                      onChange={(e) => setCustomFormTarget(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-dark dark:text-white outline-none focus:ring-2 focus:ring-emerald/30 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleCreateCustom}
                    className="w-full py-2.5 rounded-xl text-sm font-medium bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900 hover:bg-emerald/90 transition-colors"
                  >
                    {t("dhikr.createDhikr")}
                  </button>
                </div>
              </div>

              {customDhikrs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("dhikr.yourCustomDhikrs")}
                  </h3>
                  {customDhikrs.map((dhikr) => {
                    const dhikrCount = counts[dhikr.id] || 0;
                    const dhikrProgress = dhikr.targetCount > 0 ? dhikrCount / dhikr.targetCount : 0;
                    return (
                      <div
                        key={dhikr.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-lg font-noto-arabic text-dark dark:text-white text-right leading-relaxed">
                              {dhikr.arabic}
                            </p>
                            {dhikr.transliteration && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">
                                {dhikr.transliteration}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {dhikr.translation}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              removeCustomDhikr(dhikr.id);
                              toast(t("dhikr.customDhikrRemoved"), "success");
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 ml-2"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
                            animate={{ width: `${dhikrProgress * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {dhikrCount} / {dhikr.targetCount}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCounts((prev) => ({ ...prev, [dhikr.id]: 0 }));
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {t("dhikr.reset")}
                            </button>
                            <button
                              onClick={() => incrementCustom(dhikr.id, dhikr.targetCount)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900 hover:bg-emerald/90 transition-colors"
                            >
                              {t("dhikr.count")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                  {t("dhikr.todaySessions")}
                </h3>
                {todaySessions.length > 0 ? (
                  <div className="space-y-2">
                    {todaySessions.map((session) => (
                      <div
                        key={session.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center flex-shrink-0">
                          <HiOutlineCheck className="w-5 h-5 text-emerald dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark dark:text-white truncate">
                            {session.translation}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {session.completed}/{session.target} {t("dhikr.times")}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {new Date(session.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                    {t("dhikr.noSessionsToday")}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                  {t("dhikr.thisWeek")}
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(Date.now() - (6 - i) * 86400000);
                    const dateStr = d.toISOString().split("T")[0];
                    const hasSessions = thisWeekSessions.some((s) => s.date === dateStr);
                    const isToday = dateStr === today;
                    return (
                      <div key={i} className="text-center">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">
                          {d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2)}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-medium ${
                            hasSessions
                              ? "bg-emerald text-white dark:bg-emerald-400 dark:text-gray-900"
                              : isToday
                              ? "bg-gray-200 dark:bg-gray-700 text-dark dark:text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {thisWeekSessions.length > 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dhikr.totalSessionsThisWeek")}
                      </span>
                      <span className="text-sm font-bold text-emerald dark:text-emerald-400">
                        {thisWeekSessions.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dhikr.totalDhikrCompleted")}
                      </span>
                      <span className="text-sm font-bold text-emerald dark:text-emerald-400">
                        {thisWeekSessions.reduce((sum, s) => sum + s.completed, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dhikr.longestStreak")}
                      </span>
                      <span className="text-sm font-bold text-orange-500">
                        {dhikrStreak.longest} days 🔥
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                    {t("dhikr.noSessionsThisWeek")}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
