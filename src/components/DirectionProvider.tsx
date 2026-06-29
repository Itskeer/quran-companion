"use client";
import { useEffect } from "react";
import { useApp } from "@/context/AppProviders";

export default function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { language } = useApp();

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  return <>{children}</>;
}
