"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { TrendingUp, Search, ArrowUp, ArrowDown, ChevronRight, Bell, CheckCircle2, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const prices = [
  { crop: "Tobacco", variety: "Flue Cured", mandi: "Anand APMC (Central)", min: "₹4,350", max: "₹5,100", trend: "up", change: "+3.5%", category: "Cash Crop" },
  { crop: "Cotton", variety: "Kapash Bt", mandi: "Anand APMC (Central)", min: "₹6,400", max: "₹7,100", trend: "up", change: "+2.1%", category: "Cash Crop" },
  { crop: "Maize", variety: "Yellow Grain", mandi: "Dahod APMC (East)", min: "₹1,950", max: "₹2,300", trend: "up", change: "+2.4%", category: "Cereals" },
  { crop: "Rice / Paddy", variety: "Gurjari", mandi: "Navsari APMC (South)", min: "₹2,050", max: "₹2,400", trend: "up", change: "+1.2%", category: "Cereals" },
  { crop: "Cumin (Jeera)", variety: "Unjha Special", mandi: "Palanpur APMC (North)", min: "₹26,800", max: "₹29,400", trend: "up", change: "+4.8%", category: "Spices" },
  { crop: "Castor", variety: "Hybrid 4", mandi: "Bhuj APMC (West)", min: "₹5,850", max: "₹6,450", trend: "up", change: "+3.1%", category: "Oilseeds" },
  { crop: "Mustard", variety: "Rai Black", mandi: "Palanpur APMC (North)", min: "₹5,100", max: "₹5,700", trend: "up", change: "+1.9%", category: "Oilseeds" },
  { crop: "Sugarcane", variety: "Co-86032", mandi: "Navsari APMC (South)", min: "₹320", max: "₹360", trend: "stable", change: "0.0%", category: "Cash Crop" },
  { crop: "Banana", variety: "Grand Naine", mandi: "Navsari APMC (South)", min: "₹1,600", max: "₹2,000", trend: "up", change: "+2.0%", category: "Fruits" },
  { crop: "Mango", variety: "Kesar", mandi: "Navsari APMC (South)", min: "₹3,800", max: "₹4,600", trend: "up", change: "+5.2%", category: "Fruits" },
];

export default function LiveMandiPricesPage() {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [selectedCropChart, setSelectedCropChart] = React.useState("Wheat");
  const [showAlertModal, setShowAlertModal] = React.useState(false);
  const [alertSuccess, setAlertSuccess] = React.useState(false);

  const categories = ["All", "Cereals", "Vegetables", "Oilseeds", "Cash Crop"];

  const filteredPrices = prices.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.crop.toLowerCase().includes(search.toLowerCase()) || p.mandi.toLowerCase().includes(search.toLowerCase()) || p.variety.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setShowAlertModal(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-transparent">
          <Container className="text-center space-y-4 max-w-4xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">Services</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Live Mandi Prices</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Real-Time Market Data</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Live Mandi Price Feeds <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Updated Every 30 Minutes</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Track APMC crop rates, min/max price spreads, and daily market price trends across major agricultural mandis.
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setShowAlertModal(true)}>
                <Bell className="h-4 w-4" /> Set Price Alert
              </Button>
            </div>
          </Container>
        </section>

        {/* Live Table Section */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container className="space-y-8">
            <div className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-xl space-y-6">
              {/* Search & Categories Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search crop, variety, or mandi yard..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${categoryFilter === cat ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A] hover:bg-emerald-50"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-emerald-100 dark:border-[#2A2F3A] text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8B949E]">
                      <th className="pb-3 pr-4">Crop</th>
                      <th className="pb-3 pr-4">Variety</th>
                      <th className="pb-3 pr-4">Mandi Yard</th>
                      <th className="pb-3 pr-4">Min Price</th>
                      <th className="pb-3 pr-4">Max Price</th>
                      <th className="pb-3 pr-4">Trend Change</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.map((p, i) => (
                      <tr key={i} className="border-b border-emerald-50 dark:border-[#2A2F3A]/50 hover:bg-emerald-50/40 dark:hover:bg-[#1C212A]/50 transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          {p.crop}
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600 dark:text-[#C9D1D9]">{p.variety}</td>
                        <td className="py-3.5 pr-4 text-slate-600 dark:text-[#C9D1D9] font-medium">{p.mandi}</td>
                        <td className="py-3.5 pr-4 font-bold text-slate-800 dark:text-slate-200">{p.min}</td>
                        <td className="py-3.5 pr-4 font-black text-emerald-700 dark:text-emerald-400">{p.max}</td>
                        <td className="py-3.5 pr-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${p.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : p.trend === "down" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400"}`}>
                            {p.trend === "up" ? <ArrowUp className="h-3 w-3" /> : p.trend === "down" ? <ArrowDown className="h-3 w-3" /> : null}
                            {p.change}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setSelectedCropChart(p.crop)}
                            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                          >
                            View Graph
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Trend Chart Box */}
            <div className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedCropChart} 30-Day Market Trend</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Historical auction price trajectory across Gujarat mandis</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
                </button>
              </div>

              <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-emerald-100/30 dark:from-[#0B0F14] dark:to-[#161B22] border border-emerald-100/60 dark:border-[#2A2F3A] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-between px-8 pb-4 opacity-40">
                  {[40, 60, 45, 75, 65, 80, 90, 85, 95].map((h, idx) => (
                    <div key={idx} className="w-6 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="relative z-10 text-center space-y-1 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-emerald-200 dark:border-[#2A2F3A] shadow-md">
                  <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{selectedCropChart} Price Surge: +4.5% This Month</p>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">Peak Mandi Price: ₹2,450/quintal (Azadpur APMC)</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-transparent border-t border-emerald-100/60 dark:border-[#2A2F3A]">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How frequently are live mandi prices updated?", a: "Crop prices are refreshed every 30 minutes straight from government Agmarknet APMC data feeds." },
                { q: "Can I set custom price threshold alerts?", a: "Yes, click 'Set Price Alert' above to receive SMS or WhatsApp notifications when crop prices hit your target rate." },
                { q: "Do these prices include transport and commission fees?", a: "No, listed prices reflect direct APMC yard auction quotes before transportation and APMC cess charges." },
              ].map((faq, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Price Alert Dialog Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button onClick={() => setShowAlertModal(false)} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]">
                <X className="h-5 w-5" />
              </button>

              {alertSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Price Alert Active!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    We will notify you via SMS whenever target crop prices increase.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Set Live Mandi Price Alert</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Receive instant SMS notifications for price surges</p>
                  </div>

                  <form onSubmit={handleAlertSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Crop</label>
                      <select className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                        {prices.map(p => <option key={p.crop} value={p.crop}>{p.crop} ({p.variety})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Min Price (₹/Quintal)</label>
                      <input required type="number" placeholder="e.g. 2200" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit mobile number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Activate Price Alert
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
