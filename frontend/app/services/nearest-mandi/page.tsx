"use client";
import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { MapPin, Navigation, Clock, ChevronRight, CheckCircle, XCircle, Star } from "lucide-react";
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
  { name: "Sanjeli APMC", region: "Dahod, Gujarat", regionKey: "east", distance: "32.0 km", distanceNum: 32.0, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Maize", "Paddy", "Soybean"], isMain: false },

  // West Gujarat
  { name: "Bhuj APMC Market Yard", region: "Bhuj, Gujarat", regionKey: "west", distance: "3.4 km", distanceNum: 3.4, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Bajra", "Castor", "Guar", "Cumin"], isMain: true },
  { name: "Anjar APMC", region: "Kutch, Gujarat", regionKey: "west", distance: "42.0 km", distanceNum: 42.0, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Bajra", "Castor", "Cumin"], isMain: false },
  { name: "Mandvi APMC", region: "Kutch, Gujarat", regionKey: "west", distance: "56.8 km", distanceNum: 56.8, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Bajra", "Guar", "Cumin"], isMain: false },
  { name: "Rapar APMC", region: "Kutch, Gujarat", regionKey: "west", distance: "68.2 km", distanceNum: 68.2, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Castor", "Guar", "Cumin"], isMain: false },

  // Central Gujarat
  { name: "Anand (Samarkha) APMC Market", region: "Anand, Gujarat", regionKey: "central", distance: "4.6 km", distanceNum: 4.6, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Tobacco", "Cotton", "Banana", "Paddy"], isMain: true },
  { name: "Anand APMC", region: "Anand, Gujarat", regionKey: "central", distance: "5.2 km", distanceNum: 5.2, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Tobacco", "Cotton", "Banana"], isMain: false },
  { name: "Borsad APMC", region: "Anand, Gujarat", regionKey: "central", distance: "19.8 km", distanceNum: 19.8, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cotton", "Banana", "Paddy"], isMain: false },
  { name: "Khambhat APMC", region: "Anand, Gujarat", regionKey: "central", distance: "35.4 km", distanceNum: 35.4, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Tobacco", "Cotton", "Paddy"], isMain: false },
  { name: "Petlad APMC", region: "Anand, Gujarat", regionKey: "central", distance: "16.1 km", distanceNum: 16.1, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cotton", "Banana", "Tobacco"], isMain: false },
  { name: "Tarapur APMC", region: "Anand, Gujarat", regionKey: "central", distance: "22.5 km", distanceNum: 22.5, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Tobacco", "Paddy", "Banana"], isMain: false },

  // North Gujarat
  { name: "Deesa APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "5.8 km", distanceNum: 5.8, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Cumin", "Castor", "Mustard", "Isabgol"], isMain: true },
  { name: "Dhanera APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "48.0 km", distanceNum: 48.0, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cumin", "Castor", "Mustard"], isMain: false },
  { name: "Palanpur APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "30.2 km", distanceNum: 30.2, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cumin", "Isabgol", "Mustard"], isMain: false },
  { name: "Tharad APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "62.5 km", distanceNum: 62.5, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Castor", "Cumin", "Isabgol"], isMain: false },
  { name: "Bhabhar APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "55.3 km", distanceNum: 55.3, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Cumin", "Castor", "Mustard"], isMain: false },
  { name: "Deodar APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "40.7 km", distanceNum: 40.7, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Castor", "Isabgol", "Cumin"], isMain: false },
  { name: "Lakhani APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "36.1 km", distanceNum: 36.1, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Mustard", "Cumin", "Castor"], isMain: false },
  { name: "Thara APMC", region: "Banaskantha, Gujarat", regionKey: "north", distance: "28.9 km", distanceNum: 28.9, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Cumin", "Castor", "Isabgol"], isMain: false },

  // South Gujarat
  { name: "Morarji Desai Market Yard", region: "Navsari, Gujarat", regionKey: "south", distance: "3.2 km", distanceNum: 3.2, status: "Open", hours: "7:00 AM – 5:00 PM", crops: ["Rice", "Sugarcane", "Banana", "Chikoo"], isMain: true },
  { name: "Navsari APMC", region: "Navsari, Gujarat", regionKey: "south", distance: "4.8 km", distanceNum: 4.8, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Rice", "Banana", "Chikoo"], isMain: false },
  { name: "Chikhli APMC", region: "Navsari, Gujarat", regionKey: "south", distance: "22.6 km", distanceNum: 22.6, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Rice", "Sugarcane", "Banana"], isMain: false },
  { name: "Gandevi APMC", region: "Navsari, Gujarat", regionKey: "south", distance: "14.3 km", distanceNum: 14.3, status: "Closed", hours: "7:00 AM – 4:00 PM", crops: ["Banana", "Rice", "Chikoo"], isMain: false },
  { name: "Jalalpor / Veraval APMC", region: "Navsari, Gujarat", regionKey: "south", distance: "28.1 km", distanceNum: 28.1, status: "Open", hours: "7:00 AM – 4:00 PM", crops: ["Sugarcane", "Rice", "Banana"], isMain: false },
];

export default function NearestMandiPage() {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 dark:from-emerald-950/10 to-transparent">
          <Container className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <MapPin className="h-4 w-4" />
              <span>APMC Market Locator</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">Find Nearest Mandi</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">Locate Gujarat APMC mandis, check open status, market hours, and get navigation assistance.</p>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            {/* Mandi Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mandis.map((m, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {m.isMain && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                          <Star className="h-3 w-3" /> Main
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
                    <div className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{m.distance}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{m.hours}</div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.crops.map((crop, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/20">{crop}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ", " + m.region)}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500">
                      Get Directions <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
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
