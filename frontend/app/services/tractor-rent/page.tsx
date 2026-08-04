"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { 
  Tractor, Star, MapPin, ChevronRight, Search, CheckCircle2, X, Plus, 
  Calendar, Clock, Edit2, Trash2, Check, ArrowRight, ArrowLeft, Filter, 
  Phone, Mail, Award, Key, Layers, BookOpen, AlertTriangle, ShieldCheck, 
  SlidersHorizontal, Info, ShieldAlert, Eye, Settings, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

// ===========================================================
// TYPES & INTERFACES
// ===========================================================

export interface TractorListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  hp: number;
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
  transmission: string;
  implements: string[];
  description: string;
  image: string;
  registrationNumber: string;
  rcNumber?: string;
  status: "Pending" | "Approved" | "Rejected";
  availability: "Available" | "Booked";
  rating: number;
  isDraft?: boolean;
}

export interface Booking {
  id: string;
  tractorId: string;
  tractorName: string;
  farmerName: string;
  mobile: string;
  region: string;
  district: string;
  village: string;
  farmAddress: string;
  date: string;
  time: string;
  hours: number;
  landSize: number;
  cropName: string;
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

const DEFAULT_TRACTORS: TractorListing[] = [
  {
    id: "tr-1",
    brand: "Mahindra",
    model: "575 DI",
    year: 2021,
    hp: 45,
    ownerName: "Rajesh Kumar",
    ownerMobile: "9823456789",
    ownerEmail: "rajesh.patel@gmail.com",
    region: "East Gujarat",
    district: "Dahod",
    village: "Fatehpura",
    fullAddress: "Fatehpura Road, Near Gram Panchayat, Dahod, Gujarat",
    pricePerHour: 1200,
    pricePerDay: 8500,
    minHours: 3,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTiming: "07:00 AM - 07:00 PM",
    fuelType: "Diesel",
    transmission: "Manual",
    implements: ["Rotavator", "Cultivator"],
    description: "Well maintained Mahindra tractor, fuel efficient and ready for heavy operations.",
    image: "mahindra",
    registrationNumber: "GJ-20-A-4832",
    rcNumber: "RC-48329482",
    status: "Approved",
    availability: "Available",
    rating: 4.8
  },
  {
    id: "tr-2",
    brand: "John Deere",
    model: "5045D",
    year: 2022,
    hp: 50,
    ownerName: "Amit Singh",
    ownerMobile: "9812345670",
    ownerEmail: "amit.deere@yahoo.com",
    region: "Kutch",
    district: "Kachchh",
    village: "Mandvi",
    fullAddress: "Mandvi Beach Road, Mandvi, Kachchh, Gujarat",
    pricePerHour: 1800,
    pricePerDay: 13000,
    minHours: 4,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    availableTiming: "06:00 AM - 08:00 PM",
    fuelType: "Diesel",
    transmission: "Synchromesh",
    implements: ["Cultivator", "Disc Plough"],
    description: "High power John Deere tractor with attachments. Ideal for deep ploughing.",
    image: "johndeere",
    registrationNumber: "GJ-12-X-9821",
    rcNumber: "RC-98210492",
    status: "Approved",
    availability: "Available",
    rating: 4.9
  },
  {
    id: "tr-3",
    brand: "Swaraj",
    model: "735 FE",
    year: 2020,
    hp: 40,
    ownerName: "Sunil Verma",
    ownerMobile: "9988776655",
    ownerEmail: "sunil.verma@gmail.com",
    region: "Central Gujarat",
    district: "Anand",
    village: "Borsad",
    fullAddress: "Borsad Cross Road, Anand, Gujarat",
    pricePerHour: 1000,
    pricePerDay: 7200,
    minHours: 2,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availableTiming: "08:00 AM - 06:00 PM",
    fuelType: "Diesel",
    transmission: "Manual",
    implements: ["Trailer"],
    description: "Reliable Swaraj tractor. Great for local transportation and small land sizes.",
    image: "swaraj",
    registrationNumber: "GJ-23-H-1102",
    rcNumber: "RC-11029384",
    status: "Approved",
    availability: "Booked",
    rating: 4.6
  },
  {
    id: "tr-4",
    brand: "Massey Ferguson",
    model: "1035 DI",
    year: 2019,
    hp: 36,
    ownerName: "Vikram Yadav",
    ownerMobile: "9876543210",
    ownerEmail: "vikram.ferguson@gmail.com",
    region: "North Gujarat",
    district: "Banaskantha",
    village: "Dhanera",
    fullAddress: "Dhanera Market Yard, Banaskantha, Gujarat",
    pricePerHour: 1400,
    pricePerDay: 10000,
    minHours: 3,
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    availableTiming: "07:30 AM - 06:30 PM",
    fuelType: "Diesel",
    transmission: "Manual",
    implements: ["Seed Drill", "Cultivator"],
    description: "Massey Ferguson 36 HP tractor, extremely reliable and perfect for sowing operations.",
    image: "massey",
    registrationNumber: "GJ-08-E-3291",
    rcNumber: "RC-32910842",
    status: "Approved",
    availability: "Available",
    rating: 4.7
  },
  {
    id: "tr-5",
    brand: "Eicher",
    model: "380 Super DI",
    year: 2021,
    hp: 40,
    ownerName: "Sanjay Patel",
    ownerMobile: "9765432109",
    ownerEmail: "sanjay.eicher@gmail.com",
    region: "South Gujarat",
    district: "Navsari",
    village: "Chikhli",
    fullAddress: "Chikhli GIDC Road, Navsari, Gujarat",
    pricePerHour: 1150,
    pricePerDay: 8000,
    minHours: 3,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTiming: "08:00 AM - 08:00 PM",
    fuelType: "Diesel",
    transmission: "Manual",
    implements: ["Harrow", "Leveler"],
    description: "Compact and powerful Eicher tractor, highly fuel efficient. Suitable for orchards and general tillage.",
    image: "eicher",
    registrationNumber: "GJ-21-C-0941",
    rcNumber: "RC-09418382",
    status: "Approved",
    availability: "Available",
    rating: 4.7
  },
  {
    id: "tr-6",
    brand: "Sonalika",
    model: "Rx 750 III",
    year: 2023,
    hp: 55,
    ownerName: "Mansukh Bhai",
    ownerMobile: "9654321987",
    ownerEmail: "mansukh.sonalika@gmail.com",
    region: "Saurashtra",
    district: "Rajkot",
    village: "Gondal",
    fullAddress: "Gondal National Highway, Rajkot, Gujarat",
    pricePerHour: 1600,
    pricePerDay: 11500,
    minHours: 5,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    availableTiming: "06:00 AM - 09:00 PM",
    fuelType: "Diesel",
    transmission: "Automatic",
    implements: ["Rotavator", "Seed Drill", "Sprayer"],
    description: "Latest Sonalika 55 HP model, dual clutch, equipped with rotavator and seed drill. Heavy duty champion.",
    image: "sonalika",
    registrationNumber: "GJ-03-B-7751",
    rcNumber: "RC-77519284",
    status: "Approved",
    availability: "Available",
    rating: 4.9
  }
];

const AVAILABLE_IMPLEMENTS = [
  "Rotavator", "Cultivator", "Disc Plough", "Seed Drill", 
  "Trailer", "Harrow", "Leveler", "Sprayer", "Other"
];

// ===========================================================
// PREMIUM SVG TRACTOR COMPONENT
// ===========================================================

const TractorImage = ({ brand, className = "w-full h-40" }: { brand: string; className?: string }) => {
  const colorMap: Record<string, { body: string; trim: string; accent: string }> = {
    mahindra: { body: "#DC2626", trim: "#FEF2F2", accent: "#EF4444" },
    "john deere": { body: "#15803D", trim: "#FACC15", accent: "#166534" },
    swaraj: { body: "#1D4ED8", trim: "#F8FAFC", accent: "#2563EB" },
    "massey ferguson": { body: "#DC2626", trim: "#FEF2F2", accent: "#EF4444" },
    sonalika: { body: "#1E3A8A", trim: "#F59E0B", accent: "#3B82F6" },
    eicher: { body: "#047857", trim: "#F8FAFC", accent: "#10B981" },
  };

  const normalized = brand.toLowerCase();
  const colors = Object.keys(colorMap).find(k => normalized.includes(k))
    ? colorMap[Object.keys(colorMap).find(k => normalized.includes(k))!]
    : { body: "#10B981", trim: "#F59E0B", accent: "#059669" };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1E2530] dark:to-[#161B22] flex items-center justify-center p-4 border border-slate-200/50 dark:border-[#2A2F3A]/50 transition-all duration-300 group-hover:scale-[1.02] ${className}`}>
      <svg className="w-3/4 h-3/4 max-h-32 drop-shadow-lg" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="125" x2="190" y2="125" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="75" y="65" width="70" height="45" rx="4" fill={colors.body} />
        <path d="M75 65 H50 V95 H75 Z" fill={colors.body} />
        <rect x="45" y="70" width="6" height="20" rx="1" fill="#1E293B" />
        <circle cx="48" cy="75" r="3" fill="#FACC15" />
        <circle cx="48" cy="85" r="3" fill="#FACC15" />
        <path d="M70 65 V35 H67 V33 H75 V35 H72 V65 Z" fill="#475569" />
        <path d="M71 33 C 71 28, 77 28, 76 25" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
        <path d="M100 65 V45 H145 V65" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <rect x="95" y="40" width="55" height="6" rx="2" fill={colors.trim} />
        <path d="M115 75 H125 V68 H115 Z" fill="#1E293B" />
        <line x1="95" y1="65" x2="103" y2="55" stroke="#1E293B" strokeWidth="3" />
        <ellipse cx="103" cy="55" rx="6" ry="2" fill="#334155" />
        <path d="M115 75 C115 75, 125 55, 160 60 V105 H145 C145 90, 130 85, 115 90 Z" fill={colors.accent} />
        <circle cx="145" cy="105" r="24" fill="#0F172A" stroke="#475569" strokeWidth="4" />
        <circle cx="145" cy="105" r="16" fill="#334155" />
        <circle cx="145" cy="105" r="8" fill={colors.trim} />
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * 360) / 8;
          return (
            <line
              key={idx}
              x1="145"
              y1="105"
              x2={145 + 24 * Math.cos((angle * Math.PI) / 180)}
              y2={105 + 24 * Math.sin((angle * Math.PI) / 180)}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
          );
        })}
        <circle cx="65" cy="113" r="16" fill="#0F172A" stroke="#475569" strokeWidth="3" />
        <circle cx="65" cy="113" r="10" fill="#334155" />
        <circle cx="65" cy="113" r="5" fill={colors.trim} />
        {Array.from({ length: 6 }).map((_, idx) => {
          const angle = (idx * 360) / 6;
          return (
            <line
              key={idx}
              x1="65"
              y1="113"
              x2={65 + 16 * Math.cos((angle * Math.PI) / 180)}
              y2={113 + 16 * Math.sin((angle * Math.PI) / 180)}
              stroke="#1E293B"
              strokeWidth="2"
            />
          );
        })}
        <rect x="75" y="72" width="40" height="8" rx="2" fill={colors.trim} opacity="0.85" />
        <text x="78" y="78" fill="#1E293B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
          {brand.substring(0, 8).toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

// ===========================================================
// MAIN COMPONENT
// ===========================================================

export default function TractorRentPage() {
  // Mounting State (Next.js SSR safety)
  const [isMounted, setIsMounted] = React.useState(false);

  // Core Marketplace State
  const [listings, setListings] = React.useState<TractorListing[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [activeTab, setActiveTab] = React.useState<"rent" | "list" | "admin">("rent");

  // Filter & Search States
  const [search, setSearch] = React.useState("");
  const [filterRegion, setFilterRegion] = React.useState("all");
  const [filterDistrict, setFilterDistrict] = React.useState("all");
  const [filterVillage, setFilterVillage] = React.useState("all");
  const [filterBrand, setFilterBrand] = React.useState("all");
  const [filterHp, setFilterHp] = React.useState("all"); // 'all', '<40', '40-50', '>50'
  const [filterPrice, setFilterPrice] = React.useState<number>(5000); // Max hourly rate
  const [filterImplements, setFilterImplements] = React.useState<string[]>([]);
  const [filterAvailability, setFilterAvailability] = React.useState("all"); // 'all', 'Available', 'Booked'
  const [filterRating, setFilterRating] = React.useState<number>(0); // 0, 4.0, 4.5
  
  // UI Control States
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);
  const [selectedTractor, setSelectedTractor] = React.useState<TractorListing | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = React.useState<string | null>(null);
  const [contactTractor, setContactTractor] = React.useState<TractorListing | null>(null);
  const [adminEditingTractor, setAdminEditingTractor] = React.useState<TractorListing | null>(null);

  // Multi-step Owner Form State
  const [formStep, setFormStep] = React.useState(1);
  const [ownerForm, setOwnerForm] = React.useState({
    // Owner Info
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    // Location
    region: "",
    district: "",
    village: "",
    fullAddress: "",
    // Specs
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    hp: 45,
    registrationNumber: "",
    rcNumber: "",
    fuelType: "Diesel",
    transmission: "Manual",
    // Rental
    pricePerHour: 1200,
    pricePerDay: 8500,
    minHours: 3,
    availableDays: [] as string[],
    availableTiming: "08:00 AM - 06:00 PM",
    // Extras
    implements: [] as string[],
    description: "",
    imageFile: ""
  });

  // Sync state from localStorage
  React.useEffect(() => {
    setIsMounted(true);
    const storedListings = localStorage.getItem("krishimitra_tractor_listings");
    const storedBookings = localStorage.getItem("krishimitra_tractor_bookings");

    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      localStorage.setItem("krishimitra_tractor_listings", JSON.stringify(DEFAULT_TRACTORS));
      setListings(DEFAULT_TRACTORS);
    }

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveListingsToStorage = (updated: TractorListing[]) => {
    setListings(updated);
    localStorage.setItem("krishimitra_tractor_listings", JSON.stringify(updated));
  };

  const saveBookingsToStorage = (updated: Booking[]) => {
    setBookings(updated);
    localStorage.setItem("krishimitra_tractor_bookings", JSON.stringify(updated));
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
    const subset = listings.filter(t => {
      const matchReg = filterRegion === "all" || t.region === filterRegion;
      const matchDist = filterDistrict === "all" || t.district === filterDistrict;
      return matchReg && matchDist && t.status === "Approved";
    });
    const unique = Array.from(new Set(subset.map(t => t.village)));
    return unique.filter(Boolean);
  };

  // Dynamic values in active listings for filter dropdowns
  const getAvailableBrands = () => {
    const approvedList = listings.filter(t => t.status === "Approved");
    return Array.from(new Set(approvedList.map(t => t.brand))).filter(Boolean);
  };

  // Hierarchy filter implementation + general filters + search
  const filteredTractors = listings.filter((t) => {
    // Admin sees all. Farmer only sees Approved listings
    if (activeTab !== "admin" && t.status !== "Approved") return false;

    // Search query matches Brand, Model, Owner, Village, District
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      t.brand.toLowerCase().includes(searchLower) ||
      t.model.toLowerCase().includes(searchLower) ||
      t.ownerName.toLowerCase().includes(searchLower) ||
      t.village.toLowerCase().includes(searchLower) ||
      t.district.toLowerCase().includes(searchLower);

    // Hierarchical Location filter:
    // "ONLY under Selected Region -> Selected District -> Selected Village"
    const matchesRegion = filterRegion === "all" || t.region === filterRegion;
    const matchesDistrict = filterDistrict === "all" || t.district === filterDistrict;
    const matchesVillage = filterVillage === "all" || t.village.toLowerCase() === filterVillage.toLowerCase();

    // Brand filter
    const matchesBrand = filterBrand === "all" || t.brand === filterBrand;

    // HP Filter
    let matchesHp = true;
    if (filterHp === "<40") matchesHp = t.hp < 40;
    else if (filterHp === "40-50") matchesHp = t.hp >= 40 && t.hp <= 50;
    else if (filterHp === ">50") matchesHp = t.hp > 50;

    // Hourly price slider limit
    const matchesPrice = t.pricePerHour <= filterPrice;

    // Implements Filter: Tractor must contain all selected implements
    const matchesImplements = filterImplements.length === 0 || 
      filterImplements.every(impl => t.implements.includes(impl));

    // Availability Filter
    const matchesAvailability = filterAvailability === "all" || t.availability === filterAvailability;

    // Rating Filter
    const matchesRating = t.rating >= filterRating;

    return matchesSearch && matchesRegion && matchesDistrict && matchesVillage && 
      matchesBrand && matchesHp && matchesPrice && matchesImplements && 
      matchesAvailability && matchesRating;
  });

  // Handle Booking Submit
  const handleBookingConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTractor) return;

    const data = new FormData(e.currentTarget);
    const bookingId = "KM-TX-" + Math.floor(10000 + Math.random() * 90000);

    const newBooking: Booking = {
      id: bookingId,
      tractorId: selectedTractor.id,
      tractorName: `${selectedTractor.brand} ${selectedTractor.model}`,
      farmerName: data.get("farmerName") as string,
      mobile: data.get("farmerMobile") as string,
      region: data.get("farmerRegion") as string,
      district: data.get("farmerDistrict") as string,
      village: data.get("farmerVillage") as string,
      farmAddress: data.get("farmerAddress") as string,
      date: data.get("farmerDate") as string,
      time: data.get("farmerTime") as string,
      hours: Number(data.get("farmerHours")),
      landSize: Number(data.get("farmerAcres")),
      cropName: data.get("farmerCrop") as string,
      instructions: data.get("farmerNotes") as string,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookingsToStorage(updatedBookings);

    // Toggle tractor availability to Booked
    const updatedListings = listings.map(t => 
      t.id === selectedTractor.id ? { ...t, availability: "Booked" as const } : t
    );
    saveListingsToStorage(updatedListings);

    setBookingSuccessId(bookingId);
  };

  // Owner Form Image Selector/Uploader helper
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

  // Submit Listing Form (Publish or Draft)
  const handlePublishTractor = (isDraft: boolean) => {
    // Generate new listing object
    const newId = "tr-" + (listings.length + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
    const newListing: TractorListing = {
      id: newId,
      brand: ownerForm.brand || "Mahindra",
      model: ownerForm.model || "DI Model",
      year: Number(ownerForm.year),
      hp: Number(ownerForm.hp),
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
      transmission: ownerForm.transmission,
      implements: ownerForm.implements,
      description: ownerForm.description || "Freshly listed agricultural tractor.",
      image: ownerForm.imageFile || "default",
      registrationNumber: ownerForm.registrationNumber || "GJ-XX-XXXX",
      rcNumber: ownerForm.rcNumber,
      status: isDraft ? "Pending" : "Approved", // Approved immediately per OLX instant feedback
      availability: "Available",
      rating: 5.0, // New listing starts with full rating
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
      hp: 45,
      registrationNumber: "",
      rcNumber: "",
      fuelType: "Diesel",
      transmission: "Manual",
      pricePerHour: 1200,
      pricePerDay: 8500,
      minHours: 3,
      availableDays: [],
      availableTiming: "08:00 AM - 06:00 PM",
      implements: [],
      description: "",
      imageFile: ""
    });
    setFormStep(1);
    
    // Switch to Rent Tab to see the listed tractor
    setActiveTab("rent");

    // Pre-populate location filters with the newly created tractor's location
    // so the owner immediately sees their listed tractor!
    setFilterRegion(newListing.region);
    setFilterDistrict(newListing.district);
    setFilterVillage(newListing.village);
  };

  // Admin Controls
  const handleAdminApprove = (id: string) => {
    const updated = listings.map(t => t.id === id ? { ...t, status: "Approved" as const } : t);
    saveListingsToStorage(updated);
  };

  const handleAdminReject = (id: string) => {
    const updated = listings.map(t => t.id === id ? { ...t, status: "Rejected" as const } : t);
    saveListingsToStorage(updated);
  };

  const handleAdminDelete = (id: string) => {
    const updated = listings.filter(t => t.id !== id);
    saveListingsToStorage(updated);
  };

  const handleAdminToggleAvailability = (id: string) => {
    const updated = listings.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          availability: t.availability === "Available" ? ("Booked" as const) : ("Available" as const) 
        };
      }
      return t;
    });
    saveListingsToStorage(updated);
  };

  const handleAdminSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminEditingTractor) return;

    const data = new FormData(e.currentTarget);
    const updated = listings.map(t => {
      if (t.id === adminEditingTractor.id) {
        return {
          ...t,
          brand: data.get("brand") as string,
          model: data.get("model") as string,
          hp: Number(data.get("hp")),
          pricePerHour: Number(data.get("pricePerHour")),
          pricePerDay: Number(data.get("pricePerDay")),
          availability: data.get("availability") as "Available" | "Booked",
          status: data.get("status") as "Pending" | "Approved" | "Rejected",
          region: data.get("region") as string,
          district: data.get("district") as string,
          village: data.get("village") as string
        };
      }
      return t;
    });
    saveListingsToStorage(updated);
    setAdminEditingTractor(null);
  };

  // Loader if client hydration isn't ready
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
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Tractor Rental Marketplace</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Tractor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gujarat's Agricultural Machine Hub</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight leading-tight">
              Tractor Rental <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Marketplace</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Rent verified high-horsepower tractors directly from local owners, or list your tractor to earn secondary farm income.
            </p>

            {/* TAB SELECT SWITCHER */}
            <div className="pt-6 flex justify-center">
              <div className="inline-flex rounded-2xl bg-white/70 dark:bg-[#161B22]/80 p-1.5 border border-emerald-100 dark:border-[#2A2F3A] backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("rent")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "rent" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Tractor className="h-4 w-4" />
                  Rent a Tractor
                </button>
                <button
                  onClick={() => { setActiveTab("list"); setFormStep(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "list" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Plus className="h-4 w-4" />
                  List Your Tractor
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* ===========================================================
            TAB 1: RENT A TRACTOR
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
                        setFilterHp("all");
                        setFilterPrice(5000);
                        setFilterImplements([]);
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
                        placeholder="Brand, model, owner..."
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

                  {/* Tractor Brand */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Brand</label>
                    <select
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="all">All Brands</option>
                      {getAvailableBrands().map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Horse Power */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Horse Power</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: "All", value: "all" },
                        { label: "< 40 HP", value: "<40" },
                        { label: "40 - 50 HP", value: "40-50" },
                        { label: "> 50 HP", value: ">50" }
                      ].map(item => (
                        <button
                          key={item.value}
                          onClick={() => setFilterHp(item.value)}
                          className={`px-2 py-1.5 rounded-lg border text-[10px] font-black transition-all ${filterHp === item.value ? "bg-emerald-600 border-emerald-600 text-white" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-black uppercase text-slate-400 dark:text-[#8B949E]">Max Price (hr)</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">₹{filterPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="50"
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
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F14] border border-emerald-100 dark:border-[#2A2F3A] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="Available">Available Now</option>
                      <option value="Booked">Currently Booked</option>
                    </select>
                  </div>

                  {/* Implements Available */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 dark:text-[#8B949E]">Implements Needed</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_IMPLEMENTS.slice(0, 8).map(impl => {
                        const isSelected = filterImplements.includes(impl);
                        return (
                          <button
                            key={impl}
                            onClick={() => {
                              if (isSelected) {
                                setFilterImplements(prev => prev.filter(x => x !== impl));
                              } else {
                                setFilterImplements(prev => [...prev, impl]);
                              }
                            }}
                            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${isSelected ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-600 dark:text-[#8B949E]"}`}
                          >
                            {impl}
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
                        placeholder="Search brand, model, location..."
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
                  {(filterRegion !== "all" || filterDistrict !== "all" || filterVillage !== "all" || filterBrand !== "all" || filterHp !== "all" || filterImplements.length > 0) && (
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
                      {filterHp !== "all" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {filterHp === "<40" ? "<40 HP" : filterHp === "40-50" ? "40-50 HP" : ">50 HP"}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterHp("all")} />
                        </span>
                      )}
                      {filterImplements.map(impl => (
                        <span key={impl} className="inline-flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                          {impl}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterImplements(prev => prev.filter(x => x !== impl))} />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Listings Summary */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8B949E]">
                    <p>Showing <span className="font-extrabold text-slate-800 dark:text-white">{filteredTractors.length}</span> tractors matching your criteria</p>
                    {filterRegion !== "all" && <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> Browsing: {filterRegion} {filterDistrict !== "all" ? `→ ${filterDistrict}` : ""} {filterVillage !== "all" ? `→ ${filterVillage}` : ""}</p>}
                  </div>

                  {/* TRACTOR GRID */}
                  {filteredTractors.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-emerald-200 dark:border-[#2A2F3A] bg-white/40 dark:bg-[#161B22]/30 p-12 text-center space-y-4">
                      <Tractor className="h-12 w-12 text-slate-400 mx-auto" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">No Tractors Listed in this Location</h4>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-sm mx-auto">
                        We couldn't find any tractors listed under the selected filters. Expand your filters or choose "All Regions" to explore.
                      </p>
                      <button
                        onClick={() => {
                          setFilterRegion("all");
                          setFilterDistrict("all");
                          setFilterVillage("all");
                          setFilterBrand("all");
                          setFilterHp("all");
                          setFilterPrice(5000);
                          setFilterImplements([]);
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
                      {filteredTractors.map((t) => (
                        <div 
                          key={t.id} 
                          className="group rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            
                            {/* Tractor Illustration */}
                            {t.image && t.image.startsWith("data:image") ? (
                              <div className="relative w-full h-40 overflow-hidden rounded-2xl border border-slate-200/50 dark:border-[#2A2F3A]/50 bg-slate-100 dark:bg-[#1E2530] flex items-center justify-center">
                                <img src={t.image} alt={t.brand} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                              </div>
                            ) : (
                              <TractorImage brand={t.brand} className="w-full h-40" />
                            )}

                            {/* Badges & Status */}
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-800/30 uppercase tracking-wider">
                                {t.fuelType} • {t.transmission}
                              </span>
                              {t.availability === "Available" ? (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Available</span>
                              ) : (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">Booked</span>
                              )}
                            </div>

                            {/* Brand, Model, HP */}
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                  {t.brand} <span className="font-medium text-slate-500 dark:text-[#8B949E] text-sm">{t.model}</span>
                                </h3>
                                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md shrink-0">
                                  {t.hp} HP
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1 font-medium flex items-center gap-1">
                                <Award className="h-3 w-3 text-amber-500" />
                                Owner: {t.ownerName}
                              </p>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#C9D1D9] border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="truncate">{t.village}, {t.district} ({t.region})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span>{t.rating.toFixed(1)} rating</span>
                              </div>
                              
                              {/* Implements Badges */}
                              {t.implements.length > 0 && (
                                <div className="pt-1.5 flex flex-wrap gap-1">
                                  {t.implements.map(impl => (
                                    <span key={impl} className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-[#1E2530] text-slate-600 dark:text-[#8B949E] border border-slate-200/40 dark:border-[#2A2F3A]/40">
                                      {impl}
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
                                Min Booking: <span className="font-extrabold text-slate-700 dark:text-white">{t.minHours} hrs</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-extrabold text-slate-900 dark:text-white">₹{t.pricePerHour}/hr</div>
                                <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">₹{t.pricePerDay}/day</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => setContactTractor(t)}
                              >
                                <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                Contact
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-xs font-black shadow-sm"
                                disabled={t.availability !== "Available"}
                                onClick={() => setSelectedTractor(t)}
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
            TAB 2: LIST YOUR TRACTOR (MULTI-STEP WIZARD)
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
                    {formStep === 2 && "Farm Location"}
                    {formStep === 3 && "Tractor Specifications"}
                    {formStep === 4 && "Pricing & Available Timing"}
                    {formStep === 5 && "Implements & Images"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">
                    {formStep === 1 && "Provide contact info so nearby farmers can reach you."}
                    {formStep === 2 && "Where is your tractor parked? This determines visibility in region filters."}
                    {formStep === 3 && "Enter detailed specs of your tractor so farmers get standard data."}
                    {formStep === 4 && "Define your rental pricing model, minimum requirements, and time availability."}
                    {formStep === 5 && "Check off compatible implements, upload images, and add description details."}
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
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. ramesh.patel@gmail.com"
                          value={ownerForm.ownerEmail}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerEmail: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
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
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs disabled:opacity-50"
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
                          placeholder="e.g. Dhanera"
                          value={ownerForm.village}
                          onChange={(e) => setOwnerForm({ ...ownerForm, village: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Full Address <span className="text-rose-500">*</span></label>
                        <textarea
                          required
                          rows={3}
                          placeholder="E.g., Near GIDC area, Main Highway, Dhanera, Gujarat"
                          value={ownerForm.fullAddress}
                          onChange={(e) => setOwnerForm({ ...ownerForm, fullAddress: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: TRACTOR SPECS */}
                  {formStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Brand <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={ownerForm.brand}
                            onChange={(e) => setOwnerForm({ ...ownerForm, brand: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          >
                            <option value="">Select Brand</option>
                            <option value="Mahindra">Mahindra</option>
                            <option value="John Deere">John Deere</option>
                            <option value="Swaraj">Swaraj</option>
                            <option value="Massey Ferguson">Massey Ferguson</option>
                            <option value="Eicher">Eicher</option>
                            <option value="Sonalika">Sonalika</option>
                            <option value="New Holland">New Holland</option>
                            <option value="Kubota">Kubota</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Model <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 575 DI"
                            value={ownerForm.model}
                            onChange={(e) => setOwnerForm({ ...ownerForm, model: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Horse Power (HP) <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="number"
                            min="15"
                            max="100"
                            placeholder="e.g. 45"
                            value={ownerForm.hp}
                            onChange={(e) => setOwnerForm({ ...ownerForm, hp: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Registration Year <span className="text-rose-500">*</span></label>
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
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Fuel Type <span className="text-rose-500">*</span></label>
                          <select
                            value={ownerForm.fuelType}
                            onChange={(e) => setOwnerForm({ ...ownerForm, fuelType: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs"
                          >
                            <option value="Diesel">Diesel</option>
                            <option value="CNG">CNG</option>
                            <option value="Electric">Electric</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Transmission <span className="text-rose-500">*</span></label>
                          <select
                            value={ownerForm.transmission}
                            onChange={(e) => setOwnerForm({ ...ownerForm, transmission: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white text-xs"
                          >
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Synchromesh">Synchromesh</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Registration Number <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. GJ-20-A-4832"
                            value={ownerForm.registrationNumber}
                            onChange={(e) => setOwnerForm({ ...ownerForm, registrationNumber: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">RC Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="RC Book code"
                            value={ownerForm.rcNumber}
                            onChange={(e) => setOwnerForm({ ...ownerForm, rcNumber: e.target.value })}
                            className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
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
                            min="100"
                            max="5000"
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
                            min="500"
                            max="50000"
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
                          <label className="block font-bold text-slate-700 dark:text-slate-300">Available Timing <span className="text-rose-500">*</span></label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 08:00 AM - 06:00 PM"
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

                  {/* STEP 5: IMPLEMENTS & UPLOADS */}
                  {formStep === 5 && (
                    <div className="space-y-4">
                      
                      {/* Compatible Implements */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Compatible Implements</label>
                        <div className="grid grid-cols-3 gap-2">
                          {AVAILABLE_IMPLEMENTS.map((impl) => {
                            const isChecked = ownerForm.implements.includes(impl);
                            return (
                              <label key={impl} className="flex items-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-[#0B0F14] border border-slate-100 dark:border-[#2A2F3A] p-2.5 rounded-xl text-slate-600 dark:text-[#C9D1D9]">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setOwnerForm({
                                        ...ownerForm,
                                        implements: ownerForm.implements.filter(x => x !== impl)
                                      });
                                    } else {
                                      setOwnerForm({
                                        ...ownerForm,
                                        implements: [...ownerForm.implements, impl]
                                      });
                                    }
                                  }}
                                  className="rounded border-slate-300 accent-emerald-600 w-3.5 h-3.5 shrink-0"
                                />
                                <span className="text-[10px] truncate leading-none">{impl}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Image Upload Area */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Tractor Images (PNG/JPG)</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 border border-dashed border-emerald-300 dark:border-[#2A2F3A] hover:bg-emerald-50/10 dark:hover:bg-slate-800/20 p-5 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-1">
                            <Tractor className="h-6 w-6 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">Choose Image</span>
                            <span className="text-[8px] text-slate-400">Image scales automatically</span>
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

                      {/* Description notes */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">Additional Notes / Description</label>
                        <textarea
                          rows={3}
                          placeholder="Enter crop capability, fuel economy, delivery policy, or driver details..."
                          value={ownerForm.description}
                          onChange={(e) => setOwnerForm({ ...ownerForm, description: e.target.value })}
                          className="w-full p-3 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP WIZARD BUTTONS */}
                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    
                    {/* Draft button (Only step 4 and 5) */}
                    {formStep >= 4 ? (
                      <button
                        type="button"
                        onClick={() => handlePublishTractor(true)}
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
                            // Basic Validation before Next
                            if (formStep === 1 && (!ownerForm.ownerName || !ownerForm.ownerMobile)) return;
                            if (formStep === 2 && (!ownerForm.region || !ownerForm.district || !ownerForm.village || !ownerForm.fullAddress)) return;
                            if (formStep === 3 && (!ownerForm.brand || !ownerForm.model || !ownerForm.hp || !ownerForm.registrationNumber)) return;
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
                          onClick={() => handlePublishTractor(false)}
                          className="gap-1 px-6 text-xs font-black shadow-md shadow-emerald-500/20"
                        >
                          <Check className="h-4 w-4" /> Publish Tractor
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
                    <Tractor className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-slate-400">Total Tractors</h5>
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
                      {listings.filter(t => t.status === "Pending").length}
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

              {/* LISTINGS MANAGEMENT TABLE */}
              <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Manage Rental Fleet</h3>
                    <p className="text-[10px] text-slate-500">Approve listings, adjust specifications, toggle bookings and delete inventory</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Reset marketplace to default pre-populated tractors?")) {
                        localStorage.removeItem("krishimitra_tractor_listings");
                        localStorage.removeItem("krishimitra_tractor_bookings");
                        setListings(DEFAULT_TRACTORS);
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
                        <th className="p-4">Tractor ID / Details</th>
                        <th className="p-4">Owner Info</th>
                        <th className="p-4">Location (Village, District)</th>
                        <th className="p-4">Rate (Hour / Day)</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4">Moderation</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {listings.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1E2530]/20 transition-colors">
                          
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-emerald-50 dark:bg-[#1C212A] rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Tractor className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 dark:text-white">{t.brand} {t.model}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{t.hp} HP • {t.year} Reg</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <p className="font-bold text-slate-850 dark:text-slate-200">{t.ownerName}</p>
                            <p className="text-[10px] text-slate-400">{t.ownerMobile}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-medium text-slate-800 dark:text-slate-300">{t.village}, {t.district}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{t.region}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-extrabold text-slate-900 dark:text-white">₹{t.pricePerHour}/hr</p>
                            <p className="text-[10px] text-slate-400">₹{t.pricePerDay}/day</p>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleAdminToggleAvailability(t.id)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider transition-colors ${t.availability === "Available" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"}`}
                            >
                              {t.availability}
                            </button>
                          </td>

                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${t.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-850 dark:text-emerald-400" : t.status === "Pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"}`}>
                              {t.status}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {t.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleAdminApprove(t.id)}
                                    title="Approve Listing"
                                    className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAdminReject(t.id)}
                                    title="Reject Listing"
                                    className="p-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setAdminEditingTractor(t)}
                                title="Edit Details"
                                className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAdminDelete(t.id)}
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

              {/* BOOKINGS RECORD SECTION */}
              <div className="rounded-3xl border border-slate-100 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Active Booking Database</h3>
                  <p className="text-[10px] text-slate-500">Live logs of bookings requested by farmers with details of duration and location</p>
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
                          <th className="p-4">Tractor Reserved</th>
                          <th className="p-4">Location & Acres</th>
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
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-350">{b.tractorName}</td>
                            <td className="p-4">
                              <p className="font-semibold">{b.village}, {b.district}</p>
                              <p className="text-[9px] text-slate-400 font-bold">{b.landSize} Acres • {b.cropName}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold">{b.date}</p>
                              <p className="text-[10px] text-slate-400">{b.time} ({b.hours} hrs)</p>
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
      {selectedTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
            
            <button
              onClick={() => { setSelectedTractor(null); setBookingSuccessId(null); }}
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
                    Your reservation has been logged. Owner {selectedTractor.ownerName} has been notified on {selectedTractor.ownerMobile} and will coordinate dispatch details.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={() => { setSelectedTractor(null); setBookingSuccessId(null); }}
                >
                  Return to Marketplace
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Book {selectedTractor.brand} {selectedTractor.model}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Rate: <span className="font-extrabold text-slate-700 dark:text-white">₹{selectedTractor.pricePerHour}/hr</span> • Owner: {selectedTractor.ownerName}
                  </p>
                </div>

                <form onSubmit={handleBookingConfirm} className="space-y-3.5 text-xs">
                  
                  {/* Basic Contacts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                      <input required name="farmerName" type="text" placeholder="e.g. Ramesh Patel" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
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
                      <select required name="farmerRegion" defaultValue={selectedTractor.region} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-xs">
                        {Object.keys(REGION_DISTRICT_MAP).map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">District <span className="text-rose-500">*</span></label>
                      <select required name="farmerDistrict" defaultValue={selectedTractor.district} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-xs">
                        {REGION_DISTRICT_MAP[selectedTractor.region]?.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Village <span className="text-rose-500">*</span></label>
                      <input required name="farmerVillage" type="text" defaultValue={selectedTractor.village} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Farm Delivery Address <span className="text-rose-500">*</span></label>
                    <input required name="farmerAddress" type="text" placeholder="E.g. Near canal, east end of village road" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] text-slate-900 dark:text-white" />
                  </div>

                  {/* Date, Time, Duration */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rental Date <span className="text-rose-500">*</span></label>
                      <input required name="farmerDate" type="date" className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rental Time <span className="text-rose-500">*</span></label>
                      <input required name="farmerTime" type="time" defaultValue="08:00" className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hours Required <span className="text-rose-500">*</span></label>
                      <input required name="farmerHours" type="number" min={selectedTractor.minHours} max="24" defaultValue={selectedTractor.minHours} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                  </div>

                  {/* Acres & Crop Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Land Size (Acres) <span className="text-rose-500">*</span></label>
                      <input required name="farmerAcres" type="number" min="1" max="100" defaultValue="5" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Crop Name <span className="text-rose-500">*</span></label>
                      <input required name="farmerCrop" type="text" placeholder="e.g. Groundnut" className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Special Instructions</label>
                    <textarea name="farmerNotes" rows={2} placeholder="Any delivery constraints, mud conditions or extra attachments needed..." className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] resize-none" />
                  </div>

                  <Button variant="primary" type="submit" className="w-full justify-center py-3 mt-2 font-black shadow-md">
                    Confirm Rental Booking
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. CONTACT DETAILS POPUP MODAL */}
      {contactTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setContactTractor(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Phone className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Contact {contactTractor.ownerName}</h3>
              <p className="text-xs text-slate-500 dark:text-[#8B949E]">Listing: {contactTractor.brand} {contactTractor.model} ({contactTractor.hp} HP)</p>
            </div>

            <div className="space-y-3.5 pt-3 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#161B22]/90 p-3 rounded-2xl border border-slate-100 dark:border-[#2A2F3A]">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Mobile Number</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{contactTractor.ownerMobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#161B22]/90 p-3 rounded-2xl border border-slate-100 dark:border-[#2A2F3A]">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Email Address</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{contactTractor.ownerEmail || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500">
              Please quote KrishiMitra Marketplace ID <strong className="text-slate-800 dark:text-white">{contactTractor.id}</strong> when calling the owner.
            </div>

            <Button variant="outline" className="w-full mt-3" onClick={() => setContactTractor(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 3. ADMIN LISTING EDIT MODAL */}
      {adminEditingTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setAdminEditingTractor(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Listing Specs</h3>
              <p className="text-[10px] text-slate-400">ID: {adminEditingTractor.id} • Modifying specifications</p>
            </div>

            <form onSubmit={handleAdminSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  <input required name="brand" type="text" defaultValue={adminEditingTractor.brand} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Model</label>
                  <input required name="model" type="text" defaultValue={adminEditingTractor.model} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">HP</label>
                  <input required name="hp" type="number" defaultValue={adminEditingTractor.hp} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price/hr (₹)</label>
                  <input required name="pricePerHour" type="number" defaultValue={adminEditingTractor.pricePerHour} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price/day (₹)</label>
                  <input required name="pricePerDay" type="number" defaultValue={adminEditingTractor.pricePerDay} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Availability</label>
                  <select name="availability" defaultValue={adminEditingTractor.availability} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]">
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select name="status" defaultValue={adminEditingTractor.status} className="w-full p-2.5 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Region</label>
                  <input required name="region" type="text" defaultValue={adminEditingTractor.region} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">District</label>
                  <input required name="district" type="text" defaultValue={adminEditingTractor.district} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Village</label>
                  <input required name="village" type="text" defaultValue={adminEditingTractor.village} className="w-full p-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22]" />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button variant="outline" type="button" className="flex-1" onClick={() => setAdminEditingTractor(null)}>
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

      {/* 4. MOBILE FILTERS DRAWER / OVERLAY SHEET */}
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

              {/* HP Rating */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Horse Power</label>
                <select
                  value={filterHp}
                  onChange={(e) => setFilterHp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs"
                >
                  <option value="all">All Specs</option>
                  <option value="<40">&lt; 40 HP</option>
                  <option value="40-50">40 - 50 HP</option>
                  <option value=">50">&gt; 50 HP</option>
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
                  min="500"
                  max="3000"
                  step="50"
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
                  setFilterHp("all");
                  setFilterPrice(5000);
                  setFilterImplements([]);
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
