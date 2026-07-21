import * as React from "react";
import { NotificationPanel } from "../dashboard/notification-panel";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import { notificationStore } from "../../store/notification.store";
import { Bell, Menu, Search, Sprout } from "lucide-react";
import Link from "next/link";

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const unreadCount = notificationStore.getUnreadCount();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ludhiana Weather Station: 28°C Partly Cloudy</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <DropdownMenu
          trigger={
            <button className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          }
        >
          <NotificationPanel />
        </DropdownMenu>

        {/* User Profile Avatar */}
        {user && (
          <Link href="/dashboard/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Avatar name={user.fullName} size="sm" />
            <span className="hidden md:inline-block text-xs font-bold text-slate-800">{user.fullName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}