import * as React from "react";
import { NotificationPanel } from "./notification-panel";

export function NotificationsModule() {
  return (
    <div className="flex justify-center p-4">
      <NotificationPanel />
    </div>
  );
}