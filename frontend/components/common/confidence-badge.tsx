import * as React from "react";
import { ConfidenceLevel } from "../../types/common";
import { cn } from "../../lib/utils";
import { ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";

export interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  score?: number; // e.g. 94 for 94%
  className?: string;
}

export function ConfidenceBadge({ confidence, score, className }: ConfidenceBadgeProps) {
  const config = {
    High: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />,
    },
    Medium: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />,
    },
    Low: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      icon: <AlertCircle className="h-3.5 w-3.5 text-rose-600" />,
    },
  };

  const style = config[confidence] || config.Medium;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs transition-colors",
        style.bg,
        className
      )}
    >
      {style.icon}
      <span>{confidence} Confidence</span>
      {score !== undefined && <span className="font-bold opacity-85">({score}%)</span>}
    </span>
  );
}
