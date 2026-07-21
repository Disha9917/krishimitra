"use client";

import * as React from "react";
import { Landmark, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function GovernmentSchemes() {
  const schemes = [
    {
      title: "PM-Kisan Samman Nidhi",
      code: "PM-KISAN",
      benefits: "₹6,000 / year direct income support transferred in 3 equal installments directly to bank account.",
      eligibility: "All smallholder & marginal farmer families owning cultivable land.",
      applyUrl: "/dashboard/reports",
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      code: "PMFBY",
      benefits: "Comprehensive crop insurance coverage against natural calamities, pests & diseases from pre-sowing to post-harvest.",
      eligibility: "Farmers growing notified crops in notified areas (2% premium for Kharif, 1.5% for Rabi).",
      applyUrl: "/dashboard/reports",
    },
    {
      title: "Pradhan Mantri Krishi Sinchayee Yojana",
      code: "PMKSY",
      benefits: "Up to 55% subsidy on Micro-Drip and Sprinkler irrigation systems ('Per Drop More Crop').",
      eligibility: "Farmers with verified water source & cultivable land ownership.",
      applyUrl: "/dashboard/reports",
    },
    {
      title: "Kisan Credit Card Scheme",
      code: "KCC",
      benefits: "Concessional credit up to ₹3.00 Lakhs @ 4% effective interest rate with prompt repayment incentive.",
      eligibility: "All farmers, tenant farmers, sharecroppers, and self-help groups.",
      applyUrl: "/dashboard/reports",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="mx-auto max-w-7xl px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
            Government Welfare Schemes
          </span>
          <h2 className="text-3xl sm:text-[48px] font-bold text-neutral-900 leading-[1.15] tracking-tight">
            Key Government Farming Schemes
          </h2>
          <p className="text-[18px] leading-[1.6] text-neutral-600">
            Access welfare subsidies, crop insurance, micro-irrigation grants, and credit cards directly through Krishi.
          </p>
        </div>

        {/* 4 Government Scheme Modern Cards (rounded-3xl shadow-xl border border-neutral-200 bg-white p-8) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schemes.map((s, idx) => (
            <div key={idx} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-indigo-100 p-3.5 text-indigo-700">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">{s.title}</h3>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                    {s.code}
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <span className="font-bold text-neutral-900 block mb-1">Scheme Benefits:</span>
                    <p className="text-neutral-600 leading-relaxed">{s.benefits}</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block mb-1">Eligibility Criteria:</span>
                    <p className="text-neutral-600 leading-relaxed">{s.eligibility}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href={s.applyUrl}>
                  <Button variant="outline" className="h-12 w-full rounded-full justify-between font-semibold border-neutral-300 text-neutral-900 hover:bg-[#ECFDF5] hover:text-[#16A34A] hover:border-[#16A34A]">
                    <span>Check Eligibility & Apply</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
