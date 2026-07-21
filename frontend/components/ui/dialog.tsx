import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] p-6 shadow-xl animate-fade-in text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2A2F3A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#1C212A] hover:text-slate-600 dark:hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}