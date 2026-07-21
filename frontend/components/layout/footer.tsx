import * as React from "react";
import { Logo } from "../common/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <Logo />
        <p className="text-slate-400">
          © {new Date().getFullYear()} KrishiMitra AI. Precision Crop Advisory & Post-Harvest Loss Planner for Smallholder Farmers.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-emerald-700">About</Link>
          <Link href="/contact" className="hover:text-emerald-700">Contact</Link>
          <Link href="/dashboard" className="hover:text-emerald-700 font-bold">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}