import * as React from "react";
import { Navbar } from "../components/layout/navbar";
import { Hero } from "../components/landing/hero";
import { Features } from "../components/landing/features";
import { AIFeatures } from "../components/landing/ai-features";
import { HowItWorks } from "../components/landing/how-it-works";
import { Statistics } from "../components/landing/statistics";
import { Benefits } from "../components/landing/benefits";
import { Testimonials } from "../components/landing/testimonials";
import { FAQs } from "../components/landing/faqs";
import { CTA } from "../components/landing/cta";
import { Footer } from "../components/layout/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <AIFeatures />
        <HowItWorks />
        <Statistics />
        <Benefits />
        <Testimonials />
        <FAQs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}