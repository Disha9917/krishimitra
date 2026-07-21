import * as React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Sprout, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center bg-slate-50 space-y-4">
      <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
        <Sprout className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-black text-slate-900">404 - Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">The requested AgriTech page or route does not exist.</p>
      <Link href="/dashboard">
        <Button variant="primary">
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}