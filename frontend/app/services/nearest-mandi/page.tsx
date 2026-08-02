"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { MapPin, Navigation, Clock, ChevronRight, CheckCircle, XCircle, Star, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

interface Mandi {
  name: string;
  region: string;
  regionKey: string;
  status: "Open" | "Closed";
  hours: string;
  isMain: boolean;
  mapsUrl: string;
}

const regions = [
  { key: "all", label: "All Regions" },
  { key: "kutch", label: "Kutch" },
  { key: "saurashtra", label: "Saurashtra" },
  { key: "north", label: "North Gujarat" },
  { key: "central", label: "Central Gujarat" },
  { key: "east", label: "East Gujarat" },
  { key: "south", label: "South Gujarat" },
];

const mandis: Mandi[] = [
  // ================= KUTCH REGION =================
  {
    name: "APMC Bhuj Main Yard",
    region: "Bhuj, Kachchh, Gujarat",
    regionKey: "kutch",
    status: "Open",
    hours: "7:00 AM – 5:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Bhuj+Kutch",
  },
  {
    name: "Anjar APMC",
    region: "Anjar, Kachchh, Gujarat",
    regionKey: "kutch",
    status: "Open",
    hours: "7:00 AM – 5:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Anjar+Kutch",
  },

  // ================= SAURASHTRA REGION =================
  // 1. Amreli
  {
    name: "Agricultural Produce Market Committee (APMC) Amreli",
    region: "Amreli, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Amreli",
  },
  {
    name: "APMC Rajula",
    region: "Rajula, Amreli, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Rajula",
  },
  // 2. Bhavnagar
  {
    name: "APMC Bhavnagar",
    region: "Bhavnagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Bhavnagar",
  },
  {
    name: "APMC Mahuva",
    region: "Mahuva, Bhavnagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Mahuva+Bhavnagar",
  },
  // 3. Botad
  {
    name: "APMC Botad",
    region: "Botad, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Botad",
  },
  {
    name: "APMC Gadhada",
    region: "Gadhada, Botad, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Gadhada",
  },
  // 4. Devbhumi Dwarka
  {
    name: "APMC Khambhalia",
    region: "Khambhalia, Devbhumi Dwarka, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Khambhalia",
  },
  {
    name: "APMC Jamjodhpur",
    region: "Jamjodhpur, Devbhumi Dwarka, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Jamjodhpur",
  },
  // 5. Gir Somnath
  {
    name: "APMC Veraval",
    region: "Veraval, Gir Somnath, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Veraval",
  },
  {
    name: "APMC Una",
    region: "Una, Gir Somnath, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Una+Gujarat",
  },
  // 6. Jamnagar
  {
    name: "APMC Jamnagar",
    region: "Jamnagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Jamnagar",
  },
  {
    name: "APMC Jamjodhpur",
    region: "Jamjodhpur, Jamnagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Jamjodhpur",
  },
  // 7. Junagadh
  {
    name: "APMC Junagadh",
    region: "Junagadh, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Junagadh",
  },
  {
    name: "APMC Manavadar",
    region: "Manavadar, Junagadh, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Manavadar",
  },
  // 8. Morbi
  {
    name: "APMC Morbi",
    region: "Morbi, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Morbi",
  },
  {
    name: "APMC Wankaner",
    region: "Wankaner, Morbi, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Wankaner",
  },
  // 9. Porbandar
  {
    name: "APMC Porbandar",
    region: "Porbandar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Porbandar",
  },
  {
    name: "APMC Kutiyana",
    region: "Kutiyana, Porbandar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Kutiyana",
  },
  // 10. Rajkot
  {
    name: "Rajkot Marketing Yard",
    region: "Rajkot, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=Rajkot+Marketing+Yard",
  },
  {
    name: "APMC Gondal",
    region: "Gondal, Rajkot, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Gondal",
  },
  // 11. Surendranagar
  {
    name: "APMC Wadhwan",
    region: "Wadhwan, Surendranagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Wadhwan",
  },
  {
    name: "APMC Dhrangadhra",
    region: "Dhrangadhra, Surendranagar, Gujarat",
    regionKey: "saurashtra",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Dhrangadhra",
  },

  // ================= NORTH GUJARAT REGION =================
  // 1. Aravalli
  {
    name: "APMC Modasa",
    region: "Modasa, Aravalli, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Modasa",
  },
  {
    name: "APMC Bayad",
    region: "Bayad, Aravalli, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Bayad",
  },
  // 2. Banaskantha
  {
    name: "APMC Deesa",
    region: "Deesa, Banaskantha, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Deesa",
  },
  {
    name: "APMC Palanpur",
    region: "Palanpur, Banaskantha, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Palanpur",
  },
  // 3. Gandhinagar
  {
    name: "APMC Gandhinagar",
    region: "Gandhinagar, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Gandhinagar",
  },
  {
    name: "APMC Kalol",
    region: "Kalol, Gandhinagar, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Kalol+Gujarat",
  },
  // 4. Mehsana
  {
    name: "APMC Unjha",
    region: "Unjha, Mehsana, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Unjha",
  },
  {
    name: "APMC Mehsana",
    region: "Mehsana, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Mehsana",
  },
  // 5. Patan
  {
    name: "APMC Patan",
    region: "Patan, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Patan+Gujarat",
  },
  {
    name: "APMC Siddhpur",
    region: "Siddhpur, Patan, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Siddhpur",
  },
  // 6. Sabarkantha
  {
    name: "APMC Himatnagar",
    region: "Himatnagar, Sabarkantha, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Himatnagar",
  },
  {
    name: "APMC Idar",
    region: "Idar, Sabarkantha, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Idar",
  },
  // 7. Vav-Tharad
  {
    name: "APMC Tharad",
    region: "Tharad, Vav-Tharad, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Tharad",
  },
  {
    name: "APMC Vav",
    region: "Vav, Vav-Tharad, Gujarat",
    regionKey: "north",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Vav+Banaskantha",
  },

  // ================= CENTRAL GUJARAT REGION =================
  // 1. Ahmedabad
  {
    name: "APMC Ahmedabad",
    region: "Ahmedabad, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Ahmedabad",
  },
  {
    name: "APMC Dholka",
    region: "Dholka, Ahmedabad, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Dholka",
  },
  // 2. Anand
  {
    name: "APMC Anand",
    region: "Anand, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Anand",
  },
  {
    name: "APMC Borsad",
    region: "Borsad, Anand, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Borsad",
  },
  // 3. Chhota Udepur
  {
    name: "APMC Chhota Udepur",
    region: "Chhota Udepur, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Chhota+Udepur",
  },
  {
    name: "APMC Bodeli",
    region: "Bodeli, Chhota Udepur, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Bodeli",
  },
  // 4. Kheda
  {
    name: "APMC Nadiad",
    region: "Nadiad, Kheda, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Nadiad",
  },
  {
    name: "APMC Kapadvanj",
    region: "Kapadvanj, Kheda, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Kapadvanj",
  },
  // 5. Mahisagar
  {
    name: "APMC Lunawada",
    region: "Lunawada, Mahisagar, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Lunawada",
  },
  {
    name: "APMC Balasinor",
    region: "Balasinor, Mahisagar, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Balasinor",
  },
  // 6. Panchmahal
  {
    name: "APMC Godhra",
    region: "Godhra, Panchmahal, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Godhra",
  },
  {
    name: "APMC Halol",
    region: "Halol, Panchmahal, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Halol",
  },
  // 7. Vadodara
  {
    name: "APMC Vadodara",
    region: "Vadodara, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Vadodara",
  },
  {
    name: "APMC Padra",
    region: "Padra, Vadodara, Gujarat",
    regionKey: "central",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Padra",
  },

  // ================= EAST GUJARAT REGION =================
  // 1. Dahod
  {
    name: "APMC Dahod Main Office",
    region: "Dahod, Gujarat",
    regionKey: "east",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Dahod",
  },
  {
    name: "APMC Limkheda",
    region: "Limkheda, Dahod, Gujarat",
    regionKey: "east",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Limkheda",
  },
  // 2. Narmada
  {
    name: "APMC Rajpipla",
    region: "Rajpipla, Narmada, Gujarat",
    regionKey: "east",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Rajpipla",
  },
  {
    name: "APMC Dediapada",
    region: "Dediapada, Narmada, Gujarat",
    regionKey: "east",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Dediapada",
  },

  // ================= SOUTH GUJARAT REGION =================
  // 1. Bharuch
  {
    name: "APMC Bharuch",
    region: "Bharuch, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Bharuch",
  },
  {
    name: "APMC Ankleshwar",
    region: "Ankleshwar, Bharuch, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Ankleshwar",
  },
  // 2. Dang
  {
    name: "APMC Ahwa",
    region: "Ahwa, Dang, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Ahwa",
  },
  {
    name: "APMC Waghai",
    region: "Waghai, Dang, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Waghai",
  },
  // 3. Navsari
  {
    name: "APMC Navsari",
    region: "Navsari, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Navsari",
  },
  {
    name: "APMC Chikhli",
    region: "Chikhli, Navsari, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Chikhli",
  },
  // 4. Surat
  {
    name: "APMC Surat",
    region: "Surat, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Surat",
  },
  {
    name: "APMC Bardoli",
    region: "Bardoli, Surat, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Bardoli",
  },
  // 5. Tapi
  {
    name: "APMC Vyara",
    region: "Vyara, Tapi, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Vyara",
  },
  {
    name: "APMC Songadh",
    region: "Songadh, Tapi, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Songadh",
  },
  // 6. Valsad
  {
    name: "APMC Valsad",
    region: "Valsad, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: true,
    mapsUrl: "https://maps.google.com/?q=APMC+Valsad",
  },
  {
    name: "APMC Dharampur",
    region: "Dharampur, Valsad, Gujarat",
    regionKey: "south",
    status: "Open",
    hours: "8:00 AM – 6:00 PM",
    isMain: false,
    mapsUrl: "https://maps.google.com/?q=APMC+Dharampur",
  },
];

export default function NearestMandiPage() {
  const [search, setSearch] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("all");
  const [onlyOpen, setOnlyOpen] = React.useState(false);

  const filtered = mandis.filter((m) => {
    const matchesRegion = selectedRegion === "all" || m.regionKey === selectedRegion;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.region.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = onlyOpen ? m.status === "Open" : true;
    return matchesRegion && matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-transparent">
          <Container className="text-center space-y-4 max-w-4xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">Services</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Nearest Mandi</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>APMC Market Locator</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight">
              Find Nearest Mandi Yard <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Gujarat APMC Markets</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Locate nearby APMC auction yards, check live operating hours, and get step-by-step navigation.
            </p>

            {/* Search & Filter bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mandi or district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${onlyOpen ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22] text-slate-600 dark:text-[#C9D1D9] border-emerald-200 dark:border-[#2A2F3A]"}`}
              >
                <CheckCircle className="h-3.5 w-3.5" /> Open Now Only
              </button>
            </div>

            {/* Region Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {regions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRegion(r.key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${selectedRegion === r.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white/80 dark:bg-[#161B22]/80 text-slate-600 dark:text-[#C9D1D9] border-emerald-100 dark:border-[#2A2F3A] hover:bg-emerald-50"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Mandi Cards */}
        <section className="py-12 sm:py-16 bg-transparent">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((m, i) => (
                <div key={i} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {m.isMain && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                            <Star className="h-3 w-3" /> Main Yard
                          </span>
                        )}
                        {m.status === "Open" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="h-3 w-3" /> Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3" /> Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">{m.region}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9]">
                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />{m.hours}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-50 dark:border-[#2A2F3A]/60">
                    <Link href={m.mapsUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white">
                        Get Map Directions <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
