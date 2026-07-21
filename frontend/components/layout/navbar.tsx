"use client";

import * as React from "react";
import { Logo } from "../common/logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { PUBLIC_NAV_ITEMS } from "../../constants/navigation";
import { ThemeToggle } from "../ui/theme-toggle";

export function Navbar() {
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
    <nav className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/70 dark:bg-[#0B0F14]/80 backdrop-blur-md shadow-xs transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-[#C9D1D9]">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}