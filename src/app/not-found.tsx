"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import GeometricPattern from "@/components/GeometricPattern";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GeometricPattern className="absolute inset-0 opacity-20" />
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-8xl font-bold text-emerald/20 dark:text-emerald-400/20 mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 font-medium text-sm hover:bg-emerald/90 transition-all shadow-lg shadow-emerald/20"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
