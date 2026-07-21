import * as React from "react";
import { Logo } from "../common/logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { PUBLIC_NAV_ITEMS } from "../../constants/navigation";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-emerald-600 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Farmer Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}