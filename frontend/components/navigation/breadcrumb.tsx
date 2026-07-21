import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4" aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex items-center hover:text-slate-900 transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-slate-800">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}