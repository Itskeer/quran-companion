"use client";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
} from "react-icons/hi";

interface AudioPlayerProps {
  title?: string;
  className?: string;
  compact?: boolean;
}

export default function AudioPlayer({
  title = "Recitation",
  className = "",
  compact = false,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = useCallback(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + Math.random() * 3 + 1;
          if (next >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, 300);
    }
  }, [playing]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={togglePlay}
          className="p-2 rounded-lg bg-emerald/10 text-emerald dark:text-emerald-400 hover:bg-emerald/20 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <HiOutlinePause className="w-4 h-4" />
          ) : (
            <HiOutlinePlay className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 flex items-center justify-center hover:bg-emerald/90 transition-colors shadow-lg shadow-emerald/20"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <HiOutlinePause className="w-5 h-5" />
          ) : (
            <HiOutlinePlay className="w-5 h-5 ml-0.5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-dark dark:text-white truncate">{title}</p>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald to-gold rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400">{formatTime(progress)}</span>
            <span className="text-[10px] text-gray-400">{formatTime(100)}</span>
          </div>
        </div>
        <button
          onClick={() => setMuted(!muted)}
          className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <HiOutlineVolumeOff className="w-5 h-5" />
          ) : (
            <HiOutlineVolumeUp className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

function formatTime(pct: number): string {
  const total = Math.floor((pct / 100) * 180);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
