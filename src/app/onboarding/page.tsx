"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProviders";
import { useTranslation } from "@/i18n/useTranslation";
import { Language } from "@/types";
import {
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineBookOpen,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiOutlineLocationMarker,
  HiOutlineColorSwatch,
  HiOutlineAdjustments,
  HiOutlineGlobe,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineVolumeUp,
  HiOutlineCheck,
} from "react-icons/hi";

const languages: { code: Language; flag: string; label: string; native: string }[] = [
  { code: "ar", flag: "🇸🇦", label: "Arabic", native: "العربية" },
  { code: "en", flag: "🇬🇧", label: "English", native: "English" },
  { code: "fr", flag: "🇫🇷", label: "French", native: "Français" },
];

const ACCENT_COLORS = [
  { name: "Gold", value: "#C9A227" },
  { name: "Emerald", value: "#0F5132" },
  { name: "Blue", value: "#1E40AF" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Red", value: "#DC2626" },
  { name: "Teal", value: "#059669" },
];

const FONT_SIZES = ["small", "medium", "large"] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState<"small" | "medium" | "large">("medium");
  const [selectedAccent, setSelectedAccent] = useState("#C9A227");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { t, language } = useTranslation();
  const { setLanguage, setSettings } = useApp();

  const totalSteps = 5;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
    }),
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && localStorage.getItem("onboarding_complete")) {
      router.replace("/");
    }
  }, [mounted, router]);

  const goTo = useCallback(
    (newStep: number) => {
      if (newStep < 0 || newStep >= totalSteps) return;
      setDirection(newStep > step ? 1 : -1);
      setStep(newStep);
    },
    [step]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x < -threshold && step < totalSteps - 1) {
        goTo(step + 1);
      } else if (info.offset.x > threshold && step > 0) {
        goTo(step - 1);
      }
    },
    [step, goTo]
  );

  const applySettings = () => {
    document.documentElement.style.setProperty("--accent", selectedAccent);
    setSettings((prev) => ({
      ...prev,
      accentColor: selectedAccent,
      fontSize: selectedFontSize,
      darkMode,
    }));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleComplete = () => {
    applySettings();
    localStorage.setItem("onboarding_complete", "true");
    router.push("/");
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_complete", "true");
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("onboarding.skip")}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full max-w-md cursor-grab active:cursor-grabbing"
          >
            {/* STEP 0: Language Selection */}
            {step === 0 && (
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="text-8xl sm:text-9xl leading-none"
                  >
                    🌐
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {t("onboarding.language")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("onboarding.languageHint")}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-3"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                          language === lang.code
                            ? "bg-white dark:bg-gray-800 shadow-lg border-2 border-emerald dark:border-emerald-400 scale-[1.02]"
                            : "bg-white/50 dark:bg-gray-800/50 border-2 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                        }`}
                      >
                        <span className="text-3xl">{lang.flag}</span>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{lang.native}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{lang.label}</div>
                        </div>
                        {language === lang.code && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-emerald dark:bg-emerald-400 flex items-center justify-center">
                            <HiOutlineCheck className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}

            {/* STEP 1: Welcome / App Name */}
            {step === 1 && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-green-900/30 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                  >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald to-teal-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald/30">
                      <span className="text-5xl">📖</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {t("onboarding.welcome")}
                    </h1>
                    <p className="text-sm font-medium text-emerald dark:text-emerald-400">
                      {t("onboarding.welcomeSub")}
                    </p>
                  </motion.div>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-xs mx-auto"
                  >
                    {t("onboarding.welcomeDesc")}
                  </motion.p>
                </div>
              </div>
            )}

            {/* STEP 2: How to Use */}
            {step === 2 && (
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="text-center space-y-5">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="text-7xl leading-none"
                  >
                    🕌
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {t("onboarding.howToUse")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("onboarding.howToUseSub")}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-2 gap-3 text-left"
                  >
                    {[
                      { icon: HiOutlineBookOpen, title: t("onboarding.step1Title"), desc: t("onboarding.step1Desc"), color: "text-emerald" },
                      { icon: HiOutlineHeart, title: t("onboarding.step2Title"), desc: t("onboarding.step2Desc"), color: "text-rose-500" },
                      { icon: HiOutlineChartBar, title: t("onboarding.step3Title"), desc: t("onboarding.step3Desc"), color: "text-amber-500" },
                      { icon: HiOutlineLocationMarker, title: t("onboarding.step4Title"), desc: t("onboarding.step4Desc"), color: "text-blue-500" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3"
                      >
                        <item.icon className={`w-6 h-6 ${item.color} mb-1.5`} />
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{item.title}</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{item.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}

            {/* STEP 3: Customize Settings */}
            {step === 3 && (
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="text-center space-y-5">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="text-7xl leading-none"
                  >
                    ⚙️
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {t("onboarding.customize")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("onboarding.customizeSub")}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4 text-left"
                  >
                    {/* Accent Color */}
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <HiOutlineColorSwatch className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{t("settings.accentColor")}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {ACCENT_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedAccent(color.value)}
                            className={`w-9 h-9 rounded-full transition-all ${
                              selectedAccent === color.value
                                ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-110"
                                : "hover:scale-105"
                            }`}
                            style={{
                              backgroundColor: color.value,
                              ["--tw-ring-color" as string]: color.value,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <HiOutlineAdjustments className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{t("settings.fontSize")}</span>
                      </div>
                      <div className="flex gap-2">
                        {FONT_SIZES.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedFontSize(size)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                              selectedFontSize === size
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {size === "small" ? t("settings.small") : size === "medium" ? t("settings.medium") : t("settings.large")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {darkMode ? <HiOutlineMoon className="w-4 h-4 text-amber-500" /> : <HiOutlineSun className="w-4 h-4 text-amber-500" />}
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{t("settings.darkMode")}</span>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                          <motion.div
                            animate={{ x: darkMode ? 20 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* STEP 4: Get Started */}
            {step === 4 && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="text-8xl sm:text-9xl leading-none"
                  >
                    ⭐
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {t("onboarding.track")}
                    </h1>
                    <p className="text-sm font-medium text-purple-500 dark:text-purple-400">
                      {t("onboarding.trackSub")}
                    </p>
                  </motion.div>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs mx-auto"
                  >
                    {t("onboarding.trackDesc")}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 text-left"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {t("onboarding.customizeDesc")}
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group p-1"
              aria-label={`Go to screen ${i + 1}`}
            >
              <motion.div
                className={`h-2 rounded-full transition-colors duration-300 ${
                  i === step
                    ? "bg-emerald dark:bg-emerald-400"
                    : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                }`}
                animate={{ width: i === step ? 32 : 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => goTo(step - 1)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
              {t("onboarding.previous")}
            </motion.button>
          )}

          {step < totalSteps - 1 ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goTo(step + 1)}
              className="flex items-center gap-1.5 px-8 py-3 rounded-full text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300 transition-all shadow-lg shadow-emerald/25"
            >
              {t("onboarding.next")}
              <HiOutlineChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleComplete}
              className="flex items-center gap-2 px-10 py-3 rounded-full text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300 transition-all shadow-lg shadow-emerald/25"
            >
              {t("onboarding.getStarted")}
              <span className="text-lg">✨</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
