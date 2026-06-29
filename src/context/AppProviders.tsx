"use client";
import React, { createContext, useContext, useCallback, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  CheckIn,
  FavoritesCollection,
  AppSettings,
  NotificationSettings,
  Language,
  Bookmark,
  ReadingProgress,
  ReadingSession,
  DuaFavorite,
  CustomDua,
  DuaReminder,
  DuaLearningItem,
  DhikrSession,
  DhikrStreak,
  CustomDhikr,
  JournalEntry,
  MoodHistoryEntry,
  Collection,
  NotificationSchedule,
  NotificationHistoryItem,
  DailyProgress,
  MemorizationSurah,
  ReadingPlan,
  AdhkarSession,
  IstighfarEntry,
  SadaqahEntry,
  QuizResult,
  DuaRequest,
  WeeklyReflection,
  CustomTheme,
  SunnahPrayerLog,
} from "@/types";

function useSettingsState() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "quran-companion-settings",
    {
      darkMode: false,
      fontSize: "medium",
      accentColor: "#C9A227",
      autoPlay: false,
      animations: true,
      offlineMode: false,
      audioQuality: "high",
    }
  );
  return { settings, setSettings };
}

function useNotificationSettingsState() {
  const [notificationSettings, setNotificationSettings] =
    useLocalStorage<NotificationSettings>(
      "quran-companion-notification-settings",
      {
        morningAdhkar: true,
        eveningAdhkar: true,
        dailyQuran: true,
        fridayReminder: true,
        readingGoal: false,
        sleepReminder: false,
      }
    );
  return { notificationSettings, setNotificationSettings };
}

function useFavoritesState() {
  const [favorites, setFavorites] = useLocalStorage<FavoritesCollection>(
    "quran-companion-favorites",
    { verses: [], duas: [], readingLists: [] }
  );

  const toggleFavorite = useCallback(
    (type: keyof FavoritesCollection, id: string) => {
      setFavorites((prev) => {
        const list = prev[type];
        const exists = list.includes(id);
        return {
          ...prev,
          [type]: exists ? list.filter((item) => item !== id) : [...list, id],
        };
      });
    },
    [setFavorites]
  );

  const isFavorited = useCallback(
    (type: keyof FavoritesCollection, id: string): boolean => {
      return favorites[type].includes(id);
    },
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorited, setFavorites };
}

function useCheckInsState() {
  const [checkIns, setCheckIns] = useLocalStorage<CheckIn[]>(
    "quran-companion-checkins",
    []
  );

  const addCheckIn = useCallback(
    (checkIn: CheckIn) => {
      setCheckIns((prev) => [checkIn, ...prev]);
    },
    [setCheckIns]
  );

  return { checkIns, addCheckIn, setCheckIns };
}

function useLanguageState() {
  const [language, setLanguage] = useLocalStorage<Language>(
    "quran-companion-language",
    "ar"
  );
  return { language, setLanguage };
}

function useBookmarksState() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(
    "quran-companion-bookmarks",
    []
  );

  const addBookmark = useCallback(
    (bookmark: Bookmark) => {
      setBookmarks((prev) => [bookmark, ...prev]);
    },
    [setBookmarks]
  );

  const removeBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBookmarks]
  );

  const updateBookmarkNote = useCallback(
    (id: string, note: string) => {
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, note } : b))
      );
    },
    [setBookmarks]
  );

  const getAllBookmarks = useCallback((): Bookmark[] => {
    return bookmarks;
  }, [bookmarks]);

  const getBookmarksBySurah = useCallback(
    (surahNumber: number): Bookmark[] => {
      return bookmarks.filter((b) => b.surahNumber === surahNumber);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkNote,
    getAllBookmarks,
    getBookmarksBySurah,
  };
}

function useReadingProgressState() {
  const [readingProgress, setReadingProgress] = useLocalStorage<
    ReadingProgress[]
  >("quran-companion-reading-progress", []);

  const getProgressBySurah = useCallback(
    (surahNumber: number): ReadingProgress | undefined => {
      return readingProgress.find((p) => p.surahNumber === surahNumber);
    },
    [readingProgress]
  );

  const setProgressForSurah = useCallback(
    (surahNumber: number, ayahNumber: number, timeSpent: number) => {
      setReadingProgress((prev) => {
        const existing = prev.find((p) => p.surahNumber === surahNumber);
        if (existing) {
          return prev.map((p) =>
            p.surahNumber === surahNumber
              ? {
                  ...p,
                  ayahNumber,
                  lastRead: new Date().toISOString(),
                  totalVersesRead: p.totalVersesRead + 1,
                  totalTimeSpent: p.totalTimeSpent + timeSpent,
                }
              : p
          );
        }
        return [
          ...prev,
          {
            surahNumber,
            ayahNumber,
            lastRead: new Date().toISOString(),
            totalVersesRead: 1,
            totalTimeSpent: timeSpent,
          },
        ];
      });
    },
    [setReadingProgress]
  );

  return { readingProgress, getProgressBySurah, setProgressForSurah };
}

function useReadingSessionsState() {
  const [readingSessions, setReadingSessions] = useLocalStorage<
    ReadingSession[]
  >("quran-companion-reading-sessions", []);

  const addReadingSession = useCallback(
    (session: ReadingSession) => {
      setReadingSessions((prev) => [session, ...prev]);
    },
    [setReadingSessions]
  );

  return { readingSessions, addReadingSession };
}

function useDuaFavoritesState() {
  const [duaFavorites, setDuaFavorites] = useLocalStorage<DuaFavorite[]>(
    "quran-companion-dua-favorites",
    []
  );

  const toggleDuaFavorite = useCallback(
    (duaId: string) => {
      setDuaFavorites((prev) => {
        const existing = prev.find((f) => f.duaId === duaId);
        if (existing) {
          return prev.filter((f) => f.duaId !== duaId);
        }
        return [
          ...prev,
          { id: `df-${Date.now()}`, duaId, createdAt: new Date().toISOString() },
        ];
      });
    },
    [setDuaFavorites]
  );

  const isDuaFavorited = useCallback(
    (duaId: string): boolean => {
      return duaFavorites.some((f) => f.duaId === duaId);
    },
    [duaFavorites]
  );

  return { duaFavorites, toggleDuaFavorite, isDuaFavorited };
}

function useCustomDuasState() {
  const [customDuas, setCustomDuas] = useLocalStorage<CustomDua[]>(
    "quran-companion-custom-duas",
    []
  );

  const addCustomDua = useCallback(
    (dua: CustomDua) => {
      setCustomDuas((prev) => [dua, ...prev]);
    },
    [setCustomDuas]
  );

  const updateCustomDua = useCallback(
    (id: string, updates: Partial<CustomDua>) => {
      setCustomDuas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    [setCustomDuas]
  );

  const removeCustomDua = useCallback(
    (id: string) => {
      setCustomDuas((prev) => prev.filter((d) => d.id !== id));
    },
    [setCustomDuas]
  );

  return { customDuas, addCustomDua, updateCustomDua, removeCustomDua };
}

function useDuaRemindersState() {
  const [duaReminders, setDuaReminders] = useLocalStorage<DuaReminder[]>(
    "quran-companion-dua-reminders",
    []
  );

  const addDuaReminder = useCallback(
    (reminder: DuaReminder) => {
      setDuaReminders((prev) => [reminder, ...prev]);
    },
    [setDuaReminders]
  );

  const updateDuaReminder = useCallback(
    (id: string, updates: Partial<DuaReminder>) => {
      setDuaReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    [setDuaReminders]
  );

  const removeDuaReminder = useCallback(
    (id: string) => {
      setDuaReminders((prev) => prev.filter((r) => r.id !== id));
    },
    [setDuaReminders]
  );

  const toggleDuaReminder = useCallback(
    (id: string) => {
      setDuaReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
      );
    },
    [setDuaReminders]
  );

  return {
    duaReminders,
    addDuaReminder,
    updateDuaReminder,
    removeDuaReminder,
    toggleDuaReminder,
  };
}

function useDuaLearningState() {
  const [duaLearning, setDuaLearning] = useLocalStorage<DuaLearningItem[]>(
    "quran-companion-dua-learning",
    []
  );

  const updateDuaLearning = useCallback(
    (duaId: string, mastered: boolean) => {
      setDuaLearning((prev) => {
        const existing = prev.find((item) => item.duaId === duaId);
        if (existing) {
          return prev.map((item) =>
            item.duaId === duaId
              ? {
                  ...item,
                  attempts: item.attempts + 1,
                  lastAttempt: new Date().toISOString(),
                  mastered,
                }
              : item
          );
        }
        return [
          ...prev,
          {
            duaId,
            attempts: 1,
            lastAttempt: new Date().toISOString(),
            mastered,
          },
        ];
      });
    },
    [setDuaLearning]
  );

  return { duaLearning, updateDuaLearning };
}

function useDhikrSessionsState() {
  const [dhikrSessions, setDhikrSessions] = useLocalStorage<DhikrSession[]>(
    "quran-companion-dhikr-sessions",
    []
  );

  const addDhikrSession = useCallback(
    (session: DhikrSession) => {
      setDhikrSessions((prev) => [session, ...prev]);
    },
    [setDhikrSessions]
  );

  return { dhikrSessions, addDhikrSession };
}

function useDhikrStreakState() {
  const [dhikrStreak, setDhikrStreak] = useLocalStorage<DhikrStreak>(
    "quran-companion-dhikr-streak",
    { current: 0, longest: 0, lastDate: "" }
  );

  const updateDhikrStreak = useCallback(
    () => {
      const today = new Date().toISOString().split("T")[0];
      setDhikrStreak((prev) => {
        if (prev.lastDate === today) return prev;
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        const isConsecutive = prev.lastDate === yesterday;
        const newCurrent = isConsecutive ? prev.current + 1 : 1;
        return {
          current: newCurrent,
          longest: Math.max(prev.longest, newCurrent),
          lastDate: today,
        };
      });
    },
    [setDhikrStreak]
  );

  return { dhikrStreak, updateDhikrStreak };
}

function useCustomDhikrsState() {
  const [customDhikrs, setCustomDhikrs] = useLocalStorage<CustomDhikr[]>(
    "quran-companion-custom-dhikrs",
    []
  );

  const addCustomDhikr = useCallback(
    (dhikr: CustomDhikr) => {
      setCustomDhikrs((prev) => [dhikr, ...prev]);
    },
    [setCustomDhikrs]
  );

  const updateCustomDhikr = useCallback(
    (id: string, updates: Partial<CustomDhikr>) => {
      setCustomDhikrs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    [setCustomDhikrs]
  );

  const removeCustomDhikr = useCallback(
    (id: string) => {
      setCustomDhikrs((prev) => prev.filter((d) => d.id !== id));
    },
    [setCustomDhikrs]
  );

  return { customDhikrs, addCustomDhikr, updateCustomDhikr, removeCustomDhikr };
}

function useJournalEntriesState() {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(
    "quran-companion-journal-entries",
    []
  );

  const addJournalEntry = useCallback(
    (entry: JournalEntry) => {
      setJournalEntries((prev) => [entry, ...prev]);
    },
    [setJournalEntries]
  );

  const updateJournalEntry = useCallback(
    (id: string, updates: Partial<JournalEntry>) => {
      setJournalEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    [setJournalEntries]
  );

  const removeJournalEntry = useCallback(
    (id: string) => {
      setJournalEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setJournalEntries]
  );

  const searchJournalEntries = useCallback(
    (query: string): JournalEntry[] => {
      const lower = query.toLowerCase();
      return journalEntries.filter(
        (e) =>
          e.content.toLowerCase().includes(lower) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(lower)))
      );
    },
    [journalEntries]
  );

  return {
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    searchJournalEntries,
  };
}

function useMoodHistoryState() {
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodHistoryEntry[]>(
    "quran-companion-mood-history",
    []
  );

  const addMoodEntry = useCallback(
    (entry: MoodHistoryEntry) => {
      setMoodHistory((prev) => [entry, ...prev]);
    },
    [setMoodHistory]
  );

  return { moodHistory, addMoodEntry };
}

function useCollectionsState() {
  const [collections, setCollections] = useLocalStorage<Collection[]>(
    "quran-companion-collections",
    []
  );

  const addCollection = useCallback(
    (collection: Collection) => {
      setCollections((prev) => [collection, ...prev]);
    },
    [setCollections]
  );

  const updateCollection = useCallback(
    (id: string, updates: Partial<Collection>) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...updates, updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    [setCollections]
  );

  const removeCollection = useCallback(
    (id: string) => {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    },
    [setCollections]
  );

  const addVerseToCollection = useCallback(
    (collectionId: string, verseId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId && !c.verseIds.includes(verseId)
            ? {
                ...c,
                verseIds: [...c.verseIds, verseId],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [setCollections]
  );

  const removeVerseFromCollection = useCallback(
    (collectionId: string, verseId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                verseIds: c.verseIds.filter((v) => v !== verseId),
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [setCollections]
  );

  const addDuaToCollection = useCallback(
    (collectionId: string, duaId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId && !c.duaIds.includes(duaId)
            ? {
                ...c,
                duaIds: [...c.duaIds, duaId],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [setCollections]
  );

  const removeDuaFromCollection = useCallback(
    (collectionId: string, duaId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                duaIds: c.duaIds.filter((d) => d !== duaId),
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [setCollections]
  );

  return {
    collections,
    addCollection,
    updateCollection,
    removeCollection,
    addVerseToCollection,
    removeVerseFromCollection,
    addDuaToCollection,
    removeDuaFromCollection,
  };
}

function useNotificationsState() {
  const [notifications, setNotifications] = useLocalStorage<
    NotificationSchedule[]
  >("quran-companion-notifications", []);

  const addNotification = useCallback(
    (notification: NotificationSchedule) => {
      setNotifications((prev) => [notification, ...prev]);
    },
    [setNotifications]
  );

  const updateNotification = useCallback(
    (id: string, updates: Partial<NotificationSchedule>) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
      );
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

  const toggleNotification = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, enabled: !n.enabled } : n
        )
      );
    },
    [setNotifications]
  );

  return {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    toggleNotification,
  };
}

function useNotificationHistoryState() {
  const [notificationHistory, setNotificationHistory] = useLocalStorage<
    NotificationHistoryItem[]
  >("quran-companion-notification-history", []);

  const addNotificationHistoryItem = useCallback(
    (item: NotificationHistoryItem) => {
      setNotificationHistory((prev) => [item, ...prev]);
    },
    [setNotificationHistory]
  );

  const getRecentNotifications = useCallback(
    (count: number): NotificationHistoryItem[] => {
      return notificationHistory.slice(0, count);
    },
    [notificationHistory]
  );

  return { notificationHistory, addNotificationHistoryItem, getRecentNotifications };
}

function useDailyProgressState() {
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress[]>(
    "quran-companion-daily-progress",
    []
  );

  const getTodayProgress = useCallback((): DailyProgress => {
    const today = new Date().toISOString().split("T")[0];
    const existing = dailyProgress.find((p) => p.date === today);
    return (
      existing || {
        date: today,
        versesRead: 0,
        duasMade: 0,
        dhikrDone: 0,
        checkedIn: false,
      }
    );
  }, [dailyProgress]);

  const setTodayProgress = useCallback(
    (updates: Partial<Omit<DailyProgress, "date">>) => {
      const today = new Date().toISOString().split("T")[0];
      setDailyProgress((prev) => {
        const existing = prev.find((p) => p.date === today);
        if (existing) {
          return prev.map((p) =>
            p.date === today ? { ...p, ...updates } : p
          );
        }
        return [
          ...prev,
          {
            date: today,
            versesRead: 0,
            duasMade: 0,
            dhikrDone: 0,
            checkedIn: false,
            ...updates,
          },
        ];
      });
    },
    [setDailyProgress]
  );

  return { dailyProgress, getTodayProgress, setTodayProgress };
}

interface AppContextValue {
  settings: AppSettings;
  setSettings: (
    value: AppSettings | ((prev: AppSettings) => AppSettings)
  ) => void;
  notificationSettings: NotificationSettings;
  setNotificationSettings: (
    value:
      | NotificationSettings
      | ((prev: NotificationSettings) => NotificationSettings)
  ) => void;
  favorites: FavoritesCollection;
  toggleFavorite: (type: keyof FavoritesCollection, id: string) => void;
  isFavorited: (type: keyof FavoritesCollection, id: string) => boolean;
  checkIns: CheckIn[];
  addCheckIn: (checkIn: CheckIn) => void;
  language: Language;
  setLanguage: (value: Language | ((prev: Language) => Language)) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  updateBookmarkNote: (id: string, note: string) => void;
  getAllBookmarks: () => Bookmark[];
  getBookmarksBySurah: (surahNumber: number) => Bookmark[];
  readingProgress: ReadingProgress[];
  getProgressBySurah: (surahNumber: number) => ReadingProgress | undefined;
  setProgressForSurah: (
    surahNumber: number,
    ayahNumber: number,
    timeSpent: number
  ) => void;
  readingSessions: ReadingSession[];
  addReadingSession: (session: ReadingSession) => void;
  duaFavorites: DuaFavorite[];
  toggleDuaFavorite: (duaId: string) => void;
  isDuaFavorited: (duaId: string) => boolean;
  customDuas: CustomDua[];
  addCustomDua: (dua: CustomDua) => void;
  updateCustomDua: (id: string, updates: Partial<CustomDua>) => void;
  removeCustomDua: (id: string) => void;
  duaReminders: DuaReminder[];
  addDuaReminder: (reminder: DuaReminder) => void;
  updateDuaReminder: (id: string, updates: Partial<DuaReminder>) => void;
  removeDuaReminder: (id: string) => void;
  toggleDuaReminder: (id: string) => void;
  duaLearning: DuaLearningItem[];
  updateDuaLearning: (duaId: string, mastered: boolean) => void;
  dhikrSessions: DhikrSession[];
  addDhikrSession: (session: DhikrSession) => void;
  dhikrStreak: DhikrStreak;
  updateDhikrStreak: () => void;
  customDhikrs: CustomDhikr[];
  addCustomDhikr: (dhikr: CustomDhikr) => void;
  updateCustomDhikr: (id: string, updates: Partial<CustomDhikr>) => void;
  removeCustomDhikr: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  removeJournalEntry: (id: string) => void;
  searchJournalEntries: (query: string) => JournalEntry[];
  moodHistory: MoodHistoryEntry[];
  addMoodEntry: (entry: MoodHistoryEntry) => void;
  collections: Collection[];
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  removeCollection: (id: string) => void;
  addVerseToCollection: (collectionId: string, verseId: string) => void;
  removeVerseFromCollection: (collectionId: string, verseId: string) => void;
  addDuaToCollection: (collectionId: string, duaId: string) => void;
  removeDuaFromCollection: (collectionId: string, duaId: string) => void;
  notifications: NotificationSchedule[];
  addNotification: (notification: NotificationSchedule) => void;
  updateNotification: (
    id: string,
    updates: Partial<NotificationSchedule>
  ) => void;
  removeNotification: (id: string) => void;
  toggleNotification: (id: string) => void;
  notificationHistory: NotificationHistoryItem[];
  addNotificationHistoryItem: (item: NotificationHistoryItem) => void;
  getRecentNotifications: (count: number) => NotificationHistoryItem[];
  dailyProgress: DailyProgress[];
  getTodayProgress: () => DailyProgress;
  setTodayProgress: (
    updates: Partial<Omit<DailyProgress, "date">>
  ) => void;
  memorizationProgress: MemorizationSurah[];
  setMemorizationProgress: (v: MemorizationSurah[] | ((p: MemorizationSurah[]) => MemorizationSurah[])) => void;
  readingPlan: ReadingPlan | null;
  setReadingPlan: (v: ReadingPlan | null | ((p: ReadingPlan | null) => ReadingPlan | null)) => void;
  adhkarSessions: AdhkarSession[];
  setAdhkarSessions: (v: AdhkarSession[] | ((p: AdhkarSession[]) => AdhkarSession[])) => void;
  istighfarHistory: IstighfarEntry[];
  setIstighfarHistory: (v: IstighfarEntry[] | ((p: IstighfarEntry[]) => IstighfarEntry[])) => void;
  sadaqahEntries: SadaqahEntry[];
  addSadaqahEntry: (entry: SadaqahEntry) => void;
  removeSadaqahEntry: (id: string) => void;
  quizHistory: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  duaRequests: DuaRequest[];
  addDuaRequest: (req: DuaRequest) => void;
  prayForRequest: (id: string) => void;
  weeklyReflections: WeeklyReflection[];
  addWeeklyReflection: (r: WeeklyReflection) => void;
  customThemes: CustomTheme[];
  setCustomThemes: (v: CustomTheme[] | ((p: CustomTheme[]) => CustomTheme[])) => void;
  sunnahPrayerLog: Record<string, boolean>;
  toggleSunnahPrayer: (date: string, prayerId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function DarkModeWatcher({ darkMode }: { darkMode: boolean }) {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const { settings, setSettings } = useSettingsState();
  const { notificationSettings, setNotificationSettings } =
    useNotificationSettingsState();
  const { favorites, toggleFavorite, isFavorited } = useFavoritesState();
  const { checkIns, addCheckIn } = useCheckInsState();
  const { language, setLanguage } = useLanguageState();
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkNote,
    getAllBookmarks,
    getBookmarksBySurah,
  } = useBookmarksState();
  const { readingProgress, getProgressBySurah, setProgressForSurah } =
    useReadingProgressState();
  const { readingSessions, addReadingSession } = useReadingSessionsState();
  const { duaFavorites, toggleDuaFavorite, isDuaFavorited } =
    useDuaFavoritesState();
  const { customDuas, addCustomDua, updateCustomDua, removeCustomDua } =
    useCustomDuasState();
  const {
    duaReminders,
    addDuaReminder,
    updateDuaReminder,
    removeDuaReminder,
    toggleDuaReminder,
  } = useDuaRemindersState();
  const { duaLearning, updateDuaLearning } = useDuaLearningState();
  const { dhikrSessions, addDhikrSession } = useDhikrSessionsState();
  const { dhikrStreak, updateDhikrStreak } = useDhikrStreakState();
  const {
    customDhikrs,
    addCustomDhikr,
    updateCustomDhikr,
    removeCustomDhikr,
  } = useCustomDhikrsState();
  const {
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    searchJournalEntries,
  } = useJournalEntriesState();
  const { moodHistory, addMoodEntry } = useMoodHistoryState();
  const {
    collections,
    addCollection,
    updateCollection,
    removeCollection,
    addVerseToCollection,
    removeVerseFromCollection,
    addDuaToCollection,
    removeDuaFromCollection,
  } = useCollectionsState();
  const {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    toggleNotification,
  } = useNotificationsState();
  const {
    notificationHistory,
    addNotificationHistoryItem,
    getRecentNotifications,
  } = useNotificationHistoryState();
  const { dailyProgress, getTodayProgress, setTodayProgress } =
    useDailyProgressState();

  // New feature state slices
  const [memorizationProgress, setMemorizationProgress] =
    useLocalStorage<MemorizationSurah[]>("quran-companion-memorization", []);
  const [readingPlan, setReadingPlan] =
    useLocalStorage<ReadingPlan | null>("quran-companion-reading-plan", null);
  const [adhkarSessions, setAdhkarSessions] =
    useLocalStorage<AdhkarSession[]>("quran-companion-adhkar-sessions", []);
  const [istighfarHistory, setIstighfarHistory] =
    useLocalStorage<IstighfarEntry[]>("quran-companion-istighfar", []);
  const [sadaqahEntries, setSadaqahEntries] =
    useLocalStorage<SadaqahEntry[]>("quran-companion-sadaqah", []);
  const [quizHistory, setQuizHistory] =
    useLocalStorage<QuizResult[]>("quran-companion-quiz-history", []);
  const [duaRequests, setDuaRequests] =
    useLocalStorage<DuaRequest[]>("quran-companion-dua-requests", []);
  const [weeklyReflections, setWeeklyReflections] =
    useLocalStorage<WeeklyReflection[]>("quran-companion-reflections", []);
  const [customThemes, setCustomThemes] =
    useLocalStorage<CustomTheme[]>("quran-companion-custom-themes", []);
  const [sunnahPrayerLog, setSunnaPrayerLog] =
    useLocalStorage<Record<string, boolean>>("quran-companion-sunnah-log", {});

  const addSadaqahEntry = useCallback(
    (entry: SadaqahEntry) => setSadaqahEntries((prev) => [entry, ...prev]),
    [setSadaqahEntries]
  );
  const removeSadaqahEntry = useCallback(
    (id: string) => setSadaqahEntries((prev) => prev.filter((e) => e.id !== id)),
    [setSadaqahEntries]
  );
  const addQuizResult = useCallback(
    (result: QuizResult) => setQuizHistory((prev) => [result, ...prev]),
    [setQuizHistory]
  );
  const addDuaRequest = useCallback(
    (req: DuaRequest) => setDuaRequests((prev) => [req, ...prev]),
    [setDuaRequests]
  );
  const prayForRequest = useCallback(
    (id: string) =>
      setDuaRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, prayersCount: r.prayersCount + 1 } : r))
      ),
    [setDuaRequests]
  );
  const addWeeklyReflection = useCallback(
    (r: WeeklyReflection) => setWeeklyReflections((prev) => [r, ...prev]),
    [setWeeklyReflections]
  );
  const toggleSunnahPrayer = useCallback(
    (date: string, prayerId: string) =>
      setSunnaPrayerLog((prev) => {
        const key = `${date}-${prayerId}`;
        return { ...prev, [key]: !prev[key] };
      }),
    [setSunnaPrayerLog]
  );

  return (
    <AppContext.Provider
      value={{
        settings,
        setSettings,
        notificationSettings,
        setNotificationSettings,
        favorites,
        toggleFavorite,
        isFavorited,
        checkIns,
        addCheckIn,
        language,
        setLanguage,
        bookmarks,
        addBookmark,
        removeBookmark,
        updateBookmarkNote,
        getAllBookmarks,
        getBookmarksBySurah,
        readingProgress,
        getProgressBySurah,
        setProgressForSurah,
        readingSessions,
        addReadingSession,
        duaFavorites,
        toggleDuaFavorite,
        isDuaFavorited,
        customDuas,
        addCustomDua,
        updateCustomDua,
        removeCustomDua,
        duaReminders,
        addDuaReminder,
        updateDuaReminder,
        removeDuaReminder,
        toggleDuaReminder,
        duaLearning,
        updateDuaLearning,
        dhikrSessions,
        addDhikrSession,
        dhikrStreak,
        updateDhikrStreak,
        customDhikrs,
        addCustomDhikr,
        updateCustomDhikr,
        removeCustomDhikr,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        removeJournalEntry,
        searchJournalEntries,
        moodHistory,
        addMoodEntry,
        collections,
        addCollection,
        updateCollection,
        removeCollection,
        addVerseToCollection,
        removeVerseFromCollection,
        addDuaToCollection,
        removeDuaFromCollection,
        notifications,
        addNotification,
        updateNotification,
        removeNotification,
        toggleNotification,
        notificationHistory,
        addNotificationHistoryItem,
        getRecentNotifications,
        dailyProgress,
        getTodayProgress,
        setTodayProgress,
        memorizationProgress,
        setMemorizationProgress,
        readingPlan,
        setReadingPlan,
        adhkarSessions,
        setAdhkarSessions,
        istighfarHistory,
        setIstighfarHistory,
        sadaqahEntries,
        addSadaqahEntry,
        removeSadaqahEntry,
        quizHistory,
        addQuizResult,
        duaRequests,
        addDuaRequest,
        prayForRequest,
        weeklyReflections,
        addWeeklyReflection,
        customThemes,
        setCustomThemes,
        sunnahPrayerLog,
        toggleSunnahPrayer,
      }}
    >
      <DarkModeWatcher darkMode={settings.darkMode} />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProviders");
  }
  return context;
}
