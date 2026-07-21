import * as React from "react";

export function FAQs() {
  const faqs = [
    { q: "How are the confidence indicators calculated?", a: "Confidence ratings (High, Medium, Low) combine PIN code micro-climate weather history, soil satellite data, and model prediction probability scores." },
    { q: "How does the Sell / Store / Transport decision engine work?", a: "It factors in current APMC mandi prices, storage condition degradation rates, shelf life days remaining, and vehicle freight costs." },
    { q: "Can I receive alerts via WhatsApp and SMS?", a: "Yes! You can toggle instant SMS & WhatsApp alerts in your Alert Settings." },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs transition-all hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/40">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
              <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}