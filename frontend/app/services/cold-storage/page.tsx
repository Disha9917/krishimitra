import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Snowflake, MapPin, Thermometer, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const coldStorages = [
  { name: "Himalaya Cold Storage", location: "Industrial Area, 3.5 km", temp: "-2°C to 4°C", capacity: "1,000 MT", price: "₹22/kg/month" },
  { name: "Arctic Agro Chill", location: "NH-24, 5.2 km", temp: "0°C to 6°C", capacity: "750 MT", price: "₹18/kg/month" },
  { name: "FarmFresh Cold Hub", location: "Village Khera, 2.0 km", temp: "-5°C to 2°C", capacity: "500 MT", price: "₹25/kg/month" },
  { name: "GreenChill Storage", location: "Mandi Road, 4.8 km", temp: "1°C to 8°C", capacity: "1,500 MT", price: "₹15/kg/month" },
];

export default function ColdStoragePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Snowflake className="h-4 w-4" />
              <span>Cold Storage Facilities</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Find Nearby Cold Storage</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Temperature-controlled storage for perishable crops. Extend shelf life and reduce post-harvest spoilage.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coldStorages.map((cs, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                      <Snowflake className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Available</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{cs.name}</h3>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{cs.location}</div>
                    <div className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-blue-500" />{cs.temp}</div>
                    <div className="font-medium text-slate-700 dark:text-[#C9D1D9]">{cs.capacity}</div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">{cs.price}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 text-xs">
                      Book Cold Storage <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "What crops can be stored in cold storage?", a: "Fruits, vegetables, dairy, meat, and flowers. Each facility lists compatible crop types." },
                { q: "How is the temperature monitored?", a: "All facilities have 24/7 IoT temperature monitoring with real-time alerts." },
                { q: "Is there backup power?", a: "Yes, every cold storage unit has diesel generator backup with automatic switchover." },
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
