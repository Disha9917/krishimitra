import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { CreditCard, CheckCircle, ChevronRight, IndianRupee, FileText, Percent, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const benefits = [
  { icon: <IndianRupee className="h-5 w-5" />, title: "Credit Limit up to ₹3 Lakh", desc: "Based on landholding and crop pattern" },
  { icon: <Percent className="h-5 w-5" />, title: "Low Interest Rate at 4%", desc: "For timely repayment customers" },
  { icon: <Clock className="h-5 w-5" />, title: "Flexible Repayment", desc: "Up to 12 months post-harvest" },
  { icon: <FileText className="h-5 w-5" />, title: "Paperless Application", desc: "Complete online with Aadhaar" },
];

const steps = [
  { step: "1", title: "Eligibility Check", desc: "Verify land records and Aadhaar" },
  { step: "2", title: "Apply Online", desc: "Fill the KCC application form" },
  { step: "3", title: "Document Upload", desc: "Upload land paper and photos" },
  { step: "4", title: "Approval & Disbursal", desc: "Get credit in 7 working days" },
];

export default function KisanCreditCardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <CreditCard className="h-4 w-4" />
              <span>Kisan Credit Card</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Kisan Credit Card (KCC)</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Easy credit line for farmers at low interest rates. Apply online and get approval within 7 days.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {benefits.map((b, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 mx-auto">
                    {b.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">{b.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">How to Apply</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="relative rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm text-center space-y-2">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">{s.step}</div>
                  <div className="pt-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/register">
                <Button variant="primary" size="lg" className="gap-2 shadow-lg shadow-emerald-200/80 dark:shadow-emerald-900/30">
                  Apply for KCC <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-transparent">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Who is eligible for Kisan Credit Card?", a: "All farmers — small, marginal, and large — with valid land records are eligible." },
                { q: "What is the interest rate on KCC?", a: "Interest starts at 4% per annum for timely repayment. 2% additional subvention is available." },
                { q: "Can I use KCC for buying equipment?", a: "Yes, KCC can be used for seeds, fertilizers, equipment, and other agricultural expenses." },
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
