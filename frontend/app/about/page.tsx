import * as React from "react";
import { Navbar } from "../../components/layout/navbar";
import { Footer } from "../../components/layout/footer";
import { Container } from "../../components/layout/container";
import { Sprout, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <Container className="space-y-8 max-w-4xl">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black text-slate-900">About KrishiMitra AI</h1>
            <p className="text-base text-slate-600">
              Precision Crop Advisory System & Post-Harvest Loss Reduction Planner for Smallholder Farmers.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm space-y-4 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
            <p>
              Smallholder farmers face unpredictable weather, pest infestations, and post-harvest crop degradation that severely impacts rural livelihoods. KrishiMitra AI delivers hyper-local precision advisories, 7-day micro-climate timelines, AI leaf disease vision models, and commercial Sell vs Store decisions to maximize farmer profitability.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}