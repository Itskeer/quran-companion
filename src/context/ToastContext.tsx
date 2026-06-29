"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheck, HiOutlineHeart, HiOutlineClipboard } from "react-icons/hi";

type ToastType = "success" | "info" | "copy" | "favorite";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <HiOutlineCheck className="w-4 h-4" />,
  info: <HiOutlineHeart className="w-4 h-4" />,
  copy: <HiOutlineClipboard className="w-4 h-4" />,
  favorite: <HiOutlineHeart className="w-4 h-4" />,
};

const colors: Record<ToastType, string> = {
  success: "bg-emerald text-white",
  info: "bg-blue-500 text-white",
  copy: "bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-white",
  favorite: "bg-red-500 text-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium pointer-events-auto ${colors[t.type]}`}
            >
              {icons[t.type]}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
