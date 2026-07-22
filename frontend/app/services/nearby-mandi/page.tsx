"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { MapPin, Navigation, Clock, ChevronRight, CheckCircle, Search } from "lucide-react";
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

const mandis: Mandi[] = [
  { name: "APMC Dahod Main Office", region: "Dahod, Gujarat", regionKey: "east", distance: "2.1 km", distanceNum: 2.1, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Maize", "Paddy", "Soybean", "Tur"], isMain: true },
  { name: "Dahod APMC / Anaj Market", region: "Dahod, Gujarat", regionKey: "east", distance: "3.0 km", distanceNum: 3.0, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Maize", "Paddy", "Soybean", "Tur"], isMain: false },
  { name: "Bhuj APMC Market Yard", region: "Bhuj, Gujarat", regionKey: "west", distance: "3.4 km", distanceNum: 3.4, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Bajra", "Castor", "Guar", "Cumin"], isMain: true },
  { name: "Anand (Samarkha) APMC Market", region: "Anand, Gujarat", regionKey: "central", distance: "4.6 km", distanceNum: 4.6, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Tobacco", "Cotton", "Banana", "Paddy"], isMain: true },
  { name: "Deesa APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "5.8 km", distanceNum: 5.8, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Cumin", "Castor", "Mustard", "Isabgol"], isMain: true },
  { name: "Morarji Desai Market Yard", region: "Navsari, Gujarat", regionKey: "south", distance: "3.2 km", distanceNum: 3.2, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Rice", "Sugarcane", "Banana", "Chikoo"], isMain: true },
];

export default function NearbyMandiPage() {
  const [search, setSearch] = React.useState("");

  const filtered = mandis.filter((m) => {
    return m.name.toLowerCase().includes(search.toLowerCase()) || m.region.toLowerCase().includes(search.toLowerCase()) || m.crops.some(c => c.toLowerCase().includes(search.toLowerCase()));
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Nearby Mandi</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Nearby APMC Markets</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Nearby Mandi Locations <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Gujarat APMC Network</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Find APMC market yards near your current location with live operational status and crop listings.
            </p>

            {/* Search Bar */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search mandi, crop, or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </Container>
        </section>

        {/* Mandi Cards */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((m, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> Open
                      </span>
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
                        Get Directions <ChevronRight className="h-3.5 w-3.5" />
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
