"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineHeart, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

const TYPES = ["money", "time", "knowledge", "kindness", "other"] as const;

export default function SadaqahPage() {
  const { t } = useTranslation();
  const { sadaqahEntries, addSadaqahEntry, removeSadaqahEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<string>("money");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) return;
    addSadaqahEntry({
      id: Date.now().toString(), date: new Date().toISOString().split("T")[0],
      amount: amount ? Number(amount) : undefined, type: type as typeof TYPES[number],
      description: description.trim(), isAnonymous: anonymous,
    });
    setShowForm(false); setAmount(""); setDescription(""); setType("money"); setAnonymous(false);
  };

  const totalMoney = sadaqahEntries.filter((e) => e.type === "money").reduce((s, e) => s + (e.amount || 0), 0);
  const byType = TYPES.map((ty) => ({ type: ty, count: sadaqahEntries.filter((e) => e.type === ty).length }));

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
                <HiOutlineHeart className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("sadaqah.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("sadaqah.subtitle")}</p>
              </div>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="p-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sadaqahEntries.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("sadaqah.totalEntries")}</p>
            </div>
            {byType.filter((b) => b.count > 0).slice(0, 3).map((b) => (
              <div key={b.type} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{b.count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t(`sadaqah.${b.type}`)}</p>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 mb-6 overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("sadaqah.type")}</label>
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map((ty) => (
                        <button key={ty} onClick={() => setType(ty)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${type === ty ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                          {t(`sadaqah.${ty}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {type === "money" && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">{t("sadaqah.amount")}</label>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white" />
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">{t("sadaqah.description")}</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("sadaqah.isAnonymous")}</span>
                  </label>
                  <button onClick={handleSubmit}
                    className="w-full py-2.5 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium">
                    {t("sadaqah.logEntry")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {sadaqahEntries.map((entry) => (
              <motion.div key={entry.id} layout
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{entry.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.date} · {t(`sadaqah.${entry.type}`)} {entry.amount ? `· $${entry.amount}` : ""}
                  </p>
                </div>
                <button onClick={() => removeSadaqahEntry(entry.id)} className="p-2 text-red-400 hover:text-red-600">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            {sadaqahEntries.length === 0 && (
              <div className="text-center py-12">
                <HiOutlineHeart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">{t("common.emptyState")}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
