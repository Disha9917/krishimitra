"use client";

import * as React from "react";
import { Logo } from "../common/logo";
import Link from "next/link";

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace("/#", "").replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="border-t border-emerald-200/50 dark:border-[#2A2F3A] bg-white/60 dark:bg-[#0B0F14]/90 backdrop-blur-md py-8 text-slate-600 dark:text-[#8B949E] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <Logo />
        <p className="text-slate-400 dark:text-[#8B949E]">
          © {new Date().getFullYear()} FasalDrishti AI. Precision Crop Advisory & Post-Harvest Loss Planner for Smallholder Farmers.
        </p>
        <div className="flex gap-4">
          <Link
            href="/#about"
            onClick={(e) => handleNavClick(e, "/#about")}
            className="text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact")}
            className="text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}