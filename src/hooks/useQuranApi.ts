"use client";
import { useState, useCallback } from "react";
import { getSurah, getAllSurahs, QuranSurah, QuranVerse } from "@/services/quranApi";
import { verses as mockVerses } from "@/data/verses";

export function useQuranApi() {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allVerses, setAllVerses] = useState<(QuranVerse | typeof mockVerses[0])[]>(mockVerses);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSurahs();
      setSurahs(data);
      const apiVerses: QuranVerse[] = data.flatMap((s) => s.verses);
      setAllVerses([...mockVerses, ...apiVerses]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load Quran data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSurah = useCallback(async (number: number) => {
    try {
      const surah = await getSurah(number);
      setSurahs((prev) => {
        const idx = prev.findIndex((s) => s.number === number);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = surah;
          return next;
        }
        return [...prev, surah];
      });
      return surah;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load surah");
      return null;
    }
  }, []);

  return {
    surahs,
    loading,
    error,
    allVerses,
    loadSurah,
    refresh: loadAll,
  };
}
