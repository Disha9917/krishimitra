import * as React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label = "Loading data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}