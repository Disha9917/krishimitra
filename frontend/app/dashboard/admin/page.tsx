"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { AnalyticsModule } from "../../../components/dashboard/analytics-module";

export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="AgriTech System Analytics & Admin Panel" description="Overview of platform usage, advisory volumes, and disease outbreak maps." />
      <AnalyticsModule />
    </div>
  );
}