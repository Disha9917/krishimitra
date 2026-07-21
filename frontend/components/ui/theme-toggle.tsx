"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-full bg-slate-200/80 dark:bg-[#161B22] border border-slate-300/60 dark:border-[#2A2F3A]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className="relative flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-300 bg-slate-200/90 dark:bg-[#161B22] border border-slate-300/80 dark:border-[#2A2F3A] shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
    >
      {/* Background Icons */}
      <div className="flex w-full items-center justify-between px-1 text-xs select-none">
        <Sun className="h-3.5 w-3.5 text-amber-500 transition-opacity duration-200 opacity-70" />
        <Moon className="h-3.5 w-3.5 text-emerald-400 transition-opacity duration-200 opacity-70" />
      </div>

      {/* Sliding Knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full shadow-md ${
          isDark
            ? "left-8 bg-emerald-600 text-white"
            : "left-1 bg-white text-amber-500"
        }`}
      >
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 fill-current text-emerald-100" />
          ) : (
            <Sun className="h-4 w-4 fill-current text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
