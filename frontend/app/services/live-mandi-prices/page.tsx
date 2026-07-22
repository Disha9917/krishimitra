import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { TrendingUp, Search, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const prices = [
  { crop: "Wheat", variety: "Sharbati", mandi: "Azadpur", min: "₹2,150", max: "₹2,450", trend: "up", change: "+3.2%" },
  { crop: "Rice", variety: "Basmati 1121", mandi: "Karnal", min: "₹3,800", max: "₹4,200", trend: "up", change: "+1.8%" },
  { crop: "Potato", variety: "Jyoti", mandi: "Agra", min: "₹850", max: "₹1,050", trend: "down", change: "-2.1%" },
  { crop: "Onion", variety: "Red", mandi: "Nashik", min: "₹1,200", max: "₹1,600", trend: "up", change: "+5.4%" },
  { crop: "Tomato", variety: "Hybrid", mandi: "Kolar", min: "₹950", max: "₹1,200", trend: "down", change: "-4.0%" },
  { crop: "Mustard", variety: "Yellow", mandi: "Jaipur", min: "₹1,800", max: "₹2,100", trend: "up", change: "+2.5%" },
  { crop: "Sugarcane", variety: "CO-0238", mandi: "Meerut", min: "₹340", max: "₹360", trend: "stable", change: "0.0%" },
  { crop: "Maize", variety: "Hybrid", mandi: "Davangere", min: "₹1,100", max: "₹1,350", trend: "up", change: "+1.2%" },
];

export default function LiveMandiPricesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <TrendingUp className="h-4 w-4" />
              <span>Real-Time Market Data</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Live Mandi Prices</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Real-time APMC mandi prices for your crops. Search, filter, and track price trends across markets.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 mb-10 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-[#C9D1D9]">
                  <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Search by crop or mandi</span>
                </div>
                <div className="flex gap-2">
                  {["All Crops", "Wheat", "Rice", "Vegetables"].map((f, i) => (
                    <button key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${i === 0 ? "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500" : "bg-white dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A] hover:bg-emerald-50 dark:hover:bg-[#1C212A]"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-emerald-100 dark:border-[#2A2F3A] text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8B949E]">
                      <th className="pb-3 pr-4">Crop</th>
                      <th className="pb-3 pr-4">Variety</th>
                      <th className="pb-3 pr-4">Mandi</th>
                      <th className="pb-3 pr-4">Min Price</th>
                      <th className="pb-3 pr-4">Max Price</th>
                      <th className="pb-3 pr-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((p, i) => (
                      <tr key={i} className="border-b border-emerald-50 dark:border-[#2A2F3A]/50 hover:bg-emerald-50/30 dark:hover:bg-[#161B22]/50 transition-colors">
                        <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">{p.crop}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-[#C9D1D9]">{p.variety}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-[#C9D1D9]">{p.mandi}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-white">{p.min}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-white">{p.max}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : p.trend === "down" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400"}`}>
                            {p.trend === "up" ? <ArrowUp className="h-3 w-3" /> : p.trend === "down" ? <ArrowDown className="h-3 w-3" /> : null}
                            {p.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-[#C9D1D9]">Price Trend Chart</span>
              </div>
              <div className="w-full h-48 rounded-xl bg-emerald-50/50 dark:bg-[#161B22] border border-emerald-100/50 dark:border-[#2A2F3A] flex items-center justify-center text-xs text-slate-400 dark:text-[#8B949E]">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-8 w-8 mx-auto text-emerald-400" />
                  <p>Interactive price chart coming soon</p>
                  <p className="text-[10px]">Historical trends across 30 days will be displayed here</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-transparent">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How often are prices updated?", a: "Prices are updated every 30 minutes directly from APMC mandi data feeds." },
                { q: "Can I set price alerts for specific crops?", a: "Yes, you can set up price alerts in your dashboard to get notified when prices cross your target." },
                { q: "Are these prices including transportation costs?", a: "No, these are mandi yard prices. Transportation and commission charges are additional." },
              ].map((faq, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
