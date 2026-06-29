"use client";
import { useMemo } from "react";
import { useApp } from "@/context/AppProviders";
import { DailyProgress } from "@/types";

export function useDailyProgress(): DailyProgress & {
  completionPercent: number;
} {
  const { dailyProgress, checkIns, dhikrSessions, readingSessions } =
    useApp();

  return useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    const existing = dailyProgress.find((p) => p.date === today);
    const base: DailyProgress = existing || {
      date: today,
      versesRead: 0,
      duasMade: 0,
      dhikrDone: 0,
      checkedIn: false,
    };

    const todaySessions = readingSessions.filter(
      (s) => s.date.split("T")[0] === today
    );
    const todayDhikrSessions = dhikrSessions.filter(
      (d) => d.date.split("T")[0] === today
    );
    const todayCheckIn = checkIns.some((c) => c.date === today);

    const versesRead = Math.max(
      base.versesRead,
      todaySessions.reduce((sum, s) => sum + (s.ayahEnd - s.ayahStart + 1), 0)
    );
    const dhikrDone = Math.max(
      base.dhikrDone,
      todayDhikrSessions.reduce((sum, d) => sum + d.completed, 0)
    );
    const checkedIn = base.checkedIn || todayCheckIn;

    let completedTasks = 0;
    if (versesRead > 0) completedTasks += 25;
    if (base.duasMade > 0) completedTasks += 25;
    if (dhikrDone > 0) completedTasks += 25;
    if (checkedIn) completedTasks += 25;

    return {
      date: today,
      versesRead,
      duasMade: base.duasMade,
      dhikrDone,
      checkedIn,
      completionPercent: completedTasks,
    };
  }, [dailyProgress, checkIns, dhikrSessions, readingSessions]);
}
