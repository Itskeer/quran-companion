"use client";

import type { ReadingPlan, ReadingPlanDay } from "@/types";
import { surahList } from "@/data/surahs";

const READING_PLAN_KEY = "quran-companion-reading-plan";

const TOTAL_QURAN_Ayahs = 6236;

interface SurahRange {
  number: number;
  name: string;
  ayahCount: number;
}

function getFullSurahList(): SurahRange[] {
  const allAyahCounts: Record<number, number> = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75,
    9: 129, 10: 109, 11: 123, 12: 111, 13: 43, 14: 52, 15: 99,
    16: 128, 17: 111, 18: 110, 19: 98, 20: 135, 21: 112, 22: 78,
    23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69,
    30: 60, 31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83,
    37: 182, 38: 88, 39: 75, 40: 85, 41: 54, 42: 53, 43: 89,
    44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
    51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29,
    58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18,
    65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44, 71: 28,
    72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40,
    79: 46, 80: 42, 81: 29, 82: 19, 83: 36, 84: 25, 85: 22,
    86: 17, 87: 19, 88: 26, 89: 30, 90: 20, 91: 15, 92: 21,
    93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8,
    100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4,
    107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6,
  };

  const result: SurahRange[] = [];
  for (let i = 1; i <= 114; i++) {
    result.push({
      number: i,
      name: surahList.find((s) => s.number === i)?.name || `Surah ${i}`,
      ayahCount: allAyahCounts[i] || 7,
    });
  }
  return result;
}

function distributeAyahs(totalDays: number): ReadingPlanDay[] {
  const surahs = getFullSurahList();
  const days: ReadingPlanDay[] = [];
  let currentSurahIdx = 0;
  let currentAyah = 1;
  const ayahsPerDay = Math.ceil(TOTAL_QURAN_Ayahs / totalDays);

  for (let day = 1; day <= totalDays; day++) {
    const startSurah = surahs[currentSurahIdx].number;
    const startAyah = currentAyah;
    let remaining = ayahsPerDay;

    while (remaining > 0 && currentSurahIdx < surahs.length) {
      const surahAyahs = surahs[currentSurahIdx].ayahCount;
      const available = surahAyahs - currentAyah + 1;
      const toRead = Math.min(remaining, available);
      currentAyah += toRead;
      remaining -= toRead;

      if (currentAyah > surahAyahs) {
        currentSurahIdx++;
        currentAyah = 1;
      }
    }

    const endSurah = currentSurahIdx > 0
      ? surahs[Math.min(currentSurahIdx, surahs.length - 1)].number
      : startSurah;
    const endAyah = currentAyah > 1 ? currentAyah - 1 : surahs[Math.min(currentSurahIdx - 1, surahs.length - 1)]?.ayahCount || 1;

    days.push({
      day,
      surahStart: startSurah,
      ayahStart: startAyah,
      surahEnd: endSurah,
      ayahEnd: currentSurahIdx > 0 && currentAyah === 1
        ? surahs[Math.max(0, currentSurahIdx - 1)].ayahCount
        : endAyah,
      completed: false,
    });
  }

  return days;
}

export function createReadingPlan(
  type: "30day" | "60day" | "custom",
  totalDays?: number,
  dailyGoal?: number
): ReadingPlan {
  const days = type === "30day" ? 30 : type === "60day" ? 60 : (totalDays || 30);

  const plan: ReadingPlan = {
    id: `plan-${Date.now()}`,
    name: type === "30day" ? "30-Day Quran Plan" : type === "60day" ? "60-Day Quran Plan" : `${days}-Day Custom Plan`,
    type,
    totalDays: days,
    currentDay: 1,
    startDate: new Date().toISOString(),
    dailyGoal: dailyGoal || Math.ceil(TOTAL_QURAN_Ayahs / days),
    progress: distributeAyahs(days),
    completed: false,
  };

  try {
    localStorage.setItem(READING_PLAN_KEY, JSON.stringify(plan));
  } catch {
    // Storage full or unavailable
  }

  return plan;
}

export function getCurrentPlan(): ReadingPlan | null {
  try {
    const raw = localStorage.getItem(READING_PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePlan(plan: ReadingPlan): void {
  try {
    localStorage.setItem(READING_PLAN_KEY, JSON.stringify(plan));
  } catch {
    // Storage full or unavailable
  }
}

export function markDayComplete(day: number): void {
  const plan = getCurrentPlan();
  if (!plan) return;

  const dayEntry = plan.progress.find((d) => d.day === day);
  if (dayEntry) {
    dayEntry.completed = true;
  }

  if (day >= plan.currentDay) {
    plan.currentDay = day + 1;
  }

  if (plan.progress.every((d) => d.completed)) {
    plan.completed = true;
  }

  savePlan(plan);
}

export function getTodayGoal(plan: ReadingPlan): ReadingPlanDay | null {
  return plan.progress.find((d) => d.day === plan.currentDay) || null;
}

export function getPlanProgress(plan: ReadingPlan): {
  completed: number;
  remaining: number;
  percentage: number;
} {
  const completed = plan.progress.filter((d) => d.completed).length;
  const remaining = plan.totalDays - completed;
  return {
    completed,
    remaining,
    percentage: Math.round((completed / plan.totalDays) * 100),
  };
}
