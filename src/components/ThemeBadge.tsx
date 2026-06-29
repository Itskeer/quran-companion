"use client";
import { getThemeByName } from "@/data/themes";

export default function ThemeBadge({ theme }: { theme: string }) {
  const themeData = getThemeByName(theme);
  const label = themeData?.name || theme;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
      {label}
    </span>
  );
}
