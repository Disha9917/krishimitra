"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#161B22] p-1 shadow-sm border border-emerald-200/80 dark:border-emerald-800/40 overflow-hidden">
        <Image src="/icon.png" alt="FasalDrishti Logo" width={28} height={28} className="object-contain" />
      </div>
      <span>FasalDrishti <span className="text-emerald-600 dark:text-emerald-300 font-semibold">AI</span></span>
    </Link>
  );
}