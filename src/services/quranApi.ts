interface ApiVerse {
  number: number;
  text: string;
  translation?: string;
  surah: { number: number; name: string; englishName: string };
  numberInSurah: number;
  juz: number;
  page: number;
}

interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  ayahs: ApiVerse[];
}

const CACHE_KEY = "quran-api-cache";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  data: ApiSurah[];
  timestamp: number;
}

function getCache(): ApiSurah[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: ApiSurah[]) {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable — ignore
  }
}

const BASE = "https://api.alquran.cloud/v1";

async function fetchSurah(surahNumber: number): Promise<ApiSurah> {
  // Fetch Arabic + 2 translations in parallel
  const [arabicRes, enRes] = await Promise.all([
    fetch(`${BASE}/surah/${surahNumber}`),
    fetch(`${BASE}/surah/${surahNumber}/en.asad`),
  ]);

  if (!arabicRes.ok || !enRes.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);

  const arabicData = await arabicRes.json();
  const enData = await enRes.json();

  const arabicAyahs = arabicData.data.ayahs;
  const enAyahs = enData.data.ayahs;

  return {
    number: surahNumber,
    name: arabicData.data.name,
    englishName: arabicData.data.englishName,
    ayahs: arabicAyahs.map((a: { number: number; text: string; numberInSurah: number; juz: number; page: number }, i: number) => ({
      number: a.number,
      text: a.text,
      translation: enAyahs[i]?.text || "",
      surah: { number: surahNumber, name: arabicData.data.name, englishName: arabicData.data.englishName },
      numberInSurah: a.numberInSurah,
      juz: a.juz,
      page: a.page,
    })),
  };
}

export interface QuranVerse {
  id: string;
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
  juz: number;
  page: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  verses: QuranVerse[];
}

export async function getSurah(surahNumber: number): Promise<QuranSurah> {
  const cache = getCache();
  if (cache) {
    const found = cache.find((s) => s.number === surahNumber);
    if (found) return toQuranSurah(found);
  }

  const surah = await fetchSurah(surahNumber);

  const existing = getCache() || [];
  const idx = existing.findIndex((s) => s.number === surahNumber);
  if (idx >= 0) existing[idx] = surah;
  else existing.push(surah);
  setCache(existing);

  return toQuranSurah(surah);
}

export async function getAllSurahs(): Promise<QuranSurah[]> {
  const cache = getCache();
  if (cache && cache.length > 10) return cache.map(toQuranSurah);

  const metaRes = await fetch(`${BASE}/surah`);
  if (!metaRes.ok) throw new Error("Failed to fetch surah list");
  const metaData = await metaRes.json();
  const surahList = metaData.data as { number: number; name: string; englishName: string }[];

  const results: ApiSurah[] = [];

  for (const info of surahList) {
    try {
      const surah = await fetchSurah(info.number);
      results.push(surah);
    } catch {
      // Skip failed surahs
    }
  }

  setCache(results);
  return results.map(toQuranSurah);
}

export async function getVersesByThemesApi(themes: string[]): Promise<QuranVerse[]> {
  const cache = getCache();
  if (!cache) return [];

  const all: QuranVerse[] = cache.flatMap((s) => s.ayahs.map((a) => ({
    id: `q-${a.number}`,
    surah: s.englishName,
    surahNumber: s.number,
    ayahNumber: a.numberInSurah,
    arabic: a.text,
    translation: a.translation || "",
    juz: a.juz,
    page: a.page,
  })));
  const keywordMap: Record<string, string[]> = getKeywordMap();
  const searchTerms = themes.flatMap((t) => keywordMap[t.toLowerCase()] || [t.toLowerCase()]);

  return all.filter((v) => {
    const lower = v.translation.toLowerCase();
    return searchTerms.some((term) => lower.includes(term));
  }).slice(0, 20);
}

function toQuranSurah(s: ApiSurah): QuranSurah {
  return {
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    verses: s.ayahs.map((a) => ({
      id: `q-${a.number}`,
      surah: s.englishName,
      surahNumber: s.number,
      ayahNumber: a.numberInSurah,
      arabic: a.text,
      translation: a.translation || "",
      juz: a.juz,
      page: a.page,
    })),
  };
}

function getKeywordMap(): Record<string, string[]> {
  return {
    hope: ["hope", "hopeful", "optimistic", "merciful", "mercy", "forgive", "paradise", "reward", "bless"],
    comfort: ["comfort", "ease", "relief", "peace", "rest", "soothe", "gentle", "kind", "patient"],
    patience: ["patient", "patience", "endure", "persevere", "steadfast", "trial", "test", "sabr"],
    trust: ["trust", "rely", "sufficient", "protector", "guardian", "depend", "reliance"],
    mercy: ["mercy", "merciful", "compassion", "forgive", "pardoning", "gracious", "rahmah"],
    forgiveness: ["forgive", "pardon", "repent", "tawbah", "sin", "guilt", "wrongdoing"],
    gratitude: ["grateful", "thankful", "thanks", "blessing", "shukr", "alhamdulillah", "favor"],
    peace: ["peace", "calm", "tranquil", "serene", "safe", "security", "salam", "reassure"],
    guidance: ["guide", "guidance", "path", "straight", "way", "direct", "show", "lead"],
    healing: ["heal", "cure", "remedy", "recover", "shifa", "health", "wellness"],
    strength: ["strong", "strength", "might", "power", "mighty", "force", "capable"],
    motivation: ["strive", "effort", "work", "deed", "action", "goal", "purpose", "determine"],
    protection: ["protect", "guard", "safe", "refuge", "shelter", "defend", "shield", "preserve"],
    blessings: ["bless", "favor", "provision", "rizq", "sustain", "provide", "generous", "bounty"],
  };
}
