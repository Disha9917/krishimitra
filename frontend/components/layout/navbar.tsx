"use client";

import * as React from "react";
import { Logo } from "../common/logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Tractor,
  Warehouse,
  Landmark,
  MapPin,
  TrendingUp,
  Snowflake,
  BookOpen,
  Map,
  Coins,
  ShieldCheck,
  Droplets,
  CreditCard,
  BadgeCheck,
  BarChart3,
  Database,
  Wrench,
  Sprout,
  Settings,
  Flag
} from "lucide-react";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = React.useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace("/#", "").replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const dropdownCategories = [
    {
      title: "Farm Equipment",
      emoji: "🚜",
      items: [
        { label: "Tractor on Rent", href: "/register", subtitle: "Find high-power tractors", icon: <Tractor className="h-4 w-4" /> },
        { label: "Rotavator on Rent", href: "/register", subtitle: "Soil preparation tools", icon: <Sprout className="h-4 w-4" /> },
        { label: "Harvester on Rent", href: "/register", subtitle: "Efficient harvest machinery", icon: <Wrench className="h-4 w-4" /> },
        { label: "Cultivator on Rent", href: "/register", subtitle: "Secondary tillage tools", icon: <Settings className="h-4 w-4" /> },
      ]
    },
    {
      title: "Storage & Warehousing",
      emoji: "🏢",
      items: [
        { label: "Storage on Rent", href: "/dashboard/post-harvest", subtitle: "Rent dry storage spaces", icon: <Warehouse className="h-4 w-4" /> },
        { label: "Cold Storage", href: "/dashboard/post-harvest", subtitle: "For perishable crops", icon: <Snowflake className="h-4 w-4" /> },
        { label: "Warehouse Booking", href: "/dashboard/post-harvest", subtitle: "Pre-book storage units", icon: <BookOpen className="h-4 w-4" /> },
        { label: "Grain Storage", href: "/dashboard/post-harvest", subtitle: "Silo and bag storage", icon: <Database className="h-4 w-4" /> },
      ]
    },
    {
      title: "Government Support",
      emoji: "🏛",
      items: [
        { label: "Government Subsidies", href: "/register", subtitle: "Claim financial aids", icon: <Landmark className="h-4 w-4" /> },
        { label: "Central Schemes", href: "/register", subtitle: "National welfare programs", icon: <Flag className="h-4 w-4" /> },
        { label: "State Schemes", href: "/register", subtitle: "Regional farming support", icon: <Map className="h-4 w-4" /> },
        { label: "PM Kisan", href: "/register", subtitle: "Direct income support", icon: <Coins className="h-4 w-4" /> },
        { label: "PMFBY", href: "/register", subtitle: "Fasal Bima Yojana", icon: <ShieldCheck className="h-4 w-4" /> },
        { label: "PMKSY", href: "/register", subtitle: "Krishi Sinchayee Yojana", icon: <Droplets className="h-4 w-4" /> },
        { label: "Kisan Credit Card", href: "/register", subtitle: "Easy credit line", icon: <CreditCard className="h-4 w-4" /> },
      ]
    },
    {
      title: "Market Services",
      emoji: "📍",
      items: [
        { label: "Nearest Mandi", href: "/dashboard/market-prices", subtitle: "Locate local APMC markets", icon: <MapPin className="h-4 w-4" /> },
        { label: "Live Mandi Prices", href: "/dashboard/market-prices", subtitle: "Real-time crop rates", icon: <TrendingUp className="h-4 w-4" /> },
        { label: "Best Market to Sell", href: "/dashboard/market-prices", subtitle: "Maximize your sale profits", icon: <BadgeCheck className="h-4 w-4" /> },
        { label: "Market Trends", href: "/dashboard/market-prices", subtitle: "Price forecast & analytics", icon: <BarChart3 className="h-4 w-4" /> },
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/70 dark:bg-[#0B0F14]/80 backdrop-blur-md shadow-xs transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-[#C9D1D9]">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>

          {/* Mega Menu Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none py-2">
              <span>Services</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 mt-1 w-[780px] origin-top bg-white/95 dark:bg-[#0B0F14]/95 backdrop-blur-md border border-emerald-100/80 dark:border-[#2A2F3A] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-emerald-950/20 p-6 z-50"
                >
                  <div className="grid grid-cols-2 gap-6">
                    {dropdownCategories.map((category) => (
                      <div key={category.title} className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-emerald-800 dark:text-emerald-400 border-b border-emerald-100 dark:border-[#2A2F3A] pb-2">
                          <span className="text-base">{category.emoji}</span>
                          <span>{category.title}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {category.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-[#161B22]/80 transition-all group"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all">
                                {item.icon}
                              </div>
                              <div className="space-y-0.5 text-left">
                                <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-[#8B949E] leading-normal font-medium">
                                  {item.subtitle}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/#about"
            onClick={(e) => handleNavClick(e, "/#about")}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            About
          </Link>

          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact")}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons & Hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-block">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register" className="hidden sm:inline-block">
            <Button variant="primary" size="sm">
              Register
            </Button>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#161B22] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 text-sm font-semibold">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Home
              </Link>

              {/* Mobile Services Accordion */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex w-full items-center justify-between py-2 text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
                >
                  <span>Services</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-4 border-l border-emerald-100 dark:border-[#2A2F3A] overflow-hidden mt-1"
                    >
                      {dropdownCategories.map((category) => (
                        <div key={category.title} className="space-y-2">
                          <p className="text-xs font-black tracking-wider uppercase text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                            <span className="text-sm">{category.emoji}</span>
                            <span>{category.title}</span>
                          </p>
                          <div className="grid grid-cols-1 gap-2 pl-2">
                            {category.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsMobileServicesOpen(false);
                                }}
                                className="flex items-center gap-2 py-1 text-xs text-slate-500 dark:text-[#8B949E] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              >
                                <span className="text-emerald-600 dark:text-emerald-400">{item.icon}</span>
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                About
              </Link>

              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-600 dark:text-[#C9D1D9] hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Contact
              </Link>

              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#2A2F3A] flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}