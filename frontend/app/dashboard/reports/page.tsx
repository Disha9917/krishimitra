"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { ReportsModule } from "../../../components/dashboard/reports-module";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Field Advisory Reports & Exports"
        description="Generate and download PDF summaries, CSV data tables, or print official field extension reports."
      />
      <ReportsModule />
    </div>
  );
}