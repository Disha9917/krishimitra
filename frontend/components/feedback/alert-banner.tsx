import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AlertBannerProps {
  type?: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  className?: string;
}

export function AlertBanner({ type = "info", title, message, className }: AlertBannerProps) {
  const styles = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    error: "bg-rose-50 text-rose-900 border-rose-200",
  };

  const icons = {
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose-600 shrink-0" />,
  };

  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border p-4 shadow-xs", styles[type], className)}>
      {icons[type]}
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        {message && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{message}</p>}
      </div>
    </div>
  );
}