"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link href="/" onClick={handleClick} className={`inline-flex items-center gap-2.5 text-emerald-800 dark:text-emerald-400 font-extrabold text-xl tracking-tight ${className || ""}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-950/40">
        <Sprout className="h-5 w-5" />
      </div>
      <span>KrishiMitra <span className="text-emerald-600 dark:text-emerald-300 font-semibold">AI</span></span>
    </Link>
  );
}