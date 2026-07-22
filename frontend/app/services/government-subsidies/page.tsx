"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Landmark, ChevronRight, Users, IndianRupee, Search, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const subsidies = [
  { name: "PM-KISAN Samman Nidhi", benefit: "₹6,000/year", eligibility: "All small & marginal farmers", type: "Direct Cash Transfer", doc: "Aadhaar + Land Records" },
  { name: "Soil Health Card Scheme", benefit: "Free soil testing", eligibility: "All registered farmers", type: "Advisory Service", doc: "Farmer ID Card" },
  { name: "Pradhan Mantri Fasal Bima", benefit: "Insurance up to ₹2 Lakh", eligibility: "All farmers with crop loans", type: "Crop Insurance", doc: "Sowing Certificate" },
  { name: "Kisan Credit Card (KCC)", benefit: "Credit up to ₹3 Lakh at 4%", eligibility: "All landholding farmers", type: "Low-Interest Credit", doc: "Land Passbook" },
  { name: "PM-KUSUM Solar Pump", benefit: "60% Subsidy on Solar Pumps", eligibility: "Farmers with irrigation land", type: "Energy Infrastructure", doc: "Electricity Connection / Land Document" },
  { name: "Agri Infrastructure Fund", benefit: "Loans up to ₹2 Crore at 3%", eligibility: "FPOs, Agri-entrepreneurs", type: "Infrastructure", doc: "DPR & Bank Account" },
];

export default function GovernmentSubsidiesPage() {
  const [search, setSearch] = React.useState("");
  const [selectedScheme, setSelectedScheme] = React.useState<typeof subsidies[0] | null>(null);
  const [checkingSuccess, setCheckingSuccess] = React.useState(false);

  const filtered = subsidies.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()) || s.benefit.toLowerCase().includes(search.toLowerCase())
  );

  const handleEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingSuccess(true);
    setTimeout(() => {
      setCheckingSuccess(false);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Government Subsidies</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Landmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Government Support & Welfare</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Agriculture Subsidies <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Claim Financial Assistance</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Discover the latest agriculture subsidies, financial grants, and welfare schemes. Check eligibility instantly online.
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search scheme name, benefit, or type..."
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{s.type}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /><span className="font-extrabold text-emerald-700 dark:text-emerald-400">{s.benefit}</span></div>
                      <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.eligibility}</div>
                      <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">Required: {s.doc}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white" onClick={() => setSelectedScheme(s)}>
                      Check Eligibility <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "How do I apply for PM-KISAN?", a: "Visit the PM-KISAN portal or your nearest Common Service Centre. You will need Aadhaar, land records (Khatauni), and bank account details." },
                { q: "Can I apply for multiple schemes simultaneously?", a: "Yes, farmers can enroll in multiple schemes as long as they meet the distinct criteria for each scheme." },
                { q: "How long does subsidy approval take?", a: "Most direct benefit transfer (DBT) subsidies are processed within 14 to 30 days post-verification." },
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

              {checkingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Eligible for Scheme!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Based on your details, you qualify for {selectedScheme.name} ({selectedScheme.benefit}).
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check {selectedScheme.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Benefit: {selectedScheme.benefit}</p>
                  </div>

                  <form onSubmit={handleEligibilitySubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farmer Full Name</label>
                      <input required type="text" placeholder="e.g. Ramesh Chandra" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Aadhaar Number (Last 4 digits)</label>
                      <input required type="text" maxLength={4} placeholder="XXXX" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Land Size (Acres)</label>
                      <input required type="number" min="0.1" step="0.1" defaultValue="2.5" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Check Instant Eligibility
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
