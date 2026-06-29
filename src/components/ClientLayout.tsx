"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import ScrollProgress from "./ScrollProgress";
import ScrollToTop from "./ScrollToTop";

const variants = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={variants}
          initial="out"
          animate="in"
          exit="out"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <ScrollToTop />
    </>
  );
}
