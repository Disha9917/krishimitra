"use client";

import * as React from "react";
import { Button } from "../../components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="rounded-full bg-rose-100 p-3 text-rose-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Failed to load dashboard module</h3>
      <Button variant="primary" onClick={() => reset()}>
        Retry Loading
      </Button>
    </div>
  );
}