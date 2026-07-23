"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { Tractor, Star, MapPin, ChevronRight, Search, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const tractors = [
  { name: "Mahindra 575 DI", hp: "45 HP", owner: "Rajesh Kumar", location: "Fatehpura, East Gujarat (Dahod), 14.5 km", price: "₹1,200/hr", rating: 4.8, available: true, attachment: "Rotavator included" },
  { name: "John Deere 5045D", hp: "50 HP", owner: "Amit Singh", location: "Mandvi, West Gujarat (Bhuj), 22.0 km", price: "₹1,800/hr", rating: 4.9, available: true, attachment: "Cultivator + Disc Plough" },
  { name: "Swaraj 735 FE", hp: "40 HP", owner: "Sunil Verma", location: "Borsad, Central Gujarat (Anand), 8.5 km", price: "₹1,000/hr", rating: 4.6, available: false, attachment: "Standard Trolley" },
  { name: "Massey Ferguson 1035", hp: "36 HP", owner: "Vikram Yadav", location: "Dhanera, North Gujarat (Banaskantha), 19.3 km", price: "₹1,400/hr", rating: 4.7, available: true, attachment: "Seed Drill" },
  { name: "Eicher 380 Super DI", hp: "40 HP", owner: "Sanjay Patel", location: "Chikhli, South Gujarat (Navsari), 15.2 km", price: "₹1,150/hr", rating: 4.7, available: true, attachment: "Disc Harrow included" }
];

export default function TractorRentPage() {
  const [search, setSearch] = React.useState("");
  const [filterHp, setFilterHp] = React.useState("all");
  const [selectedTractor, setSelectedTractor] = React.useState<typeof tractors[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  const filtered = tractors.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.owner.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    if (filterHp === "available") return matchesSearch && t.available;
    return matchesSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedTractor(null);
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Tractor Rent</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Tractor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Farm Machinery Rental</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Rent High-Power Tractors <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Near Your Farm</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Find verified tractors available for rent from nearby owners. Book instantly with flexible hourly rates and delivery to your land.
            </p>

            {/* Filter & Search Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search model, owner, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setFilterHp("all")}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${filterHp === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A]"}`}
                >
                  All Tractors
                </button>
                <button
                  onClick={() => setFilterHp("available")}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${filterHp === "available" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A]"}`}
                >
                  Available Now
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* Listings Section */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((t, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <Tractor className="h-5 w-5" />
                      </div>
                      {t.available ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">Booked</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h3>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">{t.hp}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{t.owner}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{t.location}</div>
                      <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />{t.rating} rating</div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-[#8B949E]">{t.attachment}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{t.price}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-1 text-xs"
                      disabled={!t.available}
                      onClick={() => setSelectedTractor(t)}
                    >
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
                { q: "How do I rent a tractor on KrishiMitra?", a: "Browse listed tractors near your village, check specs & pricing, and click Book Now. The owner will confirm within 30 minutes." },
                { q: "Is fuel included in the rental price?", a: "Fuel is included for standard hourly bookings. Long-distance transport may incur extra fuel charges." },
                { q: "Can I cancel a booking if my plans change?", a: "Yes, free cancellation is supported up to 4 hours before the booked slot." },
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
        {selectedTractor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedTractor(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="h-5 w-5" />
              </button>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Booking Request Sent!</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Owner {selectedTractor.owner} has been notified. They will contact you shortly to confirm delivery.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book {selectedTractor.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E]">Rate: {selectedTractor.price} • {selectedTractor.owner}</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                      <input required type="text" placeholder="e.g. Ramesh Patel" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input required type="tel" placeholder="10-digit phone number" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Booking Date</label>
                        <input required type="date" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hours Required</label>
                        <input required type="number" min="1" max="24" defaultValue="4" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2">
                      Confirm Rental Request
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
