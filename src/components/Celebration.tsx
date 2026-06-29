"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 300,
  y: -(Math.random() * 300 + 100),
  size: Math.random() * 6 + 3,
  color: ["#C9A227", "#0F5132", "#F59E0B", "#10B981", "#3B82F6"][Math.floor(Math.random() * 5)],
  delay: Math.random() * 0.3,
}));

export default function Celebration({ show, onDone }: { show: boolean; onDone?: () => void }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onDone?.(), 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0, 1, 0] }}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl"
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
