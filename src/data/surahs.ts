import { verses } from "./verses";

export interface SurahInfo {
  number: number;
  name: string;
  ayahCount: number;
}

export const surahList: SurahInfo[] = [
  { number: 1, name: "Al-Fatihah", ayahCount: 7 },
  { number: 2, name: "Al-Baqarah", ayahCount: 286 },
  { number: 3, name: "Al-Imran", ayahCount: 200 },
  { number: 7, name: "Al-A'raf", ayahCount: 206 },
  { number: 12, name: "Yusuf", ayahCount: 111 },
  { number: 13, name: "Ar-Ra'd", ayahCount: 43 },
  { number: 17, name: "Al-Isra", ayahCount: 111 },
  { number: 20, name: "Ta-Ha", ayahCount: 135 },
  { number: 21, name: "Yunus", ayahCount: 109 },
  { number: 29, name: "Al-Ankabut", ayahCount: 69 },
  { number: 33, name: "Al-Ahzab", ayahCount: 73 },
  { number: 39, name: "Az-Zumar", ayahCount: 75 },
  { number: 40, name: "Ghafir", ayahCount: 85 },
  { number: 49, name: "Al-Hujurat", ayahCount: 18 },
  { number: 55, name: "Ar-Rahman", ayahCount: 78 },
  { number: 65, name: "At-Talaq", ayahCount: 12 },
  { number: 67, name: "Al-Mulk", ayahCount: 30 },
  { number: 89, name: "Al-Fajr", ayahCount: 30 },
  { number: 92, name: "Al-Lail", ayahCount: 21 },
  { number: 93, name: "Ad-Duha", ayahCount: 11 },
  { number: 94, name: "Ash-Sharh", ayahCount: 8 },
  { number: 97, name: "Al-Qadr", ayahCount: 5 },
  { number: 104, name: "Al-Humazah", ayahCount: 9 },
  { number: 105, name: "Al-Fil", ayahCount: 5 },
  { number: 107, name: "Al-Ma'un", ayahCount: 7 },
  { number: 108, name: "Al-Kauthar", ayahCount: 3 },
];

export function getSurahsInVerses(): SurahInfo[] {
  const surahNumbers = [...new Set(verses.map((v) => v.surahNumber))];
  return surahList.filter((s) => surahNumbers.includes(s.number));
}
