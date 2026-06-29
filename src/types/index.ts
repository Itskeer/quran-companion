export interface Verse {
  id: string;
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
  tafsir?: string;
  themes: string[];
  juz?: number;
  page?: number;
}

export interface Dua {
  id: string;
  arabic: string;
  translation: string;
  source: string;
  category: DuaCategory;
  themes: string[];
  reference?: string;
}

export type DuaCategory =
  | "Morning"
  | "Evening"
  | "Sleep"
  | "Stress"
  | "Anxiety"
  | "Forgiveness"
  | "Gratitude"
  | "Travel"
  | "Illness"
  | "Protection"
  | "Motivation"
  | "Guidance";

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  labelAr: string;
  labelFr: string;
  themes: string[];
}

export interface CheckIn {
  date: string;
  moodId: string;
  note?: string;
}

export interface Theme {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
}

export interface FavoritesCollection {
  verses: string[];
  duas: string[];
  readingLists: string[];
}

export interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
}

export type Language = "en" | "ar" | "fr";

export interface AppSettings {
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
  accentColor: string;
  autoPlay: boolean;
  animations: boolean;
  offlineMode: boolean;
  audioQuality: "low" | "medium" | "high";
}

export interface NotificationSettings {
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
  dailyQuran: boolean;
  fridayReminder: boolean;
  readingGoal: boolean;
  sleepReminder: boolean;
}

export interface Bookmark {
  id: string;
  verseId: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
  note?: string;
  createdAt: string;
  tags?: string[];
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  lastRead: string;
  totalVersesRead: number;
  totalTimeSpent: number;
}

export interface DuaFavorite {
  id: string;
  duaId: string;
  createdAt: string;
}

export interface CustomDua {
  id: string;
  arabic: string;
  translation: string;
  transliteration?: string;
  notes?: string;
  category: string;
  createdAt: string;
}

export interface DuaReminder {
  id: string;
  duaId?: string;
  customDuaId?: string;
  title: string;
  time: string;
  days: number[];
  enabled: boolean;
}

export interface DuaLearningItem {
  duaId: string;
  attempts: number;
  lastAttempt: string;
  mastered: boolean;
}

export interface DhikrSession {
  id: string;
  presetId: string;
  arabic: string;
  translation: string;
  target: number;
  completed: number;
  date: string;
}

export interface DhikrStreak {
  current: number;
  longest: number;
  lastDate: string;
}

export interface CustomDhikr {
  id: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  targetCount: number;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  moodId: string;
  template?: string;
  content: string;
  verseIds?: string[];
  duaIds?: string[];
  tags?: string[];
}

export interface MoodHistoryEntry {
  date: string;
  moodId: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  verseIds: string[];
  duaIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSession {
  date: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  duration: number;
}

export interface ReadingStats {
  totalVersesRead: number;
  totalTimeSpent: number;
  favoriteSurahs: { surahNumber: number; count: number }[];
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
}

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  time: string;
  days: number[];
  type: "verse" | "dua" | "dhikr" | "reading" | "streak" | "custom";
  enabled: boolean;
}

export interface NotificationHistoryItem {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  type: string;
}

export interface AccentColor {
  name: string;
  value: string;
}

export interface ArabicFont {
  name: string;
  value: string;
  className: string;
}

export interface ReadingMode {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
}

export interface DailyProgress {
  date: string;
  versesRead: number;
  duasMade: number;
  dhikrDone: number;
  checkedIn: boolean;
}

// ===== PHASE 1: NEW FEATURE TYPES =====

// Tafsir
export interface TafsirData {
  surahNumber: number;
  ayahNumber: number;
  tafsir: string;
  source: string;
}

// Word-by-Word
export interface WordByWordVerse {
  surahNumber: number;
  ayahNumber: number;
  words: WordByWordItem[];
}
export interface WordByWordItem {
  arabic: string;
  transliteration: string;
  meaning: string;
  position: number;
}

// Memorization Tracker
export interface MemorizationSurah {
  surahNumber: number;
  name: string;
  nameArabic: string;
  totalAyahs: number;
  memorizedAyahs: number;
  lastPracticed: string;
  nextReview: string;
  reviewCount: number;
  masteryLevel: "new" | "learning" | "reviewing" | "mastered";
}

// Reading Plan
export interface ReadingPlan {
  id: string;
  name: string;
  type: "30day" | "60day" | "custom";
  totalDays: number;
  currentDay: number;
  startDate: string;
  dailyGoal: number; // ayahs per day
  progress: ReadingPlanDay[];
  completed: boolean;
}
export interface ReadingPlanDay {
  day: number;
  surahStart: number;
  ayahStart: number;
  surahEnd: number;
  ayahEnd: number;
  completed: boolean;
  date?: string;
}

// Daily Adhkar
export interface AdhkarSession {
  id: string;
  date: string;
  type: "morning" | "evening";
  completed: string[]; // adhkar IDs completed
  totalAdhkar: number;
  completedCount: number;
}

// Istighfar
export interface IstighfarEntry {
  id: string;
  date: string;
  count: number;
  target: number;
  duaId?: string;
}

// Sadaqah
export interface SadaqahEntry {
  id: string;
  date: string;
  amount?: number;
  currency?: string;
  type: "money" | "time" | "knowledge" | "kindness" | "other";
  description: string;
  isAnonymous: boolean;
}

// Quiz
export interface QuizResult {
  id: string;
  date: string;
  category: string;
  score: number;
  total: number;
  difficulty: string;
  timeTaken: number;
}

// Dua Requests
export interface DuaRequest {
  id: string;
  text: string;
  author: string;
  date: string;
  prayersCount: number;
  category: "health" | "guidance" | "forgiveness" | "family" | "work" | "other";
  isAnonymous: boolean;
}

// Weekly Reflection
export interface WeeklyReflection {
  id: string;
  weekStart: string;
  weekEnd: string;
  gratitude: string;
  challenges: string;
  goals: string;
  spiritualGrowth: string;
  nextWeekPlan: string;
  mood: string;
}

// Custom Theme
export interface CustomTheme {
  id: string;
  name: string;
  nameAr: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  isActive: boolean;
}

// Adhan Settings
export interface AdhanSettings {
  fajr: { enabled: boolean; volume: number; sound: string };
  dhuhr: { enabled: boolean; volume: number; sound: string };
  asr: { enabled: boolean; volume: number; sound: string };
  maghrib: { enabled: boolean; volume: number; sound: string };
  isha: { enabled: boolean; volume: number; sound: string };
}

// Export/Backup
export interface ExportData {
  version: string;
  exportDate: string;
  settings: AppSettings;
  favorites: FavoritesCollection;
  bookmarks: Bookmark[];
  readingProgress: ReadingProgress[];
  checkIns: CheckIn[];
  journalEntries: JournalEntry[];
  collections: Collection[];
  memorization: MemorizationSurah[];
  readingPlan: ReadingPlan | null;
  adhkarSessions: AdhkarSession[];
  istighfarHistory: IstighfarEntry[];
  sadaqahEntries: SadaqahEntry[];
  quizHistory: QuizResult[];
  duaRequests: DuaRequest[];
  weeklyReflections: WeeklyReflection[];
  customThemes: CustomTheme[];
  sunnahPrayerLog: Record<string, boolean>;
}

// Sunnah Prayer
export interface SunnahPrayerLog {
  date: string;
  prayers: Record<string, boolean>; // prayerId -> completed
}
