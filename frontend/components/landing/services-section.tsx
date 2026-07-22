"use client";

import * as React from "react";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tractor,
  Wrench,
  Warehouse,
  Snowflake,
  Landmark,
  CreditCard,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-transparent relative z-10">
      <Container className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-400/20">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>KrishiMitra Services Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Integrated Services for <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Modern Agriculture
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#C9D1D9] leading-relaxed">
            Everything your farm needs — from machinery rentals and cold storage to government subsidies and real-time mandi prices.
          </p>
        </div>

        {/* High-Level Bento Grid Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Card 1: Equipment Rental Marketplace (Span 7) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-7 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-gradient-to-br from-white/90 via-emerald-50/30 to-white/90 dark:from-[#161B22]/90 dark:via-[#161B22]/60 dark:to-[#0B0F14]/90 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-400/60 dark:hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Tractor className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-800/40">
                  150+ Machinery Available
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Farm Equipment & Machinery Rental
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed max-w-xl">
                  Rent high-horsepower tractors, combine harvesters, rotavators, and seed drills from verified local owners at hourly or daily rates.
                </p>
              </div>

              {/* Sub-services Quick Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/services/tractor-rent"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-emerald-400 dark:hover:border-emerald-700 transition-all group/sub"
                >
                  <div className="flex items-center gap-2.5">
                    <Tractor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Tractor on Rent</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8B949E]">40 - 75 HP Tractors</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-emerald-500 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-all" />
                </Link>

                <Link
                  href="/services/harvester-rent"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-emerald-400 dark:hover:border-emerald-700 transition-all group/sub"
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Harvester on Rent</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8B949E]">Operator Included</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-emerald-500 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-all" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-100/60 dark:border-[#2A2F3A]/60 flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8B949E] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Fully Verified Equipment
              </span>
              <Link href="/services/tractor-rent">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white">
                  <span>Browse Equipment</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: APMC Mandi Intelligence (Span 5) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-5 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-gradient-to-br from-white/90 via-teal-50/20 to-white/90 dark:from-[#161B22]/90 dark:via-[#161B22]/60 dark:to-[#0B0F14]/90 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-400/60 dark:hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-400 border border-teal-300/60 dark:border-teal-800/40">
                  Live APMC Feeds
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  APMC Mandi Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">
                  Track real-time auction rates updated every 30 minutes across Gujarat APMC mandis, compare crop prices, and navigate to nearest markets.
                </p>
              </div>

              {/* Sub-services Links */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/services/live-mandi-prices"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-teal-400 dark:hover:border-teal-700 transition-all group/sub"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Live Mandi Prices</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8B949E]">Realtime Crop Auction Rates</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-teal-500 transition-all" />
                </Link>

                <Link
                  href="/services/nearest-mandi"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-teal-400 dark:hover:border-teal-700 transition-all group/sub"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Nearest Mandi Locator</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8B949E]">Operating Hours & GPS Maps</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-teal-500 transition-all" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-100/60 dark:border-[#2A2F3A]/60 flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8B949E] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> 30-Min Mandi Updates
              </span>
              <Link href="/services/live-mandi-prices">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-400 hover:bg-teal-600 hover:text-white">
                  <span>Check Prices</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Storage & Warehousing (Span 6) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-6 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-gradient-to-br from-white/90 via-amber-50/20 to-white/90 dark:from-[#161B22]/90 dark:via-[#161B22]/60 dark:to-[#0B0F14]/90 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-400/60 dark:hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Warehouse className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300/60 dark:border-amber-800/40">
                  Post-Harvest Care
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Storage & Cold Storage Chains
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-1.5 leading-relaxed">
                  Safeguard your grain harvest in pest-controlled dry warehouses, or reserve -5°C cold storage chambers for perishable crops.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/services/storage-rent"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-amber-400 transition-all group/sub"
                >
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Dry Storage</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-amber-500 transition-all" />
                </Link>

                <Link
                  href="/services/cold-storage"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-blue-400 transition-all group/sub"
                >
                  <div className="flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Cold Rooms</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-blue-500 transition-all" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-100/60 dark:border-[#2A2F3A]/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8B949E]">50,000+ MT Storage Capacity</span>
              <Link href="/services/storage-rent">
                <Button variant="outline" size="sm" className="gap-1 text-xs border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 hover:bg-amber-600 hover:text-white">
                  <span>Explore Storage</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Card 4: Government Grants & Kisan Credit (Span 6) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-6 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-gradient-to-br from-white/90 via-purple-50/20 to-white/90 dark:from-[#161B22]/90 dark:via-[#161B22]/60 dark:to-[#0B0F14]/90 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-400/60 dark:hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Landmark className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 border border-purple-300/60 dark:border-purple-800/40">
                  Financial Assistance
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Government Subsidies & KCC Credit
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-1.5 leading-relaxed">
                  Check eligibility for PM-KISAN, solar pump subsidies, state seed grants, and apply for Kisan Credit Cards at 4% concessional interest.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/services/government-subsidies"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-purple-400 transition-all group/sub"
                >
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Govt Subsidies</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-purple-500 transition-all" />
                </Link>

                <Link
                  href="/services/kisan-credit-card"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0B0F14]/60 border border-emerald-100 dark:border-[#2A2F3A] hover:border-emerald-400 transition-all group/sub"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Kisan Credit Card</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/sub:text-emerald-500 transition-all" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-100/60 dark:border-[#2A2F3A]/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8B949E]">4% Interest Loan Assistance</span>
              <Link href="/services/government-subsidies">
                <Button variant="outline" size="sm" className="gap-1 text-xs border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-400 hover:bg-purple-600 hover:text-white">
                  <span>Check Eligibility</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* View All Services Direct Hub Bar */}
        <div className="text-center pt-4">
          <Link href="/services">
            <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-emerald-200/80 dark:shadow-emerald-950/40">
              <span>Explore All Krishi Services Hub</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
