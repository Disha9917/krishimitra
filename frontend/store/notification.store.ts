export interface NotificationItem {
  id: string;
  type: "PRICE" | "DISEASE" | "WEATHER" | "ADVISORY";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "N-1",
    type: "PRICE",
    title: "Wheat Market Price Alert",
    message: "Wheat price surged by +₹60/Qtl in Khanna Mandi. Current price: ₹2,420.",
    time: "10 mins ago",
    read: false,
    actionUrl: "/dashboard/market-prices",
  },
  {
    id: "N-2",
    type: "DISEASE",
    title: "Yellow Rust High Risk Warning",
    message: "High humidity (>85%) detected in Ludhiana district. Inspect Wheat leaf tips immediately.",
    time: "1 hour ago",
    read: false,
    actionUrl: "/dashboard/disease-detection",
  },
  {
    id: "N-3",
    type: "WEATHER",
    title: "Rainfall Forecast Alert",
    message: "Moderate rain expected on Day 3. Defer nitrogen fertilizer top-dressing.",
    time: "3 hours ago",
    read: false,
    actionUrl: "/dashboard/weather",
  },
  {
    id: "N-4",
    type: "ADVISORY",
    title: "Post-Harvest Storage Advice",
    message: "Your stored Wheat batch reaches 80% shelf life in 5 days. Consider selling or re-ventilating.",
    time: "Yesterday",
    read: true,
    actionUrl: "/dashboard/post-harvest",
  },
];

let notifications = [...INITIAL_NOTIFICATIONS];

export const notificationStore = {
  getNotifications: () => notifications,
  getUnreadCount: () => notifications.filter(n => !n.read).length,
  markAllAsRead: () => {
    notifications = notifications.map(n => ({ ...n, read: true }));
  },
  addNotification: (item: Omit<NotificationItem, "id" | "time" | "read">) => {
    notifications.unshift({
      ...item,
      id: `N-${Date.now()}`,
      time: "Just now",
      read: false,
    });
  },
};