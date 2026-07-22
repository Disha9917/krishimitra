import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Warehouse, MapPin, ChevronRight, Ruler } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const storages = [
  { name: "GreenField Warehouse", location: "Sector 9, 2.1 km", capacity: "500 MT", price: "₹15/kg/month", available: true },
  { name: "AgriSafe Storage Hub", location: "NH-58, 4.5 km", capacity: "1,200 MT", price: "₹12/kg/month", available: true },
  { name: "FarmFresh Godown", location: "Village Rampur, 1.8 km", capacity: "300 MT", price: "₹18/kg/month", available: false },
  { name: "Krishi Bhandar", location: "Mandi Road, 3.0 km", capacity: "800 MT", price: "₹10/kg/month", available: true },
];

export default function StorageRentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Warehouse className="h-4 w-4" />
              <span>Storage & Warehousing</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Rent Storage Space Near You</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Find dry storage warehouses to keep your harvest safe. Compare capacity, distance, and pricing.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {storages.map((s, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30">
                      <Warehouse className="h-5 w-5" />
                    </div>
                    {s.available ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Available</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Full</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.location}</div>
                    <div className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.capacity}</div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">{s.price}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 text-xs" disabled={!s.available}>
                      Book Storage <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "Is pest control included?", a: "Yes, all listed storage facilities include regular pest fumigation as part of the rental." },
                { q: "Can I store different crops together?", a: "We recommend separate storage for different crop types to avoid cross-contamination." },
                { q: "What is the minimum storage period?", a: "Minimum 15 days. Monthly and seasonal discounts are available." },
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
