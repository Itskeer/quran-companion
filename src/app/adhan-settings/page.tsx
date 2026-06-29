"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { HiOutlineBell } from "react-icons/hi";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "jummah"] as const;

export default function AdhanSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("adhan_settings") : null;
    return saved ? JSON.parse(saved) : Object.fromEntries(PRAYERS.map((p) => [p, { enabled: true, volume: 80, sound: "adhan1" }]));
  });

  const update = (prayer: string, key: string, value: any) => {
    const next = { ...settings, [prayer]: { ...settings[prayer], [key]: value } };
    setSettings(next);
    localStorage.setItem("adhan_settings", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl"><HiOutlineBell className="w-7 h-7 text-yellow-600 dark:text-yellow-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("adhanSettings.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("adhanSettings.subtitle")}</p>
            </div>
          </div>

          <div className="space-y-4">
            {PRAYERS.map((prayer) => (
              <div key={prayer} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">{t(`adhanSettings.${prayer}`)}</h3>
                  <button onClick={() => update(prayer, "enabled", !settings[prayer]?.enabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${settings[prayer]?.enabled ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[prayer]?.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {settings[prayer]?.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">{t("adhanSettings.volume")}: {settings[prayer].volume}%</label>
                      <input type="range" min={0} max={100} value={settings[prayer].volume}
                        onChange={(e) => update(prayer, "volume", Number(e.target.value))}
                        className="w-full accent-[var(--accent)]" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">{t("adhanSettings.sound")}</label>
                      <div className="flex gap-2">{["adhan1", "adhan2", "adhan3"].map((s) => (
                        <button key={s} onClick={() => update(prayer, "sound", s)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${settings[prayer].sound === s ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                          {t("adhanSettings.adhan")} {s.slice(-1)}
                        </button>
                      ))}</div>
                    </div>
                    <button onClick={() => { const a = new SpeechSynthesisUtterance(t(`adhanSettings.${prayer}`)); a.lang = "ar-SA"; a.volume = settings[prayer].volume / 100; window.speechSynthesis.speak(a); }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm">{t("adhanSettings.playSound")}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
