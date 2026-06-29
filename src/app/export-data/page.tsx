"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { useApp } from "@/context/AppProviders";
import { HiOutlineDownload, HiOutlineUpload, HiOutlineCheckCircle } from "react-icons/hi";

export default function ExportDataPage() {
  const { t } = useTranslation();
  const { favorites, readingSessions, journalEntries, adhkarSessions, sadaqahEntries, quizHistory } = useApp();
  const [status, setStatus] = useState<"idle" | "exported" | "imported">("idle");

  const dataCounts = [
    { label: t("exportData.readingHistory"), count: readingSessions.length },
    { label: t("exportData.journalEntries"), count: journalEntries.length },
    { label: t("exportData.adhkarSessions"), count: adhkarSessions.length },
    { label: t("exportData.sadaqahEntries"), count: sadaqahEntries.length },
    { label: t("exportData.quizResults"), count: quizHistory.length },
  ];

  const exportData = () => {
    const backup: any = {};
    const keys = ["qf_favorites", "qf_reading_stats", "qf_journal", "qf_adhkar_sessions", "qf_sadaqah_entries", "qf_quiz_history", "qf_weekly_reflections"];
    keys.forEach((k) => { const v = localStorage.getItem(k); if (v) backup[k] = JSON.parse(v); });
    backup._exportDate = new Date().toISOString();
    backup._version = "1.0";
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `quran-companion-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    setStatus("exported"); setTimeout(() => setStatus("idle"), 3000);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          Object.entries(data).forEach(([k, v]) => { if (k.startsWith("qf_") || k.startsWith("_")) localStorage.setItem(k, JSON.stringify(v)); });
          setStatus("imported"); setTimeout(() => window.location.reload(), 1500);
        } catch { alert("Invalid backup file"); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-2xl"><HiOutlineDownload className="w-7 h-7 text-sky-600 dark:text-sky-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("exportData.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("exportData.subtitle")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t("exportData.backupInfo")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dataCounts.map((d) => (
                <div key={d.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{d.count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{d.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={exportData}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 text-center hover:border-[var(--accent)] transition-colors">
              <HiOutlineDownload className="w-10 h-10 text-[var(--accent)] mx-auto mb-3" />
              <p className="font-medium text-gray-900 dark:text-white mb-1">{t("exportData.export")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("exportData.exportDesc")}</p>
            </button>
            <button onClick={importData}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 text-center hover:border-green-500 transition-colors">
              <HiOutlineUpload className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="font-medium text-gray-900 dark:text-white mb-1">{t("exportData.import")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("exportData.importDesc")}</p>
            </button>
          </div>

          {status !== "idle" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 justify-center py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl">
              <HiOutlineCheckCircle className="w-5 h-5" />
              {status === "exported" ? t("exportData.exportSuccess") : t("exportData.importSuccess")}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
