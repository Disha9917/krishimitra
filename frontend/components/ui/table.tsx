import * as React from "react";
import { cn } from "../../lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]">
      <table className={cn("w-full text-left text-sm text-slate-600 dark:text-[#C9D1D9]", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-slate-50 dark:bg-[#111827] text-xs font-semibold uppercase text-slate-500 dark:text-[#8B949E] border-b border-slate-100 dark:border-[#2A2F3A]", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-slate-100 dark:divide-[#2A2F3A]", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-slate-50/80 dark:hover:bg-[#1C212A] transition-colors", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3.5 font-semibold text-slate-700 dark:text-white", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3.5 align-middle text-slate-700 dark:text-[#C9D1D9]", className)} {...props} />;
}