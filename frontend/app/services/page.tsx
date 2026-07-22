"use client";

import * as React from "react";
import { Navbar } from "../../components/layout/navbar";
import { Footer } from "../../components/layout/footer";
import { Container } from "../../components/layout/container";
import { LiveBreezeBackground } from "../../components/landing/live-breeze-background";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tractor,
  Wrench,
  Warehouse,
  Snowflake,
  Landmark,
  Flag,
  Map,
  CreditCard,
  MapPin,
  TrendingUp,
  Search,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const categories = [
  {
    id: "equipment",
    title: "Farm Equipment & Machinery",
    subtitle: "Rent tractors and harvesters from verified local owners",
    emoji: "🚜",
    badge: "Rental Marketplace",
    items: [
      {
        title: "Tractor on Rent",
        href: "/services/tractor-rent",
        desc: "High-horsepower tractors with implements available hourly or daily.",
        icon: <Tractor className="h-5 w-5" />,
        stat: "150+ Tractors",
        accent: "emerald"
      },
      {
        title: "Harvester on Rent",
        href: "/services/harvester-rent",
        desc: "Combine and paddy harvesters with experienced operators included.",
        icon: <Wrench className="h-5 w-5" />,
        stat: "80+ Harvesters",
        accent: "teal"
      }
    ]
  },
  {
    id: "storage",
    title: "Storage & Warehousing",
    subtitle: "Safe dry storage and temperature-controlled cold chains",
    emoji: "🏢",
    badge: "Post-Harvest Care",
    items: [
      {
        title: "Storage on Rent",
        href: "/services/storage-rent",
        desc: "Pest-controlled warehouses & godowns for crop inventory preservation.",
        icon: <Warehouse className="h-5 w-5" />,
        stat: "50,000 MT Cap.",
        accent: "amber"
      },
      {
        title: "Cold Storage",
        href: "/services/cold-storage",
        desc: "IoT temperature monitored cold rooms for fruits & vegetables.",
        icon: <Snowflake className="h-5 w-5" />,
        stat: "-5°C to 8°C Zone",
        accent: "blue"
      }
    ]
  },
  {
    id: "government",
    title: "Government Support & Welfare",
    subtitle: "Direct financial assistance, subsidies, and easy farm credit",
    emoji: "🏛",
    badge: "Financial Aids",
    items: [
      {
        title: "Government Subsidies",
        href: "/services/government-subsidies",
        desc: "Financial assistance for seeds, solar pumps, and farm machinery.",
        icon: <Landmark className="h-5 w-5" />,
        stat: "Up to 60% Off",
        accent: "purple"
      },
      {
        title: "Central Schemes",
        href: "/services/central-schemes",
        desc: "National welfare programs like PM-KISAN & PM-Fasal Bima.",
        icon: <Flag className="h-5 w-5" />,
        stat: "100% Coverage",
        accent: "emerald"
      },
      {
        title: "State Schemes",
        href: "/services/state-schemes",
        desc: "Regional agriculture welfare policies and state subsidies.",
        icon: <Map className="h-5 w-5" />,
        stat: "State Benefits",
        accent: "indigo"
      },
      {
        title: "Kisan Credit Card",
        href: "/services/kisan-credit-card",
        desc: "Low-interest credit lines up to ₹3 Lakh at 4% interest rate.",
        icon: <CreditCard className="h-5 w-5" />,
        stat: "4% Interest",
        accent: "rose"
      }
    ]
  },
  {
    id: "market",
    title: "Market & APMC Services",
    subtitle: "Live mandi prices, market locations, and navigation support",
    emoji: "📍",
    badge: "Real-time Data",
    items: [
      {
        title: "Nearest Mandi",
        href: "/services/nearest-mandi",
        desc: "Locate APMC markets, check operating hours & turn-by-turn directions.",
        icon: <MapPin className="h-5 w-5" />,
        stat: "Gujarat Mandis",
        accent: "amber"
      },
      {
        title: "Live Mandi Prices",
        href: "/services/live-mandi-prices",
        desc: "Real-time crop rates, price trends, and historical market analytics.",
        icon: <TrendingUp className="h-5 w-5" />,
        stat: "Updated 30m ago",
        accent: "emerald"
      }
    ]
  }
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col">
        {/* Hero Banner Section */}
        <section className="py-16 sm:py-24 bg-transparent">
          <Container className="text-center space-y-6 max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Services Hub</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Smart Krishi Services Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Empowering Farmers with <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                End-to-End Agri Services
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-2xl mx-auto leading-relaxed">
              From equipment rental and cold storage to government scheme assistance and live mandi price feeds — everything you need for high-yield farming.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative max-w-xl mx-auto pt-4">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search service (e.g. Tractor, Kisan Credit, Mandi Prices)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container className="space-y-16">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No services found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700"
                >
                  Clear search query
                </button>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/80 dark:border-[#2A2F3A] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{cat.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{cat.subtitle}</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                      {cat.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cat.items.map((item) => (
                      <motion.div
                        key={item.title}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="group rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300/80 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all">
                              {item.icon}
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-[#C9D1D9] border border-slate-200/50 dark:border-slate-700/50">
                              {item.stat}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-1.5 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-6">
                          <Link href={item.href}>
                            <Button variant="outline" size="sm" className="w-full justify-between gap-2 text-xs border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all">
                              <span>Explore Service</span>
                              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </Container>
        </section>

        {/* Why Choose Us Stats Banner */}
        <section className="py-16 bg-transparent border-y border-emerald-100/60 dark:border-[#2A2F3A]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2 p-6 rounded-3xl border border-emerald-100/60 dark:border-[#2A2F3A] bg-white/70 dark:bg-[#161B22]/70 backdrop-blur-md">
                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">100% Verified Partners</h4>
                <p className="text-xs text-slate-500 dark:text-[#8B949E]">All equipment owners and cold stores are physically verified for safety and quality.</p>
              </div>
              <div className="space-y-2 p-6 rounded-3xl border border-emerald-100/60 dark:border-[#2A2F3A] bg-white/70 dark:bg-[#161B22]/70 backdrop-blur-md">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Direct APMC Integration</h4>
                <p className="text-xs text-slate-500 dark:text-[#8B949E]">Live mandi prices updated every 30 minutes straight from government auction yards.</p>
              </div>
              <div className="space-y-2 p-6 rounded-3xl border border-emerald-100/60 dark:border-[#2A2F3A] bg-white/70 dark:bg-[#161B22]/70 backdrop-blur-md">
                <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Instant Subsidy Check</h4>
                <p className="text-xs text-slate-500 dark:text-[#8B949E]">Check eligibility for central and state agriculture schemes with a single click.</p>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
