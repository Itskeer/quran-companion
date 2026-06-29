"use client";

import { wordOfDayData } from "@/data/wordOfDay";
import type { WordOfDayItem } from "@/data/wordOfDay";

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getWordOfDay(): WordOfDayItem {
  const dayOfYear = getDayOfYear();
  const index = dayOfYear % wordOfDayData.length;
  return wordOfDayData[index];
}

export function getWordOfTheDayFr(): WordOfDayItem {
  return getWordOfDay();
}
