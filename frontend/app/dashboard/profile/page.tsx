"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { useAuth } from "../../../hooks/useAuth";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Farmer Profile & Farm Details" description="Manage personal contact info and registered land holdings." />
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
            <p className="text-xs text-slate-500">{user.role} • PIN: {user.pinCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 font-medium">Mobile Phone</span>
            <span className="font-bold text-slate-900 block mt-0.5">{user.phone}</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 font-medium">Primary Crop Cultivated</span>
            <span className="font-bold text-slate-900 block mt-0.5">{user.primaryCrop}</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 font-medium">Registered Land Holdings</span>
            <span className="font-bold text-slate-900 block mt-0.5">{user.farmSizeAcres} Acres</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-400 font-medium">District / State</span>
            <span className="font-bold text-slate-900 block mt-0.5">{user.district}, {user.state}</span>
          </div>
        </div>
      </div>
    </div>
  );
}