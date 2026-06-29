"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { surahList as surahs } from "@/data/surahs";
import { HiOutlineMoon, HiOutlinePlay, HiOutlinePause } from "react-icons/hi";

const DURATIONS = [15, 30, 45, 60];
const PLAYLIST = surahs.filter((s) => [1, 36, 67, 109, 112, 113, 114, 55, 56, 78, 87, 93, 94, 95, 97].includes(s.number));

export default function SleepModePage() {
  const { t } = useTranslation();
  const [duration, setDuration] = useState(30);
  const [surah, setSurah] = useState(55);
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const togglePlay = () => {
    if (playing) { setPlaying(false); if (timer) clearInterval(timer); setTimer(null); }
    else {
      setPlaying(true);
      const t = window.setInterval(() => { setPlaying(false); clearInterval(t); setTimer(null); }, duration * 60 * 1000);
      setTimer(t);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-900/50 rounded-2xl"><HiOutlineMoon className="w-7 h-7 text-indigo-300" /></div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t("sleepMode.title")}</h1>
              <p className="text-sm text-indigo-300/70">{t("sleepMode.subtitle")}</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mb-6">
            <div className="text-center mb-6">
              <p className="text-6xl text-white mb-2">🌙</p>
              <p className="text-4xl font-bold text-white mb-1">{duration} <span className="text-lg text-indigo-300">{t("sleepMode.timerLabel")}</span></p>
              <p className="text-sm text-indigo-300/70">{t("sleepMode.autoStop")}</p>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">{DURATIONS.map((d) => (
              <button key={d} onClick={() => setDuration(d)} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${duration === d ? "bg-indigo-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>{d} {t("sleepMode.timerLabel")}</button>
            ))}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mb-6">
            <h3 className="text-sm font-medium text-indigo-300/70 mb-3">{t("sleepMode.surah")}</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">{PLAYLIST.map((s) => (
              <button key={s.number} onClick={() => setSurah(s.number)} className={`p-3 rounded-xl text-left transition-all ${surah === s.number ? "bg-indigo-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-indigo-300/50">{s.name}</p>
              </button>
            ))}</div>
          </div>

          <div className="text-center">
            <motion.button whileTap={{ scale: 0.95 }} onClick={togglePlay}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${playing ? "bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              {playing ? <HiOutlinePause className="w-8 h-8 text-white" /> : <HiOutlinePlay className="w-8 h-8 text-white ml-1" />}
            </motion.button>
            <p className="text-sm text-indigo-300/70 mt-3">{playing ? t("sleepMode.stop") : t("sleepMode.play")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
