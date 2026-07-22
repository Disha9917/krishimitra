"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tractor, Warehouse, Landmark, MapPin, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  gradient: string;
}

function ServiceCard({ icon, title, description, buttonText, href, gradient }: ServiceCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl border border-emerald-100/70 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-emerald-950/20 hover:-translate-y-2 hover:border-emerald-300 dark:hover:border-emerald-500/30 flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        {/* Animated Gradient Icon Container */}
        <div
          className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md border border-white/10`}
        >
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-[#C9D1D9] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Link href={href} className="block w-full">
          <Button
            variant="outline"
            className="w-full text-sm font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 hover:bg-emerald-600 dark:bg-emerald-950/20 hover:text-white dark:hover:bg-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-emerald-500"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export function FarmerServices() {
  const services = [
    {
      icon: <Tractor className="h-7 w-7" />,
      title: "Tractor on Rent",
      description: "Find and rent tractors, harvesters, and farm equipment from nearby owners.",
      buttonText: "Explore Rentals",
      href: "/register",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Warehouse className="h-7 w-7" />,
      title: "Storage on Rent",
      description: "Book warehouses and cold storage facilities to reduce post-harvest losses.",
      buttonText: "Find Storage",
      href: "/dashboard/post-harvest",
      gradient: "from-amber-500 to-emerald-600",
    },
    {
      icon: <Landmark className="h-7 w-7" />,
      title: "Subsidies & Government Schemes",
      description: "Discover the latest agriculture subsidies and government schemes available for your location.",
      buttonText: "View Schemes",
      href: "/register",
      gradient: "from-blue-500 to-emerald-600",
    },
    {
      icon: <MapPin className="h-7 w-7" />,
      title: "Nearest Mandi",
      description: "Locate the nearest APMC mandi, compare prices, and get navigation assistance.",
      buttonText: "Find Mandi",
      href: "/dashboard/market-prices",
      gradient: "from-emerald-500 to-lime-600",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight leading-none">
            Farmer Services
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] font-medium max-w-2xl mx-auto">
            Everything a farmer needs in one intelligent platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              icon={service.icon}
              title={service.title}
              description={service.description}
              buttonText={service.buttonText}
              href={service.href}
              gradient={service.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
