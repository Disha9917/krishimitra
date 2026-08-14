import * as React from "react";
import { LoadingSpinner } from "../components/common/loading-spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <LoadingSpinner label="Initializing FasalDrishti AgriTech Engine..." />
    </div>
  );
}