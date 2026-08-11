"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../components/common/logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { LiveBreezeBackground } from "../../components/landing/live-breeze-background";
import { authService } from "../../services/auth.service";
import { isApiError } from "../../services/api";
import { AlertBanner } from "../../components/feedback/alert-banner";
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Zap,
  Key,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Multilingual Dictionary (EN / HI / GU)
const translations = {
  en: {
    backToHome: "Back to KrishiMitra",
    titleMain: "AI Intelligence Tailored for",
    titleHighlight: "Smallholder Farmers",
    subtitle:
      "Log in to access your hyper-local micro-climate timelines, AI leaf disease diagnostics, and commercial Sell vs Store market insights.",
    stat1Title: "94.6% Disease Diagnosis Accuracy",
    stat1Sub: "Instant computer vision crop leaf scanning",
    stat2Title: "₹4.2 Crore Saved in Spoilage Loss",
    stat2Sub: "Predictive Sell vs Store commercial advisory",
    stat3Title: "7-Day Micro-Climate Timeline",
    stat3Sub: "Hyper-local sowing & spray schedule alerts",
    pauTag: "PAU Ludhiana Extension Network Integrated",
    cardTitle: "Farmer Sign In",
    cardSub: "Select your preferred authentication method",
    mobileOtpTab: "Mobile OTP",
    passwordTab: "Password",
    mobileLabel: "Mobile Number",
    mobileOrEmailLabel: "Mobile Number or Email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    sendOtpBtn: "Send OTP Code",
    signInBtn: "Sign In Now",
    authenticating: "Authenticating...",
    enterOtp: "Enter 5-Digit OTP Code",
    otpSentMsg: "✓ OTP code sent via SMS & WhatsApp",
    demoLoginBtn: "Instant Demo Account (1-Click Sign In)",
    successTitle: "Authentication Successful!",
    successSub: "Redirecting to KrishiMitra Farmer Portal...",
    noAccount: "Don't have an account?",
    registerAccount: "Register Farmer Account",
    helplineFooter: "© 2026 KrishiMitra AI. Kisan Call Helpline Support 1800-180-1551.",
  },
  hi: {
    backToHome: "कृषि मित्र मुख्य पृष्ठ पर लौटें",
    titleMain: "छोटे किसानों के लिए एआई आधारित",
    titleHighlight: "कृषि विशेषज्ञता",
    subtitle:
      "अपनी सूक्ष्म जलवायु समयसीमा, एआई फसल रोग निदान और बिक्री बनाम भंडारण सलाह के लिए लॉगिन करें।",
    stat1Title: "94.6% फसल रोग निदान सटीकता",
    stat1Sub: "त्वरित कंप्यूटर विज़न पत्ती रोग स्कैनिंग",
    stat2Title: "₹4.2 करोड़ की नुकसान से बचत",
    stat2Sub: "पूर्वानुमानित बिक्री बनाम भंडारण वाणिज्यिक सलाह",
    stat3Title: "7-दिवसीय सूक्ष्म-जलवायु समय-सारणी",
    stat3Sub: "स्थानीय बुवाई और छिड़काव समय सारणी अलर्ट",
    pauTag: "पीएयू लुधियाना नेटवर्क से एकीकृत",
    cardTitle: "किसान साइन-इन",
    cardSub: "अपनी पसंदीदा प्रमाणीकरण विधि चुनें",
    mobileOtpTab: "मोबाइल ओटीपी",
    passwordTab: "पासवर्ड",
    mobileLabel: "मोबाइल नंबर",
    mobileOrEmailLabel: "मोबाइल नंबर या ईमेल",
    passwordLabel: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    sendOtpBtn: "ओटीपी कोड भेजें",
    signInBtn: "अभी साइन-इन करें",
    authenticating: "सत्यापित हो रहा है...",
    enterOtp: "5-अंकों का ओटीपी दर्ज करें",
    otpSentMsg: "✓ ओटीपी कोड एसएमएस और व्हाट्सएप द्वारा भेजा गया",
    demoLoginBtn: "त्वरित डेमो खाता (1-क्लिक साइन इन)",
    successTitle: "प्रमाणीकरण सफल रहा!",
    successSub: "कृषि मित्र किसान पोर्टल पर रीडायरेक्ट किया जा रहा है...",
    noAccount: "खाता नहीं है?",
    registerAccount: "किसान खाता पंजीकृत करें",
    helplineFooter: "© 2026 कृषि मित्र एआई। किसान कॉल हेल्पलाइन सहायता 1800-180-1551।",
  },
  gu: {
    backToHome: "કૃષિમિત્ર મુખ્ય પૃષ્ઠ પર પાછા ફરો",
    titleMain: "નાના ખેડૂતો માટે એઆઈ આધારીત",
    titleHighlight: "કૃષિ સલાહકાર સેવાઓ",
    subtitle:
      "તમારી સ્થાનિક હવામાન સમયરેખા, એઆઈ પાક રોગ નિદાન અને વેચાણ વિ સ્ટોર સલાહ માટે લોગિન કરો.",
    stat1Title: "94.6% પાક રોગ નિદાન ચોકસાઈ",
    stat1Sub: "ત્વરિત કમ્પ્યુટર વિઝન પાંદડાના રોગનું સ્કેનિંગ",
    stat2Title: "₹4.2 કરોડ બગાડમાંથી બચત",
    stat2Sub: "અનુમાનિત વેચાણ વિ સ્ટોર વ્યાપારી સલાહ",
    stat3Title: "7-દિવસીય માઇક્રો-ક્લાઇમેટ સમયરેખા",
    stat3Sub: "સ્થાનિક વાવણી અને છંટકાવ શેડ્યૂલ એલર્ટ",
    pauTag: "પીએયુ લુધિયાણા નેટવર્ક સાથે સંકલિત",
    cardTitle: "ખેડૂત સાઇન-ઇન",
    cardSub: "તમારી પસંદગીની પ્રમાણીકરણ પદ્ધતિ પસંદ કરો",
    mobileOtpTab: "મોબાઇલ ઓટીપી",
    passwordTab: "પાસવર્ડ",
    mobileLabel: "મોબાઇલ નંબર",
    mobileOrEmailLabel: "મોબાઇલ નંબર અથવા ઇમેઇલ",
    passwordLabel: "પાસવર્ડ",
    forgotPassword: "પાસવર્ડ ભૂલી ગયા?",
    sendOtpBtn: "ઓટીપી કોડ મોકલો",
    signInBtn: "હમણાં સાઇન-ઇન કરો",
    authenticating: "પ્રમાણિત થઈ રહ્યું છે...",
    enterOtp: "5-અંકનો ઓટીપી દાખલ કરો",
    otpSentMsg: "✓ ઓટીપી કોડ એસએમએસ અને વોટ્સએપ દ્વારા મોકલવામાં આવ્યો",
    demoLoginBtn: "ત્વરિત ડેમો એકાઉન્ટ (1-ક્લિક સાઇન ઇન)",
    successTitle: "પ્રમાણીકરણ સફળ થયું!",
    successSub: "કૃષિમિત્ર ખેડૂત પોર્ટલ પર રીડાયરેક્ટ કરવામાં આવી રહ્યું છે...",
    noAccount: "એકાઉન્ટ નથી?",
    registerAccount: "ખેડૂત એકાઉન્ટ રજીસ્ટર કરો",
    helplineFooter: "© 2026 કૃષિમિત્ર એઆઈ. કિસાન કોલ હેલ્પલાઇન સપોર્ટ 1800-180-1551.",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "hi" | "gu">("en");

  const t = translations[language];

  const normalizeIdentifier = (value: string) => {
    const trimmed = value.trim();
    const compact = trimmed.replace(/[\s-]/g, "");
    // Only normalize phone numbers: strip the +91 country code or whitespace.
    if (/^\+?91\d{10}$/.test(compact)) return compact.replace(/^\+?91/, "");
    if (/^\d{10}$/.test(compact)) return compact;
    // Leave emails (and anything else) untouched so valid characters like _ + . - @ are preserved.
    return trimmed;
  };

  const redirectToDashboard = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  // 1-Click Demo Login: fills the password form with the demo account and submits it.
  const handleDemoLogin = () => {
    setLoginMethod("password");
    setOtpSent(false);
    setMobileNumber("9876543210");
    setPassword("Farmer2026#");
    setErrorMessage(null);
    setTimeout(() => {
      handleLoginWithPassword("9876543210", "Farmer2026#");
    }, 100);
  };

  const handleLoginWithPassword = async (identifier: string, passwordValue: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.login({ identifier, password: passwordValue });
      redirectToDashboard();
    } catch (error) {
      setErrorMessage(loginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithOtp = async (identifier: string, otpValue: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.login({ identifier, otp: otpValue });
      redirectToDashboard();
    } catch (error) {
      setErrorMessage(loginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (identifier: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.requestOtp({ identifier, channel: "sms", purpose: "login" });
      setOtpSent(true);
    } catch (error) {
      setErrorMessage(loginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loginErrorMessage = (error: unknown): string => {
    if (!isApiError(error)) return "Unable to reach the server. Please try again.";
    if (error.statusCode === 429) return "Too many attempts. Please wait a minute and try again.";
    if (error.statusCode === 422) {
      const first = Object.values(error.errors ?? {})[0];
      if (Array.isArray(first) && first.length > 0) return first[0];
      return "Invalid input. Please check your details.";
    }
    return error.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = normalizeIdentifier(mobileNumber);
    if (!identifier) {
      setErrorMessage("Please enter your mobile number or email.");
      return;
    }
    if (loginMethod === "otp") {
      if (!otpSent) {
        await handleRequestOtp(identifier);
        return;
      }
      if (!otpCode) {
        setErrorMessage("Please enter the OTP code.");
        return;
      }
      await handleLoginWithOtp(identifier, otpCode);
    } else {
      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }
      await handleLoginWithPassword(identifier, password);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col justify-between text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Live Breeze Background */}
      <LiveBreezeBackground />

      {/* Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white/70 dark:bg-[#161B22]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-100/80 dark:border-[#2A2F3A] shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToHome}</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher Button Group (EN / HI / GU) */}
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

      {/* Main Split Screen Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Brand & AgriTech Showcase (5 cols on LG) */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Logo className="justify-center lg:justify-start" />
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {t.titleMain}{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-400 bg-clip-text text-transparent">
                  {t.titleHighlight}
                </span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-[#C9D1D9] leading-relaxed max-w-md mx-auto lg:mx-0">
                {t.subtitle}
              </p>
            </div>

            {/* Feature Showcase Glass Cards */}
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/75 dark:bg-[#161B22]/85 backdrop-blur-md border border-emerald-100/80 dark:border-[#2A2F3A] shadow-xs">
                <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/60 p-2 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.stat1Title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8B949E]">{t.stat1Sub}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/75 dark:bg-[#161B22]/85 backdrop-blur-md border border-emerald-100/80 dark:border-[#2A2F3A] shadow-xs">
                <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/60 p-2 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.stat2Title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8B949E]">{t.stat2Sub}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/75 dark:bg-[#161B22]/85 backdrop-blur-md border border-emerald-100/80 dark:border-[#2A2F3A] shadow-xs">
                <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/60 p-2 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <CloudSun className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.stat3Title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8B949E]">{t.stat3Sub}</p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 dark:bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.pauTag}</span>
            </div>
          </div>

          {/* Right Column: Interactive Glass Login Portal (7 cols on LG) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md space-y-6 rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl transition-all">
              
              {/* Header inside Card */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 mb-1">
                  <Sprout className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.cardTitle}</h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">
                  {t.cardSub}
                </p>
              </div>

              {/* Login Method Tab Switcher */}
              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 dark:bg-[#111827] p-1 border border-slate-200/60 dark:border-[#2A2F3A]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp");
                    setOtpSent(false);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
                    loginMethod === "otp"
                      ? "bg-white dark:bg-[#161B22] text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-[#2A2F3A]"
                      : "text-slate-600 dark:text-[#8B949E] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>{t.mobileOtpTab}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setOtpSent(false);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
                    loginMethod === "password"
                      ? "bg-white dark:bg-[#161B22] text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-[#2A2F3A]"
                      : "text-slate-600 dark:text-[#8B949E] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>{t.passwordTab}</span>
                </button>
              </div>

              {/* Form Content */}
              {isSuccess ? (
                <div className="py-8 text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.successTitle}</h3>
                  <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">{t.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <AlertBanner type="error" title="Login failed" message={errorMessage} className="animate-fade-in" />
                  )}
                  <AnimatePresence mode="wait">
                    {loginMethod === "otp" ? (
                      <motion.div
                        key="otp-fields"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <Input
                          label={t.mobileLabel}
                          placeholder="+91 98765 43210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          required
                        />

                        {otpSent && (
                          <div className="space-y-1.5 animate-fade-in">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-[#C9D1D9]">
                              {t.enterOtp}
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder="55819"
                              required
                              className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] px-3.5 py-2 text-center text-lg tracking-widest font-black text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {t.otpSentMsg}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="password-fields"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <Input
                          label={t.mobileOrEmailLabel}
                          placeholder="+91 98765 43210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          required
                        />

                        <div className="space-y-1.5 relative">
                          <Input
                            label={t.passwordLabel}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="flex justify-end text-xs">
                          <Link
                            href="/forgot-password"
                            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            {t.forgotPassword}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">{t.authenticating}</span>
                    ) : loginMethod === "otp" && !otpSent ? (
                      <span className="flex items-center gap-2">
                        {t.sendOtpBtn} <ArrowRight className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t.signInBtn} <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  {/* Dedicated Demo Credentials Compartment Box */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/70 dark:bg-[#111827] p-3.5 space-y-2 text-xs text-slate-800 dark:text-[#C9D1D9]">
                    <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Key className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Demo Farmer Credentials</span>
                      </span>
                      <span className="rounded-full bg-emerald-200/70 dark:bg-emerald-900/50 px-2 py-0.5 text-[10px] text-emerald-900 dark:text-emerald-300 font-black uppercase">
                        Test Account
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium bg-white/80 dark:bg-[#161B22] p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A]">
                      <div>
                        <span className="text-slate-400 dark:text-[#8B949E] block text-[10px]">MOBILE</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">+91 98765 43210</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-[#8B949E] block text-[10px]">OTP CODE</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">55819</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-[#8B949E] block text-[10px]">PASSWORD</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">Farmer2026#</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Instant Demo Account Login Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/30 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60 transition-all"
                    >
                      <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      <span>{t.demoLoginBtn}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Card Footer */}
              <div className="text-center text-xs text-slate-600 dark:text-[#8B949E] pt-3 border-t border-slate-100 dark:border-[#2A2F3A]">
                {t.noAccount}{" "}
                <Link href="/register" className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline">
                  {t.registerAccount}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-20 text-center py-4 text-[11px] text-slate-500 dark:text-[#8B949E]">
        {t.helplineFooter}
      </footer>
    </div>
  );
}