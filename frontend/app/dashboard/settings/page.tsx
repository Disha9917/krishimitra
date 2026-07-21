"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { AlertSettings } from "../../../components/forms/alert-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Alert Settings & Notification Simulation"
        description="Simulate SMS alerts, WhatsApp message notifications, and APMC price threshold limits."
      />
      <AlertSettings />
    </div>
  );
}