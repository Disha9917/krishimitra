import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-[#C9D1D9]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8B949E] transition-colors focus:border-emerald-500 dark:focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-[#111827]",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-[#8B949E]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";