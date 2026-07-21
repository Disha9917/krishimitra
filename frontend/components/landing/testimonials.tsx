import * as React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    { name: "Gurpreet Singh", location: "Ludhiana, Punjab", text: "The 7-day timeline and nitrogen advisory saved my wheat crop from heavy yellow rust during wet weather!" },
    { name: "Ramesh Patel", location: "Nashik, Maharashtra", text: "Post-Harvest loss planner helped me decide whether to store my onions or sell. Made ₹35,000 extra profit!" },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">Farmer Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-[#C9D1D9] italic leading-relaxed">"{r.text}"</p>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</h4>
                <p className="text-[10px] text-slate-400 dark:text-[#8B949E]">{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}