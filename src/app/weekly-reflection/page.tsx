"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlinePencil } from "react-icons/hi";

export default function WeeklyReflectionPage() {
  const { t } = useTranslation();
  const { weeklyReflections, addWeeklyReflection } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ gratitude: "", challenges: "", goals: "", spiritualGrowth: "", nextWeekPlan: "", mood: "" });

  const handleSubmit = () => {
    const filled = Object.entries(form).filter(([, v]) => v.trim());
    if (filled.length === 0) return;
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
    addWeeklyReflection({
      id: Date.now().toString(),
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
      gratitude: form.gratitude, challenges: form.challenges,
      goals: form.goals, spiritualGrowth: form.spiritualGrowth,
      nextWeekPlan: form.nextWeekPlan, mood: form.mood || "neutral",
    });
    setShowForm(false);
    setForm({ gratitude: "", challenges: "", goals: "", spiritualGrowth: "", nextWeekPlan: "", mood: "" });
  };

  const fields = [
    { key: "gratitude", label: t("weeklyReflection.gratitude") || "What are you grateful for?" },
    { key: "challenges", label: t("weeklyReflection.challenges") || "What challenges did you face?" },
    { key: "goals", label: t("weeklyReflection.goals") || "Goals for this week" },
    { key: "spiritualGrowth", label: t("weeklyReflection.spiritualGrowth") || "Spiritual growth" },
    { key: "nextWeekPlan", label: t("weeklyReflection.nextWeekPlan") || "Plan for next week" },
    { key: "mood", label: t("weeklyReflection.mood") || "Overall mood" },
  ] as const;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl"><HiOutlinePencil className="w-7 h-7 text-purple-600 dark:text-purple-400" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("weeklyReflection.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("weeklyReflection.subtitle")}</p>
              </div>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="p-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl"><HiOutlinePencil className="w-5 h-5" /></button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 mb-6 overflow-hidden">
                <div className="space-y-4">
                  {fields.map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">{label}</label>
                      <textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={2}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none" />
                    </div>
                  ))}
                  <button onClick={handleSubmit} className="w-full py-2.5 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium">{t("weeklyReflection.save")}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {weeklyReflections.map((ref) => (
              <motion.div key={ref.id} layout className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{ref.weekStart} — {ref.weekEnd}</p>
                <div className="space-y-3">
                  {ref.gratitude && <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gratitude</p><p className="text-sm text-gray-700 dark:text-gray-300">{ref.gratitude}</p></div>}
                  {ref.challenges && <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Challenges</p><p className="text-sm text-gray-700 dark:text-gray-300">{ref.challenges}</p></div>}
                  {ref.goals && <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Goals</p><p className="text-sm text-gray-700 dark:text-gray-300">{ref.goals}</p></div>}
                  {ref.spiritualGrowth && <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Spiritual Growth</p><p className="text-sm text-gray-700 dark:text-gray-300">{ref.spiritualGrowth}</p></div>}
                  {ref.nextWeekPlan && <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Next Week Plan</p><p className="text-sm text-gray-700 dark:text-gray-300">{ref.nextWeekPlan}</p></div>}
                </div>
              </motion.div>
            ))}
            {weeklyReflections.length === 0 && (
              <div className="text-center py-12">
                <HiOutlinePencil className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">{t("common.emptyState")}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
