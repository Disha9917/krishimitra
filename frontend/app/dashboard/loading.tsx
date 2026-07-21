import * as React from "react";
import { LoadingSpinner } from "../../components/common/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <LoadingSpinner label="Loading Dashboard Data..." />
    </div>
  );
}