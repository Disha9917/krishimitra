import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { CTA } from "../../../components/landing/cta";
import { Tractor, Star, MapPin, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const tractors = [
  { name: "Mahindra 575 DI", owner: "Rajesh Kumar", location: "Village Purana, 3.2 km", price: "₹1,200/hr", rating: 4.8, available: true },
  { name: "John Deere 5045D", owner: "Amit Singh", location: "Village Naya, 5.1 km", price: "₹1,800/hr", rating: 4.9, available: true },
  { name: "Swaraj 735 FE", owner: "Sunil Verma", location: "Village Baghpat, 2.8 km", price: "₹1,000/hr", rating: 4.6, available: false },
  { name: "Massey Ferguson 1035", owner: "Vikram Yadav", location: "Village Kheda, 4.0 km", price: "₹1,400/hr", rating: 4.7, available: true },
];

export default function TractorRentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Tractor className="h-4 w-4" />
              <span>Farm Equipment Rental</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Rent a Tractor Near You</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Find high-power tractors available for rent from nearby owners. Book instantly and get delivered to your farm.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tractors.map((t, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                      <Tractor className="h-5 w-5" />
                    </div>
                    {t.available ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Available</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Booked</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{t.owner}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{t.location}</div>
                    <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />{t.rating} · {t.price}</div>
                  </div>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 text-xs" disabled={!t.available}>
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
                { q: "How do I rent a tractor?", a: "Browse listed tractors near your village, check availability, and click Book Now. The owner will confirm within 30 minutes." },
                { q: "Is fuel included in the rental price?", a: "Fuel is included for standard bookings. Long-distance transport may incur extra charges." },
                { q: "Can I cancel a booking?", a: "Yes, free cancellation up to 6 hours before the rental time." },
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
