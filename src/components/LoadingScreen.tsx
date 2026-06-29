"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Finding Quran verses and authentic duas...",
  "Analyzing themes and matching content...",
  "Preparing your personalized reflections...",
];

const allThemes = ["Hope", "Patience", "Trust", "Mercy", "Comfort"];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [detectedThemes, setDetectedThemes] = useState<string[]>([]);
  const [showThemes, setShowThemes] = useState(false);
  const msgRef = useRef(0);
  const themesShown = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8 + 2, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 30 && msgRef.current < 1) { msgRef.current = 1; requestAnimationFrame(() => setMsgIndex(1)); }
    if (progress > 60 && msgRef.current < 2) { msgRef.current = 2; requestAnimationFrame(() => setMsgIndex(2)); }
    if (progress > 80 && !themesShown.current) {
      themesShown.current = true;
      requestAnimationFrame(() => setShowThemes(true));
      let i = 0;
      const addTheme = () => {
        if (i < allThemes.length) {
          const theme = allThemes[i];
          requestAnimationFrame(() => setDetectedThemes((prev) => [...prev, theme]));
          i++;
          setTimeout(addTheme, 500);
        }
      };
      addTheme();
    }
    if (progress >= 100) {
      setTimeout(onComplete, 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-gray-900 px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-emerald/20 dark:border-emerald-400/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald dark:border-t-emerald-400" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-gold" />
          <div className="absolute inset-4 rounded-full bg-emerald/5 dark:bg-emerald-400/5 flex items-center justify-center">
            <span className="text-lg">📖</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            {loadingMessages[msgIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald to-gold rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          {Math.round(progress)}%
        </p>

        <AnimatePresence>
          {showThemes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Detected themes
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {detectedThemes.map((theme, i) => (
                  <motion.span
                    key={theme}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-emerald/10 text-emerald dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald/20 dark:border-emerald-400/20"
                  >
                    {theme}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
