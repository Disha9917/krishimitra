"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Logo } from "../../../../components/common/logo";
import { ThemeToggle } from "../../../../components/ui/theme-toggle";
import { Button } from "../../../../components/ui/button";
import { LiveBreezeBackground } from "../../../../components/landing/live-breeze-background";
import { tokenStore } from "../../../../store/token.store";
import { authService } from "../../../../services/auth.service";
import {
  CENTRAL_SCHEMES,
  GUJARAT_SUBSIDIES,
  Scheme,
} from "../../../../data/schemes";
import {
  Flag,
  ArrowLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ExternalLink,
  BookOpen,
  LogOut,
  User,
  Layers,
  Sprout,
  Scan,
  Warehouse,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Briefcase,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchemeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const schemeId = params?.id as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth Protection Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasToken = tokenStore.getAccessToken();
      if (!hasToken) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const handleSignOut = () => {
    authService.logout().catch(() => undefined);
    router.push("/login");
  };

  // Find Scheme by ID (from both central schemes and state subsidies)
  const allSchemes = [...CENTRAL_SCHEMES, ...GUJARAT_SUBSIDIES];
  const scheme = allSchemes.find((s) => s.id === schemeId);

  // Application Modal State
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Mock Form Fields
  const [applicantName, setApplicantName] = useState("Rajesh Patel");
  const [aadhaarNumber, setAadhaarNumber] = useState("5432-8765-0987");
  const [landArea, setLandArea] = useState("2.5");

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsApplyOpen(false);
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

  if (!scheme) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
        <LiveBreezeBackground />
        <header className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#0B0F14]/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Logo />
            <ThemeToggle />
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
          <div className="rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/30 p-4 h-16 w-16 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <Flag className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Scheme Not Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            The scheme ID or subsidy identifier you requested does not exist or has been archived. Check the list page to see all available schemes.
          </p>
          <Link href="/dashboard/schemes">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Government Schemes</span>
            </Button>
          </Link>
        </main>
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
              <Landmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-[#C9D1D9]">{scheme.govtType} Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            <Link
              href="/dashboard/schemes"
              className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap bg-emerald-600 text-white shadow-xs cursor-pointer"
            >
              <Flag className="h-4 w-4" />
              <span>Government Schemes & Subsidies</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
          <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/dashboard/schemes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Government Schemes
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate max-w-xs">
            {scheme.name.split(" (")[0]}
          </span>
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/dashboard/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Schemes Listing</span>
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Scheme Details Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header info card */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                  scheme.govtType === "Central"
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                    : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                }`}>
                  {scheme.govtType} Government Initiative
                </span>
                
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Last Updated: {scheme.lastUpdated}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {scheme.name}
              </h1>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-[#2A2F3A]/60">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Full Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C9D1D9] leading-relaxed font-medium">
                  {scheme.description}
                </p>
              </div>
            </div>

            {/* Scheme benefits & eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Benefits */}
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Key Benefits & Financial Aid</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] leading-relaxed font-medium">
                  {scheme.benefits}
                </p>
              </div>

              {/* Eligibility */}
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Eligibility Criteria</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] leading-relaxed font-medium">
                  {scheme.eligibility}
                </p>
              </div>
            </div>

            {/* Required Documents Card */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Required Documents Checklist</span>
              </h3>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-[#C9D1D9] font-medium">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Process Card */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Application Process & Guidelines</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#C9D1D9] leading-relaxed font-medium">
                {scheme.applicationProcess}
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Specs summary */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                Quick Portal Specs
              </h3>

              <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-[#C9D1D9]">
                {/* Subsidy Amt */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Subsidy Amount / Cap
                  </span>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    {scheme.subsidyAmount || "N/A"}
                  </p>
                </div>

                {/* Eligible Crops */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Eligible Crops
                  </span>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-normal">
                    {scheme.eligibleCrops.join(", ")}
                  </p>
                </div>

                {/* Helpline */}
                <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-[#2A2F3A]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                    Helpline Support Number
                  </span>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                    {scheme.helplineNumber}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-[#2A2F3A]">
                <Button
                  variant="primary"
                  className="w-full justify-center gap-2 font-bold text-sm shadow-md py-3"
                  onClick={() => setIsApplyOpen(true)}
                >
                  <span>Apply Now (DBT Gateway)</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 font-bold text-xs py-3 border-slate-200 dark:border-slate-800/40 text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-50 dark:hover:bg-[#1C212A]"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 space-y-3">
              <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Genuine Scheme Guarantee
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-emerald-100/70 leading-relaxed">
                This is a verified scheme from the official agricultural portals of the Government of India and the state Government of Gujarat. Double check application dates on the official portals before submitting physical land certificates.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Application Simulation Modal */}
      <AnimatePresence>
        {isApplyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-5 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsApplyOpen(false)}
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
                      Application Enrolled!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-xs mx-auto leading-relaxed">
                      Your eligibility data has been validated and dispatched to the official {scheme.govtType === "Central" ? "Central Agriculture Ministry" : "i-Khedut Gujarat"} registry.
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-2xl text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Application Reference No: KM-SCH-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      DBT Application Gateway
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      Enroll: {scheme.name.split(" (")[0]}
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
                      onClick={() => setIsApplyOpen(false)}
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
        © {new Date().getFullYear()} FasalDrishti AI. Kisan Call Helpline Support 1800-180-1551.
      </footer>
    </div>
  );
}
