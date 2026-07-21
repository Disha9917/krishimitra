import * as React from "react";
import { cn } from "../../lib/utils";

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-semibold transition-all focus:outline-none",
              isActive
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}