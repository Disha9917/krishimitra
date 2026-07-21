import * as React from "react";
import { Avatar } from "../ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function NavUser() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
      <Link href="/dashboard/profile" className="flex items-center gap-2.5 min-w-0">
        <Avatar name={user.fullName} size="sm" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
          <p className="text-[10px] text-slate-500 truncate">{user.phone}</p>
        </div>
      </Link>
      <Link href="/login" onClick={logout} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
        <LogOut className="h-4 w-4" />
      </Link>
    </div>
  );
}