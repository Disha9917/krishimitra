import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Map, CheckCircle, ChevronRight, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const schemes = [
  { name: "Mukhyamantri Kisan Kalyan Yojana", benefit: "₹12,000/year per family", eligibility: "All state registered farmers", type: "Income Support" },
  { name: "State Seed Distribution Scheme", benefit: "50% subsidy on quality seeds", eligibility: "Small & marginal farmers", type: "Seed" },
  { name: "Free Electricity for Irrigation", benefit: "Free power up to 5 HP", eligibility: "Farmers with irrigation pumps", type: "Energy" },
  { name: "Mukhyamantri Kisan Mitra Yojana", benefit: "₹4,000/year per acre", eligibility: "Landholding farmers", type: "Direct Transfer" },
  { name: "State Tractor Subsidy Scheme", benefit: "25% subsidy up to ₹1.5L", eligibility: "Small farmers under 5 acres", type: "Equipment" },
  { name: "Organic Farming Promotion Scheme", benefit: "₹30,000/ha for certification", eligibility: "Organic farming groups", type: "Organic" },
];

export default function StateSchemesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Map className="h-4 w-4" />
              <span>Regional Farming Support</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">State Government Schemes</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Discover region-specific agriculture schemes tailored for your state. Benefits vary by location and eligibility.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((s, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30">
                      <Map className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">{s.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /><span className="font-semibold">{s.benefit}</span></div>
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.eligibility}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500">
                      Check Availability <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "How do I know which state schemes I qualify for?", a: "Enter your state and district on our platform to see personalized scheme recommendations." },
                { q: "Can I apply for both central and state schemes?", a: "Yes, central and state schemes are independent of each other." },
                { q: "What documents are needed for state scheme applications?", a: "Typically Aadhaar, land records, bank passbook, and caste certificate if applicable." },
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
