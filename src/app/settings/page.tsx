"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineColorSwatch,
  HiOutlineAdjustments,
  HiOutlineGlobe,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineVolumeUp,
  HiOutlineDeviceMobile,
  HiOutlineInformationCircle,
  HiOutlineExclamation,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineCog,
  HiOutlineUser,
} from "react-icons/hi";

const ACCENT_COLORS = [
  { name: "Gold", value: "#C9A227" },
  { name: "Emerald", value: "#0F5132" },
  { name: "Blue", value: "#1E40AF" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Red", value: "#DC2626" },
  { name: "Teal", value: "#059669" },
  { name: "Amber", value: "#D97706" },
  { name: "Pink", value: "#EC4899" },
];

const FONT_SIZES = ["small", "medium", "large"] as const;

const READING_MODES = [
  { id: "light", label: "Light", icon: HiOutlineSun },
  { id: "dark", label: "Dark", icon: HiOutlineMoon },
  { id: "sepia", label: "Sepia", icon: HiOutlineAdjustments },
] as const;

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "fr" as const, label: "French" },
  { code: "ar" as const, label: "Arabic" },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled
          ? "bg-[var(--accent,#0F5132)] dark:bg-[var(--accent,#0F5132)]"
          : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

export default function SettingsPage() {
  const { settings, setSettings, language, setLanguage } = useApp();
  const { t } = useTranslation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetDone, setShowResetDone] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      settings.accentColor
    );
  }, [settings.accentColor]);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-haptic");
    if (stored !== null) setHapticFeedback(JSON.parse(stored));
    const storedSound = localStorage.getItem("quran-companion-sound");
    if (storedSound !== null) setSoundEffects(JSON.parse(storedSound));
  }, []);

  const handleAccentColor = (color: string) => {
    setSettings((prev) => ({ ...prev, accentColor: color }));
    document.documentElement.style.setProperty("--accent", color);
  };

  const handleReadingMode = (mode: string) => {
    if (mode === "dark") {
      setSettings((prev) => ({ ...prev, darkMode: true }));
    } else {
      setSettings((prev) => ({ ...prev, darkMode: false }));
    }
  };

  const handleHaptic = () => {
    const next = !hapticFeedback;
    setHapticFeedback(next);
    localStorage.setItem("quran-companion-haptic", JSON.stringify(next));
  };

  const handleSound = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    localStorage.setItem("quran-companion-sound", JSON.stringify(next));
  };

  const currentMode = settings.darkMode ? "dark" : "light";

  const handleResetProgress = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("quran-companion-")
    );
    for (const key of keys) {
      if (
        key === "quran-companion-settings" ||
        key === "quran-companion-language"
      ) {
        continue;
      }
      localStorage.removeItem(key);
    }
    setShowResetConfirm(false);
    setShowResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("settings.subtitle")}
        </p>
      </motion.div>

      {/* Your Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUser className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t("settings.yourName")}
          </h2>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          {t("settings.nameHint")}
        </p>
        <input
          type="text"
          defaultValue={typeof window !== "undefined" ? localStorage.getItem("user_name") || "" : ""}
          onBlur={(e) => {
            localStorage.setItem("user_name", e.target.value);
          }}
          placeholder={t("settings.namePlaceholder")}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
        />
      </motion.div>

      {/* Accent Color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineColorSwatch className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t("settings.accentColor")}
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleAccentColor(color.value)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                settings.accentColor === color.value
                  ? "bg-gray-50 dark:bg-gray-700/50 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
              style={
                settings.accentColor === color.value
                  ? { ["--tw-ring-color" as string]: color.value }
                  : {}
              }
            >
              <div
                className="w-10 h-10 rounded-full shadow-inner"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {color.name}
              </span>
              {settings.accentColor === color.value && (
                <HiOutlineCheck className="w-4 h-4 absolute top-2 right-2 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineAdjustments className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">{t("settings.display")}</h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {t("settings.fontSize")}
            </label>
            <div className="flex gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, fontSize: size }))
                  }
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                    settings.fontSize === size
                      ? "bg-[var(--accent)] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {t("settings.display")}
            </label>
            <div className="flex gap-2">
              {READING_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleReadingMode(mode.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineGlobe className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t("settings.language")}
          </h2>
        </div>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                language === lang.code
                  ? "bg-[var(--accent)] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Playback & Sound */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineVolumeUp className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t("settings.autoPlay")}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineVolumeUp className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("settings.autoPlay")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.autoPlayDesc")}
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.autoPlay}
              onToggle={() =>
                setSettings((prev) => ({ ...prev, autoPlay: !prev.autoPlay }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineDeviceMobile className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("settings.haptic")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.hapticDesc")}
                </p>
              </div>
            </div>
            <Toggle enabled={hapticFeedback} onToggle={handleHaptic} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineSun className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("settings.sound")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.soundDesc")}
                </p>
              </div>
            </div>
            <Toggle enabled={soundEffects} onToggle={handleSound} />
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineExclamation className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t("settings.reset")}
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {t("settings.resetDesc")}
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
        >
          <HiOutlineTrash className="w-4 h-4" />
          {t("settings.reset")}
        </button>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineInformationCircle className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-semibold text-gray-900 dark:text-white">{t("settings.about")}</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("settings.appName")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Quran Companion
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("settings.version")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              1.0.0
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("settings.author")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Ahmed Jaballah
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("settings.builtWith")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Next.js + React 19
            </span>
          </div>
        </div>
      </motion.div>

      {/* Reset Confirm Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <HiOutlineExclamation className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                {t("settings.reset")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                {t("settings.resetConfirm")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlineX className="w-4 h-4" />
                  {t("settings.no")}
                </button>
                <button
                  onClick={handleResetProgress}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  {t("settings.yes")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Done Modal */}
      <AnimatePresence>
        {showResetDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("settings.progressReset")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("settings.progressResetDesc")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
