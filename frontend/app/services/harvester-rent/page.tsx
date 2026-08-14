"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { 
  Wrench, Star, MapPin, ChevronRight, Search, CheckCircle2, X, Plus, 
  Calendar, Clock, Edit2, Trash2, Check, ArrowRight, ArrowLeft, Filter, 
  Phone, Mail, Award, Key, Layers, BookOpen, AlertTriangle, ShieldCheck, 
  SlidersHorizontal, Info, ShieldAlert, Eye, Settings, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

// ===========================================================
// TYPES & INTERFACES
// ===========================================================

export interface HarvesterListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  harvesterType: "Combine" | "Mini Combine" | "Paddy Harvester" | "Sugarcane Harvester" | "Multi Crop Harvester" | string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  region: string;
  district: string;
  village: string;
  fullAddress: string;
  pricePerHour: number;
  pricePerDay: number;
  minHours: number;
  availableDays: string[];
  availableTiming: string;
  fuelType: string;
  workingWidth: string;
  capacity: string;
  supportedCrops: string[];
  description: string;
  image: string;
  registrationNumber: string;
  rcNumber?: string;
  status: "Pending" | "Approved" | "Rejected";
  availability: "Available" | "Booked";
  rating: number;
  isDraft?: boolean;
}

export interface HarvesterBooking {
  id: string;
  harvesterId: string;
  harvesterName: string;
  farmerName: string;
  mobile: string;
  region: string;
  district: string;
  village: string;
  farmAddress: string;
  cropToHarvest: string;
  harvestArea: number;
  date: string;
  time: string;
  acres: number;
  instructions?: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  timestamp: string;
}

// ===========================================================
// CONSTANTS & SEED DATA
// ===========================================================

const REGION_DISTRICT_MAP: Record<string, string[]> = {
  "Kutch": ["Kachchh"],
  "Saurashtra": [
    "Amreli", "Bhavnagar", "Botad", "Devbhumi Dwarka", "Gir Somnath", 
    "Jamnagar", "Junagadh", "Morbi", "Porbandar", "Rajkot", "Surendranagar"
  ],
  "North Gujarat": [
    "Aravalli", "Banaskantha", "Gandhinagar", "Mehsana", "Patan", "Sabarkantha", "Vav-Tharad"
  ],
  "Central Gujarat": [
    "Ahmedabad", "Anand", "Chhota Udepur", "Kheda", "Mahisagar", "Panchmahal", "Vadodara"
  ],
  "East Gujarat": [
    "Dahod", "Narmada"
  ],
  "South Gujarat": [
    "Bharuch", "Dang", "Navsari", "Surat", "Tapi", "Valsad"
  ]
};

const DEFAULT_HARVESTERS: HarvesterListing[] = [
  {
    id: "hv-1",
    brand: "John Deere",
    model: "S680",
    year: 2021,
    harvesterType: "Combine",
    ownerName: "Harvest Solutions Inc.",
    ownerMobile: "9812345670",
    ownerEmail: "info@harvestsolutions.com",
    region: "East Gujarat",
    district: "Dahod",
    village: "Devgadh Baria",
    fullAddress: "Main GIDC Area, Devgadh Baria, Dahod, Gujarat",
    pricePerHour: 2500,
    pricePerDay: 18000,
    minHours: 4,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    availableTiming: "06:00 AM - 08:00 PM",
    fuelType: "Diesel",
    workingWidth: "14 feet",
    capacity: "8 acres/hr",
    supportedCrops: ["Wheat", "Paddy", "Maize", "Soybean"],
    description: "High power John Deere combine harvester. Fast processing speed. Experienced operator included.",
    image: "johndeere",
    registrationNumber: "GJ-20-B-9988",
    rcNumber: "RC-99881023",
    status: "Approved",
    availability: "Available",
    rating: 4.9
  },
  {
    id: "hv-2",
    brand: "CLAAS",
    model: "Dominator 140",
    year: 2020,
    harvesterType: "Combine",
    ownerName: "GreenField Agro",
    ownerMobile: "9823456789",
    ownerEmail: "contact@greenfieldagro.in",
    region: "Kutch",
    district: "Kachchh",
    village: "Anjar",
    fullAddress: "Anjar-Mundra Highway, Near Toll Plaza, Kachchh, Gujarat",
    pricePerHour: 1800,
    pricePerDay: 13000,
    minHours: 4,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTiming: "07:00 AM - 07:00 PM",
    fuelType: "Diesel",
    workingWidth: "12 feet",
    capacity: "5 acres/hr",
    supportedCrops: ["Wheat", "Bajra", "Mustard", "Soybean"],
    description: "Compact combine harvester, ideal for small to medium farms. Operator included.",
    image: "claas",
    registrationNumber: "GJ-12-C-1294",
    rcNumber: "RC-12948382",
    status: "Approved",
    availability: "Available",
    rating: 4.7
  },
  {
    id: "hv-3",
    brand: "New Holland",
    model: "CX 880",
    year: 2022,
    harvesterType: "Multi Crop Harvester",
    ownerName: "FarmTech Services",
    ownerMobile: "9988776655",
    ownerEmail: "rentals@farmtech.com",
    region: "Central Gujarat",
    district: "Anand",
    village: "Khambhat",
    fullAddress: "Khambhat Port Road, Anand, Gujarat",
    pricePerHour: 2200,
    pricePerDay: 16000,
    minHours: 3,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availableTiming: "08:00 AM - 06:00 PM",
    fuelType: "Diesel",
    workingWidth: "13 feet",
    capacity: "6 acres/hr",
    supportedCrops: ["Wheat", "Paddy", "Maize", "Bajra", "Groundnut", "Tur"],
    description: "Multi-crop combine harvester with advanced grain cleaning system. Certified operator.",
    image: "newholland",
    registrationNumber: "GJ-23-M-7711",
    rcNumber: "RC-77118321",
    status: "Approved",
    availability: "Available",
    rating: 4.8
  },
  {
    id: "hv-4",
    brand: "Kubota",
    model: "DC 105",
    year: 2021,
    harvesterType: "Paddy Harvester",
    ownerName: "Rural Rentals",
    ownerMobile: "9876543210",
    ownerEmail: "ruralrentals@gmail.com",
    region: "North Gujarat",
    district: "Banaskantha",
    village: "Tharad",
    fullAddress: "Tharad GIDC Area, Banaskantha, Gujarat",
    pricePerHour: 1500,
    pricePerDay: 11000,
    minHours: 3,
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    availableTiming: "07:30 AM - 06:30 PM",
    fuelType: "Diesel",
    workingWidth: "10 feet",
    capacity: "4 acres/hr",
    supportedCrops: ["Paddy", "Wheat", "Soybean"],
    description: "Kubota paddy harvester. Crawlers track model. Suitable for wet muddy fields. Highly efficient.",
    image: "kubota",
    registrationNumber: "GJ-08-H-4451",
    rcNumber: "RC-44519284",
    status: "Approved",
    availability: "Booked",
    rating: 4.6
  },
  {
    id: "hv-5",
    brand: "Preet",
    model: "987",
    year: 2019,
    harvesterType: "Combine",
    ownerName: "Sardar Agro Rentals",
    ownerMobile: "9765432109",
    ownerEmail: "sardaragro@gmail.com",
    region: "South Gujarat",
    district: "Navsari",
    village: "Gandevi",
    fullAddress: "Gandevi Sugar Factory Road, Navsari, Gujarat",
    pricePerHour: 2000,
    pricePerDay: 14500,
    minHours: 4,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTiming: "08:00 AM - 08:00 PM",
    fuelType: "Diesel",
    workingWidth: "14 feet",
    capacity: "7 acres/hr",
    supportedCrops: ["Sugarcane", "Paddy", "Maize", "Soybean"],
    description: "Preet combine harvester. Heavy duty engine, perfect for sugarcane. Operator included.",
    image: "preet",
    registrationNumber: "GJ-21-E-9021",
    rcNumber: "RC-90218492",
    status: "Approved",
    availability: "Available",
    rating: 4.8
  }
];

const AVAILABLE_CROPS = [
  "Wheat", "Paddy", "Maize", "Bajra", "Groundnut", "Soybean", 
  "Cotton", "Sugarcane", "Mustard", "Castor", "Tur", "Other"
];

const HARVESTER_TYPES = [
  "Combine", "Mini Combine", "Paddy Harvester", "Sugarcane Harvester", "Multi Crop Harvester"
];

// ===========================================================
// PREMIUM SVG HARVESTER COMPONENT
// ===========================================================

const HarvesterImage = ({ brand, type, className = "w-full h-40" }: { brand: string; type: string; className?: string }) => {
  const colorMap: Record<string, { body: string; trim: string; accent: string }> = {
    "john deere": { body: "#15803D", trim: "#FACC15", accent: "#166534" },
    claas: { body: "#EA580C", trim: "#F8FAFC", accent: "#C2410C" },
    "new holland": { body: "#1D4ED8", trim: "#F8FAFC", accent: "#2563EB" },
    kubota: { body: "#EA580C", trim: "#1E293B", accent: "#F97316" },
    preet: { body: "#DC2626", trim: "#FEF2F2", accent: "#EF4444" },
  };

  const normalized = brand.toLowerCase();
  const colors = Object.keys(colorMap).find(k => normalized.includes(k))
    ? colorMap[Object.keys(colorMap).find(k => normalized.includes(k))!]
    : { body: "#065F46", trim: "#F59E0B", accent: "#047857" };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1E2530] dark:to-[#161B22] flex items-center justify-center p-4 border border-slate-200/50 dark:border-[#2A2F3A]/50 transition-all duration-300 group-hover:scale-[1.02] ${className}`}>
      <svg className="w-3/4 h-3/4 max-h-32 drop-shadow-lg" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="125" x2="190" y2="125" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="70" y="55" width="85" height="50" rx="6" fill={colors.body} />
        <path d="M70 55 H95 L110 80 H70 Z" fill="#1E293B" opacity="0.3" />
        <rect x="73" y="58" width="22" height="18" rx="2" fill="#BAE6FD" stroke="#475569" strokeWidth="1.5" />
        <circle cx="84" cy="67" r="2.5" fill="#1E293B" />
        <path d="M80 73 C80 70, 88 70, 88 73" fill="#1E293B" />
        <rect x="135" y="40" width="8" height="20" rx="1" fill="#334155" />
        <path d="M139 40 C139 35, 143 35, 142 32" stroke="#94A3B8" strokeWidth="1.5" className="animate-pulse" />
        <rect x="100" y="42" width="40" height="15" rx="3" fill={colors.accent} />
        <path d="M75 95 L40 108 H30 L45 90 Z" fill="#475569" />
        <circle cx="30" cy="108" r="14" fill="#334155" stroke={colors.trim} strokeWidth="2" />
        <circle cx="30" cy="108" r="3" fill="#94A3B8" />
        {Array.from({ length: 6 }).map((_, idx) => {
          const angle = (idx * 360) / 6;
          return (
            <line
              key={idx}
              x1="30"
              y1="108"
              x2={30 + 14 * Math.cos((angle * Math.PI) / 180)}
              y2={108 + 14 * Math.sin((angle * Math.PI) / 180)}
              stroke={colors.accent}
              strokeWidth="2.5"
            />
          );
        })}
        <path d="M125 55 L160 30 H175" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        {type && type.toLowerCase().includes("paddy") ? (
          <rect x="58" y="98" width="40" height="18" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="2" />
        ) : (
          <>
            <circle cx="75" cy="105" r="20" fill="#0F172A" stroke="#475569" strokeWidth="3" />
            <circle cx="75" cy="105" r="12" fill="#334155" />
            <circle cx="75" cy="105" r="6" fill={colors.trim} />
          </>
        )}
        <circle cx="138" cy="110" r="14" fill="#0F172A" stroke="#475569" strokeWidth="2.5" />
        <circle cx="138" cy="110" r="8" fill="#334155" />
        <circle cx="138" cy="110" r="4" fill={colors.trim} />
        <rect x="100" y="75" width="45" height="10" rx="2" fill={colors.trim} opacity="0.85" />
        <text x="103" y="83" fill="#1E293B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
          {brand.substring(0, 8).toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

// ===========================================================
// MAIN COMPONENT
// ===========================================================

export default function HarvesterRentPage() {
  const [isMounted, setIsMounted] = React.useState(false);

  // Core Marketplace State
  const [listings, setListings] = React.useState<HarvesterListing[]>([]);
  const [bookings, setBookings] = React.useState<HarvesterBooking[]>([]);
  const [activeTab, setActiveTab] = React.useState<"rent" | "list" | "admin">("rent");

  // Filters State
  const [search, setSearch] = React.useState("");
  const [filterRegion, setFilterRegion] = React.useState("all");
  const [filterDistrict, setFilterDistrict] = React.useState("all");
  const [filterVillage, setFilterVillage] = React.useState("all");
  const [filterBrand, setFilterBrand] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");
  const [filterPrice, setFilterPrice] = React.useState<number>(10000);
  const [filterCrops, setFilterCrops] = React.useState<string[]>([]);
  const [filterAvailability, setFilterAvailability] = React.useState("all");
  const [filterRating, setFilterRating] = React.useState<number>(0);

  // UI States
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);
  const [selectedHarvester, setSelectedHarvester] = React.useState<HarvesterListing | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = React.useState<string | null>(null);
  const [contactHarvester, setContactHarvester] = React.useState<HarvesterListing | null>(null);
  const [adminEditingHarvester, setAdminEditingHarvester] = React.useState<HarvesterListing | null>(null);

  // Multi-step Owner Form State
  const [formStep, setFormStep] = React.useState(1);
  const [ownerForm, setOwnerForm] = React.useState({
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    region: "",
    district: "",
    village: "",
    fullAddress: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    harvesterType: "Combine",
    registrationNumber: "",
    rcNumber: "",
    fuelType: "Diesel",
    workingWidth: "12 feet",
    capacity: "5 acres/hr",
    pricePerHour: 2000,
    pricePerDay: 15000,
    minHours: 4,
    availableDays: [] as string[],
    availableTiming: "07:00 AM - 07:00 PM",
    supportedCrops: [] as string[],
    description: "",
    imageFile: ""
  });

  // Sync state from localStorage
  React.useEffect(() => {
    setIsMounted(true);
    const storedListings = localStorage.getItem("fasaldrishti_harvester_listings");
    const storedBookings = localStorage.getItem("fasaldrishti_harvester_bookings");

    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      localStorage.setItem("fasaldrishti_harvester_listings", JSON.stringify(DEFAULT_HARVESTERS));
      setListings(DEFAULT_HARVESTERS);
    }

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveListingsToStorage = (updated: HarvesterListing[]) => {
    setListings(updated);
    localStorage.setItem("fasaldrishti_harvester_listings", JSON.stringify(updated));
  };

  const saveBookingsToStorage = (updated: HarvesterBooking[]) => {
    setBookings(updated);
    localStorage.setItem("fasaldrishti_harvester_bookings", JSON.stringify(updated));
  };

  // Reset Filters when Region/District changes to maintain consistency
  const handleRegionChange = (reg: string) => {
    setFilterRegion(reg);
    setFilterDistrict("all");
    setFilterVillage("all");
  };

  const handleDistrictChange = (dist: string) => {
    setFilterDistrict(dist);
    setFilterVillage("all");
  };

  // Get dynamic villages list based on selected Region + District
  const getAvailableVillages = () => {
    const subset = listings.filter(h => {
      const matchReg = filterRegion === "all" || h.region === filterRegion;
      const matchDist = filterDistrict === "all" || h.district === filterDistrict;
      return matchReg && matchDist && h.status === "Approved";
    });
    const unique = Array.from(new Set(subset.map(h => h.village)));
    return unique.filter(Boolean);
  };

  const getAvailableBrands = () => {
    const approvedList = listings.filter(h => h.status === "Approved");
    return Array.from(new Set(approvedList.map(h => h.brand))).filter(Boolean);
  };

  // Hierarchy filter implementation + general filters + search
  const filteredHarvesters = listings.filter((h) => {
    if (activeTab !== "admin" && h.status !== "Approved") return false;

    // Search matches Brand, Model, Owner, Village, District, Supported Crop
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      h.brand.toLowerCase().includes(searchLower) ||
      h.model.toLowerCase().includes(searchLower) ||
      h.ownerName.toLowerCase().includes(searchLower) ||
      h.village.toLowerCase().includes(searchLower) ||
      h.district.toLowerCase().includes(searchLower) ||
      h.supportedCrops.some(c => c.toLowerCase().includes(searchLower));

    // Hierarchical Location: Region -> District -> Village
    const matchesRegion = filterRegion === "all" || h.region === filterRegion;
    const matchesDistrict = filterDistrict === "all" || h.district === filterDistrict;
    const matchesVillage = filterVillage === "all" || h.village.toLowerCase() === filterVillage.toLowerCase();

    // Filters
    const matchesBrand = filterBrand === "all" || h.brand === filterBrand;
    const matchesType = filterType === "all" || h.harvesterType === filterType;
    const matchesPrice = h.pricePerHour <= filterPrice;
    
    // Supported Crops filter
    const matchesCrops = filterCrops.length === 0 || 
      filterCrops.every(c => h.supportedCrops.includes(c));

    const matchesAvailability = filterAvailability === "all" || h.availability === filterAvailability;
    const matchesRating = h.rating >= filterRating;

    return matchesSearch && matchesRegion && matchesDistrict && matchesVillage && 
      matchesBrand && matchesType && matchesPrice && matchesCrops && 
      matchesAvailability && matchesRating;
  });

  // Handle Booking Submit
  const handleBookingConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedHarvester) return;

    const data = new FormData(e.currentTarget);
    const bookingId = "KM-HV-" + Math.floor(10000 + Math.random() * 90000);
    const areaVal = Number(data.get("farmerAcres"));

    const newBooking: HarvesterBooking = {
      id: bookingId,
      harvesterId: selectedHarvester.id,
      harvesterName: `${selectedHarvester.brand} ${selectedHarvester.model}`,
      farmerName: data.get("farmerName") as string,
      mobile: data.get("farmerMobile") as string,
      region: data.get("farmerRegion") as string,
      district: data.get("farmerDistrict") as string,
      village: data.get("farmerVillage") as string,
      farmAddress: data.get("farmerAddress") as string,
      cropToHarvest: data.get("farmerCrop") as string,
      harvestArea: areaVal,
      date: data.get("farmerDate") as string,
      time: data.get("farmerTime") as string,
      acres: areaVal, // Duplicate field as per prompt specification
      instructions: data.get("farmerNotes") as string,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookingsToStorage(updatedBookings);

    // Toggle harvester availability to Booked
    const updatedListings = listings.map(h => 
      h.id === selectedHarvester.id ? { ...h, availability: "Booked" as const } : h
    );
    saveListingsToStorage(updatedListings);

    setBookingSuccessId(bookingId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOwnerForm(prev => ({ ...prev, imageFile: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishHarvester = (isDraft: boolean) => {
    const newId = "hv-" + (listings.length + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
    const newListing: HarvesterListing = {
      id: newId,
      brand: ownerForm.brand || "John Deere",
      model: ownerForm.model || "Harvest Max",
      year: Number(ownerForm.year),
      harvesterType: ownerForm.harvesterType,
      ownerName: ownerForm.ownerName,
      ownerMobile: ownerForm.ownerMobile,
      ownerEmail: ownerForm.ownerEmail,
      region: ownerForm.region,
      district: ownerForm.district,
      village: ownerForm.village,
      fullAddress: ownerForm.fullAddress,
      pricePerHour: Number(ownerForm.pricePerHour),
      pricePerDay: Number(ownerForm.pricePerDay),
      minHours: Number(ownerForm.minHours),
      availableDays: ownerForm.availableDays.length > 0 ? ownerForm.availableDays : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      availableTiming: ownerForm.availableTiming,
      fuelType: ownerForm.fuelType,
      workingWidth: ownerForm.workingWidth || "12 feet",
      capacity: ownerForm.capacity || "5 acres/hr",
      supportedCrops: ownerForm.supportedCrops.length > 0 ? ownerForm.supportedCrops : ["Wheat", "Paddy"],
      description: ownerForm.description || "High efficiency crop harvester available for seasonal harvest.",
      image: ownerForm.imageFile || "default",
      registrationNumber: ownerForm.registrationNumber || "GJ-XX-XXXX",
      rcNumber: ownerForm.rcNumber,
      status: isDraft ? "Pending" : "Approved",
      availability: "Available",
      rating: 5.0,
      isDraft: isDraft
    };

    const updated = [newListing, ...listings];
    saveListingsToStorage(updated);

    // Reset Form
    setOwnerForm({
      ownerName: "",
      ownerMobile: "",
      ownerEmail: "",
      region: "",
      district: "",
      village: "",
      fullAddress: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      harvesterType: "Combine",
      registrationNumber: "",
      rcNumber: "",
      fuelType: "Diesel",
      workingWidth: "12 feet",
      capacity: "5 acres/hr",
      pricePerHour: 2000,
      pricePerDay: 15000,
      minHours: 4,
      availableDays: [],
      availableTiming: "07:00 AM - 07:00 PM",
      supportedCrops: [],
      description: "",
      imageFile: ""
    });
    setFormStep(1);
    
    // Switch to Rent Tab to see the listed harvester
    setActiveTab("rent");

    // Focus filters on the new harvester location
    setFilterRegion(newListing.region);
    setFilterDistrict(newListing.district);
    setFilterVillage(newListing.village);
  };

  // Admin Controls
  const handleAdminApprove = (id: string) => {
    const updated = listings.map(h => h.id === id ? { ...h, status: "Approved" as const } : h);
    saveListingsToStorage(updated);
  };

  const handleAdminReject = (id: string) => {
    const updated = listings.map(h => h.id === id ? { ...h, status: "Rejected" as const } : h);
    saveListingsToStorage(updated);
  };

  const handleAdminDelete = (id: string) => {
    const updated = listings.filter(h => h.id !== id);
    saveListingsToStorage(updated);
  };

  const handleAdminToggleAvailability = (id: string) => {
    const updated = listings.map(h => {
      if (h.id === id) {
        return { 
          ...h, 
          availability: h.availability === "Available" ? ("Booked" as const) : ("Available" as const) 
        };
      }
      return h;
    });
    saveListingsToStorage(updated);
  };

  const handleAdminSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminEditingHarvester) return;

    const data = new FormData(e.currentTarget);
    const updated = listings.map(h => {
      if (h.id === adminEditingHarvester.id) {
        return {
          ...h,
          brand: data.get("brand") as string,
          model: data.get("model") as string,
          harvesterType: data.get("harvesterType") as string,
          pricePerHour: Number(data.get("pricePerHour")),
          pricePerDay: Number(data.get("pricePerDay")),
          availability: data.get("availability") as "Available" | "Booked",
          status: data.get("status") as "Pending" | "Approved" | "Rejected",
          region: data.get("region") as string,
          district: data.get("district") as string,
          village: data.get("village") as string
        };
      }
      return h;
    });
    saveListingsToStorage(updated);
    setAdminEditingHarvester(null);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14] flex flex-col items-center justify-center text-emerald-400">
        <RefreshCw className="h-10 w-10 animate-spin" />
        <span className="mt-4 text-xs font-bold tracking-wider">LOADING MARKETPLACE...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col pb-20">
        {/* Marketplace Banner */}
        <section className="py-12 bg-transparent">
          <Container className="text-center space-y-4 max-w-4xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">Services</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Harvester Rental Marketplace</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gujarat's Season Harvesting Hub</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight leading-tight">
              Harvester Rental <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Marketplace</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Rent high-capacity combine harvesters directly from certified owners near you, or list your harvester to earn seasonal revenue.
            </p>

            {/* TAB SELECT SWITCHER */}
            <div className="pt-6 flex justify-center">
              <div className="inline-flex rounded-2xl bg-white/70 dark:bg-[#161B22]/80 p-1.5 border border-emerald-100 dark:border-[#2A2F3A] backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("rent")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "rent" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Wrench className="h-4 w-4" />
                  Rent a Harvester
                </button>
                <button
                  onClick={() => { setActiveTab("list"); setFormStep(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "list" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Plus className="h-4 w-4" />
                  List Your Harvester
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* ===========================================================
            TAB 1: RENT A HARVESTER
            =========================================================== */}
        {activeTab === "rent" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-7xl">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* SIDEBAR FILTERS (DESKTOP) */}
                <div className="hidden lg:flex flex-col w-80 shrink-0 bg-white/80 dark:bg-[#161B22]/95 border border-emerald-100/80 dark:border-[#2A2F3A] rounded-3xl p-6 space-y-6 backdrop-blur-md sticky top-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white">
                      <SlidersHorizontal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Filter Listings
                    </h3>
                    <button 
                      onClick={() => {
                        setFilterRegion("all");
                        setFilterDistrict("all");
                        setFilterVillage("all");
                        setFilterBrand("all");
                        setFilterType("all");
                        setFilterPrice(10000);
                        setFilterCrops([]);
                        setFilterAvailability("all");
                        setFilterRating(0);
                        setSearch("");
                      }}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Search Bar inside Filters */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Search Keywords</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Brand, model, owner, crop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Hierarchical Location Filter */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Region</label>
                      <select 
                        value={filterRegion} 
                        onChange={(e) => handleRegionChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="all">All Regions</option>
                        {Object.keys(REGION_DISTRICT_MAP).map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">District</label>
                      <select
                        value={filterDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        disabled={filterRegion === "all"}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        <option value="all">All Districts</option>
                        {filterRegion !== "all" && REGION_DISTRICT_MAP[filterRegion]?.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Village</label>
                      <select
                        value={filterVillage}
                        onChange={(e) => setFilterVillage(e.target.value)}
                        disabled={filterDistrict === "all"}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        <option value="all">All Villages</option>
                        {filterDistrict !== "all" && getAvailableVillages().map(vil => (
                          <option key={vil} value={vil}>{vil}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Harvester Brand */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Brand</label>
                    <select
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs"
                    >
                      <option value="all">All Brands</option>
                      {getAvailableBrands().map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Harvester Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Harvester Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs"
                    >
                      <option value="all">All Types</option>
                      {HARVESTER_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price range */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-black uppercase text-slate-400 dark:text-[#8B949E]">Max Price (hr)</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">₹{filterPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="100"
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Min Owner Rating</label>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs"
                    >
                      <option value="0">Show All Ratings</option>
                      <option value="4">4.0+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.8">4.8+ Stars</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Availability</label>
                    <select
                      value={filterAvailability}
                      onChange={(e) => setFilterAvailability(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs"
                    >
                      <option value="all">All</option>
                      <option value="Available">Available Now</option>
                      <option value="Booked">Currently Booked</option>
                    </select>
                  </div>

                  {/* Crop Compatibility */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Crop Compatibility</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_CROPS.slice(0, 10).map(c => {
                        const isSelected = filterCrops.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => {
                              if (isSelected) {
                                setFilterCrops(prev => prev.filter(x => x !== c));
                              } else {
                                setFilterCrops(prev => [...prev, c]);
                              }
                            }}
                            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${isSelected ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-600 dark:text-[#8B949E]"}`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* MAIN GRID SECTION */}
                <div className="flex-1 w-full space-y-6">
                  {/* Mobile Filters Header */}
                  <div className="flex lg:hidden items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search harvesters, owners, locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setShowFiltersMobile(true)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-emerald-100 dark:border-[#2A2F3A] text-slate-600 dark:text-[#C9D1D9] flex items-center justify-center"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>

                  {/* ACTIVE FILTERS CHIPS */}
                  {(filterRegion !== "all" || filterDistrict !== "all" || filterVillage !== "all" || filterBrand !== "all" || filterType !== "all" || filterCrops.length > 0) && (
                    <div className="flex flex-wrap gap-2 items-center bg-emerald-50/50 dark:bg-[#161B22]/30 p-3 rounded-2xl border border-emerald-100/50 dark:border-[#2A2F3A]/50">
                      <span className="text-[10px] font-black text-slate-400 dark:text-[#8B949E] uppercase tracking-wider mr-1">Active:</span>
                      {filterRegion !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterRegion}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleRegionChange("all")} />
                        </span>
                      )}
                      {filterDistrict !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterDistrict}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleDistrictChange("all")} />
                        </span>
                      )}
                      {filterVillage !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterVillage}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterVillage("all")} />
                        </span>
                      )}
                      {filterBrand !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterBrand}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterBrand("all")} />
                        </span>
                      )}
                      {filterType !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterType}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterType("all")} />
                        </span>
                      )}
                      {filterCrops.map(c => (
                        <span key={c} className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {c}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterCrops(prev => prev.filter(x => x !== c))} />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Listings Summary */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8B949E]">
                    <p>Showing <span className="font-extrabold text-slate-800 dark:text-white">{filteredHarvesters.length}</span> harvesters matching your criteria</p>
                    {filterRegion !== "all" && <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> Browsing: {filterRegion} {filterDistrict !== "all" ? `→ ${filterDistrict}` : ""} {filterVillage !== "all" ? `→ ${filterVillage}` : ""}</p>}
                  </div>

                  {/* HARVESTER GRID */}
                  {filteredHarvesters.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-emerald-200 dark:border-[#2A2F3A] bg-white/40 dark:bg-[#161B22]/30 p-12 text-center space-y-4">
                      <Wrench className="h-12 w-12 text-slate-400 mx-auto" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">No Harvesters Listed in this Location</h4>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-sm mx-auto">
                        We couldn't find any harvesters listed under the selected filters. Expand your filters or choose "All Regions" to explore.
                      </p>
                      <button
                        onClick={() => {
                          setFilterRegion("all");
                          setFilterDistrict("all");
                          setFilterVillage("all");
                          setFilterBrand("all");
                          setFilterType("all");
                          setFilterPrice(10000);
                          setFilterCrops([]);
                          setFilterAvailability("all");
                          setFilterRating(0);
                        }}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
                      >
                        Reset Location & Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredHarvesters.map((h) => (
                        <div 
                          key={h.id} 
                          className="group rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            
                            {/* Harvester Illustration */}
                            {h.image && h.image.startsWith("data:image") ? (
                              <div className="relative w-full h-40 overflow-hidden rounded-2xl border border-slate-200/50 dark:border-[#2A2F3A]/50 bg-slate-100 dark:bg-[#1E2530] flex items-center justify-center">
                                <img src={h.image} alt={h.brand} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                              </div>
                            ) : (
                              <HarvesterImage brand={h.brand} type={h.harvesterType} className="w-full h-40" />
                            )}

                            {/* Badges & Status */}
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-800/30 uppercase tracking-wider">
                                {h.harvesterType} • {h.fuelType}
                              </span>
                              {h.availability === "Available" ? (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                              ) : (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">Booked</span>
                              )}
                            </div>

                            {/* Brand, Model */}
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                  {h.brand} <span className="font-medium text-slate-500 dark:text-[#8B949E] text-sm">{h.model}</span>
                                </h3>
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md shrink-0">
                                  {h.capacity}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1 font-medium flex items-center gap-1">
                                <Award className="h-3 w-3 text-amber-500" />
                                Owner: {h.ownerName}
                              </p>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9] border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="truncate">{h.village}, {h.district} ({h.region})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span>{h.rating.toFixed(1)} rating ({h.workingWidth} width)</span>
                              </div>
                              
                              {/* Supported Crops Badges */}
                              {h.supportedCrops.length > 0 && (
                                <div className="pt-1.5 flex flex-wrap gap-1">
                                  {h.supportedCrops.map(crop => (
                                    <span key={crop} className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-[#1E2530] text-slate-600 dark:text-[#8B949E] border border-slate-200/40 dark:border-[#2A2F3A]/40">
                                      {crop}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Pricing & Call-to-actions */}
                          <div className="pt-3 border-t border-emerald-50 dark:border-[#2A2F3A]/60 flex flex-col gap-2">
                            <div className="flex items-baseline justify-between">
                              <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">
                                Min Booking: <span className="font-extrabold text-slate-700 dark:text-white">{h.minHours} hrs</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-extrabold text-slate-900 dark:text-white">₹{h.pricePerHour}/hr</div>
                                <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">₹{h.pricePerDay}/day</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => setContactHarvester(h)}
                              >
                                <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                Contact
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-xs font-black shadow-sm"
                                disabled={h.availability !== "Available"}
                                onClick={() => setSelectedHarvester(h)}
                              >
                                Book Now
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}


                </div>

              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            TAB 2: LIST YOUR HARVESTER (MULTI-STEP WIZARD)
            =========================================================== */}
        {activeTab === "list" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-xl">
              <div className="bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md border border-emerald-100 dark:border-[#2A2F3A] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                
                {/* Wizard Header Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#8B949E]">
                    <span className="uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Step {formStep} of 5</span>
                    <span>{Math.round((formStep / 5) * 100)}% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#0B0F14] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300"
                      style={{ width: `${(formStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* STEP Titles */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {formStep === 1 && "Owner Contact Details"}
                    {formStep === 2 && "Harvester Location"}
                    {formStep === 3 && "Harvester Specifications"}
                    {formStep === 4 && "Rental Details & Slots"}
                    {formStep === 5 && "Supported Crops & Images"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">
                    {formStep === 1 && "Provide contact info so nearby farmers can reach you."}
                    {formStep === 2 && "Where is your machine parked? This determines visibility in regional filters."}
                    {formStep === 3 && "Enter detailed specs of your harvester so farmers get standard data."}
                    {formStep === 4 && "Define your rental pricing model, minimum requirements, and time availability."}
                    {formStep === 5 && "Check off compatibility crops, upload images, and add description details."}
                  </p>
                </div>

                {/* FORM FIELDS */}
                <div className="space-y-4 text-xs">
                  
                  {/* STEP 1: OWNER INFO */}
                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Owner Name <span className="text-rose-500">*</span></label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Ramesh Bhai Patel"
                          value={ownerForm.ownerName}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerName: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Mobile Number <span className="text-rose-500">*</span></label>
                        <input
                          required
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={ownerForm.ownerMobile}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerMobile: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. ramesh.patel@gmail.com"
                          value={ownerForm.ownerEmail}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerEmail: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: LOCATION */}
                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Region <span className="text-rose-500">*</span></label>
                        <select
                          required
                          value={ownerForm.region}
                          onChange={(e) => setOwnerForm({ ...ownerForm, region: e.target.value, district: "", village: "" })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs focus:outline-none"
                        >
                          <option value="">Select Region</option>
                          {Object.keys(REGION_DISTRICT_MAP).map(reg => (
                            <option key={reg} value={reg}>{reg}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">District <span className="text-rose-500">*</span></label>
                        <select
                          required
                          disabled={!ownerForm.region}
                          value={ownerForm.district}
                          onChange={(e) => setOwnerForm({ ...ownerForm, district: e.target.value, village: "" })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs focus:outline-none disabled:opacity-50"
                        >
                          <option value="">Select District</option>
                          {ownerForm.region && REGION_DISTRICT_MAP[ownerForm.region]?.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Village <span className="text-rose-500">*</span></label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Chikhli"
                          value={ownerForm.village}
                          onChange={(e) => setOwnerForm({ ...ownerForm, village: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Full Address <span className="text-rose-500">*</span></label>
                        <textarea
                          required
                          rows={3}
                          placeholder="E.g., Near GIDC Area, Main Highway, Gandevi, Gujarat"
                          value={ownerForm.fullAddress}
                          onChange={(e) => setOwnerForm({ ...ownerForm, fullAddress: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white resize-none focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SPECIFICATIONS */}
                  {formStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Brand <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={ownerForm.brand}
                            onChange={(e) => setOwnerForm({ ...ownerForm, brand: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs focus:outline-none"
                          >
                            <option value="">Select Brand</option>
                            <option value="John Deere">John Deere</option>
                            <option value="CLAAS">CLAAS</option>
                            <option value="New Holland">New Holland</option>
                            <option value="Kubota">Kubota</option>
                            <option value="Preet">Preet</option>
                            <option value="Kartar">Kartar</option>
                            <option value="Swaraj">Swaraj</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Model <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. S680 / DC 105"
                            value={ownerForm.model}
                            onChange={(e) => setOwnerForm({ ...ownerForm, model: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Harvester Type <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={ownerForm.harvesterType}
                            onChange={(e) => setOwnerForm({ ...ownerForm, harvesterType: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs focus:outline-none"
                          >
                            {HARVESTER_TYPES.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Manufacturing Year <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="number"
                            min="2010"
                            max={new Date().getFullYear()}
                            value={ownerForm.year}
                            onChange={(e) => setOwnerForm({ ...ownerForm, year: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Working Width <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 14 feet"
                            value={ownerForm.workingWidth}
                            onChange={(e) => setOwnerForm({ ...ownerForm, workingWidth: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Capacity (Acres per Hour) <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 5 acres/hr"
                            value={ownerForm.capacity}
                            onChange={(e) => setOwnerForm({ ...ownerForm, capacity: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Registration Number <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. GJ-21-E-9021"
                            value={ownerForm.registrationNumber}
                            onChange={(e) => setOwnerForm({ ...ownerForm, registrationNumber: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Fuel Type <span className="text-rose-500">*</span></label>
                          <select
                            value={ownerForm.fuelType}
                            onChange={(e) => setOwnerForm({ ...ownerForm, fuelType: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs focus:outline-none"
                          >
                            <option value="Diesel">Diesel</option>
                            <option value="CNG">CNG</option>
                            <option value="Electric">Electric</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">RC Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="Registration Certificate code"
                          value={ownerForm.rcNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, rcNumber: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: RENTAL DETAILS */}
                  {formStep === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Price per Hour (₹) <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="number"
                            min="500"
                            max="20000"
                            value={ownerForm.pricePerHour}
                            onChange={(e) => setOwnerForm({ ...ownerForm, pricePerHour: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Price per Day (₹) <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="number"
                            min="2000"
                            max="100000"
                            value={ownerForm.pricePerDay}
                            onChange={(e) => setOwnerForm({ ...ownerForm, pricePerDay: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Min Rental Hours <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="number"
                            min="1"
                            max="24"
                            value={ownerForm.minHours}
                            onChange={(e) => setOwnerForm({ ...ownerForm, minHours: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Available Time Slots <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 06:00 AM - 08:00 PM"
                            value={ownerForm.availableTiming}
                            onChange={(e) => setOwnerForm({ ...ownerForm, availableTiming: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Available Days <span className="text-rose-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                            const isSelected = ownerForm.availableDays.includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => {
                                  if (isSelected) {
                                    setOwnerForm({
                                      ...ownerForm,
                                      availableDays: ownerForm.availableDays.filter(d => d !== day)
                                    });
                                  } else {
                                    setOwnerForm({
                                      ...ownerForm,
                                      availableDays: [...ownerForm.availableDays, day]
                                    });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-600 dark:text-[#8B949E]"}`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: CROPS & UPLOADS */}
                  {formStep === 5 && (
                    <div className="space-y-4">
                      
                      {/* Supported Crops */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Supported Crops Compatibility <span className="text-rose-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                          {AVAILABLE_CROPS.map((crop) => {
                            const isChecked = ownerForm.supportedCrops.includes(crop);
                            return (
                              <label key={crop} className="flex items-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-[#0B0F14] border border-slate-100 dark:border-[#2A2F3A] p-2.5 rounded-xl text-slate-600 dark:text-[#C9D1D9]">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setOwnerForm({
                                        ...ownerForm,
                                        supportedCrops: ownerForm.supportedCrops.filter(x => x !== crop)
                                      });
                                    } else {
                                      setOwnerForm({
                                        ...ownerForm,
                                        supportedCrops: [...ownerForm.supportedCrops, crop]
                                      });
                                    }
                                  }}
                                  className="rounded border-slate-300 accent-emerald-600 w-3.5 h-3.5 shrink-0"
                                />
                                <span className="text-[10px] truncate leading-none">{crop}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Image Upload Area */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Harvester Images & RC Book</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 border border-dashed border-emerald-300 dark:border-[#2A2F3A] hover:bg-emerald-50/10 dark:hover:bg-slate-800/20 p-5 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-1">
                            <Wrench className="h-6 w-6 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">Choose Images</span>
                            <span className="text-[8px] text-slate-400">Preview uploads instantly</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                          {ownerForm.imageFile && (
                            <div className="w-20 h-20 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                              <img src={ownerForm.imageFile} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Additional Notes / Description</label>
                        <textarea
                          rows={3}
                          placeholder="Provide details about cutter size, operator safety features, grain hopper tank capacity, or pricing policies..."
                          value={ownerForm.description}
                          onChange={(e) => setOwnerForm({ ...ownerForm, description: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white resize-none focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP WIZARD BUTTONS */}
                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    
                    {formStep >= 4 ? (
                      <button
                        type="button"
                        onClick={() => handlePublishHarvester(true)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-white font-bold hover:bg-slate-100 text-xs shrink-0"
                      >
                        Save Draft
                      </button>
                    ) : (
                      <div className="w-10" />
                    )}

                    <div className="flex gap-2">
                      {formStep > 1 && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setFormStep(prev => prev - 1)}
                          className="gap-1 px-4 text-xs font-bold"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </Button>
                      )}

                      {formStep < 5 ? (
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => {
                            // Step Validation
                            if (formStep === 1 && (!ownerForm.ownerName || !ownerForm.ownerMobile)) return;
                            if (formStep === 2 && (!ownerForm.region || !ownerForm.district || !ownerForm.village || !ownerForm.fullAddress)) return;
                            if (formStep === 3 && (!ownerForm.brand || !ownerForm.model || !ownerForm.year || !ownerForm.workingWidth || !ownerForm.capacity || !ownerForm.registrationNumber)) return;
                            if (formStep === 4 && (!ownerForm.pricePerHour || !ownerForm.pricePerDay || !ownerForm.minHours || !ownerForm.availableTiming)) return;

                            setFormStep(prev => prev + 1);
                          }}
                          className="gap-1 px-5 text-xs font-black shadow-sm"
                        >
                          Next <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => handlePublishHarvester(false)}
                          className="gap-1 px-6 text-xs font-black shadow-md shadow-emerald-500/20"
                        >
                          <Check className="h-4 w-4" /> Publish Harvester
                        </Button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            TAB 3: ADMIN DASHBOARD
            =========================================================== */}
        {activeTab === "admin" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-7xl space-y-6">
              
              {/* Admin Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 p-5 shadow-xs flex items-center gap-4">
                  <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-slate-400">Total Harvesters</h5>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{listings.length}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 p-5 shadow-xs flex items-center gap-4">
                  <div className="h-10 w-10 bg-amber-100 dark:bg-amber-950/50 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-slate-400">Pending Actions</h5>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {listings.filter(h => h.status === "Pending").length}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 p-5 shadow-xs flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-slate-400">Total Bookings</h5>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{bookings.length}</p>
                  </div>
                </div>
              </div>

              {/* LISTINGS TABLE */}
              <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Manage Harvester Fleet</h3>
                    <p className="text-[10px] text-slate-500">Approve listings, adjust specifications, toggle availability, and delete records</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Reset marketplace to default pre-populated harvesters?")) {
                        localStorage.removeItem("fasaldrishti_harvester_listings");
                        localStorage.removeItem("fasaldrishti_harvester_bookings");
                        setListings(DEFAULT_HARVESTERS);
                        setBookings([]);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-200/40 dark:border-rose-900/30 text-[10px] font-black"
                  >
                    Reset System
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#0B0F14]/50 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th className="p-4">Harvester ID / Details</th>
                        <th className="p-4">Owner Info</th>
                        <th className="p-4">Location (Village, District)</th>
                        <th className="p-4">Rate (Hour / Day)</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {listings.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1E2530]/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-emerald-50 dark:bg-[#1C212A] rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Wrench className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 dark:text-white">{h.brand} {h.model}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{h.harvesterType} • {h.capacity}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <p className="font-bold text-slate-850 dark:text-slate-200">{h.ownerName}</p>
                            <p className="text-[10px] text-slate-400">{h.ownerMobile}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-medium text-slate-800 dark:text-slate-300">{h.village}, {h.district}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{h.region}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-extrabold text-slate-900 dark:text-white">₹{h.pricePerHour}/hr</p>
                            <p className="text-[10px] text-slate-400">₹{h.pricePerDay}/day</p>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleAdminToggleAvailability(h.id)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider transition-colors ${h.availability === "Available" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"}`}
                            >
                              {h.availability}
                            </button>
                          </td>

                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${h.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-850 dark:text-emerald-400" : h.status === "Pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"}`}>
                              {h.status}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {h.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleAdminApprove(h.id)}
                                    title="Approve Listing"
                                    className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAdminReject(h.id)}
                                    title="Reject Listing"
                                    className="p-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setAdminEditingHarvester(h)}
                                title="Edit Details"
                                className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAdminDelete(h.id)}
                                title="Delete Listing"
                                className="p-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOOKINGS TABLE */}
              <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Active Booking Database</h3>
                  <p className="text-[10px] text-slate-500">Live logs of bookings requested by farmers with details of crops and date</p>
                </div>
                <div className="overflow-x-auto">
                  {bookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-bold">No active bookings recorded in this session.</div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#0B0F14]/50 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Farmer Details</th>
                          <th className="p-4">Harvester Reserved</th>
                          <th className="p-4">Location & Crop</th>
                          <th className="p-4">Date / Time</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {bookings.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1E2530]/20">
                            <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{b.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-slate-900 dark:text-white">{b.farmerName}</p>
                              <p className="text-[10px] text-slate-400">{b.mobile}</p>
                            </td>
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-350">{b.harvesterName}</td>
                            <td className="p-4">
                              <p className="font-semibold">{b.village}, {b.district}</p>
                              <p className="text-[9px] text-slate-400 font-bold">{b.harvestArea} Acres ({b.acres}) • {b.cropToHarvest}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold">{b.date}</p>
                              <p className="text-[10px] text-slate-400">{b.time}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </Container>
          </section>
        )}

      </main>

      <Footer />

      {/* ===========================================================
          MODALS & OVERLAYS
          =========================================================== */}

      {/* 1. BOOKING DIALOG FORM MODAL */}
      {selectedHarvester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
            
            <button
              onClick={() => { setSelectedHarvester(null); setBookingSuccessId(null); }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingSuccessId ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Booking Successful!</h3>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Booking ID: {bookingSuccessId}</p>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-sm mx-auto pt-2">
                    Your harvester reservation has been logged. Owner {selectedHarvester.ownerName} has been notified on {selectedHarvester.ownerMobile} and will coordinate dispatch details.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={() => { setSelectedHarvester(null); setBookingSuccessId(null); }}
                >
                  Return to Marketplace
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Book {selectedHarvester.brand} {selectedHarvester.model}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Rate: <span className="font-extrabold text-slate-700 dark:text-white">₹{selectedHarvester.pricePerHour}/hr</span> • Capacity: {selectedHarvester.capacity}
                  </p>
                </div>

                <form onSubmit={handleBookingConfirm} className="space-y-3.5 text-xs">
                  
                  {/* Basic Contacts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                      <input required name="farmerName" type="text" placeholder="e.g. Vikram Patel" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number <span className="text-rose-500">*</span></label>
                      <input required name="farmerMobile" type="tel" placeholder="10-digit mobile number" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  {/* Location Hierarchy */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Region <span className="text-rose-500">*</span></label>
                      <select required name="farmerRegion" defaultValue={selectedHarvester.region} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-xs">
                        {Object.keys(REGION_DISTRICT_MAP).map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">District <span className="text-rose-500">*</span></label>
                      <select required name="farmerDistrict" defaultValue={selectedHarvester.district} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-xs">
                        {REGION_DISTRICT_MAP[selectedHarvester.region]?.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Village <span className="text-rose-500">*</span></label>
                      <input required name="farmerVillage" type="text" defaultValue={selectedHarvester.village} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farm Address <span className="text-rose-500">*</span></label>
                    <input required name="farmerAddress" type="text" placeholder="E.g. Near GIDC road, west end of canal" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                  </div>

                  {/* Crop to Harvest & Harvest Area */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Crop to Harvest <span className="text-rose-500">*</span></label>
                      <select required name="farmerCrop" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-xs">
                        {selectedHarvester.supportedCrops.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harvest Area (Acres) <span className="text-rose-500">*</span></label>
                      <input required name="farmerAcres" type="number" min="1" max="100" defaultValue="5" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                  </div>

                  {/* Date, Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harvest Date <span className="text-rose-500">*</span></label>
                      <input required name="farmerDate" type="date" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Time <span className="text-rose-500">*</span></label>
                      <input required name="farmerTime" type="time" defaultValue="08:00" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Instructions</label>
                    <textarea name="farmerNotes" rows={2} placeholder="Any delivery constraints, soil dampness, or field details..." className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] resize-none" />
                  </div>

                  <Button variant="primary" type="submit" className="w-full justify-center py-3 mt-2 font-black shadow-md">
                    Confirm Harvester Booking
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. CONTACT DETAILS POPUP MODAL */}
      {contactHarvester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setContactHarvester(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Phone className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Contact {contactHarvester.ownerName}</h3>
              <p className="text-xs text-slate-500 dark:text-[#8B949E]">Listing: {contactHarvester.brand} {contactHarvester.model} ({contactHarvester.harvesterType})</p>
            </div>

            <div className="space-y-3.5 pt-3 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#161B22]/90 p-3 rounded-2xl border border-slate-100 dark:border-[#2A2F3A]">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Mobile Number</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{contactHarvester.ownerMobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#161B22]/90 p-3 rounded-2xl border border-slate-100 dark:border-[#2A2F3A]">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Email Address</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{contactHarvester.ownerEmail || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500">
              Please quote FasalDrishti Harvester ID <strong className="text-slate-800 dark:text-white">{contactHarvester.id}</strong> when calling the owner.
            </div>

            <Button variant="outline" className="w-full mt-3" onClick={() => setContactHarvester(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 3. ADMIN LISTING EDIT MODAL */}
      {adminEditingHarvester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setAdminEditingHarvester(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Harvester Details</h3>
              <p className="text-[10px] text-slate-400">ID: {adminEditingHarvester.id} • Modifying specifications</p>
            </div>

            <form onSubmit={handleAdminSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  <input required name="brand" type="text" defaultValue={adminEditingHarvester.brand} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Model</label>
                  <input required name="model" type="text" defaultValue={adminEditingHarvester.model} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <input required name="harvesterType" type="text" defaultValue={adminEditingHarvester.harvesterType} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price/hr (₹)</label>
                  <input required name="pricePerHour" type="number" defaultValue={adminEditingHarvester.pricePerHour} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price/day (₹)</label>
                  <input required name="pricePerDay" type="number" defaultValue={adminEditingHarvester.pricePerDay} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Availability</label>
                  <select name="availability" defaultValue={adminEditingHarvester.availability} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]">
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select name="status" defaultValue={adminEditingHarvester.status} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Region</label>
                  <input required name="region" type="text" defaultValue={adminEditingHarvester.region} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">District</label>
                  <input required name="district" type="text" defaultValue={adminEditingHarvester.district} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Village</label>
                  <input required name="village" type="text" defaultValue={adminEditingHarvester.village} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button variant="outline" type="button" className="flex-1" onClick={() => setAdminEditingHarvester(null)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MOBILE FILTERS DRAWER */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="w-80 h-full bg-white dark:bg-[#161B22] p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Filter Options
                </h3>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Location Hierarchy */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Region</label>
                  <select
                    value={filterRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                  >
                    <option value="all">All Regions</option>
                    {Object.keys(REGION_DISTRICT_MAP).map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">District</label>
                  <select
                    value={filterDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={filterRegion === "all"}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                  >
                    <option value="all">All Districts</option>
                    {filterRegion !== "all" && REGION_DISTRICT_MAP[filterRegion]?.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Village</label>
                  <select
                    value={filterVillage}
                    onChange={(e) => setFilterVillage(e.target.value)}
                    disabled={filterDistrict === "all"}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                  >
                    <option value="all">All Villages</option>
                    {filterDistrict !== "all" && getAvailableVillages().map(vil => (
                      <option key={vil} value={vil}>{vil}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Brand</label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                >
                  <option value="all">All Brands</option>
                  {getAvailableBrands().map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Harvester Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                >
                  <option value="all">All Types</option>
                  {HARVESTER_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-slate-400">Max Price (hr)</span>
                  <span className="font-black text-emerald-600">₹{filterPrice}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="100"
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Availability</label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                >
                  <option value="all">All status</option>
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterRegion("all");
                  setFilterDistrict("all");
                  setFilterVillage("all");
                  setFilterBrand("all");
                  setFilterType("all");
                  setFilterPrice(10000);
                  setFilterCrops([]);
                  setFilterAvailability("all");
                  setFilterRating(0);
                  setShowFiltersMobile(false);
                }}
              >
                Reset All Filters
              </Button>
              <Button variant="primary" className="w-full font-black" onClick={() => setShowFiltersMobile(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
