"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { CreditCard, ChevronRight, IndianRupee, FileText, Percent, Clock, Calculator, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const benefits = [
  { icon: <IndianRupee className="h-5 w-5" />, title: "Credit Limit up to ₹3 Lakh", desc: "Sanctioned based on landholding and crop pattern" },
  { icon: <Percent className="h-5 w-5" />, title: "Subsidized 4% Interest Rate", desc: "Concessional rate for prompt repayment" },
  { icon: <Clock className="h-5 w-5" />, title: "Flexible Repayment", desc: "Up to 12 months post-harvest flexible schedule" },
  { icon: <FileText className="h-5 w-5" />, title: "Paperless Digital Portal", desc: "Complete online verification via Aadhaar & e-Land" },
];

const steps = [
  { step: "1", title: "Eligibility Check", desc: "Verify land records & Aadhaar linkage" },
  { step: "2", title: "Apply Online", desc: "Fill simple e-KCC digital form" },
  { step: "3", title: "Document Upload", desc: "Upload land passbook & photo" },
  { step: "4", title: "Disbursal", desc: "Receive KCC limit in 7 working days" },
];

export default function KisanCreditCardPage() {
  const [landAcres, setLandAcres] = React.useState<number>(3);
  const [cropType, setCropType] = React.useState<string>("cash");
  const [showAppModal, setShowAppModal] = React.useState(false);
  const [appSuccess, setAppSuccess] = React.useState(false);

  // Estimate credit limit: base ₹50,000 per acre for cash crop, ₹35,000 per acre for grain
  const estimatedCredit = Math.min(300000, Math.round(landAcres * (cropType === "cash" ? 50000 : 35000)));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSuccess(true);
    setTimeout(() => {
      setAppSuccess(false);
      setShowAppModal(false);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Kisan Credit Card</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Easy Agricultural Credit</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Kisan Credit Card (KCC) <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Low 4% Interest Rate Loan</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Hassle-free credit line for seeds, fertilizers, machinery, and crop input expenses. Apply online with fast 7-day disbursal.
            </p>

            <div className="pt-2">
              <Button variant="primary" size="lg" className="gap-2 shadow-lg shadow-emerald-200/80 dark:shadow-emerald-900/30" onClick={() => setShowAppModal(true)}>
                Apply for KCC Now <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </Container>
        </section>

        {/* Benefits Grid */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 mx-auto">
                    {b.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{b.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive Calculator Section */}
            <div className="rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-8 shadow-xl max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-800/60 text-emerald-300">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">KCC Credit Limit Estimator</h3>
                  <p className="text-xs text-emerald-200">Calculate your estimated loan entitlement</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-200">Landholding Size (Acres): {landAcres} Acres</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={landAcres}
                    onChange={(e) => setLandAcres(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-200">Primary Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-xs text-white focus:outline-none"
                  >
                    <option value="cash">Cash Crops (Cotton, Tobacco, Sugarcane)</option>
                    <option value="grain">Grain & Pulses (Wheat, Rice, Maize)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-300">Estimated KCC Credit Limit</p>
                  <p className="text-2xl font-black text-emerald-400">₹{estimatedCredit.toLocaleString("en-IN")}</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setShowAppModal(true)}>
                  Apply for ₹{estimatedCredit.toLocaleString("en-IN")}
                </Button>
              </div>
            </div>

            {/* Process Steps */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">4 Easy Application Steps</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="relative rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm text-center space-y-2">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shadow-md">{s.step}</div>
                    <div className="pt-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
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
                { q: "Who is eligible for Kisan Credit Card?", a: "All farmers — small, marginal, tenant farmers, and sharecroppers — with valid land cultivation records are eligible." },
                { q: "What is the net interest rate on KCC?", a: "Effective interest rate is 4% per annum upon prompt repayment (3% interest subvention + 2% prompt repayment incentive)." },
                { q: "Can KCC funds be used for equipment purchases?", a: "Yes, KCC credit limits cover crop production costs, post-harvest expenses, and farm machinery maintenance." },
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
        {showAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button onClick={() => setShowAppModal(false)} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]">
                <X className="h-5 w-5" />
              </button>

              {appSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">KCC Application Initiated!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Your Kisan Credit Card application for ₹{estimatedCredit.toLocaleString("en-IN")} has been registered. The partner bank branch will contact you for e-KYC.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Kisan Credit Card</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Estimated Limit: ₹{estimatedCredit.toLocaleString("en-IN")}</p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farmer Full Name</label>
                      <input required type="text" placeholder="e.g. Ramesh Patel" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit phone number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Aadhaar Card Number</label>
                      <input required type="text" maxLength={12} placeholder="12-digit Aadhaar number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Submit KCC Application
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
