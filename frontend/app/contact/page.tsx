import * as React from "react";
import { Navbar } from "../../components/layout/navbar";
import { Footer } from "../../components/layout/footer";
import { Container } from "../../components/layout/container";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <Container className="max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black text-slate-900">Get in Touch</h1>
            <p className="text-sm text-slate-600">Have questions about KrishiMitra AgriTech or extension services?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Support Contacts</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <span>Kisan Call Helpline: 1800-180-1551</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <span>support@krishimitra.agri</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Punjab Agricultural University Campus, Ludhiana</span>
                </div>
              </div>
            </div>
            <form className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <Input label="Full Name" placeholder="Rajesh Kumar" required />
              <Input label="Phone Number" placeholder="+91 98765 43210" required />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Message</label>
                <textarea rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" placeholder="Your inquiry..." />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                <Send className="h-4 w-4" /> Send Message
              </Button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}