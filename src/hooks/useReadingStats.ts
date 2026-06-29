"use client";
import { useMemo } from "react";
import { useApp } from "@/context/AppProviders";
import { ReadingStats } from "@/types";

export function useReadingStats(): ReadingStats {
  const { readingSessions, readingProgress } = useApp();

  return useMemo(() => {
    const totalVersesRead = readingProgress.reduce(
      (sum, p) => sum + p.totalVersesRead,
      0
    );

    const totalTimeSpent = readingSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    const surahCounts: Record<number, number> = {};
    for (const session of readingSessions) {
      surahCounts[session.surahNumber] =
        (surahCounts[session.surahNumber] || 0) + 1;
    }
    const favoriteSurahs = Object.entries(surahCounts)
      .map(([surah, count]) => ({
        surahNumber: Number(surah),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const sessionDates = new Set(
      readingSessions.map((s) => s.date.split("T")[0])
    );
    const sortedDates = Array.from(sessionDates).sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    if (sortedDates.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            streak = 1;
          } else {
            const current = new Date(sortedDates[i - 1]);
            const prev = new Date(sortedDates[i]);
            const diffDays =
              (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
              streak += 1;
            } else {
              longestStreak = Math.max(longestStreak, streak);
              streak = 1;
            }
          }
        }
        longestStreak = Math.max(longestStreak, streak);
        if (sortedDates[0] === today) {
          currentStreak = streak;
        } else {
          currentStreak = streak - 1;
          if (currentStreak < 0) currentStreak = 0;
        }
      } else {
        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            streak = 1;
          } else {
            const current = new Date(sortedDates[i - 1]);
            const prev = new Date(sortedDates[i]);
            const diffDays =
              (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
              streak += 1;
            } else {
              longestStreak = Math.max(longestStreak, streak);
              streak = 1;
            }
          }
        }
        longestStreak = Math.max(longestStreak, streak);
        currentStreak = 0;
      }
    }

    return {
      totalVersesRead,
      totalTimeSpent,
      favoriteSurahs,
      currentStreak,
      longestStreak,
      totalSessions: readingSessions.length,
    };
  }, [readingSessions, readingProgress]);
}
