"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { 
  Snowflake, 
  MapPin, 
  Database, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  X, 
  Phone, 
  ExternalLink, 
  Clock, 
  Tag 
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { 
  COLD_STORAGE_REGIONS, 
  COLD_STORAGE_DISTRICTS, 
  VERIFIED_COLD_STORAGES, 
  ColdStorageFacility 
} from "../../../data/coldStorages";

export default function ColdStoragePage() {
  const [selectedRegion, setSelectedRegion] = React.useState("kutch");
  const [selectedDistrict, setSelectedDistrict] = React.useState("Kachchh");
  const [search, setSearch] = React.useState("");
  const [selectedStorage, setSelectedStorage] = React.useState<ColdStorageFacility | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  // Sync district select when region changes
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reg = e.target.value;
    setSelectedRegion(reg);
    const districts = COLD_STORAGE_DISTRICTS[reg] || [];
    setSelectedDistrict(districts[0] || "");
  };

  const filtered = VERIFIED_COLD_STORAGES.filter((cs) => {
    const matchesRegion = cs.region === selectedRegion;
    const matchesDistrict = cs.district === selectedDistrict;
    
    const matchesSearch = search.trim() === "" ||
      cs.name.toLowerCase().includes(search.toLowerCase()) ||
      cs.address.toLowerCase().includes(search.toLowerCase()) ||
      cs.commodities.toLowerCase().includes(search.toLowerCase()) ||
      cs.type.toLowerCase().includes(search.toLowerCase());

    return matchesRegion && matchesDistrict && matchesSearch;
  });

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
              <span>Verified Cold Chain Network</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Verified Gujarat Cold Storages <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Rent Commercial Climate Chambers</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Real, registered warehousing facilities for potatoes, mangoes, onions, spices, and dairy. Prevent post-harvest losses.
            </p>

            {/* CASCADING FILTER CONTROLS */}
            <div className="max-w-2xl mx-auto bg-white/70 dark:bg-[#161B22]/70 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left shadow-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Select Region</label>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {COLD_STORAGE_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Select District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {(COLD_STORAGE_DISTRICTS[selectedRegion] || []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-7 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by facility name, crops or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 dark:bg-[#161B22]/95 border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-3"
              />
            </div>
          </Container>
        </section>

        {/* Listings Section */}
        <section className="pb-20 sm:pb-24 bg-transparent -mt-8">
          <Container>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cs, i) => (
                  <div 
                    key={i} 
                    className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {cs.type}
                        </span>
                        
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          cs.availability === "Available" 
                            ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                            : cs.availability === "Limited Space"
                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
                            : "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30"
                        }`}>
                          {cs.availability}
                        </span>
                      </div>

                      {/* Header */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{cs.name}</h3>
                        <p className="text-[11px] text-slate-400 dark:text-[#8B949E] mt-1">Taluka: {cs.taluka} • Village: {cs.village}</p>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2 text-xs text-slate-600 dark:text-[#C9D1D9]">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cs.address}</span>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-white">Capacity:</span> {cs.capacity}
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <Snowflake className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-white">Accepts:</span> {cs.commodities}
                          </div>
                        </div>

                        {cs.workingHours && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{cs.workingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action panel */}
                    <div className="pt-4 mt-6 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {/* Maps Button */}
                        <a 
                          href={cs.mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] hover:bg-slate-50 dark:hover:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] transition-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Maps
                        </a>

                        {/* Call Button */}
                        {cs.phone && (
                          <a 
                            href={`tel:${cs.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] hover:bg-slate-50 dark:hover:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] transition-all"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </a>
                        )}
                      </div>

                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full justify-center gap-1 text-xs font-black shadow-sm" 
                        onClick={() => setSelectedStorage(cs)}
                        disabled={cs.availability === "Full"}
                      >
                        Book Storage <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto text-center py-12 px-6 rounded-3xl bg-white/70 dark:bg-[#161B22]/70 border border-emerald-100 dark:border-[#2A2F3A] backdrop-blur-md space-y-3">
                <Snowflake className="h-10 w-10 text-slate-400 mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Facilities Found</h3>
                <p className="text-xs text-slate-500 dark:text-[#8B949E] leading-relaxed">
                  No verified cold storage facility is currently available for this district.
                </p>
              </div>
            )}
          </Container>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-transparent border-t border-emerald-100/60 dark:border-[#2A2F3A]">
          <Container className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What produce can be stored in these cold storages?", a: "Different facilities support different produce. Type categories include Potato, multi-commodity, specialized fruits, vegetables, frozen storage, and dairy chambers." },
                { q: "How is the temperature monitored?", a: "Verified cold storages utilize automated digital climate sensors sending real-time logs to state agricultural committees." },
                { q: "Who can use the booking simulator?", a: "Any registered Gujarat farmer with an active Khedut Card or standard Aadhaar proof can reserve climate-controlled space." },
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reserve Space</h3>
                    <p className="text-[11px] text-slate-500 dark:text-[#8B949E] leading-tight">
                      {selectedStorage.name} <br />
                      Type: {selectedStorage.type} • Capacity: {selectedStorage.capacity}
                    </p>
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
                        <input required type="text" placeholder="e.g. Potato / Mango" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity (Crates/MT)</label>
                        <input required type="number" min="1" max="1000" defaultValue="20" className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <Button variant="primary" type="submit" className="w-full justify-center pt-2.5 pb-2.5 mt-2 font-bold">
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
