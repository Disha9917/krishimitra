"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { MapPin, Navigation, Clock, ChevronRight, CheckCircle, XCircle, Star, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

interface Mandi {
  name: string;
  region: string;
  regionKey: string;
  distance: string;
  distanceNum: number;
  status: "Open" | "Closed";
  hours: string;
  crops: string[];
  isMain: boolean;
}

const regions = [
  { key: "all", label: "All Regions" },
  { key: "east", label: "East Gujarat (Dahod)" },
  { key: "west", label: "West Gujarat (Bhuj/Kutch)" },
  { key: "central", label: "Central Gujarat (Anand)" },
  { key: "north", label: "North Gujarat (Banaskantha)" },
  { key: "south", label: "South Gujarat (Navsari)" },
];

const mandis: Mandi[] = [
  // East Gujarat
  { name: "APMC Dahod Main Office", region: "Dahod, Gujarat", regionKey: "east", distance: "2.1 km", distanceNum: 2.1, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Maize", "Paddy", "Soybean", "Tur"], isMain: true },
  { name: "Dahod APMC / Anaj Market", region: "Dahod, Gujarat", regionKey: "east", distance: "3.0 km", distanceNum: 3.0, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Maize", "Paddy", "Soybean", "Tur"], isMain: false },
  { name: "Devgadh Baria APMC", region: "Dahod, Gujarat", regionKey: "east", distance: "18.5 km", distanceNum: 18.5, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Maize", "Paddy", "Tur"], isMain: false },
  { name: "Fatehpura APMC", region: "Dahod, Gujarat", regionKey: "east", distance: "25.3 km", distanceNum: 25.3, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Maize", "Soybean", "Tur"], isMain: false },
  { name: "Limkheda APMC", region: "Dahod, Gujarat", regionKey: "east", distance: "14.7 km", distanceNum: 14.7, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Paddy", "Maize", "Tur"], isMain: false },

  // West Gujarat
  { name: "Bhuj APMC Market Yard", region: "Bhuj, Gujarat", regionKey: "west", distance: "3.4 km", distanceNum: 3.4, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Bajra", "Castor", "Guar", "Cumin"], isMain: true },
  { name: "Anjar APMC", region: "Kutch, Gujarat", regionKey: "west", distance: "42.0 km", distanceNum: 42.0, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Bajra", "Castor", "Cumin"], isMain: false },
  { name: "Mandvi APMC", region: "Kutch, Gujarat", regionKey: "west", distance: "56.8 km", distanceNum: 56.8, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Bajra", "Guar", "Cumin"], isMain: false },

  // Central Gujarat
  { name: "Anand (Samarkha) APMC Market", region: "Anand, Gujarat", regionKey: "central", distance: "4.6 km", distanceNum: 4.6, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Tobacco", "Cotton", "Banana", "Paddy"], isMain: true },
  { name: "Borsad APMC", region: "Anand, Gujarat", regionKey: "central", distance: "19.8 km", distanceNum: 19.8, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cotton", "Banana", "Paddy"], isMain: false },

  // North Gujarat
  { name: "Deesa APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "5.8 km", distanceNum: 5.8, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Cumin", "Castor", "Mustard", "Isabgol"], isMain: true },
  { name: "Palanpur APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "30.2 km", distanceNum: 30.2, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cumin", "Isabgol", "Mustard"], isMain: false },

  // South Gujarat
  { name: "Morarji Desai Market Yard", region: "Navsari, Gujarat", regionKey: "south", distance: "3.2 km", distanceNum: 3.2, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Rice", "Sugarcane", "Banana", "Chikoo"], isMain: true },
  { name: "Navsari APMC", region: "Navsari, Gujarat", regionKey: "south", distance: "4.8 km", distanceNum: 4.8, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Rice", "Banana", "Chikoo"], isMain: false },
];

export default function NearestMandiPage() {
  const [search, setSearch] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("all");
  const [onlyOpen, setOnlyOpen] = React.useState(false);

  const filtered = mandis.filter((m) => {
    const matchesRegion = selectedRegion === "all" || m.regionKey === selectedRegion;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.region.toLowerCase().includes(search.toLowerCase()) || m.crops.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = onlyOpen ? m.status === "Open" : true;
    return matchesRegion && matchesSearch && matchesStatus;
  });

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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Nearest Mandi</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>APMC Market Locator</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Find Nearest Mandi Yard <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Gujarat APMC Markets</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Locate nearby APMC auction yards, check live operating hours, traded crops, and get step-by-step navigation.
            </p>

            {/* Search & Filter bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mandi, crop, or district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${onlyOpen ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A]"}`}
              >
                <CheckCircle className="h-3.5 w-3.5" /> Open Now Only
              </button>
            </div>

            {/* Region Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {regions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRegion(r.key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${selectedRegion === r.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22]/80 text-slate-600 dark:text-[#C9D1D9] border-emerald-100 dark:border-[#2A2F3A] hover:bg-emerald-50"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Mandi Cards */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((m, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {m.isMain && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                            <Star className="h-3 w-3" /> Main Yard
                          </span>
                        )}
                        {m.status === "Open" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="h-3 w-3" /> Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3" /> Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{m.region}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{m.distance} away</div>
                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{m.hours}</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {m.crops.map((crop, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/20">{crop}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60">
                    <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ", " + m.region)}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white">
                        Get Map Directions <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
