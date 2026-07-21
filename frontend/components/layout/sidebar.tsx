import * as React from "react";
import { Logo } from "../common/logo";
import { NavMain } from "../navigation/nav-main";
import { NavUser } from "../navigation/nav-user";

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4">
      <div className="space-y-6">
        <div className="px-2 pt-2">
          <Logo />
        </div>
        <NavMain onItemClick={onItemClick} />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <NavUser />
      </div>
    </aside>
  );
}