"use client";

const TAFSIR_CACHE_KEY = "quran-companion-tafsir-cache";
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000;

interface TafsirCacheEntry {
  data: string;
  timestamp: number;
}

interface TafsirCache {
  [key: string]: TafsirCacheEntry;
}

function getCacheKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

function readCache(): TafsirCache {
  try {
    const raw = localStorage.getItem(TAFSIR_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeCache(cache: TafsirCache): void {
  try {
    localStorage.setItem(TAFSIR_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable
  }
}

function isCacheValid(entry: TafsirCacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_EXPIRY;
}

export async function fetchTafsir(surahNumber: number, ayahNumber: number): Promise<string> {
  const key = getCacheKey(surahNumber, ayahNumber);
  const cache = readCache();

  if (cache[key] && isCacheValid(cache[key])) {
    return cache[key].data;
  }

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/ar-tafsir-ibn-kathir`
    );
    if (!res.ok) return "";

    const data = await res.json();
    const text = data.data?.text || "";

    cache[key] = { data: text, timestamp: Date.now() };
    writeCache(cache);

    return text;
  } catch {
    return "";
  }
}

export async function fetchSurahTafsir(surahNumber: number): Promise<Record<number, string>> {
  const cache = readCache();
  const result: Record<number, string> = {};
  const ayahsToFetch: number[] = [];

  const totalAyahs = await getAyahCount(surahNumber);

  for (let i = 1; i <= totalAyahs; i++) {
    const key = getCacheKey(surahNumber, i);
    if (cache[key] && isCacheValid(cache[key])) {
      result[i] = cache[key].data;
    } else {
      ayahsToFetch.push(i);
    }
  }

  if (ayahsToFetch.length > 0) {
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/ar-tafsir-ibn-kathir`
      );
      if (res.ok) {
        const data = await res.json();
        const ayahs = data.data?.ayahs || [];
        for (const ayah of ayahs) {
          const ayahNum = ayah.numberInSurah;
          result[ayahNum] = ayah.text;
          cache[getCacheKey(surahNumber, ayahNum)] = {
            data: ayah.text,
            timestamp: Date.now(),
          };
        }
        writeCache(cache);
      }
    } catch {
      // Fall back to individual fetches
      for (const ayahNum of ayahsToFetch) {
        const tafsir = await fetchTafsir(surahNumber, ayahNum);
        if (tafsir) result[ayahNum] = tafsir;
      }
    }
  }

  return result;
}

async function getAyahCount(surahNumber: number): Promise<number> {
  const ayahCounts: Record<number, number> = {
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
  return ayahCounts[surahNumber] || 7;
}
