import * as React from "react";
import { cn } from "../../lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id?: string;
  type?: "success" | "warning" | "error" | "info";
  message: string;
  onClose?: () => void;
}

export function Toast({ type = "success", message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    error: <XCircle className="h-5 w-5 text-rose-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 shadow-md transition-all animate-fade-in",
        borders[type]
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="rounded-lg p-1 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}