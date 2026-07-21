import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-[#C9D1D9]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] px-3.5 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-emerald-500 dark:focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-[#111827]",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";