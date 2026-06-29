"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateQiblaDirection } from "@/services/qibla";
import { HiOutlineGlobe, HiOutlineVolumeOff } from "react-icons/hi";

export default function SalahFocusPage() {
  const { t } = useTranslation();
  const { latitude, longitude } = useGeolocation();
  const qibla = latitude && longitude ? calculateQiblaDirection(latitude, longitude) : null;
  const [active, setActive] = useState(false);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${active ? "bg-black" : "bg-cream dark:bg-gray-900"} pt-24 pb-12 px-4`}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-2xl ${active ? "bg-white/10" : "bg-amber-100 dark:bg-amber-900/30"}`}>
              <HiOutlineGlobe className={`w-7 h-7 ${active ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${active ? "text-white" : "text-gray-900 dark:text-white"}`}>{t("salahFocus.title")}</h1>
              <p className={`text-sm ${active ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>{t("salahFocus.subtitle")}</p>
            </div>
          </div>

          <div className={`${active ? "bg-white/5" : "bg-white dark:bg-gray-800"} rounded-3xl border ${active ? "border-white/10" : "border-gray-100 dark:border-gray-700/50"} p-8 text-center mb-6`}>
            <p className={`text-2xl font-bold mb-6 ${active ? "text-white" : "text-gray-900 dark:text-white"}`}>{t("salahFocus.qiblaDirection")}</p>
            {qibla !== null ? (
              <motion.div animate={{ rotate: qibla }} transition={{ duration: 2, type: "spring" }}>
                <div className={`w-32 h-32 rounded-full border-4 ${active ? "border-white/30" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center mx-auto`}>
                  <span className={`text-4xl ${active ? "text-white" : "text-gray-900 dark:text-white"}`}>🕋</span>
                </div>
              </motion.div>
            ) : (
              <p className={`${active ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>📍 {t("qibla.enableLocation")}</p>
            )}
            <p className={`mt-4 text-sm ${active ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>
              {qibla !== null ? `${Math.round(qibla)}°` : "--"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => setActive(!active)} className={`py-4 rounded-2xl font-medium flex items-center justify-center gap-2 ${active ? "bg-white/10 text-white" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
              <HiOutlineVolumeOff className="w-5 h-5" />
              {t("salahFocus.enableDND")}
            </button>
            <button onClick={() => setActive(!active)} className={`py-4 rounded-2xl font-medium ${active ? "bg-white/10 text-white" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
              {active ? t("salahFocus.exit") : t("salahFocus.enable")}
            </button>
          </div>

          <div className={`${active ? "bg-white/5" : "bg-white dark:bg-gray-800"} rounded-2xl border ${active ? "border-white/10" : "border-gray-100 dark:border-gray-700/50"} p-6`}>
            <h3 className={`text-sm font-medium mb-4 ${active ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>{t("salahFocus.reminder")}</h3>
            <div className="space-y-3">
              {[t("salahFocus.focus"), t("salahFocus.turnOff"), t("salahFocus.qibla")].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-lg ${active ? "text-white" : "text-[var(--accent)]"}`}>{["1️⃣", "2️⃣", "3️⃣"][i]}</span>
                  <p className={`text-sm ${active ? "text-white/80" : "text-gray-700 dark:text-gray-300"}`}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
