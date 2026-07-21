import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_ITEMS } from "../../constants/navigation";
import {
  LayoutDashboard,
  Sprout,
  Warehouse,
  Scan,
  TrendingUp,
  CloudSun,
  History,
  FileText,
  BellRing,
} from "lucide-react";
import { cn } from "../../lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Sprout: <Sprout className="h-4 w-4" />,
  Warehouse: <Warehouse className="h-4 w-4" />,
  Scan: <Scan className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  CloudSun: <CloudSun className="h-4 w-4" />,
  History: <History className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  BellRing: <BellRing className="h-4 w-4" />,
};

export function NavMain({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 py-2">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
              isActive
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className={cn(isActive ? "text-white" : "text-emerald-600")}>
              {iconMap[item.icon] || <Sprout className="h-4 w-4" />}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}