import * as React from "react";
import { notificationStore, NotificationItem } from "../../store/notification.store";
import { Bell, Check, TrendingUp, AlertTriangle, CloudRain, Sprout, X } from "lucide-react";
import Link from "next/link";

export interface NotificationPanelProps {
  onClose?: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    notificationStore.getNotifications()
  );
  const unreadCount = notificationStore.getUnreadCount();

  const handleMarkAllRead = () => {
    notificationStore.markAllAsRead();
    setNotifications([...notificationStore.getNotifications()]);
  };

  const getIcon = (type: string) => {
    if (type === "PRICE") return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (type === "DISEASE") return <AlertTriangle className="h-4 w-4 text-rose-600" />;
    if (type === "WEATHER") return <CloudRain className="h-4 w-4 text-blue-600" />;
    return <Sprout className="h-4 w-4 text-amber-600" />;
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600" />
          <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
          {unreadCount > 0 && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadCount} Unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark Read
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.actionUrl || "#"}
            onClick={onClose}
            className={`block rounded-xl border p-3 transition-colors ${
              !n.read
                ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50"
                : "border-slate-100 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="rounded-lg bg-white p-1.5 shadow-xs border border-slate-100 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{n.title}</h5>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
