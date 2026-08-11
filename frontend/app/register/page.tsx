"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../components/common/logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { LiveBreezeBackground } from "../../components/landing/live-breeze-background";
import { GUJARAT_DISTRICT_ZONES } from "../../utils/constants";
import { RegionDistrictSelector } from "../../components/forms/region-district-selector";
import { authService } from "../../services/auth.service";
import { isApiError } from "../../services/api";
import { AlertBanner } from "../../components/feedback/alert-banner";
import {
  Sprout,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  User,
  Phone,
  Lock,
  Layers,
  Check,
  QrCode,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Multilingual Dictionary for Register Wizard (EN / HI / GU)
const translations = {
  en: {
    backToHome: "Back to KrishiMitra",
    heading: "Farmer Profile Registration",
    subheading: "Set up your personalized Gujarat AI Advisory profile in 3 simple steps",
    step1Title: "Personal Details",
    step2Title: "District & Crops",
    step3Title: "AI Kisan Digital ID",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address",
    mobileLabel: "Mobile Number",
    passwordLabel: "Password",
    pinCodeLabel: "PIN Code",
    selectDistrict: "Select Gujarat District Zone",
    landSizeLabel: "Farm Land Size (Acres):",
    selectedCropsLabel: "Selected Crops for your Zone:",
    nextBtn: "Next Step",
    prevBtn: "Previous",
    launchBtn: "Complete & Launch Dashboard",
    alreadyRegistered: "Already registered?",
    signInLink: "Sign In",
    passportHeader: "OFFICIAL KISAN DIGITAL ID",
    verifiedBadge: "PAU & AgriTech Certified Extension",
  },
  hi: {
    backToHome: "कृषि मित्र मुख्य पृष्ठ पर लौटें",
    heading: "किसान पंजीकरण",
    subheading: "3 सरल चरणों में अपना व्यक्तिगत गुजरात एआई सलाहकार प्रोफाइल सेट करें",
    step1Title: "व्यक्तिगत विवरण",
    step2Title: "ज़िला और फसलें",
    step3Title: "एआई किसान डिजिटल आईडी",
    fullNameLabel: "पूरा नाम",
    emailLabel: "ईमेल पता",
    mobileLabel: "मोबाइल नंबर",
    passwordLabel: "पासवर्ड",
    pinCodeLabel: "पिन कोड",
    selectDistrict: "गुजरात जिला क्षेत्र चुनें",
    landSizeLabel: "कृषि भूमि का आकार (एकड़):",
    selectedCropsLabel: "आपके क्षेत्र के लिए चयनित फसलें:",
    nextBtn: "अगला चरण",
    prevBtn: "पिछला",
    launchBtn: "पंजीकरण पूर्ण करें और डैशबोर्ड खोलें",
    alreadyRegistered: "पहले से पंजीकृत हैं?",
    signInLink: "साइन इन करें",
    passportHeader: "आधिकारिक किसान डिजिटल आईडी",
    verifiedBadge: "पीएयू और एग्रीटेक प्रमाणित एक्सटेंशन",
  },
  gu: {
    backToHome: "કૃષિમિત્ર મુખ્ય પૃષ્ઠ પર પાછા ફરો",
    heading: "ખેડૂત નોંધણી",
    subheading: "3 સરળ પગલાઓમાં તમારી વ્યક્તિગત ગુજરાત એઆઈ પ્રોફાઇલ સેટ કરો",
    step1Title: "વ્યક્તિગત વિગતો",
    step2Title: "જીલ્લો અને પાક",
    step3Title: "એઆઈ કિસાન આઈડી",
    fullNameLabel: "પૂરું નામ",
    emailLabel: "ઈમેલ સરનામું",
    mobileLabel: "મોબાઇલ નંબર",
    passwordLabel: "પાસવર્ડ",
    pinCodeLabel: "પિન કોડ",
    selectDistrict: "ગુજરાત જિલ્લો પસંદ કરો",
    landSizeLabel: "જમીનનું ક્ષેત્રફળ (એકર):",
    selectedCropsLabel: "તમારા વિસ્તાર માટે પસંદ કરેલા પાક:",
    nextBtn: "આગળનું પગલું",
    prevBtn: "પાછળ",
    launchBtn: "નોંધણી પૂર્ણ કરો અને ડેશબોર્ડ ખોલો",
    alreadyRegistered: "પહેલેથી જ નોંધાયેલ છો?",
    signInLink: "સાઇન ઇન કરો",
    passportHeader: "સત્તાવાર કિસાન ડિજિટલ આઈડી",
    verifiedBadge: "પીએયુ અને એગ્રીટેક પ્રમાણિત એક્સ્ટેંશન",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<"en" | "hi" | "gu">("en");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("central-gujarat");
  const [selectedDistrictId, setSelectedDistrictId] = useState("anand");
  const [landAcres, setLandAcres] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = translations[language];
  const selectedDistrict = GUJARAT_DISTRICT_ZONES.find((d) => d.id === selectedDistrictId) || GUJARAT_DISTRICT_ZONES[0];

  const normalizePhone = (value: string): string => {
    const compact = value.replace(/[\s-]/g, "").replace(/^\+/, "");
    if (/^91\d{10}$/.test(compact)) return compact.slice(2);
    return compact;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const phone = normalizePhone(mobileNumber);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      setIsLoading(false);
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(pinCode)) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({
        fullName,
        email: email.trim(),
        phone,
        password,
        pinCode,
        preferredLanguage: language,
        role: "farmer",
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      if (isApiError(error)) {
        const first = Object.values(error.errors ?? {})[0];
        setErrorMessage(Array.isArray(first) && first.length > 0 ? String(first[0]) : error.message);
      } else {
        setErrorMessage("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col justify-between text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Live Farm Breeze Canvas */}
      <LiveBreezeBackground />

      {/* Header Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white/70 dark:bg-[#161B22]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-100/80 dark:border-[#2A2F3A] shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToHome}</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-xl bg-white/70 dark:bg-[#161B22]/80 backdrop-blur-md p-1 border border-emerald-100/80 dark:border-[#2A2F3A] text-xs font-semibold text-slate-600 dark:text-[#C9D1D9]">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === "en" ? "bg-emerald-600 text-white shadow-xs font-bold" : "hover:text-emerald-600"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === "hi" ? "bg-emerald-600 text-white shadow-xs font-bold" : "hover:text-emerald-600"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage("gu")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === "gu" ? "bg-emerald-600 text-white shadow-xs font-bold" : "hover:text-emerald-600"
              }`}
            >
              ગુજરાતી
            </button>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Registration Wizard Container */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col justify-center items-center">
        
        {/* Wizard Card */}
        <div className="w-full space-y-6 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl transition-all">
          
          {/* Title Header */}
          <div className="text-center space-y-2">
            <Logo className="justify-center" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t.heading}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C9D1D9] max-w-md mx-auto">
              {t.subheading}
            </p>
          </div>

          {/* Gamified 3-Step Indicator Bar */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-6">
            <div className={`flex flex-col items-center gap-1.5 text-center ${currentStep >= 1 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${currentStep >= 1 ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 dark:bg-[#111827] text-slate-400"}`}>
                1
              </div>
              <span className="text-[11px] hidden sm:inline">{t.step1Title}</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 text-center ${currentStep >= 2 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${currentStep >= 2 ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 dark:bg-[#111827] text-slate-400"}`}>
                2
              </div>
              <span className="text-[11px] hidden sm:inline">{t.step2Title}</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 text-center ${currentStep >= 3 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${currentStep >= 3 ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 dark:bg-[#111827] text-slate-400"}`}>
                3
              </div>
              <span className="text-[11px] hidden sm:inline">{t.step3Title}</span>
            </div>
          </div>

          {/* Form Step Body */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Registration Successful!</h3>
              <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">Creating Kisan Profile & Launching Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              {errorMessage && (
                <AlertBanner type="error" title="Registration failed" message={errorMessage} className="animate-fade-in" />
              )}
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Personal & Mobile Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <Input
                      label={t.fullNameLabel}
                      placeholder="Rajesh Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <Input
                      label={t.emailLabel}
                      type="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      label={t.mobileLabel}
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                    <Input
                      label={t.passwordLabel}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Input
                      label={t.pinCodeLabel}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="382481"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      required
                    />
                  </motion.div>
                )}

                {/* STEP 2: District & Crop Configurator */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Region & District Selector */}
                    <div className="space-y-2">
                      <RegionDistrictSelector
                        selectedRegionId={selectedRegionId}
                        selectedDistrictId={selectedDistrictId}
                        onSelect={(regionId, districtId) => {
                          setSelectedRegionId(regionId);
                          setSelectedDistrictId(districtId);
                        }}
                      />
                    </div>

                    {/* Dedicated Crops Preview */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#C9D1D9]">
                        {t.selectedCropsLabel}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {selectedDistrict.crops.map((crop) => (
                          <div key={crop.name} className="p-2.5 rounded-xl bg-emerald-100/60 dark:bg-[#111827] border border-emerald-200/60 dark:border-[#2A2F3A] text-center">
                            <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{crop.name}</h5>
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{crop.match}% Match</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acreage Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-[#C9D1D9]">{t.landSizeLabel}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{landAcres} Acres</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={50}
                        value={landAcres}
                        onChange={(e) => setLandAcres(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: AI Digital Kisan ID Badge Preview */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Digital Kisan ID Card */}
                    <div className="rounded-3xl border border-emerald-300 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                      <div className="flex justify-between items-start border-b border-emerald-800/60 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase">
                            {t.passportHeader}
                          </span>
                          <h3 className="text-xl font-black">{fullName || "Rajesh Patel"}</h3>
                          <p className="text-xs text-emerald-200">KM-GUJ-2026-8841 • {selectedDistrict.name}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-2 text-slate-900 shrink-0 shadow-md">
                          <QrCode className="h-10 w-10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-emerald-400 block text-[10px]">REGISTERED CROPS</span>
                          <span className="font-bold">{selectedDistrict.crops.map((c) => c.name).join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 block text-[10px]">FARM ACREAGE</span>
                          <span className="font-bold">{landAcres} Acres ({selectedDistrict.zone})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-emerald-900/80 p-2.5 border border-emerald-700/50 text-xs font-semibold text-emerald-200">
                        <Award className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{t.verifiedBadge}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Wizard Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#2A2F3A]">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-xs"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>{t.prevBtn}</span>
                  </Button>
                ) : <div />}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="text-xs shadow-md"
                  >
                    <span>{t.nextBtn}</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                    className="shadow-xl"
                  >
                    {isLoading ? "Launching..." : t.launchBtn}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-600 dark:text-[#8B949E] pt-3 border-t border-slate-100 dark:border-[#2A2F3A]">
            {t.alreadyRegistered}{" "}
            <Link href="/login" className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline">
              {t.signInLink}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-20 text-center py-4 text-[11px] text-slate-500 dark:text-[#8B949E]">
        © {new Date().getFullYear()} KrishiMitra AI. Kisan Call Helpline Support 1800-180-1551.
      </footer>
    </div>
  );
}