import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-[#0B0F14] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
    
    const variants = {
      primary: "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-500/25",
      secondary: "bg-emerald-50 dark:bg-[#161B22] text-emerald-700 dark:text-[#C9D1D9] hover:bg-emerald-100 dark:hover:bg-[#1C212A] dark:hover:text-white border border-emerald-200 dark:border-[#2A2F3A]",
      outline: "border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-50 dark:hover:bg-[#1C212A] dark:hover:text-white shadow-xs",
      ghost: "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white",
      danger: "bg-rose-600 dark:bg-rose-600/90 text-white hover:bg-rose-700 shadow-sm",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";