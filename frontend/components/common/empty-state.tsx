import * as React from "react";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data found",
  description = "Get started by generating your first advisory or diagnostic report.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 my-6">
      <div className="rounded-full bg-white p-3 shadow-xs border border-slate-100 text-slate-400 mb-3">
        <FolderOpen className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}