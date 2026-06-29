"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineHeart, HiOutlinePlus } from "react-icons/hi";

const CATEGORIES = ["health", "guidance", "forgiveness", "family", "work", "other"] as const;

export default function DuaRequestsPage() {
  const { t } = useTranslation();
  const { duaRequests, addDuaRequest, prayForRequest } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("health");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addDuaRequest({
      id: Date.now().toString(), date: new Date().toISOString().split("T")[0],
      text: text.trim(), category: category as typeof CATEGORIES[number],
      isAnonymous: anonymous, prayersCount: 0, author: anonymous ? "Anonymous" : author.trim() || "Anonymous",
    });
    setShowForm(false); setText(""); setAuthor(""); setCategory("health"); setAnonymous(false);
  };

  const stats = { total: duaRequests.length, totalPrayers: duaRequests.reduce((s, r) => s + r.prayersCount, 0) };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl"><HiOutlineHeart className="w-7 h-7 text-rose-600 dark:text-rose-400" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("duaRequests.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("duaRequests.subtitle")}</p>
              </div>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="p-3 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl"><HiOutlinePlus className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("duaRequests.totalRequests")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 text-center">
              <p className="text-2xl font-bold text-[var(--accent)]">{stats.totalPrayers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("duaRequests.prayerCount")}</p>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 mb-6 overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">{t("duaRequests.category")}</label>
                    <div className="flex flex-wrap gap-2">{CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${category === cat ? "bg-[var(--accent)] text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>{cat}</button>
                    ))}</div>
                  </div>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={t("duaRequests.textPlaceholder")}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none" />
                  <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={t("duaRequests.authorPlaceholder")}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("duaRequests.isAnonymous")}</span>
                  </label>
                  <button onClick={handleSubmit} className="w-full py-2.5 bg-[var(--accent)] text-white dark:text-gray-900 rounded-xl font-medium">{t("duaRequests.submitRequest")}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {duaRequests.map((req) => (
              <motion.div key={req.id} layout className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{req.date} · {req.author}</p>
                  <span className="text-xs px-2 py-1 rounded-full capitalize bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{req.category}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{req.text}</p>
                <button onClick={() => prayForRequest(req.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors">
                  <HiOutlineHeart className="w-4 h-4" /> {req.prayersCount}
                </button>
              </motion.div>
            ))}
            {duaRequests.length === 0 && (
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
