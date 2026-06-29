"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineColorSwatch } from "react-icons/hi";

const BUILT_IN = [
  { id: "green", name: "Emerald Green", accent: "#0F5132", light: "#FAF8F3", dark: "#0a0a0a" },
  { id: "blue", name: "Ocean Blue", accent: "#1E40AF", light: "#F0F4FF", dark: "#0a0a1a" },
  { id: "purple", name: "Royal Purple", accent: "#7C3AED", light: "#F5F0FF", dark: "#0a0a15" },
  { id: "gold", name: "Desert Gold", accent: "#B8860B", light: "#FFFBF0", dark: "#0a0a0a" },
];

export default function CustomThemesPage() {
  const { t } = useTranslation();
  const { settings, setSettings } = useApp();
  const [customColors, setCustomColors] = useState({ accent: "#0F5132", light: "#FAF8F3", dark: "#0a0a0a" });
  const [name, setName] = useState("");

  const applyTheme = (accent: string) => {
    setSettings((prev) => ({ ...prev, accentColor: accent }));
    document.documentElement.style.setProperty("--accent", accent);
    localStorage.setItem("accent_color", accent);
  };

  const saveCustom = () => {
    if (!name.trim()) return;
    const themes = JSON.parse(localStorage.getItem("custom_themes") || "[]");
    themes.push({ id: Date.now().toString(), name: name.trim(), ...customColors });
    localStorage.setItem("custom_themes", JSON.stringify(themes));
    applyTheme(customColors.accent);
    setName("");
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl"><HiOutlineColorSwatch className="w-7 h-7 text-pink-600 dark:text-pink-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("customThemes.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("customThemes.subtitle")}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t("customThemes.builtIn")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {BUILT_IN.map((theme) => (
              <button key={theme.id} onClick={() => applyTheme(theme.accent)}
                className={`rounded-2xl p-4 text-center transition-all ${settings.accentColor === theme.accent ? "ring-2 ring-[var(--accent)] ring-offset-2 dark:ring-offset-gray-900" : "border border-gray-200 dark:border-gray-700"}`}>
                <div className="w-10 h-10 rounded-full mx-auto mb-2" style={{ backgroundColor: theme.accent }} />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{theme.name}</p>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t("customThemes.create")}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">{t("customThemes.themeName")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("customThemes.themeName")}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["accent", "light", "dark"] as const).map((key) => (
                  <div key={key}>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block capitalize">{t(`customThemes.${key}Color`)}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={customColors[key]} onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer" />
                      <input type="text" value={customColors[key]} onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-700" style={{ backgroundColor: customColors.light }}>
                <p className="text-sm font-medium" style={{ color: customColors.accent }}>{t("customThemes.preview")}</p>
                <p className="text-xs mt-1" style={{ color: "#666" }}>{t("customThemes.previewDesc")}</p>
              </div>
              <button onClick={saveCustom} className="w-full py-2.5 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium">{t("customThemes.saveTheme")}</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
