import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Wrench, Star, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const harvesters = [
  { name: "John Deere S680", owner: "Harvest Solutions Inc.", location: "Sector 12, 6.5 km", price: "₹2,500/hr", rating: 4.9, capacity: "8 acres/hr" },
  { name: "CLAAS Dominator 140", owner: "GreenField Agro", location: "NH-24, 4.2 km", price: "₹1,800/hr", rating: 4.7, capacity: "5 acres/hr" },
  { name: "New Holland CX 880", owner: "FarmTech Services", location: "Village Gopal, 7.8 km", price: "₹2,200/hr", rating: 4.8, capacity: "6 acres/hr" },
  { name: "Kubota DC 105", owner: "Rural Rentals", location: "Mandi Road, 3.5 km", price: "₹1,500/hr", rating: 4.6, capacity: "4 acres/hr" },
];

export default function HarvesterRentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Wrench className="h-4 w-4" />
              <span>Harvest Machinery Rental</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Rent a Harvester Near You</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Efficient harvest machinery available for seasonal rental. Compare prices, capacity, and book instantly.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {harvesters.map((h, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Available</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{h.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{h.owner}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{h.location}</div>
                    <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />{h.rating} · {h.price}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-medium">{h.capacity}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 text-xs">
                      Book Now <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "What is the minimum rental duration?", a: "Minimum 4 hours for standard harvesters. Full-day discounts are available." },
                { q: "Do you provide an operator?", a: "Yes, all harvesters come with an experienced operator included in the price." },
                { q: "Can I book for multiple days?", a: "Yes, multi-day bookings are supported with discounted per-hour rates." },
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
