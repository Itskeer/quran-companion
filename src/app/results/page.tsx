"use client";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { verses } from "@/data/verses";
import { duas } from "@/data/duas";
import { rankByThemes } from "@/utils/matching";
import { usePageTitle } from "@/hooks/usePageTitle";
import VerseCard from "@/components/VerseCard";
import DuaCard from "@/components/DuaCard";

function ResultsContent() {
  usePageTitle("Your Results");
  const searchParams = useSearchParams();

  const { moodIds, note } = useMemo(() => ({
    moodIds: searchParams.get("moods")?.split(",") || [],
    note: searchParams.get("note") || "",
  }), [searchParams]);

  const selectedMoods = useMemo(
    () => moods.filter((m) => moodIds.includes(m.id)),
    [moodIds]
  );

  const allThemes = useMemo(
    () => [...new Set(selectedMoods.flatMap((m) => m.themes))],
    [selectedMoods]
  );

  const scoredVerses = useMemo(
    () => rankByThemes(verses, allThemes, note).filter((r) => r.score > 0),
    [allThemes, note]
  );

  const scoredDuas = useMemo(
    () => rankByThemes(duas, allThemes, note).filter((r) => r.score > 0),
    [allThemes, note]
  );

  const topThemes = useMemo(() => {
    const themeScores: Record<string, number> = {};
    scoredVerses.forEach((r) => r.matchedThemes.forEach((t) => { themeScores[t] = (themeScores[t] || 0) + r.score; }));
    return Object.entries(themeScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  }, [scoredVerses]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-4xl mb-4">🌙</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-3">
            Your Personalized Results
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Based on your mood{selectedMoods.length > 1 ? "s" : ""}:{" "}
            {selectedMoods.map((m) => m.emoji + " " + m.label).join(", ")}
          </p>
          {note && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 italic">
              &ldquo;{note}&rdquo;
            </p>
          )}
        </motion.div>

        {scoredVerses.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-dark dark:text-white mb-6 flex items-center gap-2"
            >
              <span>📜</span> Quran Verses
              <span className="text-xs font-normal text-gray-400 ml-1">
                (sorted by relevance)
              </span>
            </motion.h2>
            <div className="space-y-4">
              {scoredVerses.map(({ item: verse, score }, i) => (
                <div key={verse.id} className="relative">
                  {i === 0 && score > 0.5 && (
                    <span className="absolute -top-2 -right-2 z-10 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Best Match
                    </span>
                  )}
                  <VerseCard verse={verse} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {scoredVerses.length === 0 && scoredDuas.length > 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8">
            No strongly matching verses found, but here are relevant duas.
          </p>
        )}

        {scoredDuas.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold text-dark dark:text-white mb-6 flex items-center gap-2"
            >
              <span>🤲</span> Recommended Duas
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {scoredDuas.map(({ item: dua }, i) => (
                <DuaCard key={dua.id} dua={dua} index={i} />
              ))}
            </div>
          </section>
        )}

        {scoredVerses.length === 0 && scoredDuas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-400 dark:text-gray-500">
              Try selecting more moods or adding more detail to your note.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 mb-8"
        >
          <h3 className="font-semibold text-dark dark:text-white mb-3">Reflection</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            These verses are commonly associated with{" "}
            {topThemes.length > 0 ? topThemes.join(", ") : allThemes.slice(0, 3).join(", ")}.
            Take your time reading and reflecting.
          </p>
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              ⚠️ This recommendation is generated by matching themes. It is not a
              religious ruling or personalized religious advice.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
          <div className="w-8 h-8 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
