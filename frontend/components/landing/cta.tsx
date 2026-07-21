import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 bg-transparent relative z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800/90 via-emerald-700/85 to-teal-800/90 dark:from-[#161B22] dark:via-emerald-950/70 dark:to-[#111827] backdrop-blur-xl p-8 sm:p-12 text-center text-white shadow-2xl border border-emerald-400/30 dark:border-[#2A2F3A] space-y-6 overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-lime-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <Sprout className="h-12 w-12 mx-auto text-emerald-300 dark:text-emerald-400 animate-bounce" />
          <h2 className="text-3xl font-black sm:text-4xl tracking-tight text-white">Ready to Maximize Yield & Stop Post-Harvest Losses?</h2>
          <p className="text-sm sm:text-base text-emerald-100 dark:text-[#C9D1D9] max-w-xl mx-auto leading-relaxed">
            Get instant AI recommendations tailored for your farm, crop variety, and local weather conditions.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="bg-white dark:bg-[#22C55E] text-emerald-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-[#16A34A] shadow-lg shadow-emerald-950/20 transition-all transform hover:-translate-y-0.5 border-none">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}