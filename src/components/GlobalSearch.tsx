"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { searchVerses } from "@/data/verses";
import { searchDuas } from "@/data/duas";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const verseResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchVerses(query).slice(0, 5);
  }, [query]);

  const duaResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchDuas(query).slice(0, 5);
  }, [query]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      requestAnimationFrame(() => setQuery(""));
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) { onClose(); } else { ((window as unknown as Record<string, unknown>).__openSearch as (() => void) | undefined)?.(); }
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
              <HiOutlineSearch className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search verses and duas... (Ctrl+K)"
                className="flex-1 bg-transparent text-dark dark:text-white placeholder-gray-400 outline-none text-sm"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {!query.trim() ? (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-8">
                  Type to search across all verses and duas
                </p>
              ) : (
                <>
                  {verseResults.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                        Verses
                      </p>
                      {verseResults.map((v) => (
                        <Link
                          key={v.id}
                          href="/quran"
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <span className="text-xs font-medium text-emerald shrink-0">
                            {v.surahNumber}:{v.ayahNumber}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {v.translation.slice(0, 80)}...
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {duaResults.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                        Duas
                      </p>
                      {duaResults.map((d) => (
                        <Link
                          key={d.id}
                          href="/duas"
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <span className="text-xs font-medium text-gold shrink-0">
                            {d.category}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {d.translation.slice(0, 80)}...
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {verseResults.length === 0 && duaResults.length === 0 && (
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-8">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <span className="text-[10px] text-gray-400">Navigate with ↑↓</span>
              <span className="text-[10px] text-gray-400">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono">ESC</kbd> to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
