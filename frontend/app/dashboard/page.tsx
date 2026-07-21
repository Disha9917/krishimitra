"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../components/common/logo";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { Button } from "../../components/ui/button";
import { LiveBreezeBackground } from "../../components/landing/live-breeze-background";
import { GUJARAT_DISTRICT_ZONES } from "../../utils/constants";
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Warehouse,
  Scan,
  Upload,
  ArrowRight,
  MapPin,
  Thermometer,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  LogOut,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "disease" | "storage" | "mandi">("overview");

  // Auth Protection Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAuthCookie = document.cookie.includes("krishi_auth=true");
      const hasAuthLocal = localStorage.getItem("krishi_auth") === "true";
      if (!hasAuthCookie && !hasAuthLocal) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      document.cookie = "krishi_auth=; path=/; max-age=0";
      localStorage.removeItem("krishi_auth");
    }
    router.push("/login");
  };

  // Selected Gujarat District State (Defaults to Anand Central)
  const [selectedDistrictId, setSelectedDistrictId] = useState("anand");
  const selectedDistrict = GUJARAT_DISTRICT_ZONES.find((d) => d.id === selectedDistrictId) || GUJARAT_DISTRICT_ZONES[2];

  // Disease Scanner State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    disease: string;
    crop: string;
    confidence: number;
    severity: string;
    treatment: string;
    organic: string;
  }>(null);

  // Storage Planner State
  const [quantityQuintals, setQuantityQuintals] = useState(100);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [storageDays, setStorageDays] = useState(30);

  const currentCrop = selectedDistrict.crops[selectedCropIndex] || selectedDistrict.crops[0];

  // Handle Sample Scan Click
  const handleSampleScan = () => {
    setIsAnalyzing(true);
    setScanResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setScanResult({
        disease: "Leaf Spot & Blight (Cercospora)",
        crop: `${currentCrop.name} (${selectedDistrict.name})`,
        confidence: 96.8,
        severity: "Moderate (Level 2)",
        treatment: "Spray Mancozeb 75% WP @ 2.5g/liter or Copper Oxychloride @ 3g/liter",
        organic: "Spray Neem Seed Kernel Extract (NSKE 5%) @ 50ml/liter + Trichoderma harzianum",
      });
    }, 1200);
  };

  // Storage calculations based on selected crop
  const basePricePerQuintal = currentCrop.price;
  const priceIncreasePer30Days = Math.round(basePricePerQuintal * 0.08); // 8% expected appreciation over 30 days
  const storageCostPerQuintal = 35;
  const currentTotal = quantityQuintals * basePricePerQuintal;
  const projectedPrice = basePricePerQuintal + Math.round((priceIncreasePer30Days * storageDays) / 30);
  const totalStorageCost = quantityQuintals * storageCostPerQuintal;
  const projectedTotal = quantityQuintals * projectedPrice - totalStorageCost;
  const netProfitGain = projectedTotal - currentTotal;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Live Farm Breeze Canvas */}
      <LiveBreezeBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#0B0F14]/85 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo />
            
            {/* Gujarat District Selector Pill */}
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-[#161B22] px-3 py-1.5 border border-emerald-200/60 dark:border-[#2A2F3A] text-xs font-bold">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setSelectedCropIndex(0);
                }}
                className="bg-transparent text-slate-900 dark:text-white font-extrabold focus:outline-none cursor-pointer pr-1"
              >
                {GUJARAT_DISTRICT_ZONES.map((dist) => (
                  <option key={dist.id} value={dist.id} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                    {dist.name} (PIN {dist.pincode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Farmer Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B22] p-1.5 border border-slate-200/60 dark:border-[#2A2F3A] text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">
              <div className="rounded-lg bg-emerald-600 p-1.5 text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              <span>Rajesh Patel</span>
            </div>

            <ThemeToggle />

            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Sub-Header Navigation Tabs */}
        <div className="border-t border-slate-100 dark:border-[#2A2F3A] bg-white/40 dark:bg-[#0B0F14]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("crops")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === "crops"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Sprout className="h-4 w-4" />
              <span>Precision Crop Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab("disease")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === "disease"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>AI Disease Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab("storage")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === "storage"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Warehouse className="h-4 w-4" />
              <span>Sell vs Store Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("mandi")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === "mandi"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>APMC Mandi Prices</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Banner Alert featuring active Gujarat District */}
            <div className="rounded-3xl border border-emerald-200/80 dark:border-[#2A2F3A] bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-emerald-100 border border-white/30">
                  <Sparkles className="h-4 w-4" />
                  <span>{selectedDistrict.zone} • {selectedDistrict.name} Advisory Active</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">Welcome back, Rajesh!</h2>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Active location set to <strong>{selectedDistrict.name}</strong> (PIN {selectedDistrict.pincode}). Top recommended crops for your zone: {selectedDistrict.crops.map((c) => c.name).join(", ")}.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("crops")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-800 font-bold px-4 py-2.5 text-xs shadow-md hover:bg-emerald-50 transition-all"
                  >
                    <span>Explore District Crops ({selectedDistrict.crops.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("disease")}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/60 backdrop-blur-md text-white border border-emerald-400/40 font-bold px-4 py-2.5 text-xs hover:bg-emerald-900/80 transition-all"
                  >
                    <Scan className="h-4 w-4" />
                    <span>Scan Leaf Image</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Top Crop Match</span>
                  <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDistrict.crops[0].name}</div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{selectedDistrict.crops[0].match}% Zone Match</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>APMC Price ({selectedDistrict.crops[0].name})</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">₹{selectedDistrict.crops[0].price.toLocaleString()} / Qtl</div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ↑ +5.2% in {selectedDistrict.name.split(" ")[0]} APMC
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Post-Harvest Gain</span>
                  <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">+₹{(Math.round(selectedDistrict.crops[0].price * 0.08 * 100) - 3500).toLocaleString()} / 100 Qtl</div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Store 30 Days for Max Profit
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Active District Zone</span>
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDistrict.name.split(" ")[0]}</div>
                <div className="text-[11px] text-slate-500 dark:text-[#8B949E]">
                  {selectedDistrict.zone}
                </div>
              </div>
            </div>

            {/* District Crops Grid Preview */}
            <div className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Dedicated Crops for {selectedDistrict.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Curated agricultural suite tailored for {selectedDistrict.zone} soil & weather.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("crops")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Detailed Advisory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedDistrict.crops.map((crop, idx) => (
                  <div
                    key={crop.name}
                    className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] border border-emerald-100/60 dark:border-[#2A2F3A] space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5">
                        Crop #{idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                        {crop.match}% Match
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{crop.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E]">{crop.season} Season</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 dark:text-[#C9D1D9] border-t border-emerald-100 dark:border-[#2A2F3A] pt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Yield:</span>
                        <span className="font-bold">{crop.yield}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mandi Price:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{crop.price.toLocaleString()}/Qtl</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PRECISION CROP ADVISOR */}
        {activeTab === "crops" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Precision Crop Advisories for {selectedDistrict.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">
                  {selectedDistrict.zone} • PIN {selectedDistrict.pincode} • Customized AgriTech Suite
                </p>
              </div>
              
              <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B22] p-2 border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Switch District:</span>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="bg-transparent font-extrabold text-emerald-700 dark:text-emerald-400 focus:outline-none"
                >
                  {GUJARAT_DISTRICT_ZONES.map((d) => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedDistrict.crops.map((crop, idx) => (
                <div
                  key={crop.name}
                  className="rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="rounded-md bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1">
                        Rank #{idx + 1} • {crop.match}% Match
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#8B949E]">
                        {crop.season}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{crop.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">High suitability for {selectedDistrict.name}</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 dark:text-[#C9D1D9] border-t border-b border-slate-100 dark:border-[#2A2F3A] py-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Yield:</span>
                        <span className="font-bold">{crop.yield}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Optimal Sowing:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{crop.sowing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mandi Benchmark:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">₹{crop.price.toLocaleString()} / Qtl</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-[#111827] p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Tailored for {selectedDistrict.zone} climate.</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: AI DISEASE SCANNER */}
        {activeTab === "disease" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Leaf Disease Scanner</h2>
              <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">
                Upload or capture a clear photo of infected crop leaves for instant computer vision diagnostic remedies.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-8 shadow-xl space-y-6">
              <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-[#111827] rounded-3xl p-8 text-center space-y-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <Scan className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Drop Crop Leaf Photo Here</h4>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">
                    Supports {selectedDistrict.crops.map((c) => c.name).join(", ")}
                  </p>
                </div>

                <button
                  onClick={handleSampleScan}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-bold px-5 py-3 text-xs shadow-md hover:bg-emerald-500 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isAnalyzing ? "Analyzing Computer Vision..." : `Run Test Diagnosis for ${currentCrop.name}`}</span>
                </button>
              </div>

              {scanResult && (
                <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/80 dark:bg-[#161B22] p-6 space-y-4 animate-fade-in text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-[#2A2F3A] pb-3">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-extrabold text-sm">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Diagnosis Result: {scanResult.disease}</span>
                    </div>
                    <span className="rounded-full bg-emerald-600 text-white text-[11px] font-bold px-3 py-1">
                      {scanResult.confidence}% Accuracy Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 dark:text-[#8B949E] block">Target Crop Variety:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{scanResult.crop}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 dark:text-[#8B949E] block">Infestation Severity:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{scanResult.severity}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-amber-200/60 dark:border-[#2A2F3A]">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Recommended Fungicide Spray:</h5>
                    <p className="text-xs text-slate-700 dark:text-[#C9D1D9] bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A]">
                      {scanResult.treatment}
                    </p>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-white pt-2">Organic & Bio Remedy:</h5>
                    <p className="text-xs text-slate-700 dark:text-[#C9D1D9] bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A]">
                      {scanResult.organic}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: SELL VS STORE PLANNER */}
        {activeTab === "storage" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sell Now vs Cold Store Profit Calculator</h2>
              <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">
                Predict commercial price escalation for {selectedDistrict.name} crops to maximize farmer profit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-emerald-600" />
                  <span>Harvest & Storage Parameters</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-[#C9D1D9] mb-1">
                      Select {selectedDistrict.name} Crop
                    </label>
                    <select
                      value={selectedCropIndex}
                      onChange={(e) => setSelectedCropIndex(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#111827] p-2.5 font-bold text-slate-900 dark:text-white"
                    >
                      {selectedDistrict.crops.map((c, idx) => (
                        <option key={c.name} value={idx}>
                          {c.name} (Benchmark ₹{c.price}/Qtl)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-[#C9D1D9] mb-1">Harvest Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={quantityQuintals}
                      onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#111827] p-2.5 font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-[#C9D1D9] mb-1">Storage Duration (Days): {storageDays} Days</label>
                    <input
                      type="range"
                      min={15}
                      max={90}
                      step={15}
                      value={storageDays}
                      onChange={(e) => setStorageDays(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Profit Output */}
              <div className="rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-emerald-950 text-white p-6 shadow-xl space-y-6 flex flex-col justify-between">
                <div>
                  <span className="rounded-md bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1">AI Commercial Advisory</span>
                  <h3 className="text-xl font-black mt-2 text-emerald-300">
                    {netProfitGain > 0 ? "STORE IN CERTIFIED WAREHOUSE" : "SELL IMMEDIATELY IN APMC"}
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    Holding {quantityQuintals} quintals of {currentCrop.name} for {storageDays} days in {selectedDistrict.name} area.
                  </p>
                </div>

                <div className="space-y-3 text-xs border-t border-emerald-800/60 pt-4">
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Current APMC Sale Value:</span>
                    <span className="font-bold">₹{currentTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Projected Market Sale Value:</span>
                    <span className="font-bold text-emerald-400">₹{(projectedPrice * quantityQuintals).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Storage & Protection Fees:</span>
                    <span className="font-bold text-rose-300">-₹{totalStorageCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-emerald-800 font-extrabold text-white">
                    <span>Estimated Net Profit Boost:</span>
                    <span className="text-emerald-400">+₹{netProfitGain.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: APMC MANDI PRICES */}
        {activeTab === "mandi" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Real-Time APMC Mandi Prices across Gujarat</h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">Live daily market arrivals across Gujarat 5 major district zones.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Updated 10 mins ago</span>
            </div>

            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#2A2F3A] text-slate-500 dark:text-[#8B949E]">
                    <th className="pb-3 font-bold">District Yard</th>
                    <th className="pb-3 font-bold">Primary Crops</th>
                    <th className="pb-3 font-bold">Benchmark Rate</th>
                    <th className="pb-3 font-bold">Price Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2A2F3A] font-semibold text-slate-900 dark:text-white">
                  {GUJARAT_DISTRICT_ZONES.map((dist) => (
                    <tr key={dist.id} className={dist.id === selectedDistrictId ? "bg-emerald-50/60 dark:bg-[#111827]" : ""}>
                      <td className="py-3.5 font-bold">{dist.name}</td>
                      <td>{dist.crops.map((c) => c.name).join(", ")}</td>
                      <td className="font-bold text-emerald-600 dark:text-emerald-400">₹{dist.crops[0].price.toLocaleString()} / Qtl</td>
                      <td className="text-emerald-600 font-bold">↑ +4.8%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </main>

      {/* Dashboard Footer */}
      <footer className="relative z-20 text-center py-4 border-t border-slate-100 dark:border-[#2A2F3A] text-[11px] text-slate-500 dark:text-[#8B949E]">
        © {new Date().getFullYear()} KrishiMitra AI. Kisan Call Helpline Support 1800-180-1551.
      </footer>
    </div>
  );
}
