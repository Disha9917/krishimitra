"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Wrench, Star, MapPin, ChevronRight, Search, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const harvesters = [
  { name: "John Deere S680", owner: "Harvest Solutions Inc.", location: "Devgadh Baria, East Gujarat (Dahod), 18.2 km", price: "₹2,500/hr", rating: 4.9, capacity: "8 acres/hr", operator: "Operator Included" },
  { name: "CLAAS Dominator 140", owner: "GreenField Agro", location: "Anjar, West Gujarat (Bhuj), 12.8 km", price: "₹1,800/hr", rating: 4.7, capacity: "5 acres/hr", operator: "Operator Included" },
  { name: "New Holland CX 880", owner: "FarmTech Services", location: "Khambhat, Central Gujarat (Anand), 24.5 km", price: "₹2,200/hr", rating: 4.8, capacity: "6 acres/hr", operator: "Operator Included" },
  { name: "Kubota DC 105", owner: "Rural Rentals", location: "Tharad, North Gujarat (Banaskantha), 21.4 km", price: "₹1,500/hr", rating: 4.6, capacity: "4 acres/hr", operator: "Self-driven or Operator" },
  { name: "Preet 987", owner: "Sardar Agro Rentals", location: "Gandevi, South Gujarat (Navsari), 9.6 km", price: "₹2,000/hr", rating: 4.8, capacity: "7 acres/hr", operator: "Operator Included" }
];

export default function HarvesterRentPage() {
  const [search, setSearch] = React.useState("");
  const [selectedHarvester, setSelectedHarvester] = React.useState<typeof harvesters[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  const filtered = harvesters.filter(
    (h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.owner.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedHarvester(null);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Harvester Rent</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Harvest Machinery Rental</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Rent Combine Harvesters <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">For Fast Crop Harvesting</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Efficient harvest machinery available for seasonal rental. Compare processing speed, capacity, and book with expert operators included.
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search harvester model, owner, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </Container>
        </section>

        {/* Listings Section */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((h, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{h.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{h.owner}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{h.location}</div>
                      <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />{h.rating} rating</div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-semibold">{h.capacity}</div>
                      <div className="text-[10px] font-medium text-slate-500 dark:text-[#8B949E]">{h.operator}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{h.price}</span>
                    <Button variant="primary" size="sm" className="gap-1 text-xs" onClick={() => setSelectedHarvester(h)}>
                      Book Now <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "What is the minimum rental duration?", a: "Minimum booking duration is 4 hours for standard combine harvesters. Full-day discounts are available." },
                { q: "Do harvesters come with an experienced operator?", a: "Yes, all our listed harvesters include a certified operator in the rental cost." },
                { q: "Can I book a harvester for multiple days during harvest peak?", a: "Yes, multi-day seasonal bookings are supported with custom volume discounts." },
              ].map((faq, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Booking Dialog Modal */}
        {selectedHarvester && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedHarvester(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="h-5 w-5" />
              </button>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Harvester Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    {selectedHarvester.owner} has accepted your request. The operator will arrive at your farm at the scheduled time.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book {selectedHarvester.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Rate: {selectedHarvester.price} • {selectedHarvester.capacity}</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                      <input required type="text" placeholder="e.g. Vikram Patel" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit mobile number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harvest Date</label>
                        <input required type="date" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farm Area (Acres)</label>
                        <input required type="number" min="1" max="100" defaultValue="5" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Submit Harvester Booking
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
