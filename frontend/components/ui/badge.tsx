import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    secondary: "bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] border-slate-200 dark:border-[#2A2F3A]",
    outline: "border border-slate-300 dark:border-[#2A2F3A] text-slate-700 dark:text-[#C9D1D9]",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-white",
    danger: "bg-rose-500 text-white",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}