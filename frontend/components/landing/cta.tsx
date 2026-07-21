import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-8 sm:p-12 text-center text-white shadow-xl space-y-6">
          <Sprout className="h-12 w-12 mx-auto text-emerald-200" />
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Maximize Yield & Stop Post-Harvest Losses?</h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Get instant AI recommendations tailored for your farm, crop variety, and local weather conditions.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}