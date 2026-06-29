"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHeart,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineClipboardCheck,
  HiOutlineArchive,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineStar,
  HiOutlineDuplicate,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

type TabType = "verses" | "duas" | "hadith" | "names" | "stories";
type SortType = "date" | "name" | "category";

interface FavoriteItem {
  id: string;
  type: TabType;
  title: string;
  excerpt: string;
  category: string;
  dateAdded: string;
  content?: string;
}

const SAMPLE_FAVORITES: FavoriteItem[] = [
  {
    id: "v1",
    type: "verses",
    title: "Al-Fatihah 1:1",
    excerpt: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    category: "Quran",
    dateAdded: "2026-01-15",
    content: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  },
  {
    id: "v2",
    type: "verses",
    title: "Al-Baqarah 2:255",
    excerpt: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    category: "Quran",
    dateAdded: "2026-01-16",
    content: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
  },
  {
    id: "d1",
    type: "duas",
    title: "Dua for Guidance",
    excerpt: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good.",
    category: "Guidance",
    dateAdded: "2026-01-17",
    content: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  },
  {
    id: "d2",
    type: "duas",
    title: "Dua for Patience",
    excerpt: "Our Lord, pour upon us patience and let us die as Muslims.",
    category: "Patience",
    dateAdded: "2026-01-18",
    content: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا",
  },
  {
    id: "h1",
    type: "hadith",
    title: "Hadith #1",
    excerpt: "Islam is built on five pillars...",
    category: "Pillars",
    dateAdded: "2026-01-19",
    content: "Islam is built on five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakat, making the Hajj pilgrimage, and fasting in Ramadan.",
  },
  {
    id: "h2",
    type: "hadith",
    title: "Hadith #2",
    excerpt: "The best among you are those who learn the Quran and teach it.",
    category: "Quran",
    dateAdded: "2026-01-20",
    content: "The Prophet said: 'The best among you are those who learn the Quran and teach it.'",
  },
  {
    id: "n1",
    type: "names",
    title: "Ar-Rahman",
    excerpt: "The Most Merciful",
    category: "Names of Allah",
    dateAdded: "2026-01-21",
    content: "الرَّحْمَٰنُ",
  },
  {
    id: "n2",
    type: "names",
    title: "Ar-Raheem",
    excerpt: "The Especially Merciful",
    category: "Names of Allah",
    dateAdded: "2026-01-22",
    content: "الرَّحِيمُ",
  },
  {
    id: "s1",
    type: "stories",
    title: "Prophet Ibrahim (AS)",
    excerpt: "The story of Ibrahim's (AS) search for truth and his monotheistic beliefs.",
    category: "Prophets",
    dateAdded: "2026-01-23",
    content: "Ibrahim (AS) searched for the truth by observing the stars, moon, and sun, realizing they were all temporary. He declared his Lord and rejected all idols.",
  },
  {
    id: "s2",
    type: "stories",
    title: "Prophet Yusuf (AS)",
    excerpt: "The story of Yusuf (AS) and his journey through trials to become a minister of Egypt.",
    category: "Prophets",
    dateAdded: "2026-01-24",
    content: "Yusuf (AS) was thrown into a well by his brothers, taken to Egypt, and after many trials, Allah elevated him to a position of authority.",
  },
];

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "verses", label: "Verses", icon: <HiOutlineBookOpen className="w-4 h-4" /> },
  { id: "duas", label: "Duas", icon: <HiOutlineHeart className="w-4 h-4" /> },
  { id: "hadith", label: "Hadith", icon: <HiOutlineDocumentText className="w-4 h-4" /> },
  { id: "names", label: "Names", icon: <HiOutlineStar className="w-4 h-4" /> },
  { id: "stories", label: "Stories", icon: <HiOutlineArchive className="w-4 h-4" /> },
];

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("verses");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-favorites");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.items && data.items.length > 0) {
          setFavorites(data.items);
        } else {
          setFavorites(SAMPLE_FAVORITES);
        }
      } catch {
        setFavorites(SAMPLE_FAVORITES);
      }
    } else {
      setFavorites(SAMPLE_FAVORITES);
    }
  }, []);

  useEffect(() => {
    const data = { items: favorites };
    localStorage.setItem("quran-companion-favorites", JSON.stringify(data));
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    let items = favorites.filter((item) => item.type === activeTab);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    items.sort((a, b) => {
      let comparison = 0;
      switch (sortType) {
        case "date":
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortAsc ? comparison : -comparison;
    });

    return items;
  }, [favorites, activeTab, searchQuery, sortType, sortAsc]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabType, number> = {
      verses: 0,
      duas: 0,
      hadith: 0,
      names: 0,
      stories: 0,
    };
    favorites.forEach((item) => {
      counts[item.type]++;
    });
    return counts;
  }, [favorites]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allIds = filteredFavorites.map((item) => item.id);
    setSelectedItems(new Set(allIds));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const deleteSelected = () => {
    setFavorites((prev) => prev.filter((item) => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setIsSelectMode(false);
  };

  const removeItem = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const shareItem = (item: FavoriteItem) => {
    const text = `${item.title}\n\n${item.content || item.excerpt}\n\nCategory: ${item.category}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const copyItem = (item: FavoriteItem) => {
    navigator.clipboard.writeText(item.content || item.excerpt);
    alert("Copied to clipboard!");
  };

  const exportFavorites = () => {
    const text = favorites
      .map(
        (item) =>
          `[${item.type.toUpperCase()}] ${item.title}\n${item.excerpt}\nCategory: ${item.category}\nDate Added: ${item.dateAdded}\n\n`
      )
      .join("---\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quran-companion-favorites.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCount = favorites.length;

  const emptyStateMessages: Record<TabType, string> = {
    verses: t("favorites.emptyVerses"),
    duas: t("favorites.emptyDuas"),
    hadith: t("favorites.emptyHadith"),
    names: t("favorites.emptyNames"),
    stories: t("favorites.emptyStories"),
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <HiOutlineHeart className="w-8 h-8 text-[var(--accent)]" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("favorites.title")}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
              {totalCount} {totalCount === 1 ? "item" : "items"} saved
            </p>
          </div>
          <button
            onClick={exportFavorites}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlineDownload className="w-4 h-4" />
            {t("favorites.export")}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("favorites.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineX className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="py-2 bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="date">Date Added</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sortAsc ? (
                <HiOutlineSortAscending className="w-4 h-4 text-gray-500" />
              ) : (
                <HiOutlineSortDescending className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              setSelectedItems(new Set());
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isSelectMode
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {isSelectMode ? t("common.cancel") : t("favorites.select")}
          </button>
        </div>
      </motion.div>

      {isSelectMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedItems.size} {t("favorites.selected")}
            </span>
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("favorites.selectAll")}
            </button>
            <button
              onClick={deselectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("favorites.deselectAll")}
            </button>
          </div>
          <button
            onClick={deleteSelected}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineTrash className="w-4 h-4" />
            {t("common.delete")}
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-3"
        >
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-16">
              <HiOutlineHeart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {emptyStateMessages[activeTab]}
              </p>
            </div>
          ) : (
            filteredFavorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 relative ${
                  isSelectMode && selectedItems.has(item.id)
                    ? "border-2 border-[var(--accent)] bg-[var(--accent)]/5"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {isSelectMode && (
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedItems.has(item.id)
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedItems.has(item.id) && (
                        <HiOutlineCheck className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {item.category}
                      </span>
                    </div>

                    {item.content && (
                      <p className="text-gray-800 dark:text-gray-200 text-lg mb-2" dir="rtl">
                        {item.content}
                      </p>
                    )}

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {item.excerpt}
                    </p>

                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      Added on {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </div>

                  {!isSelectMode && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => shareItem(item)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={t("common.share")}
                      >
                        <HiOutlineShare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyItem(item)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={t("common.copy")}
                      >
                        <HiOutlineClipboardCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                        title={t("common.delete")}
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {filteredFavorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          {t("favorites.showing")} {filteredFavorites.length} {t("favorites.of")} {tabCounts[activeTab]} {activeTab}
        </motion.div>
      )}
    </div>
  );
}
