import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Landmark, CheckCircle, ChevronRight, Users, IndianRupee, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const subsidies = [
  { name: "PM-KISAN Samman Nidhi", benefit: "₹6,000/year", eligibility: "All small & marginal farmers", type: "Direct Cash Transfer" },
  { name: "Soil Health Card Scheme", benefit: "Free soil testing", eligibility: "All registered farmers", type: "Advisory" },
  { name: "Pradhan Mantri Fasal Bima Yojana", benefit: "Crop insurance up to ₹2L", eligibility: "All farmers with crop loans", type: "Insurance" },
  { name: "Kisan Credit Card", benefit: "Credit up to ₹3L at 4% interest", eligibility: "All farmers", type: "Credit" },
  { name: "PM-KUSUM Scheme", benefit: "60% subsidy on solar pumps", eligibility: "Farmers with irrigation", type: "Energy" },
  { name: "Agri Infrastructure Fund", benefit: "Low-interest loans up to ₹2Cr", eligibility: "Farmer groups & FPOs", type: "Infrastructure" },
];

export default function GovernmentSubsidiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Landmark className="h-4 w-4" />
              <span>Government Support</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Government Subsidies for Farmers</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Discover the latest agriculture subsidies and government schemes available for your location and crop type.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subsidies.map((s, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{s.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /><span className="font-semibold">{s.benefit}</span></div>
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.eligibility}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500">
                      Check Eligibility <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 bg-transparent">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I apply for PM-KISAN?", a: "Visit the PM-KISAN portal or your nearest Common Service Centre. You need Aadhaar, land records, and bank account details." },
                { q: "Can I apply for multiple schemes?", a: "Yes, you can enroll in multiple schemes as long as you meet the eligibility criteria for each." },
                { q: "How long does subsidy approval take?", a: "Most schemes process within 30 days. Direct benefit transfers are credited within 7 days of approval." },
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
