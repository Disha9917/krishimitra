"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { 
  Snowflake, Database, MapPin, ChevronRight, Search, ShieldCheck, CheckCircle2, X, Plus, 
  Calendar, Clock, Edit2, Trash2, Check, ArrowRight, ArrowLeft, Filter, 
  Phone, Mail, Award, Key, Layers, BookOpen, AlertTriangle, SlidersHorizontal, 
  Info, ShieldAlert, Eye, Settings, RefreshCw, Star, FileText, Download, 
  DollarSign, TrendingUp, User, Percent, Truck, Lock, Camera, CheckSquare, 
  Square, Sparkles, ExternalLink, Shield, Box, Share2, Thermometer, Droplets, Wind, Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

// ===========================================================
// TYPES & DATA STRUCTURES FOR COLD STORAGE
// ===========================================================

export interface ColdStorageListing {
  id: string;
  name: string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  ownershipType: "Government" | "Private" | "Cooperative";
  region: string;
  district: string;
  village: string;
  fullAddress: string;
  pincode: string;
  mapsUrl: string;
  facilityType: string;
  licenseNumber: string;
  fssaiNumber?: string;
  gstNumber?: string;
  totalCapacityMT: number;
  availableCapacityMT: number;
  minBookingMT: number;
  tempRange: string; // e.g. "0°C to 4°C"
  humidityRange: string; // e.g. "85% - 95% RH"
  rentalChargePerMT: number; // ₹ per MT per month
  securityDeposit: number;
  workingHours: string;
  supportedProduce: string[];
  facilities: string[];
  description: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isFssaiVerified: boolean;
  isLicenseVerified: boolean;
  isGstVerified: boolean;
  status: "Approved" | "Pending" | "Rejected" | "Suspended";
  isFeatured?: boolean;
  hasPowerBackup: boolean;
}

export interface ColdStorageBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  farmerName: string;
  farmerMobile: string;
  region: string;
  district: string;
  village: string;
  produce: string;
  quantityMT: number;
  arrivalDate: string;
  durationMonths: number;
  pickupDate: string;
  requiredTemp: string;
  specialInstructions?: string;
  chamberCharges: number;
  taxAmount: number;
  securityDeposit: number;
  totalAmount: number;
  status: "Confirmed" | "Active" | "Completed" | "Cancelled";
  timestamp: string;
}

export interface ColdStorageReview {
  id: string;
  facilityId: string;
  farmerName: string;
  rating: number;
  comment: string;
  date: string;
}

// ===========================================================
// LOCATION MAPPING
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

const DISTRICT_VILLAGE_MAP: Record<string, string[]> = {
  "Banaskantha": ["Deesa", "Dhanera", "Palanpur", "Tharad", "Vav"],
  "Kachchh": ["Anjar", "Mandvi", "Bhuj", "Gandhidham", "Nakhatrana"],
  "Anand": ["Borsad", "Samarkha", "Petlad", "Khambhat", "Umreth"],
  "Navsari": ["Chikhli", "Gandevi", "Jalalpore", "Bansda", "Khergam"],
  "Junagadh": ["Talala", "Malia", "Visavadar", "Manavadar", "Keshod"],
  "Rajkot": ["Gondal", "Jetpur", "Jasdan", "Dhoraji", "Morbi Road"],
  "Mehsana": ["Unjha", "Kadi", "Visnagar", "Becharaji", "Vadnagar"],
  "Ahmedabad": ["Sanand", "Dholka", "Bavla", "Viramgam", "Mandal"],
  "Vadodara": ["Padra", "Karjan", "Dabhoi", "Savli", "Waghodia"],
  "Dahod": ["Devgadh Baria", "Fatehpura", "Jhalod", "Garbada", "Limkheda"]
};

// ===========================================================
// COLD STORAGE SPECIFIC CONSTANTS
// ===========================================================

const COLD_FACILITY_TYPES = [
  "Controlled Atmosphere (CA) Chamber",
  "Potato Cold Storage",
  "Multi-Commodity Cold Room",
  "Fruit & Vegetable Chilling Room",
  "Spice & Seed Cold Godown",
  "Deep Freeze Chamber (-18°C to -25°C)",
  "Banana & Mango Ripening Chamber",
  "Floriculture Cold Room",
  "Government Cold Storage",
  "Cooperative Cold Storage"
];

const SUPPORTED_PRODUCE = [
  "Potato",
  "Mango (Kesar / Alphonso)",
  "Onion & Garlic",
  "Apple & Pears",
  "Banana (Ripening)",
  "Citrus & Pomegranate",
  "Tomatoes & Vegetables",
  "Spices (Cumin/Mustard/Turmeric)",
  "Hybrid Seeds",
  "Dairy & Ghee",
  "Cut Flowers",
  "Frozen Agro Produce",
  "Others"
];

const ALL_COLD_FACILITIES = [
  "24x7 Diesel Generator Backup",
  "Automated Digital Climate Logging",
  "Controlled Humidity (RH 85-95%)",
  "Pre-Cooling Chamber Unit",
  "Grading & Sorting Bay",
  "Forklift & Hydraulic Docks",
  "Ammonia/Freon Refrigeration Plant",
  "Thermal PUF Insulated Panels",
  "Fire Suppression System",
  "24x7 CCTV & Security Guard",
  "Electronic Weighbridge",
  "Cold Chain Transit Loading Ramp",
  "Transit Insurance Coverage"
];

// ===========================================================
// DEFAULT SEED COLD STORAGES DATA
// ===========================================================

const DEFAULT_COLD_STORAGES: ColdStorageListing[] = [
  {
    id: "cs-1",
    name: "Deesa Mega Potato CA Cold Storage Hub",
    ownerName: "Jignesh Chaudhari",
    ownerMobile: "9898765432",
    ownerEmail: "jignesh.deesa@coldchain.in",
    ownershipType: "Private",
    region: "North Gujarat",
    district: "Banaskantha",
    village: "Deesa",
    fullAddress: "Highway 27, Potato Market Yard Zone, Deesa, Banaskantha, Gujarat",
    pincode: "385535",
    mapsUrl: "https://maps.google.com/?q=Deesa+Banaskantha+Cold+Storage",
    facilityType: "Potato Cold Storage",
    licenseNumber: "CS-GJ-2021-9981",
    fssaiNumber: "10721001000452",
    gstNumber: "24AAACD9981F1Z2",
    totalCapacityMT: 5000,
    availableCapacityMT: 2100,
    minBookingMT: 10,
    tempRange: "2°C to 4°C",
    humidityRange: "90% - 95% RH",
    rentalChargePerMT: 650, // ₹650 / MT / month
    securityDeposit: 2000,
    workingHours: "07:00 AM - 09:00 PM",
    supportedProduce: ["Potato", "Onion & Garlic", "Hybrid Seeds", "Spices (Cumin/Mustard/Turmeric)"],
    facilities: ["24x7 Diesel Generator Backup", "Automated Digital Climate Logging", "Pre-Cooling Chamber Unit", "Grading & Sorting Bay", "Forklift & Hydraulic Docks", "Electronic Weighbridge", "Transit Insurance Coverage"],
    description: "North Gujarat's premier Controlled Atmosphere potato cold storage with automated humidity controls preventing sprouting and weight loss.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    reviewsCount: 68,
    isVerified: true,
    isFssaiVerified: true,
    isLicenseVerified: true,
    isGstVerified: true,
    status: "Approved",
    isFeatured: true,
    hasPowerBackup: true
  },
  {
    id: "cs-2",
    name: "Junagadh Gir Kesar Mango & Fruit Chilling Center",
    ownerName: "Mansukh Bhai Solanki",
    ownerMobile: "9824123456",
    ownerEmail: "mansukh.kesar@junagadhcold.org",
    ownershipType: "Cooperative",
    region: "Saurashtra",
    district: "Junagadh",
    village: "Talala",
    fullAddress: "Talala Mango Yard Road, Junagadh, Gujarat",
    pincode: "362150",
    mapsUrl: "https://maps.google.com/?q=Talala+Junagadh+Cold+Storage",
    facilityType: "Banana & Mango Ripening Chamber",
    licenseNumber: "CS-GJ-2022-4410",
    fssaiNumber: "10722005000889",
    totalCapacityMT: 2500,
    availableCapacityMT: 950,
    minBookingMT: 5,
    tempRange: "8°C to 12°C",
    humidityRange: "85% - 90% RH",
    rentalChargePerMT: 800,
    securityDeposit: 1500,
    workingHours: "06:00 AM - 10:00 PM",
    supportedProduce: ["Mango (Kesar / Alphonso)", "Banana (Ripening)", "Citrus & Pomegranate", "Tomatoes & Vegetables"],
    facilities: ["24x7 Diesel Generator Backup", "Pre-Cooling Chamber Unit", "Grading & Sorting Bay", "Thermal PUF Insulated Panels", "Cold Chain Transit Loading Ramp"],
    description: "Specialized ethylene-controlled ripening and chilling chambers for Kesar mangoes and perishable horticultures.",
    images: ["https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    reviewsCount: 44,
    isVerified: true,
    isFssaiVerified: true,
    isLicenseVerified: true,
    isGstVerified: false,
    status: "Approved",
    isFeatured: true,
    hasPowerBackup: true
  },
  {
    id: "cs-3",
    name: "Anand Amul Zone Dairy & Multi-Commodity Cold Room",
    ownerName: "Pankaj Bhai Patel",
    ownerMobile: "9979887766",
    ownerEmail: "pankaj.anand@coldroom.in",
    ownershipType: "Cooperative",
    region: "Central Gujarat",
    district: "Anand",
    village: "Samarkha",
    fullAddress: "GIDC Industrial Estate, Phase 2, Anand, Gujarat",
    pincode: "388001",
    mapsUrl: "https://maps.google.com/?q=Samarkha+Anand+Cold+Room",
    facilityType: "Multi-Commodity Cold Room",
    licenseNumber: "CS-GJ-2020-1123",
    fssaiNumber: "10720002000112",
    gstNumber: "24BBBCP1123G1Z8",
    totalCapacityMT: 1800,
    availableCapacityMT: 620,
    minBookingMT: 2,
    tempRange: "0°C to 5°C",
    humidityRange: "85% RH",
    rentalChargePerMT: 550,
    securityDeposit: 1000,
    workingHours: "08:00 AM - 08:00 PM",
    supportedProduce: ["Dairy & Ghee", "Hybrid Seeds", "Tomatoes & Vegetables", "Spices (Cumin/Mustard/Turmeric)"],
    facilities: ["24x7 Diesel Generator Backup", "Automated Digital Climate Logging", "Ammonia/Freon Refrigeration Plant", "24x7 CCTV & Security Guard"],
    description: "Multipurpose chilled rooms with dual compressor technology and automated backup generators.",
    images: ["https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    reviewsCount: 31,
    isVerified: true,
    isFssaiVerified: true,
    isLicenseVerified: true,
    isGstVerified: true,
    status: "Approved",
    hasPowerBackup: true
  },
  {
    id: "cs-4",
    name: "Navsari Tropical Fruit & Floriculture Cold Chain",
    ownerName: "Harish Naik",
    ownerMobile: "9879012345",
    ownerEmail: "harish.navsari@coldstore.com",
    ownershipType: "Private",
    region: "South Gujarat",
    district: "Navsari",
    village: "Chikhli",
    fullAddress: "Chikhli Highway Junction, Navsari, Gujarat",
    pincode: "396521",
    mapsUrl: "https://maps.google.com/?q=Chikhli+Navsari+Cold+Chain",
    facilityType: "Floriculture Cold Room",
    licenseNumber: "CS-GJ-2023-7740",
    fssaiNumber: "10723004000991",
    gstNumber: "24CCCCN7740H1Z3",
    totalCapacityMT: 1200,
    availableCapacityMT: 450,
    minBookingMT: 1,
    tempRange: "4°C to 8°C",
    humidityRange: "90% - 95% RH",
    rentalChargePerMT: 720,
    securityDeposit: 1200,
    workingHours: "06:00 AM - 08:00 PM",
    supportedProduce: ["Cut Flowers", "Mango (Kesar / Alphonso)", "Banana (Ripening)", "Citrus & Pomegranate"],
    facilities: ["24x7 Diesel Generator Backup", "Controlled Humidity (RH 85-95%)", "Pre-Cooling Chamber Unit", "Thermal PUF Insulated Panels"],
    description: "High-humidity chamber designed for roses, cut flowers, and South Gujarat tropical fruits.",
    images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    reviewsCount: 22,
    isVerified: true,
    isFssaiVerified: true,
    isLicenseVerified: true,
    isGstVerified: true,
    status: "Approved",
    hasPowerBackup: true
  }
];

const DEFAULT_COLD_REVIEWS: ColdStorageReview[] = [
  {
    id: "crev-1",
    facilityId: "cs-1",
    farmerName: "Karan Patel (Potato Grower)",
    rating: 5,
    comment: "Stored 120 MT Potato for 4 months. ZERO sprouting loss, exact 3°C temperature maintained throughout season.",
    date: "2026-07-18"
  }
];

// ===========================================================
// MAIN COLD STORAGE MARKETPLACE COMPONENT
// ===========================================================

export default function ColdStoragePage() {
  const [isMounted, setIsMounted] = React.useState(false);

  // Core State
  const [coldStorages, setColdStorages] = React.useState<ColdStorageListing[]>([]);
  const [bookings, setBookings] = React.useState<ColdStorageBooking[]>([]);
  const [reviews, setReviews] = React.useState<ColdStorageReview[]>([]);
  const [activeTab, setActiveTab] = React.useState<"find" | "list" | "my-bookings" | "my-chambers" | "admin">("find");

  // Filter States
  const [search, setSearch] = React.useState("");
  const [filterRegion, setFilterRegion] = React.useState("all");
  const [filterDistrict, setFilterDistrict] = React.useState("all");
  const [filterVillage, setFilterVillage] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");
  const [filterProduce, setFilterProduce] = React.useState("all");
  const [filterCapacity, setFilterCapacity] = React.useState<number>(0);
  const [filterPrice, setFilterPrice] = React.useState<number>(1500); // Max rental charge per MT
  const [filterAvailability, setFilterAvailability] = React.useState("all");
  const [filterOwnership, setFilterOwnership] = React.useState("all");
  const [filterRating, setFilterRating] = React.useState<number>(0);

  // Modals
  const [selectedStorage, setSelectedStorage] = React.useState<ColdStorageListing | null>(null);
  const [bookingStorage, setBookingStorage] = React.useState<ColdStorageListing | null>(null);
  const [confirmedBooking, setConfirmedBooking] = React.useState<ColdStorageBooking | null>(null);
  const [viewingReceiptBooking, setViewingReceiptBooking] = React.useState<ColdStorageBooking | null>(null);
  const [newReviewText, setNewReviewText] = React.useState("");
  const [newReviewRating, setNewReviewRating] = React.useState(5);

  // Owner Form 7 Steps
  const [formStep, setFormStep] = React.useState(1);
  const [ownerForm, setOwnerForm] = React.useState({
    ownerName: "", ownerMobile: "", ownerEmail: "", aadhaarNumber: "", gstNumber: "", fssaiNumber: "",
    region: "", district: "", village: "", fullAddress: "", pincode: "", mapsUrl: "",
    name: "", facilityType: COLD_FACILITY_TYPES[0], ownershipType: "Private" as "Government" | "Private" | "Cooperative",
    licenseNumber: "", totalCapacityMT: 1000, availableCapacityMT: 1000, minBookingMT: 5,
    tempRange: "2°C to 4°C", humidityRange: "90% RH", rentalChargePerMT: 650, securityDeposit: 1500,
    workingHours: "07:00 AM - 09:00 PM", supportedProduce: [] as string[], facilities: [] as string[],
    images: [] as string[], description: ""
  });

  // Client Hydration & Storage Loading
  React.useEffect(() => {
    setIsMounted(true);
    const storedCold = localStorage.getItem("fasaldrishti_cold_storages");
    const storedBookings = localStorage.getItem("fasaldrishti_cold_bookings");
    const storedReviews = localStorage.getItem("fasaldrishti_cold_reviews");

    if (storedCold) {
      setColdStorages(JSON.parse(storedCold));
    } else {
      localStorage.setItem("fasaldrishti_cold_storages", JSON.stringify(DEFAULT_COLD_STORAGES));
      setColdStorages(DEFAULT_COLD_STORAGES);
    }

    if (storedBookings) setBookings(JSON.parse(storedBookings));
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      localStorage.setItem("fasaldrishti_cold_reviews", JSON.stringify(DEFAULT_COLD_REVIEWS));
      setReviews(DEFAULT_COLD_REVIEWS);
    }
  }, []);

  const saveStoragesToStorage = (updated: ColdStorageListing[]) => {
    setColdStorages(updated);
    localStorage.setItem("fasaldrishti_cold_storages", JSON.stringify(updated));
  };

  const saveBookingsToStorage = (updated: ColdStorageBooking[]) => {
    setBookings(updated);
    localStorage.setItem("fasaldrishti_cold_bookings", JSON.stringify(updated));
  };

  const saveReviewsToStorage = (updated: ColdStorageReview[]) => {
    setReviews(updated);
    localStorage.setItem("fasaldrishti_cold_reviews", JSON.stringify(updated));
  };

  // Cascading Filter Handlers
  const handleRegionChange = (reg: string) => {
    setFilterRegion(reg);
    setFilterDistrict("all");
    setFilterVillage("all");
  };

  const handleDistrictChange = (dist: string) => {
    setFilterDistrict(dist);
    setFilterVillage("all");
  };

  const getAvailableDistricts = () => {
    if (filterRegion === "all") return Object.values(REGION_DISTRICT_MAP).flat();
    return REGION_DISTRICT_MAP[filterRegion] || [];
  };

  const getAvailableVillages = () => {
    if (filterDistrict === "all") {
      const setOfVils = new Set<string>();
      getAvailableDistricts().forEach(d => (DISTRICT_VILLAGE_MAP[d] || []).forEach(v => setOfVils.add(v)));
      coldStorages.forEach(cs => { if (filterRegion === "all" || cs.region === filterRegion) setOfVils.add(cs.village); });
      return Array.from(setOfVils);
    }
    const standard = DISTRICT_VILLAGE_MAP[filterDistrict] || [];
    const fromListings = coldStorages.filter(cs => cs.district === filterDistrict).map(cs => cs.village);
    return Array.from(new Set([...standard, ...fromListings]));
  };

  // Main Filtering Logic
  const filteredStorages = coldStorages.filter((cs) => {
    if (activeTab !== "admin" && cs.status !== "Approved") return false;

    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      cs.name.toLowerCase().includes(searchLower) ||
      cs.ownerName.toLowerCase().includes(searchLower) ||
      cs.village.toLowerCase().includes(searchLower) ||
      cs.district.toLowerCase().includes(searchLower) ||
      cs.region.toLowerCase().includes(searchLower) ||
      cs.supportedProduce.some(p => p.toLowerCase().includes(searchLower));

    const matchesRegion = filterRegion === "all" || cs.region === filterRegion;
    const matchesDistrict = filterDistrict === "all" || cs.district === filterDistrict;
    const matchesVillage = filterVillage === "all" || cs.village.toLowerCase() === filterVillage.toLowerCase();

    const matchesType = filterType === "all" || cs.facilityType === filterType;
    const matchesProduce = filterProduce === "all" || cs.supportedProduce.includes(filterProduce);
    const matchesCapacity = cs.availableCapacityMT >= filterCapacity;
    const matchesPrice = cs.rentalChargePerMT <= filterPrice;

    let matchesAvailability = true;
    if (filterAvailability === "available") matchesAvailability = cs.availableCapacityMT > 0;
    else if (filterAvailability === "full") matchesAvailability = cs.availableCapacityMT <= 0;

    const matchesOwnership = filterOwnership === "all" || cs.ownershipType === filterOwnership;
    const matchesRating = cs.rating >= filterRating;

    return matchesSearch && matchesRegion && matchesDistrict && matchesVillage && 
      matchesType && matchesProduce && matchesCapacity && matchesPrice && 
      matchesAvailability && matchesOwnership && matchesRating;
  });

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingStorage) return;

    const formData = new FormData(e.currentTarget);
    const quantityMT = Number(formData.get("quantityMT"));
    const durationMonths = Number(formData.get("durationMonths"));
    const arrivalDate = formData.get("arrivalDate") as string;

    if (quantityMT > bookingStorage.availableCapacityMT) {
      alert(`Requested capacity (${quantityMT} MT) exceeds available cold chamber space (${bookingStorage.availableCapacityMT} MT).`);
      return;
    }

    if (quantityMT < bookingStorage.minBookingMT) {
      alert(`Minimum chamber booking is ${bookingStorage.minBookingMT} MT.`);
      return;
    }

    const arr = new Date(arrivalDate || Date.now());
    arr.setMonth(arr.getMonth() + durationMonths);
    const pickupDate = arr.toISOString().split("T")[0];

    const baseCharge = quantityMT * bookingStorage.rentalChargePerMT * durationMonths;
    const taxAmount = Math.round(baseCharge * 0.18);
    const securityDeposit = bookingStorage.securityDeposit;
    const grandTotal = baseCharge + taxAmount + securityDeposit;

    const newBooking: ColdStorageBooking = {
      id: "KM-CS-" + Math.floor(10000 + Math.random() * 90000),
      facilityId: bookingStorage.id,
      facilityName: bookingStorage.name,
      farmerName: formData.get("farmerName") as string,
      farmerMobile: formData.get("farmerMobile") as string,
      region: formData.get("region") as string,
      district: formData.get("district") as string,
      village: formData.get("village") as string,
      produce: formData.get("produce") as string,
      quantityMT: quantityMT,
      arrivalDate: arrivalDate,
      durationMonths: durationMonths,
      pickupDate: pickupDate,
      requiredTemp: bookingStorage.tempRange,
      specialInstructions: formData.get("specialInstructions") as string,
      chamberCharges: baseCharge,
      taxAmount: taxAmount,
      securityDeposit: securityDeposit,
      totalAmount: grandTotal,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    };

    const updatedStorages = coldStorages.map((cs) => {
      if (cs.id === bookingStorage.id) {
        return { ...cs, availableCapacityMT: Math.max(0, cs.availableCapacityMT - quantityMT) };
      }
      return cs;
    });

    const updatedBookings = [newBooking, ...bookings];

    saveStoragesToStorage(updatedStorages);
    saveBookingsToStorage(updatedBookings);

    setBookingStorage(null);
    setConfirmedBooking(newBooking);
  };

  // Cancel Booking
  const handleCancelBooking = (id: string) => {
    const bookingToCancel = bookings.find(b => b.id === id);
    if (!bookingToCancel) return;

    if (confirm("Are you sure you want to cancel this cold chamber reservation? Available capacity will be restored.")) {
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" as const } : b);
      const updatedStorages = coldStorages.map(cs => {
        if (cs.id === bookingToCancel.facilityId) {
          return { ...cs, availableCapacityMT: cs.availableCapacityMT + bookingToCancel.quantityMT };
        }
        return cs;
      });

      saveBookingsToStorage(updatedBookings);
      saveStoragesToStorage(updatedStorages);
    }
  };

  // Publish Cold Storage Owner Listing
  const handlePublishColdStorage = (isDraft: boolean) => {
    const newId = "cs-" + (coldStorages.length + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
    const newListing: ColdStorageListing = {
      id: newId,
      name: ownerForm.name || "Commercial Cold Storage Facility",
      ownerName: ownerForm.ownerName,
      ownerMobile: ownerForm.ownerMobile,
      ownerEmail: ownerForm.ownerEmail,
      ownershipType: ownerForm.ownershipType,
      region: ownerForm.region || "North Gujarat",
      district: ownerForm.district || "Banaskantha",
      village: ownerForm.village || "Deesa",
      fullAddress: ownerForm.fullAddress || "Cold Storage Zone Road",
      pincode: ownerForm.pincode || "385535",
      mapsUrl: ownerForm.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(ownerForm.fullAddress)}`,
      facilityType: ownerForm.facilityType,
      licenseNumber: ownerForm.licenseNumber || "CS-GJ-2026-" + Math.floor(1000 + Math.random() * 9000),
      fssaiNumber: ownerForm.fssaiNumber,
      gstNumber: ownerForm.gstNumber,
      totalCapacityMT: Number(ownerForm.totalCapacityMT),
      availableCapacityMT: Number(ownerForm.availableCapacityMT),
      minBookingMT: Number(ownerForm.minBookingMT),
      tempRange: ownerForm.tempRange,
      humidityRange: ownerForm.humidityRange,
      rentalChargePerMT: Number(ownerForm.rentalChargePerMT),
      securityDeposit: Number(ownerForm.securityDeposit),
      workingHours: ownerForm.workingHours,
      supportedProduce: ownerForm.supportedProduce.length > 0 ? ownerForm.supportedProduce : ["Potato", "Onion & Garlic"],
      facilities: ownerForm.facilities.length > 0 ? ownerForm.facilities : ["24x7 Diesel Generator Backup", "Automated Digital Climate Logging"],
      description: ownerForm.description || "Modern climate-controlled cold storage chamber.",
      images: ownerForm.images.length > 0 ? ownerForm.images : ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      isFssaiVerified: !!ownerForm.fssaiNumber,
      isLicenseVerified: true,
      isGstVerified: !!ownerForm.gstNumber,
      status: isDraft ? "Pending" : "Approved",
      hasPowerBackup: true
    };

    const updated = [newListing, ...coldStorages];
    saveStoragesToStorage(updated);

    // Reset Form
    setOwnerForm({
      ownerName: "", ownerMobile: "", ownerEmail: "", aadhaarNumber: "", gstNumber: "", fssaiNumber: "",
      region: "", district: "", village: "", fullAddress: "", pincode: "", mapsUrl: "",
      name: "", facilityType: COLD_FACILITY_TYPES[0], ownershipType: "Private", licenseNumber: "",
      totalCapacityMT: 1000, availableCapacityMT: 1000, minBookingMT: 5, tempRange: "2°C to 4°C",
      humidityRange: "90% RH", rentalChargePerMT: 650, securityDeposit: 1500, workingHours: "07:00 AM - 09:00 PM",
      supportedProduce: [], facilities: [], images: [], description: ""
    });
    setFormStep(1);

    setActiveTab("find");
    setFilterRegion(newListing.region);
    setFilterDistrict(newListing.district);
    setFilterVillage(newListing.village);
  };

  // Add Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStorage || !newReviewText.trim()) return;

    const newRev: ColdStorageReview = {
      id: "crev-" + Date.now(),
      facilityId: selectedStorage.id,
      farmerName: "Rajesh Kumar (Verified Farmer)",
      rating: newReviewRating,
      comment: newReviewText,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedReviews = [newRev, ...reviews];
    saveReviewsToStorage(updatedReviews);

    const facilityRevs = updatedReviews.filter(r => r.facilityId === selectedStorage.id);
    const avgRating = Number((facilityRevs.reduce((acc, r) => acc + r.rating, 0) / facilityRevs.length).toFixed(1));

    const updatedStorages = coldStorages.map(cs => {
      if (cs.id === selectedStorage.id) {
        return { ...cs, rating: avgRating, reviewsCount: facilityRevs.length };
      }
      return cs;
    });
    saveStoragesToStorage(updatedStorages);

    setNewReviewText("");
  };

  // Admin Controls
  const handleAdminStatus = (id: string, status: ColdStorageListing["status"]) => {
    const updated = coldStorages.map(cs => cs.id === id ? { ...cs, status } : cs);
    saveStoragesToStorage(updated);
  };

  const handleAdminToggleFeature = (id: string) => {
    const updated = coldStorages.map(cs => cs.id === id ? { ...cs, isFeatured: !cs.isFeatured } : cs);
    saveStoragesToStorage(updated);
  };

  const handleAdminDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this cold storage listing?")) {
      const updated = coldStorages.filter(cs => cs.id !== id);
      saveStoragesToStorage(updated);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14] flex flex-col items-center justify-center text-emerald-400">
        <RefreshCw className="h-10 w-10 animate-spin" />
        <span className="mt-4 text-xs font-bold tracking-wider">LOADING COLD STORAGE MARKETPLACE...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col pb-24">
        {/* Header Section */}
        <section className="py-12 bg-transparent">
          <Container className="text-center space-y-4 max-w-4xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">Services</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Cold Storage Marketplace</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Snowflake className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gujarat's Climate-Controlled Commercial Cold Chain Hub</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight leading-tight">
              Cold Storage & CA Chamber <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Rental Marketplace</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Reserve partial MT cold storage space in verified CA chambers and chilling godowns for potatoes, fruits, spices, and perishable produce.
            </p>

            {/* TAB SELECT SWITCHER */}
            <div className="pt-6 flex flex-wrap justify-center gap-2">
              <div className="inline-flex rounded-2xl bg-white/80 dark:bg-[#161B22]/90 p-1.5 border border-emerald-100 dark:border-[#2A2F3A] backdrop-blur-md shadow-sm">
                <button
                  onClick={() => setActiveTab("find")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === "find" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Snowflake className="h-4 w-4" />
                  ❄️ Find Cold Storage
                </button>
                <button
                  onClick={() => { setActiveTab("list"); setFormStep(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === "list" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Plus className="h-4 w-4" />
                  🏭 List Your Cold Storage
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* ===========================================================
            TAB 1: FIND COLD STORAGE
            =========================================================== */}
        {activeTab === "find" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-7xl space-y-6">
              
              {/* SEARCH BAR & COUNTER */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-[#161B22]/90 border border-emerald-100/80 dark:border-[#2A2F3A] p-4 rounded-3xl backdrop-blur-md shadow-xs">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by facility name, produce type (potato, mango, spices), village, district, or owner..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0">
                  Showing {filteredStorages.length} Verified Cold Stores
                </div>
              </div>

              {/* LAYOUT: CASCADING FILTERS + COLD STORAGE GRID */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* SIDEBAR CASCADING FILTERS */}
                <div className="w-full lg:w-80 shrink-0 bg-white/80 dark:bg-[#161B22]/95 border border-emerald-100/80 dark:border-[#2A2F3A] rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-sm sticky top-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                    <h3 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white">
                      <SlidersHorizontal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Cold Storage Filters
                    </h3>
                    <button
                      onClick={() => {
                        setFilterRegion("all"); setFilterDistrict("all"); setFilterVillage("all");
                        setFilterType("all"); setFilterProduce("all"); setFilterCapacity(0);
                        setFilterPrice(1500); setFilterAvailability("all"); setFilterOwnership("all");
                        setFilterRating(0); setSearch("");
                      }}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* 1. REGION */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">1. Region</label>
                    <select
                      value={filterRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Regions (Statewide)</option>
                      {Object.keys(REGION_DISTRICT_MAP).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. DISTRICT */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">2. District</label>
                    <select
                      value={filterDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Districts</option>
                      {getAvailableDistricts().map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. VILLAGE */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">3. Village / Taluka</label>
                    <select
                      value={filterVillage}
                      onChange={(e) => setFilterVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Villages</option>
                      {getAvailableVillages().map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. FACILITY TYPE */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Chamber Facility Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Facility Types</option>
                      {COLD_FACILITY_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. PRODUCE TYPE */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Produce to Store</label>
                    <select
                      value={filterProduce}
                      onChange={(e) => setFilterProduce(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Produce Types</option>
                      {SUPPORTED_PRODUCE.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* 6. MAX RENTAL PRICE */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 dark:text-[#8B949E]">Max Price / MT:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono">₹{filterPrice}/MT/Mo</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="1500"
                      step="50"
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* 7. RATING */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Minimum Rating</label>
                    <div className="flex items-center gap-2">
                      {[0, 4.0, 4.5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setFilterRating(r)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${filterRating === r ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 dark:bg-[#0B0F14] text-slate-700 dark:text-[#C9D1D9] border-slate-200 dark:border-[#2A2F3A]"}`}
                        >
                          {r === 0 ? "All" : `${r}★+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLD STORAGE CARDS GRID */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStorages.length > 0 ? (
                    filteredStorages.map((cs) => {
                      const occupiedPct = Math.round(((cs.totalCapacityMT - cs.availableCapacityMT) / cs.totalCapacityMT) * 100);
                      const isFull = cs.availableCapacityMT <= 0;

                      return (
                        <div
                          key={cs.id}
                          className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                        >
                          <div className="space-y-3">
                            {/* Image Visual */}
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0B0F14]">
                              <img
                                src={cs.images[0]}
                                alt={cs.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              
                              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <Snowflake className="h-3 w-3" />
                                  FasalDrishti Verified
                                </span>
                                {cs.isFssaiVerified && (
                                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    ✓ FSSAI
                                  </span>
                                )}
                              </div>

                              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                <div className="text-white">
                                  <span className="text-[10px] uppercase font-bold text-emerald-300">{cs.facilityType}</span>
                                  <h3 className="text-base font-extrabold leading-tight text-white">{cs.name}</h3>
                                </div>
                                <div className="bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-amber-500 flex items-center gap-1 shadow-sm">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                                  <span>{cs.rating}</span>
                                  <span className="text-[10px] text-slate-500">({cs.reviewsCount})</span>
                                </div>
                              </div>
                            </div>

                            {/* Climate Specs Bar */}
                            <div className="flex items-center justify-between text-xs bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold">
                              <div className="flex items-center gap-1.5">
                                <Thermometer className="h-4 w-4 text-rose-500 shrink-0" />
                                <span>Temp: {cs.tempRange}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Droplets className="h-4 w-4 text-cyan-500 shrink-0" />
                                <span>RH: {cs.humidityRange}</span>
                              </div>
                            </div>

                            {/* Location & Details */}
                            <div className="space-y-2 text-xs text-slate-600 dark:text-[#C9D1D9]">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span>{cs.village}, {cs.district} ({cs.region})</span>
                                </div>
                                <a
                                  href={cs.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                                >
                                  <ExternalLink className="h-3 w-3" /> Map
                                </a>
                              </div>

                              {/* Capacity Bar */}
                              <div className="rounded-xl bg-slate-50 dark:bg-[#111827] p-3 border border-slate-100 dark:border-[#2A2F3A] space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-extrabold">
                                  <span>Available: <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{cs.availableCapacityMT} MT</span></span>
                                  <span className="text-slate-500 dark:text-[#8B949E]">Total: {cs.totalCapacityMT} MT</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${isFull ? "bg-rose-500" : occupiedPct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    style={{ width: `${occupiedPct}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 dark:text-[#8B949E]">
                                  <span>Occupied: {occupiedPct}%</span>
                                  <span>Min Booking: {cs.minBookingMT} MT</span>
                                </div>
                              </div>

                              {/* Produce Badges */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {cs.supportedProduce.slice(0, 3).map((p) => (
                                  <span key={p} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50">
                                    {p}
                                  </span>
                                ))}
                                {cs.supportedProduce.length > 3 && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]">
                                    +{cs.supportedProduce.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-3 border-t border-slate-100 dark:border-[#2A2F3A] flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">Rental Charge</div>
                              <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                                ₹{cs.rentalChargePerMT} <span className="text-xs font-normal text-slate-500">/MT/mo</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStorage(cs)}
                                className="text-xs font-bold"
                              >
                                Details
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={isFull}
                                onClick={() => setBookingStorage(cs)}
                                className="gap-1 text-xs font-black shadow-sm"
                              >
                                Book Chamber <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-16 text-center space-y-4 bg-white/70 dark:bg-[#161B22]/70 border border-emerald-100 dark:border-[#2A2F3A] rounded-3xl backdrop-blur-md">
                      <Snowflake className="h-12 w-12 text-slate-400 mx-auto animate-pulse" />
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Cold Storage Found</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-md mx-auto">
                        No verified cold store matches your active filters. Try clearing search or selecting another region.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            TAB 2: LIST YOUR COLD STORAGE (7-STEP OWNER FORM)
            =========================================================== */}
        {activeTab === "list" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-4xl">
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 sm:p-10 shadow-xl space-y-8">
                
                {/* STEP PROGRESS BAR */}
                <div className="space-y-4 border-b border-slate-100 dark:border-[#2A2F3A] pb-6">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                    <span>Step {formStep} of 7 — Cold Storage Facility Registration</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{Math.round((formStep / 7) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0B0F14] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full transition-all duration-300" style={{ width: `${(formStep / 7) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-[#8B949E] overflow-x-auto no-scrollbar">
                    {["Owner", "Location", "Chambers", "Produce", "Facilities", "Photos", "Publish"].map((lbl, idx) => (
                      <button key={lbl} onClick={() => setFormStep(idx + 1)} className={`cursor-pointer hover:text-emerald-600 ${formStep === idx + 1 ? "text-emerald-600 font-black dark:text-emerald-400" : ""}`}>
                        {idx + 1}. {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 1 */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 1: Cold Storage Owner Info</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Provide verified contact details and food safety licensing.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Owner / Business Name *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.ownerName}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerName: e.target.value })}
                          placeholder="e.g. Jignesh Chaudhari"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Mobile Number (WhatsApp) *</label>
                        <input
                          type="tel"
                          required
                          value={ownerForm.ownerMobile}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerMobile: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={ownerForm.ownerEmail}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerEmail: e.target.value })}
                          placeholder="owner@coldstorage.com"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">FSSAI License Number (Food Safety)</label>
                        <input
                          type="text"
                          value={ownerForm.fssaiNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, fssaiNumber: e.target.value })}
                          placeholder="14-digit FSSAI License"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1">GST Number (Optional for Tax Receipts)</label>
                        <input
                          type="text"
                          value={ownerForm.gstNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, gstNumber: e.target.value })}
                          placeholder="24AAAAA0000A1Z5"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 2: Location Hierarchy</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Select location. Your cold store automatically appears under Region → District → Village.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Region *</label>
                        <select
                          value={ownerForm.region}
                          onChange={(e) => {
                            const reg = e.target.value;
                            const dists = REGION_DISTRICT_MAP[reg] || [];
                            setOwnerForm({ ...ownerForm, region: reg, district: dists[0] || "", village: "" });
                          }}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        >
                          <option value="">Select Region</option>
                          {Object.keys(REGION_DISTRICT_MAP).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">District *</label>
                        <select
                          value={ownerForm.district}
                          onChange={(e) => {
                            const dist = e.target.value;
                            const vils = DISTRICT_VILLAGE_MAP[dist] || [];
                            setOwnerForm({ ...ownerForm, district: dist, village: vils[0] || "" });
                          }}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        >
                          <option value="">Select District</option>
                          {(REGION_DISTRICT_MAP[ownerForm.region] || []).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Village / Taluka *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.village}
                          onChange={(e) => setOwnerForm({ ...ownerForm, village: e.target.value })}
                          placeholder="e.g. Deesa / Talala"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1">Full Street Address *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.fullAddress}
                          onChange={(e) => setOwnerForm({ ...ownerForm, fullAddress: e.target.value })}
                          placeholder="Cold Storage Zone Road, Near APMC Market Yard"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.pincode}
                          onChange={(e) => setOwnerForm({ ...ownerForm, pincode: e.target.value })}
                          placeholder="6-digit Pincode"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-bold mb-1">Google Maps Location Link</label>
                        <input
                          type="url"
                          value={ownerForm.mapsUrl}
                          onChange={(e) => setOwnerForm({ ...ownerForm, mapsUrl: e.target.value })}
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 3: Chamber Climate Specs & Tariffs</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Specify temperature control ranges, total MT capacity, and monthly rental tariffs.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Cold Storage Facility Name *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.name}
                          onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                          placeholder="e.g. Royal Potato CA Cold Storage"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Facility Type *</label>
                        <select
                          value={ownerForm.facilityType}
                          onChange={(e) => setOwnerForm({ ...ownerForm, facilityType: e.target.value })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        >
                          {COLD_FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Ownership *</label>
                        <select
                          value={ownerForm.ownershipType}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownershipType: e.target.value as any })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        >
                          <option value="Government">Government</option>
                          <option value="Private">Private</option>
                          <option value="Cooperative">Cooperative</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">License Number *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.licenseNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, licenseNumber: e.target.value })}
                          placeholder="CS-GJ-2026-XXXX"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Temperature Control Range (°C) *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.tempRange}
                          onChange={(e) => setOwnerForm({ ...ownerForm, tempRange: e.target.value })}
                          placeholder="e.g. 2°C to 4°C or -18°C to -25°C"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Humidity Control (RH%) *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.humidityRange}
                          onChange={(e) => setOwnerForm({ ...ownerForm, humidityRange: e.target.value })}
                          placeholder="e.g. 90% - 95% RH"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Total Capacity (MT) *</label>
                        <input
                          type="number"
                          required
                          min="10"
                          value={ownerForm.totalCapacityMT}
                          onChange={(e) => setOwnerForm({ ...ownerForm, totalCapacityMT: Number(e.target.value), availableCapacityMT: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Rental Charge (₹ / MT / Month) *</label>
                        <input
                          type="number"
                          required
                          min="100"
                          value={ownerForm.rentalChargePerMT}
                          onChange={(e) => setOwnerForm({ ...ownerForm, rentalChargePerMT: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {formStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 4: Supported Produce & Commodities</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Select all perishable crops and goods accepted inside your cold rooms.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {SUPPORTED_PRODUCE.map((p) => {
                        const isChecked = ownerForm.supportedProduce.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              const updated = isChecked
                                ? ownerForm.supportedProduce.filter(i => i !== p)
                                : [...ownerForm.supportedProduce, p];
                              setOwnerForm({ ...ownerForm, supportedProduce: updated });
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between font-bold transition-all cursor-pointer ${isChecked ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-700 dark:text-[#C9D1D9]"}`}
                          >
                            <span>{p}</span>
                            {isChecked ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {formStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 5: Cold Storage Facilities</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Check all climate-control and logistics amenities available at your facility.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {ALL_COLD_FACILITIES.map((f) => {
                        const isChecked = ownerForm.facilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              const updated = isChecked
                                ? ownerForm.facilities.filter(i => i !== f)
                                : [...ownerForm.facilities, f];
                              setOwnerForm({ ...ownerForm, facilities: updated });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between font-bold transition-all cursor-pointer ${isChecked ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-700 dark:text-[#C9D1D9]"}`}
                          >
                            <span>{f}</span>
                            {isChecked ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 6 */}
                {formStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 6: Facility Photos</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Provide image URLs or select high-resolution cold storage visual presets.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Image URL (Public HTTPS Link)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={ownerForm.images[0] || ""}
                          onChange={(e) => setOwnerForm({ ...ownerForm, images: [e.target.value] })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-bold">Or Select Preset Gallery Visual:</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
                          ].map((url, idx) => (
                            <div
                              key={idx}
                              onClick={() => setOwnerForm({ ...ownerForm, images: [url] })}
                              className={`h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${ownerForm.images[0] === url ? "border-emerald-500 scale-105" : "border-transparent"}`}
                            >
                              <img src={url} alt="Preset" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7 */}
                {formStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 7: Final Review & Publish</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Review your cold storage specs and publish to the marketplace.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Facility Description *</label>
                        <textarea
                          rows={4}
                          value={ownerForm.description}
                          onChange={(e) => setOwnerForm({ ...ownerForm, description: e.target.value })}
                          placeholder="Describe refrigeration technology, generator backup power, temperature logging frequency, dock handling..."
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30 space-y-2">
                        <div className="font-extrabold text-emerald-800 dark:text-emerald-300">Listing Overview:</div>
                        <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-[#C9D1D9]">
                          <div>Facility: <strong className="text-slate-900 dark:text-white">{ownerForm.name || "Untitled Cold Store"}</strong></div>
                          <div>Location: <strong className="text-slate-900 dark:text-white">{ownerForm.village}, {ownerForm.district}</strong></div>
                          <div>Temp Range: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{ownerForm.tempRange}</strong></div>
                          <div>Rental Rate: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">₹{ownerForm.rentalChargePerMT}/MT/Month</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NAVIGATION BUTTONS */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#2A2F3A] flex items-center justify-between">
                  {formStep > 1 ? (
                    <Button variant="outline" size="sm" onClick={() => setFormStep(formStep - 1)} className="gap-1">
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </Button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    {formStep === 7 ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handlePublishColdStorage(true)}>
                          Save Draft
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handlePublishColdStorage(false)} className="gap-1 font-black">
                          Publish Cold Storage <Check className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => setFormStep(formStep + 1)} className="gap-1 font-bold">
                        Next Step <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            SECONDARY VIEW 1: MY BOOKINGS
            =========================================================== */}
        {activeTab === "my-bookings" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2A2F3A] pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    My Cold Chamber Reservations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">View active temperature reservations, download official payment receipts, and manage pickup dates.</p>
                </div>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/30">
                            {b.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"}`}>
                            {b.status}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{b.facilityName}</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-[#C9D1D9]">
                          <div>Farmer: <strong className="text-slate-900 dark:text-white">{b.farmerName}</strong></div>
                          <div>Produce: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{b.produce}</strong></div>
                          <div>Quantity: <strong className="text-slate-900 dark:text-white font-mono">{b.quantityMT} MT</strong></div>
                          <div>Temp Set: <strong className="text-rose-500 font-mono font-bold">{b.requiredTemp}</strong></div>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-[#8B949E]">
                          Arrival: {b.arrivalDate} • Expected Pickup: {b.pickupDate}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-[#2A2F3A] pt-3 md:pt-0 md:pl-6 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">Total Amount</div>
                          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">₹{b.totalAmount.toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewingReceiptBooking(b)} className="gap-1 text-xs">
                            <Download className="h-3.5 w-3.5" /> Receipt
                          </Button>
                          {b.status === "Confirmed" && (
                            <Button variant="outline" size="sm" onClick={() => handleCancelBooking(b.id)} className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 bg-white/70 dark:bg-[#161B22]/70 border border-emerald-100 dark:border-[#2A2F3A] rounded-3xl backdrop-blur-md">
                  <Snowflake className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">No Active Cold Storage Bookings</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">You haven't reserved cold room space yet. Switch to "Find Cold Storage" to browse facilities.</p>
                </div>
              )}
            </Container>
          </section>
        )}

        {/* ===========================================================
            SECONDARY VIEW 2: MY CHAMBERS / OWNER DASHBOARD
            =========================================================== */}
        {activeTab === "my-chambers" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  Cold Storage Owner Dashboard
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8B949E]">Monitor cold chamber capacities, generator backup status, and monthly rental revenues.</p>
              </div>

              {/* STATS METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Total Facilities</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{coldStorages.length}</div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Total Cold Capacity</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {coldStorages.reduce((acc, cs) => acc + cs.totalCapacityMT, 0)} MT
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Available Chamber Space</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {coldStorages.reduce((acc, cs) => acc + cs.availableCapacityMT, 0)} MT
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Estimated Monthly Revenue</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    ₹{bookings.reduce((acc, b) => acc + b.chamberCharges, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* LISTINGS TABLE */}
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Cold Facilities</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#2A2F3A] text-slate-400 dark:text-[#8B949E]">
                        <th className="py-3 px-2">Facility Name</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">Temp Range</th>
                        <th className="py-3 px-2">Available</th>
                        <th className="py-3 px-2">Rate / MT</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2F3A]">
                      {coldStorages.map((cs) => (
                        <tr key={cs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{cs.name}</td>
                          <td className="py-3 px-2">{cs.village}, {cs.district}</td>
                          <td className="py-3 px-2 font-mono text-rose-500 font-bold">{cs.tempRange}</td>
                          <td className="py-3 px-2 font-mono font-bold text-emerald-600">{cs.availableCapacityMT} MT</td>
                          <td className="py-3 px-2 font-mono">₹{cs.rentalChargePerMT}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                              {cs.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button onClick={() => setSelectedStorage(cs)} className="text-emerald-600 hover:underline font-bold">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            SECONDARY VIEW 3: ADMIN PANEL
            =========================================================== */}
        {activeTab === "admin" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-6xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2A2F3A] pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    Cold Storage Admin Management Panel
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">Approve, suspend, verify FSSAI/License credentials, or feature cold stores across Gujarat.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 space-y-4 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#2A2F3A] text-slate-400 dark:text-[#8B949E]">
                        <th className="py-3 px-2">Cold Storage</th>
                        <th className="py-3 px-2">Owner & Mobile</th>
                        <th className="py-3 px-2">FSSAI / License</th>
                        <th className="py-3 px-2">Temp Control</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Featured</th>
                        <th className="py-3 px-2 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2F3A]">
                      {coldStorages.map((cs) => (
                        <tr key={cs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{cs.name}</td>
                          <td className="py-3 px-2">{cs.ownerName} ({cs.ownerMobile})</td>
                          <td className="py-3 px-2 font-mono text-[11px]">{cs.fssaiNumber || cs.licenseNumber}</td>
                          <td className="py-3 px-2 font-mono text-rose-500 font-bold">{cs.tempRange}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cs.status === "Approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"}`}>
                              {cs.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button onClick={() => handleAdminToggleFeature(cs.id)} className="cursor-pointer">
                              {cs.isFeatured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <Star className="h-4 w-4 text-slate-300" />}
                            </button>
                          </td>
                          <td className="py-3 px-2 text-right space-x-1">
                            {cs.status !== "Approved" && (
                              <button onClick={() => handleAdminStatus(cs.id, "Approved")} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 cursor-pointer">
                                Approve
                              </button>
                            )}
                            {cs.status !== "Suspended" && (
                              <button onClick={() => handleAdminStatus(cs.id, "Suspended")} className="px-2 py-1 bg-amber-600 text-white rounded-md text-[10px] font-bold hover:bg-amber-700 cursor-pointer">
                                Suspend
                              </button>
                            )}
                            <button onClick={() => handleAdminDelete(cs.id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-[10px] font-bold hover:bg-rose-700 cursor-pointer">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            MODAL 1: COLD STORAGE DETAILS & REVIEWS & CALENDAR
            =========================================================== */}
        {selectedStorage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedStorage(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Visual Hero */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#161B22]">
                <img src={selectedStorage.images[0]} alt={selectedStorage.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Snowflake className="h-3 w-3" /> FasalDrishti Verified
                    </span>
                    {selectedStorage.isFssaiVerified && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        ✓ FSSAI Licensed
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black">{selectedStorage.name}</h2>
                  <p className="text-xs text-slate-300">{selectedStorage.village}, {selectedStorage.district} ({selectedStorage.region})</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                  <div className="text-slate-400">Total Capacity</div>
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono">{selectedStorage.totalCapacityMT} MT</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
                  <div className="text-emerald-700 dark:text-emerald-300">Available Space</div>
                  <div className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">{selectedStorage.availableCapacityMT} MT</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                  <div className="text-slate-400">Temp Range</div>
                  <div className="text-base font-black text-rose-500 font-mono">{selectedStorage.tempRange}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                  <div className="text-slate-400">Rental Rate</div>
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono">₹{selectedStorage.rentalChargePerMT}/MT/mo</div>
                </div>
              </div>

              {/* 30-DAY CHAMBER CALENDAR */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span>Chamber Availability & Temperature Sensor Log (30-Day Outlook)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {selectedStorage.availableCapacityMT > 0 ? "🟢 Chamber Space Available" : "🔴 Fully Occupied"}
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const isReserved = i % 8 === 3 || i % 8 === 6;
                    const isFull = selectedStorage.availableCapacityMT <= 0;
                    return (
                      <div
                        key={i}
                        title={`Day ${i + 1}: ${isFull ? "Fully Occupied" : isReserved ? "Reserved" : "Available"}`}
                        className={`h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white transition-all ${isFull ? "bg-rose-500" : isReserved ? "bg-amber-500" : "bg-emerald-500"}`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Supported Produce & Facilities */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Supported Perishable Produce:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStorage.supportedProduce.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/50">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Cold Storage Facilities & Amenities:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedStorage.facilities.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-slate-700 dark:text-[#C9D1D9]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Address & Owner Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A] space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Owner & Location Specs:</div>
                <div className="space-y-1 text-slate-600 dark:text-[#C9D1D9]">
                  <div>Owner Name: <strong className="text-slate-900 dark:text-white">{selectedStorage.ownerName}</strong></div>
                  <div>Contact Mobile: <a href={`tel:${selectedStorage.ownerMobile}`} className="text-emerald-600 font-bold hover:underline">{selectedStorage.ownerMobile}</a></div>
                  <div>Address: {selectedStorage.fullAddress}, Pincode: {selectedStorage.pincode}</div>
                  <div>Working Hours: {selectedStorage.workingHours}</div>
                </div>
              </div>

              {/* REVIEWS */}
              <div className="border-t border-slate-100 dark:border-[#2A2F3A] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    Farmer Reviews ({reviews.filter(r => r.facilityId === selectedStorage.id).length})
                  </h4>
                  <span className="text-xs font-mono font-extrabold text-amber-500">{selectedStorage.rating} / 5.0 ★</span>
                </div>

                <form onSubmit={handleAddReview} className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setNewReviewRating(star)} className="cursor-pointer text-amber-400">
                        <Star className={`h-4 w-4 ${star <= newReviewRating ? "fill-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Write your experience storing cold produce..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                    />
                    <Button variant="primary" size="sm" type="submit">Submit</Button>
                  </div>
                </form>

                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {reviews.filter(r => r.facilityId === selectedStorage.id).map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900 dark:text-white">{r.farmerName}</span>
                        <span className="text-amber-500">{r.rating}★</span>
                      </div>
                      <p className="text-slate-600 dark:text-[#C9D1D9] text-[11px]">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  disabled={selectedStorage.availableCapacityMT <= 0}
                  onClick={() => {
                    setBookingStorage(selectedStorage);
                    setSelectedStorage(null);
                  }}
                  className="w-full sm:w-auto justify-center font-black"
                >
                  Proceed to Book Cold Chamber
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===========================================================
            MODAL 2: BOOK COLD CHAMBER FORM
            =========================================================== */}
        {bookingStorage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-5">
              <button
                onClick={() => setBookingStorage(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Book Cold Chamber Space</h3>
                <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">
                  {bookingStorage.name} • Available: <strong className="text-emerald-600">{bookingStorage.availableCapacityMT} MT</strong>
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Farmer Full Name *</label>
                    <input
                      type="text"
                      name="farmerName"
                      required
                      placeholder="e.g. Ramesh Bhai Patel"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="farmerMobile"
                      required
                      placeholder="10-digit mobile"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold mb-1">Region</label>
                    <input type="text" name="region" readOnly defaultValue={bookingStorage.region} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">District</label>
                    <input type="text" name="district" readOnly defaultValue={bookingStorage.district} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Village</label>
                    <input type="text" name="village" readOnly defaultValue={bookingStorage.village} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Select Produce *</label>
                    <select name="produce" required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white">
                      {bookingStorage.supportedProduce.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Quantity Required (MT) *</label>
                    <input
                      type="number"
                      name="quantityMT"
                      required
                      min={bookingStorage.minBookingMT}
                      max={bookingStorage.availableCapacityMT}
                      defaultValue={Math.min(10, bookingStorage.availableCapacityMT)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Expected Arrival Date *</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Chamber Storage Period *</label>
                    <select name="durationMonths" required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white">
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Special Handling Instructions (Optional)</label>
                  <input
                    type="text"
                    name="specialInstructions"
                    placeholder="e.g. Crate stacking / Pre-chilling before room entry"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full justify-center py-3 font-black text-xs shadow-md">
                  Confirm Cold Room Reservation
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ===========================================================
            MODAL 3: BOOKING CONFIRMED & PAYMENT SUMMARY RECEIPT
            =========================================================== */}
        {(confirmedBooking || viewingReceiptBooking) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
              <button
                onClick={() => { setConfirmedBooking(null); setViewingReceiptBooking(null); }}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {(() => {
                const item = confirmedBooking || viewingReceiptBooking!;
                return (
                  <div className="space-y-4">
                    <div className="text-center space-y-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-4">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Cold Room Reserved!</h3>
                      <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                        Booking ID: {item.id}
                      </div>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                      <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-[#2A2F3A] pb-2">
                        Official Cold Storage Payment Invoice
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Facility:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.facilityName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farmer:</span>
                        <span>{item.farmerName} ({item.farmerMobile})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Produce & Quantity:</span>
                        <span className="font-bold text-emerald-600 font-mono">{item.produce} • {item.quantityMT} MT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Temp Setpoint:</span>
                        <span className="font-mono text-rose-500 font-bold">{item.requiredTemp}</span>
                      </div>

                      <div className="border-t border-slate-200 dark:border-[#2A2F3A] pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Chamber Charges:</span>
                          <span className="font-mono">₹{item.chamberCharges.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Taxes (18% GST):</span>
                          <span className="font-mono">₹{item.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Security Deposit:</span>
                          <span className="font-mono">₹{item.securityDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-[#2A2F3A]">
                          <span>Grand Total:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{item.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => {
                          alert(`Downloading Cold Storage Invoice Receipt ${item.id}.pdf`);
                          setConfirmedBooking(null);
                          setViewingReceiptBooking(null);
                        }}
                        className="w-full justify-center gap-1 font-black"
                      >
                        <Download className="h-4 w-4" /> Download PDF Receipt
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
