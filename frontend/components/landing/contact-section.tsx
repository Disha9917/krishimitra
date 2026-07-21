"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-16 bg-transparent relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-[#161B22] px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-[#2A2F3A]">
            <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Reach Out To Us</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            Get In Touch
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#C9D1D9] max-w-2xl mx-auto leading-relaxed">
            Have questions about KrishiMitra AgriTech advisory, post-harvest features, or extension services?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Support Info Card */}
          <div className="space-y-6 rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Support & Helpline Contacts</h3>
              <div className="space-y-4 text-xs text-slate-700 dark:text-[#C9D1D9]">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] border border-emerald-100/60 dark:border-[#2A2F3A]">
                  <div className="rounded-xl bg-emerald-600 dark:bg-emerald-500 p-2 text-white shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">Kisan Call Helpline</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">1800-180-1551 (Toll Free)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] border border-emerald-100/60 dark:border-[#2A2F3A]">
                  <div className="rounded-xl bg-emerald-600 dark:bg-emerald-500 p-2 text-white shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">Email Support</p>
                    <p className="text-[11px] text-slate-600 dark:text-[#8B949E] mt-0.5">support@krishimitra.agri</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] border border-emerald-100/60 dark:border-[#2A2F3A]">
                  <div className="rounded-xl bg-emerald-600 dark:bg-emerald-500 p-2 text-white shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">Headquarters</p>
                    <p className="text-[11px] text-slate-600 dark:text-[#8B949E] mt-0.5">Punjab Agricultural University Campus, Ludhiana</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-[#8B949E] italic border-t border-slate-100 dark:border-[#2A2F3A] pt-3">
              Our AgriTech specialists respond to all farmer inquiries within 24 hours.
            </p>
          </div>

          {/* Interactive Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9]">
                  Thank you! Our agricultural extension team will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <Input label="Full Name" placeholder="Rajesh Kumar" required />
                <Input label="Phone Number" placeholder="+91 98765 43210" required />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-[#C9D1D9]">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8B949E] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Describe your query or crop inquiry..."
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full shadow-md">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
