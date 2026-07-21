import * as React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Sprout, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white space-y-4 transition-colors duration-300">
      <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-4 text-emerald-600 dark:text-emerald-400">
        <Sprout className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white">404 - Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-[#C9D1D9] max-w-sm">The requested AgriTech page or route does not exist.</p>
      <Link href="/">
        <Button variant="primary">
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </Button>
      </Link>
    </div>
  );
}