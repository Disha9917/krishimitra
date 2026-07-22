"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Warehouse, MapPin, ChevronRight, Ruler, Search, ShieldCheck, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const storages = [
  { name: "GreenField Warehouse", location: "Sector 9, 2.1 km", capacity: "500 MT", price: "₹15/kg/month", available: true, type: "Dry Grain Storage" },
  { name: "AgriSafe Storage Hub", location: "NH-58, 4.5 km", capacity: "1,200 MT", price: "₹12/kg/month", available: true, type: "Pest-Controlled Warehouse" },
  { name: "FarmFresh Godown", location: "Village Rampur, 1.8 km", capacity: "300 MT", price: "₹18/kg/month", available: false, type: "Standard Godown" },
  { name: "Krishi Bhandar", location: "Mandi Road, 3.0 km", capacity: "800 MT", price: "₹10/kg/month", available: true, type: "Bulk Grain Storage" },
];

export default function StorageRentPage() {
  const [search, setSearch] = React.useState("");
  const [selectedStorage, setSelectedStorage] = React.useState<typeof storages[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  const filtered = storages.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedStorage(null);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Storage Rent</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Storage & Warehousing</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Rent Dry Storage Space <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Protect Your Crop Harvest</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Find pest-controlled dry storage warehouses to keep your grains safe post-harvest. Compare capacity, distance, and monthly rates.
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search storage facility, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </Container>
        </section>

        {/* Listings */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((s, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30">
                        <Warehouse className="h-5 w-5" />
                      </div>
                      {s.available ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">Full</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">{s.type}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{s.location}</div>
                      <div className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />Capacity: {s.capacity}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-[#8B949E]"><ShieldCheck className="h-3 w-3 text-emerald-500" /> 24/7 Security & Fumigated</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{s.price}</span>
                    <Button variant="primary" size="sm" className="gap-1 text-xs" disabled={!s.available} onClick={() => setSelectedStorage(s)}>
                      Book Space <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "Is pest control included in storage rentals?", a: "Yes, all verified storage facilities conduct regular pest fumigation as part of the standard rental contract." },
                { q: "Can I store different grain types together?", a: "We recommend storing distinct grain varieties in separate bays to maintain moisture levels and quality." },
                { q: "What is the minimum storage period?", a: "Minimum storage duration is 15 days. Monthly and seasonal volume discounts apply." },
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
        {selectedStorage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedStorage(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="h-5 w-5" />
              </button>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Storage Reservation Submitted!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    {selectedStorage.name} manager will review your quantity and contact you within 1 hour.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reserve {selectedStorage.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Rate: {selectedStorage.price} • {selectedStorage.capacity}</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                      <input required type="text" placeholder="e.g. Anand Patel" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit mobile number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Crop Type</label>
                        <input required type="text" placeholder="e.g. Wheat / Paddy" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity (Quintals)</label>
                        <input required type="number" min="5" max="5000" defaultValue="50" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Submit Storage Request
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
