"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { verses, getVerseById } from "@/data/verses";
import { duas, getDuaById } from "@/data/duas";
import { Collection } from "@/types";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineShare,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineHeart,
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineSortAscending,
  HiOutlineClock,
} from "react-icons/hi";

type Tab = "favorites" | "collections";

export default function CollectionsPage() {
  const { t } = useTranslation();
  const {
    favorites,
    toggleFavorite,
    collections,
    addCollection,
    updateCollection,
    removeCollection,
    addVerseToCollection,
    removeVerseFromCollection,
    addDuaToCollection,
    removeDuaFromCollection,
    duaFavorites,
    toggleDuaFavorite,
  } = useApp();

  const [tab, setTab] = useState<Tab>("favorites");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState<string | null>(
    null
  );
  const [newCollName, setNewCollName] = useState("");
  const [newCollDesc, setNewCollDesc] = useState("");
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null
  );
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [showAddItemModal, setShowAddItemModal] = useState<string | null>(null);
  const [addItemType, setAddItemType] = useState<"verses" | "duas">("verses");
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const favoriteVerses = useMemo(
    () =>
      favorites.verses
        .map((id) => getVerseById(id))
        .filter(Boolean) as typeof verses,
    [favorites.verses]
  );

  const favoriteDuas = useMemo(
    () =>
      duaFavorites
        .map((f) => getDuaById(f.duaId))
        .filter(Boolean) as typeof duas,
    [duaFavorites]
  );

  const sortedCollections = useMemo(() => {
    const filtered = collections.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description &&
          c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [collections, searchQuery, sortBy]);

  const handleCreateCollection = () => {
    if (!newCollName.trim()) return;
    const now = new Date().toISOString();
    addCollection({
      id: `col-${Date.now()}`,
      name: newCollName.trim(),
      description: newCollDesc.trim() || undefined,
      verseIds: [],
      duaIds: [],
      createdAt: now,
      updatedAt: now,
    });
    setNewCollName("");
    setNewCollDesc("");
    setShowCreateModal(false);
  };

  const handleUpdateCollection = (id: string) => {
    if (!editName.trim()) return;
    updateCollection(id, { name: editName.trim(), description: editDesc.trim() || undefined });
    setEditingCollection(null);
    setEditName("");
    setEditDesc("");
  };

  const handleShareCollection = (collection: Collection) => {
    const lines: string[] = [];
    lines.push(`${collection.name}\n`);
    if (collection.description) lines.push(`${collection.description}\n`);
    if (collection.verseIds.length > 0) {
      lines.push("--- Verses ---");
      for (const vid of collection.verseIds) {
        const v = getVerseById(vid);
        if (v) {
          lines.push(`${v.surah} (${v.ayahNumber})`);
          lines.push(v.arabic);
          lines.push(v.translation);
          lines.push("");
        }
      }
    }
    if (collection.duaIds.length > 0) {
      lines.push("--- Duas ---");
      for (const did of collection.duaIds) {
        const d = getDuaById(did);
        if (d) {
          lines.push(`[${d.category}] ${d.source}`);
          lines.push(d.arabic);
          lines.push(d.translation);
          lines.push("");
        }
      }
    }
    if (navigator.share) {
      navigator.share({ title: collection.name, text: lines.join("\n") });
    } else {
      navigator.clipboard.writeText(lines.join("\n"));
    }
  };

  const filteredAddItems = useMemo(() => {
    const q = addSearchQuery.toLowerCase();
    if (addItemType === "verses") {
      return verses.filter(
        (v) =>
          v.surah.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q) ||
          v.themes.some((t) => t.toLowerCase().includes(q))
      );
    }
    return duas.filter(
      (d) =>
        d.translation.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
    );
  }, [addItemType, addSearchQuery]);

  const expanded = expandedCollection
    ? collections.find((c) => c.id === expandedCollection)
    : null;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {t("nav.collections")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("collections.subtitle")}
        </p>
      </motion.div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
        {([["favorites", t("favorites.title")], ["collections", t("nav.collections")]] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      <AnimatePresence mode="wait">
        {tab === "favorites" && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineHeart className="w-5 h-5 text-emerald dark:text-emerald-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {t("collections.favoriteVerses")}
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({favoriteVerses.length})
                </span>
              </div>
              {favoriteVerses.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                    {t("collections.noFavoriteVerses")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favoriteVerses.map((verse) => (
                    <div
                      key={verse.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4"
                    >
                      <div className="text-right mb-2">
                        <p className="text-lg leading-[2] text-gray-900 dark:text-white">
                          {verse.arabic}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {verse.translation}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {verse.surah} · Ayah {verse.ayahNumber}
                        </span>
                        <button
                          onClick={() => toggleFavorite("verses", verse.id)}
                          className="p-1.5 rounded-lg text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                        >
                          <HiOutlineHeart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineHeart className="w-5 h-5 text-purple-500" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {t("collections.favoriteDuas")}
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({favoriteDuas.length})
                </span>
              </div>
              {favoriteDuas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                    {t("collections.noFavoriteDuas")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favoriteDuas.map((dua) => (
                    <div
                      key={dua.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4"
                    >
                      <p className="text-right text-lg leading-[2] text-gray-900 dark:text-white mb-2">
                        {dua.arabic}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {dua.translation}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {dua.source}
                        </span>
                        <button
                          onClick={() => toggleDuaFavorite(dua.id)}
                          className="p-1.5 rounded-lg text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                        >
                          <HiOutlineHeart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === "collections" && (
          <motion.div
            key="collections"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <HiOutlinePlus className="w-4 h-4" />
                {t("collections.create")}
              </button>
              <div className="flex-1 relative">
                <HiOutlineSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("collections.searchPlaceholder")}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald dark:focus:border-emerald-400"
                />
              </div>
              <button
                onClick={() => setSortBy(sortBy === "date" ? "name" : "date")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {sortBy === "date" ? (
                  <HiOutlineClock className="w-4 h-4" />
                ) : (
                  <HiOutlineSortAscending className="w-4 h-4" />
                )}
                {sortBy === "date" ? t("collections.byDate") : t("collections.byName")}
              </button>
            </div>

            {sortedCollections.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-12 text-center">
                <HiOutlineCollection className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  {searchQuery
                    ? t("collections.noResults")
                    : t("collections.empty")}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  {t("collections.createPrompt")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedCollections.map((col) => (
                  <motion.div
                    key={col.id}
                    layout
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        {editingCollection === col.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald"
                            />
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                  placeholder={t("collections.descPlaceholder")}
                               className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald"
                             />
                             <div className="flex gap-2">
                               <button
                                 onClick={() => handleUpdateCollection(col.id)}
                                 className="text-xs px-3 py-1 rounded-lg bg-emerald text-white hover:opacity-90"
                               >
                                 {t("common.save")}
                               </button>
                               <button
                                 onClick={() => setEditingCollection(null)}
                                 className="text-xs px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                               >
                                 {t("common.cancel")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {col.name}
                            </h3>
                            {col.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {col.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
                       <span>{col.verseIds.length} {t("collections.verseCount")}</span>
                       <span>{col.duaIds.length} {t("collections.duaCount")}</span>
                       <span>
                         {t("collections.updated")} {new Date(col.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setExpandedCollection(
                            expandedCollection === col.id ? null : col.id
                          )
                        }
                        className="flex-1 text-xs py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {expandedCollection === col.id ? t("collections.close") : t("collections.view")}
                      </button>
                      <button
                        onClick={() => handleShareCollection(col)}
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                         title={t("collections.share")}
                      >
                        <HiOutlineShare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCollection(col.id);
                          setEditName(col.name);
                          setEditDesc(col.description || "");
                        }}
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                         title={t("collections.edit")}
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      {confirmDelete === col.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              removeCollection(col.id);
                              setConfirmDelete(null);
                              if (expandedCollection === col.id)
                                setExpandedCollection(null);
                            }}
                            className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="p-2 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            <HiOutlineX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(col.id)}
                          className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                           title={t("collections.delete")}
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {expandedCollection === col.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 space-y-3"
                      >
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowAddItemModal(col.id);
                              setAddItemType("verses");
                              setAddSearchQuery("");
                            }}
                            className="flex-1 text-xs py-2 rounded-xl bg-emerald/10 text-emerald dark:text-emerald-400 hover:bg-emerald/20 transition-colors"
                          >
                            {t("collections.addVerse")}
                          </button>
                          <button
                            onClick={() => {
                              setShowAddItemModal(col.id);
                              setAddItemType("duas");
                              setAddSearchQuery("");
                            }}
                            className="flex-1 text-xs py-2 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                          >
                            {t("collections.addDua")}
                          </button>
                        </div>

                        {col.verseIds.length > 0 && (
                          <div>
                             <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                               {t("collections.verses")}
                             </h4>
                            <div className="space-y-2">
                              {col.verseIds.map((vid) => {
                                const v = getVerseById(vid);
                                if (!v) return null;
                                return (
                                  <div
                                    key={vid}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900 dark:text-white truncate">
                                        {v.surah} ({v.ayahNumber})
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {v.translation}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeVerseFromCollection(col.id, vid)
                                      }
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2 shrink-0"
                                    >
                                      <HiOutlineX className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {col.duaIds.length > 0 && (
                          <div>
                             <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                               {t("collections.duas")}
                             </h4>
                            <div className="space-y-2">
                              {col.duaIds.map((did) => {
                                const d = getDuaById(did);
                                if (!d) return null;
                                return (
                                  <div
                                    key={did}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900 dark:text-white truncate">
                                        [{d.category}] {d.source}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {d.translation}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeDuaFromCollection(col.id, did)
                                      }
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2 shrink-0"
                                    >
                                      <HiOutlineX className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {col.verseIds.length === 0 &&
                          col.duaIds.length === 0 && (
                             <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
                               {t("collections.emptyCollection")}
                             </p>
                          )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                 {t("collections.newCollection")}
               </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCollName}
                  onChange={(e) => setNewCollName(e.target.value)}
                   placeholder={t("collections.namePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                  autoFocus
                />
                <input
                  type="text"
                  value={newCollDesc}
                  onChange={(e) => setNewCollDesc(e.target.value)}
                   placeholder={t("collections.descPlaceholder")}
                   className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                   className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                 >
                   {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleCreateCollection}
                   disabled={!newCollName.trim()}
                   className="flex-1 py-2.5 rounded-xl bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                 >
                   {t("common.create")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddItemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddItemModal(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddItemType("verses")}
                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                       addItemType === "verses"
                         ? "bg-emerald/10 text-emerald dark:text-emerald-400"
                         : "text-gray-500 dark:text-gray-400"
                     }`}
                   >
                     {t("collections.verses")}
                  </button>
                  <button
                    onClick={() => setAddItemType("duas")}
                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                       addItemType === "duas"
                         ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                         : "text-gray-500 dark:text-gray-400"
                     }`}
                   >
                     {t("collections.duas")}
                  </button>
                </div>
                <button
                  onClick={() => setShowAddItemModal(null)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="relative">
                  <HiOutlineSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={addSearchQuery}
                    onChange={(e) => setAddSearchQuery(e.target.value)}
                    placeholder={`Search ${addItemType}...`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {filteredAddItems.slice(0, 30).map((item) => {
                  const isAdded =
                    addItemType === "verses"
                      ? expanded?.verseIds.includes(item.id)
                      : expanded?.duaIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">
                          {"translation" in item
                            ? (item as { translation: string }).translation.slice(0, 80)
                            : ""}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {"surah" in item
                            ? `${(item as { surah: string }).surah} (${(item as { ayahNumber: number }).ayahNumber})`
                            : "category" in item
                            ? `${(item as { category: string }).category} · ${(item as { source: string }).source}`
                            : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!expanded) return;
                          if (addItemType === "verses") {
                            if (isAdded) {
                              removeVerseFromCollection(expanded.id, item.id);
                            } else {
                              addVerseToCollection(expanded.id, item.id);
                            }
                          } else {
                            if (isAdded) {
                              removeDuaFromCollection(expanded.id, item.id);
                            } else {
                              addDuaToCollection(expanded.id, item.id);
                            }
                          }
                        }}
                        className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                          isAdded
                            ? "bg-emerald/10 text-emerald dark:text-emerald-400"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-emerald hover:text-white"
                        }`}
                      >
                        {isAdded ? t("collections.added") : t("collections.add")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
