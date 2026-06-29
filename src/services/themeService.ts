"use client";

import type { CustomTheme } from "@/types";

const CUSTOM_THEMES_KEY = "quran-companion-custom-themes";

const BUILT_IN_THEMES: CustomTheme[] = [
  {
    id: "green",
    name: "Islamic Green",
    nameAr: "الأخضر الإسلامي",
    primary: "#0f5132",
    secondary: "#28a745",
    accent: "#198754",
    background: "#f0fdf4",
    surface: "#ffffff",
    text: "#222222",
    isActive: false,
  },
  {
    id: "blue",
    name: "Ocean Blue",
    nameAr: "أزرق المحيط",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#2563eb",
    background: "#eff6ff",
    surface: "#ffffff",
    text: "#222222",
    isActive: false,
  },
  {
    id: "purple",
    name: "Royal Purple",
    nameAr: "البنفسجي الملكي",
    primary: "#6b21a8",
    secondary: "#a855f7",
    accent: "#9333ea",
    background: "#faf5ff",
    surface: "#ffffff",
    text: "#222222",
    isActive: false,
  },
  {
    id: "gold",
    name: "Noble Gold",
    nameAr: "الذهب النبيل",
    primary: "#92400e",
    secondary: "#d97706",
    accent: "#f59e0b",
    background: "#fffbeb",
    surface: "#ffffff",
    text: "#222222",
    isActive: false,
  },
];

export function getBuiltInThemes(): CustomTheme[] {
  return BUILT_IN_THEMES;
}

export function getCustomThemes(): CustomTheme[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomTheme(theme: CustomTheme): void {
  const themes = getCustomThemes();
  const existing = themes.findIndex((t) => t.id === theme.id);

  if (existing >= 0) {
    themes[existing] = theme;
  } else {
    themes.push(theme);
  }

  try {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
  } catch {
    // Storage full or unavailable
  }
}

export function deleteCustomTheme(id: string): void {
  const themes = getCustomThemes().filter((t) => t.id !== id);
  try {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
  } catch {
    // Storage full or unavailable
  }
}

export function applyTheme(theme: CustomTheme): void {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-background", theme.background);
  root.style.setProperty("--color-surface", theme.surface);
  root.style.setProperty("--color-text", theme.text);
}
