"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { islamicCalendarEvents as calendarEvents } from "@/data/calendarEvents";
import { HiOutlineCalendar } from "react-icons/hi";

const CATEGORIES = [...new Set(calendarEvents.map((e) => e.category))];
const HIJRI_MONTHS = ["", "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah"];

export default function CalendarEventsPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = calendarEvents.filter((e) => category === "all" || e.category === category);
  const major = filtered.filter((e) => e.significance === "major");
  const others = filtered.filter((e) => e.significance !== "major");

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl"><HiOutlineCalendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("calendarEvents.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("calendarEvents.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            <button onClick={() => setCategory("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${category === "all" ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize ${category === cat ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{cat}</button>
            ))}
          </div>

          {major.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t("calendarEvents.nextOccurrence")}</h3>
              <div className="space-y-3 mb-6">
                {major.map((event) => (
                  <motion.div key={event.id} layout className="bg-gradient-to-r from-[var(--accent)]/10 to-transparent dark:from-[var(--accent)]/20 rounded-2xl border border-[var(--accent)]/20 p-4 cursor-pointer" onClick={() => setSelected(selected === event.id ? null : event.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{event.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{HIJRI_MONTHS[event.hijriMonth]} {event.hijriDay}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] capitalize">{event.category}</span>
                    </div>
                    {selected === event.id && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-[var(--accent)]/10">{event.description}</motion.p>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t("calendarEvents.previous")}</h3>
          <div className="space-y-3">
            {others.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 flex items-center gap-3">
                <span className="text-xl">{event.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{HIJRI_MONTHS[event.hijriMonth]} {event.hijriDay}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
