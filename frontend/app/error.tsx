"use client";

import * as React from "react";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white space-y-4 transition-colors duration-300">
      <div className="rounded-full bg-rose-100 dark:bg-rose-950/60 p-4 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">An error occurred in FasalDrishti System</h2>
      <p className="text-xs text-slate-500 dark:text-[#C9D1D9] max-w-md">{error.message || "Unable to complete request."}</p>
      <Button variant="primary" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}