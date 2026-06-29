"use client";

import type { ExportData } from "@/types";

const BACKUP_DATE_KEY = "quran-companion-last-backup";

export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("quran-companion")) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || "null");
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }

  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    settings: (data["quran-companion-settings"] as ExportData["settings"]) || {
      darkMode: false,
      fontSize: "medium",
      accentColor: "#198754",
      autoPlay: false,
      animations: true,
      offlineMode: false,
      audioQuality: "medium",
    },
    favorites: (data["quran-companion-favorites"] as ExportData["favorites"]) || {
      verses: [],
      duas: [],
      readingLists: [],
    },
    bookmarks: (data["quran-companion-bookmarks"] as ExportData["bookmarks"]) || [],
    readingProgress: (data["quran-companion-reading-progress"] as ExportData["readingProgress"]) || [],
    checkIns: (data["quran-companion-checkins"] as ExportData["checkIns"]) || [],
    journalEntries: (data["quran-companion-journal"] as ExportData["journalEntries"]) || [],
    collections: (data["quran-companion-collections"] as ExportData["collections"]) || [],
    memorization: (data["quran-companion-memorization"] as ExportData["memorization"]) || [],
    readingPlan: (data["quran-companion-reading-plan"] as ExportData["readingPlan"]) || null,
    adhkarSessions: (data["quran-companion-adhkar-sessions"] as ExportData["adhkarSessions"]) || [],
    istighfarHistory: (data["quran-companion-istighfar"] as ExportData["istighfarHistory"]) || [],
    sadaqahEntries: (data["quran-companion-sadaqah"] as ExportData["sadaqahEntries"]) || [],
    quizHistory: (data["quran-companion-quiz-history"] as ExportData["quizHistory"]) || [],
    duaRequests: (data["quran-companion-dua-requests"] as ExportData["duaRequests"]) || [],
    weeklyReflections: (data["quran-companion-reflections"] as ExportData["weeklyReflections"]) || [],
    customThemes: (data["quran-companion-custom-themes"] as ExportData["customThemes"]) || [],
    sunnahPrayerLog: (data["quran-companion-sunnah-prayers"] as ExportData["sunnahPrayerLog"]) || {},
  };
}

export function downloadBackup(): void {
  const data = exportAllData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `quran-companion-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  try {
    localStorage.setItem(BACKUP_DATE_KEY, new Date().toISOString());
  } catch {
    // Ignore
  }
}

export function importBackup(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportData;

        if (!data.version || !data.exportDate) {
          resolve(false);
          return;
        }

        const keyMap: Record<string, unknown> = {
          "quran-companion-settings": data.settings,
          "quran-companion-favorites": data.favorites,
          "quran-companion-bookmarks": data.bookmarks,
          "quran-companion-reading-progress": data.readingProgress,
          "quran-companion-checkins": data.checkIns,
          "quran-companion-journal": data.journalEntries,
          "quran-companion-collections": data.collections,
          "quran-companion-memorization": data.memorization,
          "quran-companion-reading-plan": data.readingPlan,
          "quran-companion-adhkar-sessions": data.adhkarSessions,
          "quran-companion-istighfar": data.istighfarHistory,
          "quran-companion-sadaqah": data.sadaqahEntries,
          "quran-companion-quiz-history": data.quizHistory,
          "quran-companion-dua-requests": data.duaRequests,
          "quran-companion-reflections": data.weeklyReflections,
          "quran-companion-custom-themes": data.customThemes,
          "quran-companion-sunnah-prayers": data.sunnahPrayerLog,
        };

        for (const [key, value] of Object.entries(keyMap)) {
          if (value !== undefined && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        }

        resolve(true);
      } catch {
        resolve(false);
      }
    };

    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}

export function getLastBackupDate(): string | null {
  try {
    return localStorage.getItem(BACKUP_DATE_KEY);
  } catch {
    return null;
  }
}
