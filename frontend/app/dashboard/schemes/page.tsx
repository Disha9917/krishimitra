"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../../components/common/logo";
import { ThemeToggle } from "../../../components/ui/theme-toggle";
import { Button } from "../../../components/ui/button";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import {
  REGION_DISTRICT_MAPPING,
  getRecommendedSchemes,
  Scheme,
} from "../../../data/schemes";
import {
  Flag,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  ChevronRight,
  Users,
  Briefcase,
  ExternalLink,
  BookOpen,
  Info,
  LogOut,
  User,
  Layers,
  Sprout,
  Scan,
  Warehouse,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GovernmentSchemesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth Protection Check (same as main dashboard)
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

  // State for cascading dropdowns (defaults to Central Gujarat -> Anand)
  const [selectedRegionId, setSelectedRegionId] = useState("central-gujarat");
  
  // Get districts for selected region
  const selectedRegionSpec = REGION_DISTRICT_MAPPING.find((r) => r.id === selectedRegionId) || REGION_DISTRICT_MAPPING[3];
  const [selectedDistrictName, setSelectedDistrictName] = useState("Anand");

  // Get crop options for selected region
  const cropCategoryOptions = [
    ...selectedRegionSpec.crops.traditional,
    ...selectedRegionSpec.crops.exotic,
  ];
  const [selectedCrop, setSelectedCrop] = useState("Paddy");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "central" | "state">("all");

  // Selected Scheme for Application Modal Simulation
  const [selectedApplyScheme, setSelectedApplyScheme] = useState<Scheme | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Mock Form Fields
  const [applicantName, setApplicantName] = useState("Rajesh Patel");
  const [aadhaarNumber, setAadhaarNumber] = useState("5432-8765-0987");
  const [landArea, setLandArea] = useState("2.5");

  // Handle Cascading dropdown updates
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setSelectedRegionId(regionId);
    
    const spec = REGION_DISTRICT_MAPPING.find((r) => r.id === regionId);
    if (spec && spec.districts.length > 0) {
      setSelectedDistrictName(spec.districts[0]);
      
      const allCrops = [...spec.crops.traditional, ...spec.crops.exotic];
      if (allCrops.length > 0) {
        setSelectedCrop(allCrops[0]);
      }
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictName(e.target.value);
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrop(e.target.value);
  };

  // Fetch filtered schemes
  const recommendedSchemes = getRecommendedSchemes(
    selectedRegionId,
    selectedDistrictName,
    selectedCrop,
    searchQuery,
    activeFilter
  );

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedApplyScheme(null);
      }, 2500);
    }, 1800);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          <span className="text-xs font-bold text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Live Farm Breeze Canvas */}
      <LiveBreezeBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#0B0F14]/85 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo />
            
            {/* Active Specs Pill */}
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-[#161B22] px-3 py-1.5 border border-emerald-200/60 dark:border-[#2A2F3A] text-xs font-bold">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-[#C9D1D9]">{selectedDistrictName} ({selectedRegionSpec.name})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Pill */}
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
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-all whitespace-nowrap"
            >
              <Layers className="h-4 w-4" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-all whitespace-nowrap"
            >
              <Sprout className="h-4 w-4" />
              <span>Precision Crop Advisor</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-all whitespace-nowrap"
            >
              <Scan className="h-4 w-4" />
              <span>AI Disease Scanner</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-all whitespace-nowrap"
            >
              <Warehouse className="h-4 w-4" />
              <span>Sell vs Store Planner</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-all whitespace-nowrap"
            >
              <TrendingUp className="h-4 w-4" />
              <span>APMC Mandi Prices</span>
            </Link>

            <button
              disabled
              className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap bg-emerald-600 text-white shadow-xs cursor-default"
            >
              <Flag className="h-4 w-4" />
              <span>Government Schemes & Subsidies</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Dynamic Greeting Banner */}
        <div className="relative z-10 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-[#0F172A] dark:via-emerald-950/90 dark:to-[#0B0F14] text-slate-900 dark:text-white p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-teal-500/10 dark:bg-teal-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 dark:bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-400/30 shadow-xs">
              <Landmark className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              <span>Smart Recommendation Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Government Schemes & Subsidies portal
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
              Filter agriculture subsidies and welfare benefits tailored to your region <strong className="text-slate-900 dark:text-white font-black">{selectedDistrictName}</strong> and active crop cultivation of <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{selectedCrop}</strong>.
            </p>
          </div>
        </div>

        {/* Cascading Filter Controls Card */}
        <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-[#2A2F3A]">
            <Filter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Customize Crop & Location Matrix</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Region Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 dark:text-[#8B949E]">
                1. Select Region
              </label>
              <select
                value={selectedRegionId}
                onChange={handleRegionChange}
                className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-emerald-50/40 dark:bg-[#111827] p-3 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {REGION_DISTRICT_MAPPING.map((region) => (
                  <option key={region.id} value={region.id} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                    {region.name} ({region.districts.length} Districts)
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 dark:text-[#8B949E]">
                2. Select District
              </label>
              <select
                value={selectedDistrictName}
                onChange={handleDistrictChange}
                className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-emerald-50/40 dark:bg-[#111827] p-3 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {selectedRegionSpec.districts.map((dist) => (
                  <option key={dist} value={dist} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 dark:text-[#8B949E]">
                3. Select Sown Crop
              </label>
              <select
                value={selectedCrop}
                onChange={handleCropChange}
                className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-emerald-50/40 dark:bg-[#111827] p-3 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <optgroup label="Traditional Crops" className="bg-white dark:bg-[#161B22] text-slate-500 font-bold">
                  {selectedRegionSpec.crops.traditional.map((c) => (
                    <option key={c} value={c} className="text-slate-900 dark:text-white font-bold">
                      🌾 {c}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Exotic/Premium Crops" className="bg-white dark:bg-[#161B22] text-slate-500 font-bold">
                  {selectedRegionSpec.crops.exotic.map((c) => (
                    <option key={c} value={c} className="text-slate-900 dark:text-white font-bold">
                      🌟 {c}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Search, Filter Tabs & Results Count */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sub-Filters: All, Central, State */}
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-[#161B22]/70 border border-emerald-100 dark:border-[#2A2F3A] p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
            {[
              { id: "all", label: "All Schemes & Subsidies" },
              { id: "central", label: "Central Gov. Schemes" },
              { id: "state", label: "Gujarat Subsidies" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeFilter === f.id
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20"
                    : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#1C212A]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scheme name, description, benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] pl-10 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Listing Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Found <strong className="text-emerald-700 dark:text-emerald-400">{recommendedSchemes.length}</strong> matching schemes for {selectedCrop} in {selectedDistrictName}
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {recommendedSchemes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-dashed border-slate-200 dark:border-[#2A2F3A] bg-white/40 dark:bg-[#161B22]/40 p-12 text-center space-y-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto">
                  <Info className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Matching Schemes Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the crop selection, clearing your search query, or switching filter categories.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recommendedSchemes.map((scheme, idx) => (
                  <motion.div
                    key={scheme.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.05, 0.4) } }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300/80 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          scheme.govtType === "Central"
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                            : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                        }`}>
                          {scheme.govtType}
                        </span>
                        
                        <span className="text-[10px] font-bold text-slate-400">
                          Updated {scheme.lastUpdated}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5">
                        <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {scheme.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-[#C9D1D9] leading-relaxed line-clamp-3">
                          {scheme.description}
                        </p>
                      </div>

                      {/* Benefits & Eligibility Summary */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#2A2F3A] text-xs">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-slate-700 dark:text-emerald-100/90 leading-tight">
                            <strong>Benefits: </strong> {scheme.subsidyAmount || scheme.benefits}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-slate-700 dark:text-emerald-100/90 leading-tight">
                            <strong>Eligibility: </strong> {scheme.eligibility}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-6 border-t border-slate-100 dark:border-[#2A2F3A] flex gap-3 mt-4">
                      <Link href={`/dashboard/schemes/${scheme.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-center gap-1 text-xs font-bold border-slate-200 dark:border-slate-800/40 text-slate-700 dark:text-[#C9D1D9]"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </Button>
                      </Link>

                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 justify-center gap-1 text-xs font-bold"
                        onClick={() => setSelectedApplyScheme(scheme)}
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Interactive Application Modal */}
      <AnimatePresence>
        {selectedApplyScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-5 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedApplyScheme(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="h-5 w-5" />
              </button>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Application Initiated!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-xs mx-auto leading-relaxed">
                      Your details have been successfully synced with the {selectedApplyScheme.govtType === "Central" ? "GoI DBT Portal" : "i-Khedut Gujarat Server"}.
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-2xl text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Application ID: KM-SCH-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      DBT Application Gateway
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      Enroll: {selectedApplyScheme.name.split(" (")[0]}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600 dark:text-[#8B949E]">
                        Farmer Name (as in Land Records)
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Aadhaar */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600 dark:text-[#8B949E]">
                        Aadhaar / Kisan Digital ID
                      </label>
                      <input
                        type="text"
                        required
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Land Area */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600 dark:text-[#8B949E]">
                        Cultivable Land Holding (Acre)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-[#2A2F3A] flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 justify-center text-xs font-bold"
                      onClick={() => setSelectedApplyScheme(null)}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1 justify-center text-xs font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-1.5">
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <span>Verify & Submit</span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-20 text-center py-4 border-t border-slate-100 dark:border-[#2A2F3A] text-[11px] text-slate-500 dark:text-[#8B949E]">
        © {new Date().getFullYear()} KrishiMitra AI. Kisan Call Helpline Support 1800-180-1551.
      </footer>
    </div>
  );
}
