import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Flag, CheckCircle, ChevronRight, IndianRupee, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const schemes = [
  { name: "Pradhan Mantri Krishi Sinchayee Yojana", benefit: "Per drop more crop", eligibility: "All farmers", type: "Irrigation" },
  { name: "National Mission for Sustainable Agriculture", benefit: "Climate-resilient farming support", eligibility: "Small & marginal farmers", type: "Sustainability" },
  { name: "Pradhan Mantri Fasal Bima Yojana", benefit: "Comprehensive crop insurance", eligibility: "All farmers", type: "Insurance" },
  { name: "Paramparagat Krishi Vikas Yojana", benefit: "₹50,000/ha for organic farming", eligibility: "Farmer groups", type: "Organic" },
  { name: "National Food Security Mission", benefit: "Enhanced food grain production", eligibility: "All registered farmers", type: "Production" },
  { name: "Mission for Integrated Development of Horticulture", benefit: "Subsidy up to 50% on horticulture", eligibility: "Horticulture farmers", type: "Horticulture" },
];

export default function CentralSchemesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Flag className="h-4 w-4" />
              <span>National Welfare Programs</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Central Government Schemes</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Explore national-level agriculture welfare programs designed to support farmers across India.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((s, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                      <Flag className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{s.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.benefit}</div>
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.eligibility}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500">
                      Apply Now <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "How are central schemes different from state schemes?", a: "Central schemes are funded by the Government of India and implemented nationwide, while state schemes vary by region." },
                { q: "Can I avail benefits from multiple central schemes?", a: "Yes, as long as you meet individual scheme eligibility criteria." },
                { q: "Where do I submit applications?", a: "Applications can be submitted online via respective scheme portals or at your nearest agriculture office." },
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
