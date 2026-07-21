import * as React from "react";
import { Filter } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterBarProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterBar({ options, selected, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-1">
        <Filter className="h-3.5 w-3.5" /> Filter:
      </div>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              isSelected
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}