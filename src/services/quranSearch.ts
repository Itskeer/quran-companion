import { QuranVerse } from "./quranApi";

export interface SearchResult {
  verse: QuranVerse;
  score: number;
  matchType: "arabic" | "translation" | "both";
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0610-\u061A\u06D6-\u06ED]/g, "")
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateScore(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();

  if (normalizedText === normalizedQuery) return 100;

  if (normalizedText.startsWith(normalizedQuery)) return 90;

  if (normalizedText.includes(normalizedQuery)) return 70;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const textWords = normalizedText.split(/\s+/).filter(Boolean);
  let matchedWords = 0;

  for (const qw of queryWords) {
    for (const tw of textWords) {
      if (tw === qw) {
        matchedWords++;
        break;
      }
      if (tw.includes(qw) || qw.includes(tw)) {
        matchedWords += 0.5;
        break;
      }
    }
  }

  if (matchedWords > 0) {
    return (matchedWords / queryWords.length) * 50;
  }

  return 0;
}

function arabicScore(query: string, arabic: string): number {
  let q = query.replace(/[^\u0600-\u06FF\s]/g, "").trim();
  let a = arabic;

  if (q.length === 0) return 0;

  const exact = a.includes(q);
  const score = calculateScore(q, a);

  if (exact) return Math.max(score, 80);
  return score;
}

export function searchQuran(verses: QuranVerse[], query: string): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const verse of verses) {
    const transScore = calculateScore(normalizedQuery, verse.translation || "");
    const arScore = arabicScore(query, verse.arabic);

    let totalScore = 0;
    let matchType: "arabic" | "translation" | "both" = "translation";

    if (transScore > 0 && arScore > 0) {
      totalScore = transScore * 0.6 + arScore * 0.4;
      matchType = "both";
    } else if (transScore > 0) {
      totalScore = transScore;
      matchType = "translation";
    } else if (arScore > 0) {
      totalScore = arScore;
      matchType = "arabic";
    }

    if (totalScore > 0) {
      results.push({ verse, score: totalScore, matchType });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 50);
}

export function searchBySurah(
  verses: QuranVerse[],
  surahNumber: number,
  query: string
): SearchResult[] {
  const filtered = verses.filter((v) => v.surahNumber === surahNumber);
  return searchQuran(filtered, query);
}

export function searchByJuz(
  verses: QuranVerse[],
  juz: number,
  query: string
): SearchResult[] {
  const filtered = verses.filter((v) => v.juz === juz);
  return searchQuran(filtered, query);
}

export function searchByPage(
  verses: QuranVerse[],
  page: number,
  query: string
): SearchResult[] {
  const filtered = verses.filter((v) => v.page === page);
  return searchQuran(filtered, query);
}
