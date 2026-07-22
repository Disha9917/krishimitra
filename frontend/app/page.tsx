import * as React from "react";
import { Navbar } from "../components/layout/navbar";
import { Hero } from "../components/landing/hero";
import { Features } from "../components/landing/features";
import { HowItWorks } from "../components/landing/how-it-works";
import { Statistics } from "../components/landing/statistics";
import { Benefits } from "../components/landing/benefits";
import { Testimonials } from "../components/landing/testimonials";
import { FAQs } from "../components/landing/faqs";
import { AboutSection } from "../components/landing/about-section";
import { ContactSection } from "../components/landing/contact-section";
import { CTA } from "../components/landing/cta";
import { Footer } from "../components/layout/footer";
import { LiveBreezeBackground } from "../components/landing/live-breeze-background";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      {/* Page-wide Swaying Farm Breeze Live Background (Option 3) */}
      <LiveBreezeBackground />

      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Statistics />
        <Benefits />
        <AboutSection />
        <Testimonials />
        <FAQs />
        <ContactSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}