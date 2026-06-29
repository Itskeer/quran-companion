"use client";

import type { MemorizationSurah } from "@/types";
import { surahList } from "@/data/surahs";

const MEMORIZATION_KEY = "quran-companion-memorization";

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 90];

function getMasteryLevel(
  memorized: number,
  total: number,
  reviewCount: number
): MemorizationSurah["masteryLevel"] {
  if (memorized === 0) return "new";
  if (memorized === total && reviewCount >= 5) return "mastered";
  if (memorized >= total * 0.7) return "reviewing";
  return "learning";
}

export function getMemorizationData(): MemorizationSurah[] {
  try {
    const raw = localStorage.getItem(MEMORIZATION_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMemorizationData(data: MemorizationSurah[]): void {
  try {
    localStorage.setItem(MEMORIZATION_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function updateMemorization(
  surahNumber: number,
  ayahsMemorized: number
): MemorizationSurah[] {
  const data = getMemorizationData();
  const surahInfo = surahList.find((s) => s.number === surahNumber);
  const totalAyahs = surahInfo?.ayahCount || 0;

  const existing = data.find((s) => s.surahNumber === surahNumber);
  const now = new Date().toISOString();

  if (existing) {
    existing.memorizedAyahs = ayahsMemorized;
    existing.lastPracticed = now;
    existing.masteryLevel = getMasteryLevel(
      ayahsMemorized,
      totalAyahs,
      existing.reviewCount
    );
    existing.nextReview = calculateNextReview(existing);
  } else {
    const entry: MemorizationSurah = {
      surahNumber,
      name: surahInfo?.name || "",
      nameArabic: "",
      totalAyahs,
      memorizedAyahs: ayahsMemorized,
      lastPracticed: now,
      nextReview: "",
      reviewCount: 0,
      masteryLevel: getMasteryLevel(ayahsMemorized, totalAyahs, 0),
    };
    entry.nextReview = calculateNextReview(entry);
    data.push(entry);
  }

  saveMemorizationData(data);
  return data;
}

export function calculateNextReview(surah: MemorizationSurah): string {
  const intervalIndex = Math.min(surah.reviewCount, REVIEW_INTERVALS.length - 1);
  const days = REVIEW_INTERVALS[intervalIndex];
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function getNextReviewSurahs(): MemorizationSurah[] {
  const data = getMemorizationData();
  const now = new Date().toISOString();
  return data.filter((s) => s.memorizedAyahs > 0 && s.nextReview <= now);
}

export function getOverallStats(): {
  totalAyahs: number;
  memorized: number;
  percentage: number;
  mastered: number;
} {
  const data = getMemorizationData();
  let totalAyahs = 0;
  let memorized = 0;
  let mastered = 0;

  for (const s of data) {
    totalAyahs += s.totalAyahs;
    memorized += s.memorizedAyahs;
    if (s.masteryLevel === "mastered") mastered++;
  }

  return {
    totalAyahs,
    memorized,
    percentage: totalAyahs > 0 ? Math.round((memorized / totalAyahs) * 100) : 0,
    mastered,
  };
}
