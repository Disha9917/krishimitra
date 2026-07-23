"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Snowflake, MapPin, Thermometer, ChevronRight, Search, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const coldStorages = [
  { name: "Dahod APMC Cold Chain", location: "Fatehpura, East Gujarat (Dahod), 22.1 km", temp: "-2°C to 4°C", capacity: "1,000 MT", price: "₹22/kg/month", suitable: "Maize, Paddy, Soybean, Tur" },
  { name: "Bhuj APMC Cold Hub", location: "Mandvi, West Gujarat (Bhuj), 19.4 km", temp: "0°C to 6°C", capacity: "750 MT", price: "₹18/kg/month", suitable: "Bajra, Castor, Guar, Cumin" },
  { name: "Anand Samarkha Cold Storage", location: "Petlad, Central Gujarat (Anand), 14.8 km", temp: "-5°C to 2°C", capacity: "500 MT", price: "₹25/kg/month", suitable: "Tobacco, Cotton, Wheat, Banana" },
  { name: "Deesa APMC Cold Chambers", location: "Lakhani, North Gujarat (Banaskantha), 11.2 km", temp: "1°C to 8°C", capacity: "1,500 MT", price: "₹15/kg/month", suitable: "Cumin, Castor, Potato, Isabgol" },
  { name: "Morarji Desai Cold Storage", location: "Gandevi, South Gujarat (Navsari), 7.5 km", temp: "0°C to 5°C", capacity: "800 MT", price: "₹20/kg/month", suitable: "Paddy, Sugarcane, Banana, Chickoo" }
];

export default function ColdStoragePage() {
  const [search, setSearch] = React.useState("");
  const [selectedStorage, setSelectedStorage] = React.useState<typeof coldStorages[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  const filtered = coldStorages.filter(
    (cs) => cs.name.toLowerCase().includes(search.toLowerCase()) || cs.location.toLowerCase().includes(search.toLowerCase()) || cs.suitable.toLowerCase().includes(search.toLowerCase())
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Cold Storage</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Snowflake className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cold Chain & Warehousing</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Find Nearby Cold Storage <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Prevent Post-Harvest Loss</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Temperature-controlled cold rooms for fruits, vegetables & flowers. Extend shelf life and get better market prices.
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cold store name, location, crop..."
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
              {filtered.map((cs, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <Snowflake className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{cs.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{cs.suitable}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{cs.location}</div>
                      <div className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{cs.temp}</div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Capacity: {cs.capacity}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{cs.price}</span>
                    <Button variant="primary" size="sm" className="gap-1 text-xs" onClick={() => setSelectedStorage(cs)}>
                      Book Cold Store <ChevronRight className="h-3.5 w-3.5" />
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
                { q: "What produce can be stored in cold storage?", a: "Fruits, vegetables, dairy, meat, and floriculture. Each cold store lists specific compatible crop chambers." },
                { q: "How is the temperature monitored?", a: "All units are equipped with 24/7 IoT sensors sending real-time climate alerts to your dashboard." },
                { q: "Is backup power guaranteed during power cuts?", a: "Yes, every registered cold storage features dual industrial diesel generator backups with auto switchover." },
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
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cold Room Reserved!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    {selectedStorage.name} will prepare your temperature chamber.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reserve {selectedStorage.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Rate: {selectedStorage.price} • Temp: {selectedStorage.temp}</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                      <input required type="text" placeholder="e.g. Dinesh Shah" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit mobile number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Produce Type</label>
                        <input required type="text" placeholder="e.g. Potato / Tomatoes" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity (Crates/MT)</label>
                        <input required type="number" min="1" max="1000" defaultValue="20" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Confirm Cold Chamber Booking
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
