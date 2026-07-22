"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Map, CheckCircle, ChevronRight, Users, IndianRupee, Search, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const schemes = [
  { name: "Mukhyamantri Kisan Kalyan Yojana", benefit: "₹12,000/year per farm family", eligibility: "All state registered farmers", type: "Income Support", state: "Gujarat" },
  { name: "State Seed Distribution Subsidy", benefit: "50% subsidy on certified seeds", eligibility: "Small & marginal farmers", type: "Input Subsidy", state: "Gujarat" },
  { name: "Free Electricity for Solar Pumps", benefit: "Free agricultural power up to 5 HP", eligibility: "Farmers with irrigation pump sets", type: "Energy Grant", state: "Gujarat" },
  { name: "Mukhyamantri Kisan Mitra Yojana", benefit: "₹4,000/year per acre direct transfer", eligibility: "Landholding crop growers", type: "Direct Transfer", state: "Gujarat" },
  { name: "State Tractor Subsidy Scheme", benefit: "25% subsidy up to ₹1.5 Lakh", eligibility: "Small farmers under 5 acres", type: "Equipment Grant", state: "Gujarat" },
  { name: "Organic Farming Promotion Scheme", benefit: "₹30,000/ha for organic certification", eligibility: "Registered organic farmer clusters", type: "Organic Certification", state: "Gujarat" },
];

export default function StateSchemesPage() {
  const [search, setSearch] = React.useState("");
  const [selectedScheme, setSelectedScheme] = React.useState<typeof schemes[0] | null>(null);
  const [appSuccess, setAppSuccess] = React.useState(false);

  const filtered = schemes.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()) || s.benefit.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSuccess(true);
    setTimeout(() => {
      setAppSuccess(false);
      setSelectedScheme(null);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">State Schemes</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Map className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Regional Farming Support</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              State Government Schemes <br />
              <span className="bg-gradient-to-r from-purple-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">Regional Agricultural Welfare</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Discover region-specific schemes tailored for state agriculture. Compare financial benefits, seed subsidies, and electricity support.
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search state scheme or benefit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </Container>
        </section>

        {/* Listings */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30">
                        <Map className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">{s.type}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /><span className="font-extrabold text-emerald-700 dark:text-emerald-400">{s.benefit}</span></div>
                      <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.eligibility}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white" onClick={() => setSelectedScheme(s)}>
                      Check Availability <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-transparent border-t border-emerald-100/60 dark:border-[#2A2F3A]">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I know which state schemes I qualify for?", a: "Select your state and district on our platform to filter personalized scheme recommendations for your land holding size." },
                { q: "Can I combine state subsidies with central government schemes?", a: "Yes, central and state schemes are independent and can be combined provided there is no double-dipping on identical financial grants." },
                { q: "What documents are required for state scheme applications?", a: "Typically Aadhaar, land passbook (7/12 extract), bank passbook, and local residency proof." },
              ].map((faq, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Dialog Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button onClick={() => setSelectedScheme(null)} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]">
                <X className="h-5 w-5" />
              </button>

              {appSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-purple-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">State Application Registered!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Your registration for {selectedScheme.name} has been received. Your local Block Agriculture Officer will verify your records.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Register for {selectedScheme.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Benefit: {selectedScheme.benefit}</p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farmer Full Name</label>
                      <input required type="text" placeholder="e.g. Harishbhai Patel" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">District / Taluka</label>
                      <input required type="text" placeholder="e.g. Anand, Petlad" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Land Khata / Survey Number</label>
                      <input required type="text" placeholder="e.g. Survey # 142/A" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2 bg-purple-600 hover:bg-purple-700">
                      Submit State Scheme Application
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
