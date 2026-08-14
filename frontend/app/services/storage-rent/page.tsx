"use client";

import * as React from "react";
import { Navbar } from "../../../components/layout/navbar";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { LiveBreezeBackground } from "../../../components/landing/live-breeze-background";
import { 
  Warehouse, Building2, MapPin, ChevronRight, Search, ShieldCheck, CheckCircle2, X, Plus, 
  Calendar, Clock, Edit2, Trash2, Check, ArrowRight, ArrowLeft, Filter, 
  Phone, Mail, Award, Key, Layers, BookOpen, AlertTriangle, SlidersHorizontal, 
  Info, ShieldAlert, Eye, Settings, RefreshCw, Star, FileText, Download, 
  DollarSign, TrendingUp, User, Percent, Truck, Lock, Camera, CheckSquare, 
  Square, Sparkles, ExternalLink, Shield, Box, Share2
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

// ===========================================================
// TYPES & DATA STRUCTURES
// ===========================================================

export interface WarehouseListing {
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
  warehouseType: string;
  licenseNumber: string;
  gstNumber?: string;
  aadhaarNumber?: string;
  totalCapacityMT: number;
  availableCapacityMT: number;
  minBookingMT: number;
  rentalChargePerMT: number; // ₹ per MT per month
  securityDeposit: number;
  workingHours: string;
  supportedCommodities: string[];
  facilities: string[];
  description: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isLicenseVerified: boolean;
  isOwnerVerified: boolean;
  isGstVerified: boolean;
  status: "Approved" | "Pending" | "Rejected" | "Suspended";
  isFeatured?: boolean;
}

export interface StorageBooking {
  id: string;
  warehouseId: string;
  warehouseName: string;
  farmerName: string;
  farmerMobile: string;
  region: string;
  district: string;
  village: string;
  commodity: string;
  quantityMT: number;
  arrivalDate: string;
  durationMonths: number;
  pickupDate: string;
  specialInstructions?: string;
  warehouseCharges: number;
  taxAmount: number;
  securityDeposit: number;
  totalAmount: number;
  status: "Confirmed" | "Active" | "Completed" | "Cancelled";
  timestamp: string;
}

export interface WarehouseReview {
  id: string;
  warehouseId: string;
  farmerName: string;
  rating: number;
  comment: string;
  date: string;
}

// ===========================================================
// REGION -> DISTRICT -> VILLAGE MAPPING
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
  "Dahod": ["Devgadh Baria", "Fatehpura", "Jhalod", "Garbada", "Limkheda"],
  "Kachchh": ["Anjar", "Mandvi", "Bhuj", "Gandhidham", "Nakhatrana"],
  "Anand": ["Borsad", "Samarkha", "Petlad", "Khambhat", "Umreth"],
  "Banaskantha": ["Deesa", "Dhanera", "Palanpur", "Tharad", "Vav"],
  "Navsari": ["Chikhli", "Gandevi", "Jalalpore", "Bansda", "Khergam"],
  "Rajkot": ["Gondal", "Jetpur", "Jasdan", "Dhoraji", "Morbi Road"],
  "Ahmedabad": ["Sanand", "Dholka", "Bavla", "Viramgam", "Mandal"],
  "Vadodara": ["Padra", "Karjan", "Dabhoi", "Savli", "Waghodia"],
  "Mehsana": ["Unjha", "Kadi", "Visnagar", "Becharaji", "Vadnagar"],
  "Surat": ["Bardoli", "Kamrej", "Olpad", "Mahuva", "Mandvi"]
};

// ===========================================================
// CONSTANTS
// ===========================================================

const WAREHOUSE_TYPES = [
  "Grain Warehouse",
  "Seed Warehouse",
  "Fertilizer Warehouse",
  "Cotton Warehouse",
  "Oilseed Warehouse",
  "Multi Commodity Warehouse",
  "Government Warehouse",
  "Private Warehouse",
  "Cooperative Warehouse"
];

const SUPPORTED_COMMODITIES = [
  "Wheat", "Paddy", "Rice", "Bajra", "Cotton", "Groundnut", 
  "Maize", "Castor", "Cumin", "Mustard", "Soybean", "Tur", 
  "Seeds", "Fertilizer", "Animal Feed", "Others"
];

const ALL_FACILITIES = [
  "24x7 Security", "CCTV", "Fire Safety", "Pest Control", 
  "Loading Dock", "Forklift", "Weighbridge", "Truck Parking", 
  "Insurance", "Moisture Control", "Ventilation", "Digital Inventory"
];

// ===========================================================
// DEFAULT SEED DATA
// ===========================================================

const DEFAULT_WAREHOUSES: WarehouseListing[] = [
  {
    id: "wh-1",
    name: "Dahod APMC Grain Silo & Warehouse",
    ownerName: "Rajesh Bhai Patel",
    ownerMobile: "9823456789",
    ownerEmail: "rajesh.patel@dahodapmc.org",
    ownershipType: "Cooperative",
    region: "East Gujarat",
    district: "Dahod",
    village: "Devgadh Baria",
    fullAddress: "Plot No. 42, Devgadh Baria Road, Near APMC Market Yard, Dahod, Gujarat",
    pincode: "389380",
    mapsUrl: "https://maps.google.com/?q=Devgadh+Baria+Dahod+APMC",
    warehouseType: "Grain Warehouse",
    licenseNumber: "CWD-GJ-2021-9482",
    gstNumber: "24AAACD1234F1Z5",
    totalCapacityMT: 1000,
    availableCapacityMT: 420,
    minBookingMT: 5,
    rentalChargePerMT: 350, // ₹350 per MT / month
    securityDeposit: 1000,
    workingHours: "08:00 AM - 08:00 PM",
    supportedCommodities: ["Wheat", "Paddy", "Maize", "Soybean", "Tur"],
    facilities: ["24x7 Security", "CCTV", "Fire Safety", "Pest Control", "Weighbridge", "Truck Parking", "Insurance", "Moisture Control"],
    description: "State-of-the-art climate ventilated grain warehouse with automated fumigation and digital inventory monitoring.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    rating: 4.8,
    reviewsCount: 34,
    isVerified: true,
    isLicenseVerified: true,
    isOwnerVerified: true,
    isGstVerified: true,
    status: "Approved",
    isFeatured: true
  },
  {
    id: "wh-2",
    name: "Kutch Desert Spices & Seed Storage Hub",
    ownerName: "Amitabh Jadeja",
    ownerMobile: "9812345670",
    ownerEmail: "amit.jadeja@kutchstorage.com",
    ownershipType: "Private",
    region: "Kutch",
    district: "Kachchh",
    village: "Anjar",
    fullAddress: "National Highway 8A, Anjar Industrial Area, Kachchh, Gujarat",
    pincode: "370110",
    mapsUrl: "https://maps.google.com/?q=Anjar+Kachchh+Storage",
    warehouseType: "Seed Warehouse",
    licenseNumber: "CWD-GJ-2022-8104",
    gstNumber: "24BBBCJ9876E1Z2",
    totalCapacityMT: 1500,
    availableCapacityMT: 850,
    minBookingMT: 10,
    rentalChargePerMT: 420,
    securityDeposit: 1500,
    workingHours: "07:00 AM - 09:00 PM",
    supportedCommodities: ["Cumin", "Castor", "Bajra", "Mustard", "Groundnut"],
    facilities: ["24x7 Security", "CCTV", "Moisture Control", "Ventilation", "Pest Control", "Digital Inventory", "Forklift"],
    description: "Specialized humidity-controlled godown ideal for high-value cash crops like Cumin (Jeera) and Castor (Eranda).",
    images: ["https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80"],
    rating: 4.9,
    reviewsCount: 52,
    isVerified: true,
    isLicenseVerified: true,
    isOwnerVerified: true,
    isGstVerified: true,
    status: "Approved",
    isFeatured: true
  },
  {
    id: "wh-3",
    name: "Anand Central Farmers Cooperative Storage",
    ownerName: "Suresh Bhai Amin",
    ownerMobile: "9988776655",
    ownerEmail: "suresh.amin@anandcoop.in",
    ownershipType: "Government",
    region: "Central Gujarat",
    district: "Anand",
    village: "Samarkha",
    fullAddress: "Near Amul Dairy Road, Samarkha Circle, Anand, Gujarat",
    pincode: "388001",
    mapsUrl: "https://maps.google.com/?q=Samarkha+Anand+Cooperative",
    warehouseType: "Multi Commodity Warehouse",
    licenseNumber: "CWD-GJ-2019-3392",
    totalCapacityMT: 800,
    availableCapacityMT: 180,
    minBookingMT: 2,
    rentalChargePerMT: 280,
    securityDeposit: 500,
    workingHours: "08:30 AM - 06:30 PM",
    supportedCommodities: ["Wheat", "Rice", "Cotton", "Maize", "Groundnut", "Fertilizer"],
    facilities: ["24x7 Security", "Fire Safety", "Pest Control", "Loading Dock", "Truck Parking", "Insurance"],
    description: "Subsidized government-backed cooperative warehouse with direct APMC road access and low tariffs for small farmers.",
    images: ["https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"],
    rating: 4.6,
    reviewsCount: 28,
    isVerified: true,
    isLicenseVerified: true,
    isOwnerVerified: true,
    isGstVerified: false,
    status: "Approved"
  },
  {
    id: "wh-4",
    name: "Deesa Agro Logistics & Cold-Dry Warehouse",
    ownerName: "Vikram Chaudhari",
    ownerMobile: "9876543210",
    ownerEmail: "vikram.deesa@gmail.com",
    ownershipType: "Private",
    region: "North Gujarat",
    district: "Banaskantha",
    village: "Deesa",
    fullAddress: "Deesa-Palanpur Highway, Near Market Yard, Banaskantha, Gujarat",
    pincode: "385535",
    mapsUrl: "https://maps.google.com/?q=Deesa+Banaskantha+Agro",
    warehouseType: "Oilseed Warehouse",
    licenseNumber: "CWD-GJ-2023-1104",
    gstNumber: "24CCCCD5432G1Z9",
    totalCapacityMT: 2000,
    availableCapacityMT: 1200,
    minBookingMT: 15,
    rentalChargePerMT: 390,
    securityDeposit: 2000,
    workingHours: "06:00 AM - 10:00 PM",
    supportedCommodities: ["Groundnut", "Mustard", "Castor", "Cumin", "Seeds"],
    facilities: ["24x7 Security", "CCTV", "Fire Safety", "Pest Control", "Weighbridge", "Forklift", "Digital Inventory", "Moisture Control"],
    description: "Heavy-capacity storage hub built for large oilseed and spice traders. Includes electronic weighbridge and 40ft trailer parking.",
    images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80"],
    rating: 4.7,
    reviewsCount: 41,
    isVerified: true,
    isLicenseVerified: true,
    isOwnerVerified: true,
    isGstVerified: true,
    status: "Approved"
  },
  {
    id: "wh-5",
    name: "Navsari South Farmers Storage Facility",
    ownerName: "Jayesh Desai",
    ownerMobile: "9765432109",
    ownerEmail: "desai.navsari@yahoo.com",
    ownershipType: "Cooperative",
    region: "South Gujarat",
    district: "Navsari",
    village: "Chikhli",
    fullAddress: "Chikhli Sugar Factory Road, Navsari, Gujarat",
    pincode: "396521",
    mapsUrl: "https://maps.google.com/?q=Chikhli+Navsari+Warehouse",
    warehouseType: "Grain Warehouse",
    licenseNumber: "CWD-GJ-2020-5591",
    totalCapacityMT: 600,
    availableCapacityMT: 310,
    minBookingMT: 5,
    rentalChargePerMT: 310,
    securityDeposit: 800,
    workingHours: "08:00 AM - 07:00 PM",
    supportedCommodities: ["Paddy", "Rice", "Sugarcane", "Animal Feed", "Fertilizer"],
    facilities: ["24x7 Security", "Pest Control", "Loading Dock", "Ventilation", "Insurance"],
    description: "Clean dry storage suited for paddy, bagged rice, and organic fertilizer storage during heavy monsoon months.",
    images: ["https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80"],
    rating: 4.5,
    reviewsCount: 19,
    isVerified: true,
    isLicenseVerified: true,
    isOwnerVerified: true,
    isGstVerified: true,
    status: "Approved"
  }
];

const DEFAULT_REVIEWS: WarehouseReview[] = [
  {
    id: "rev-1",
    warehouseId: "wh-1",
    farmerName: "Ramesh Bhai Chaudhari",
    rating: 5,
    comment: "Very clean facility. Stored 45 MT Wheat for 2 months without any dampness or pest issue. Staff is very helpful.",
    date: "2026-07-20"
  },
  {
    id: "rev-2",
    warehouseId: "wh-1",
    farmerName: "Dinesh Patel",
    rating: 4,
    comment: "Weighbridge service was accurate. Prompt unloading at the dock.",
    date: "2026-06-14"
  }
];

// ===========================================================
// MAIN WAREHOUSE MARKETPLACE COMPONENT
// ===========================================================

export default function StorageRentPage() {
  const [isMounted, setIsMounted] = React.useState(false);

  // Core State
  const [warehouses, setWarehouses] = React.useState<WarehouseListing[]>([]);
  const [bookings, setBookings] = React.useState<StorageBooking[]>([]);
  const [reviews, setReviews] = React.useState<WarehouseReview[]>([]);
  const [activeTab, setActiveTab] = React.useState<"find" | "list" | "my-bookings" | "my-warehouses" | "admin">("find");

  // Filter States
  const [search, setSearch] = React.useState("");
  const [filterRegion, setFilterRegion] = React.useState("all");
  const [filterDistrict, setFilterDistrict] = React.useState("all");
  const [filterVillage, setFilterVillage] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");
  const [filterCommodity, setFilterCommodity] = React.useState("all");
  const [filterCapacity, setFilterCapacity] = React.useState<number>(0);
  const [filterPrice, setFilterPrice] = React.useState<number>(1000); // Max rental charge per MT
  const [filterAvailability, setFilterAvailability] = React.useState("all"); // 'all', 'available', 'full'
  const [filterOwnership, setFilterOwnership] = React.useState("all");
  const [filterRating, setFilterRating] = React.useState<number>(0);

  // UI Control Modals
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<WarehouseListing | null>(null);
  const [bookingWarehouse, setBookingWarehouse] = React.useState<WarehouseListing | null>(null);
  const [confirmedBooking, setConfirmedBooking] = React.useState<StorageBooking | null>(null);
  const [viewingReceiptBooking, setViewingReceiptBooking] = React.useState<StorageBooking | null>(null);
  const [newReviewText, setNewReviewText] = React.useState("");
  const [newReviewRating, setNewReviewRating] = React.useState(5);

  // Multi-step Owner Form State (7 Steps)
  const [formStep, setFormStep] = React.useState(1);
  const [ownerForm, setOwnerForm] = React.useState({
    // Step 1: Owner Details
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    aadhaarNumber: "",
    gstNumber: "",
    // Step 2: Location
    region: "",
    district: "",
    village: "",
    fullAddress: "",
    pincode: "",
    mapsUrl: "",
    // Step 3: Warehouse Details
    name: "",
    warehouseType: WAREHOUSE_TYPES[0],
    ownershipType: "Private" as "Government" | "Private" | "Cooperative",
    licenseNumber: "",
    totalCapacityMT: 500,
    availableCapacityMT: 500,
    minBookingMT: 5,
    rentalChargePerMT: 350,
    securityDeposit: 1000,
    workingHours: "08:00 AM - 08:00 PM",
    // Step 4: Accepted Commodities
    supportedCommodities: [] as string[],
    // Step 5: Facilities
    facilities: [] as string[],
    // Step 6: Uploads
    images: [] as string[],
    // Step 7: Description & Notes
    description: "",
    notes: ""
  });

  // Client Hydration & Storage Loading
  React.useEffect(() => {
    setIsMounted(true);
    const storedWarehouses = localStorage.getItem("fasaldrishti_warehouses");
    const storedBookings = localStorage.getItem("fasaldrishti_warehouse_bookings");
    const storedReviews = localStorage.getItem("fasaldrishti_warehouse_reviews");

    if (storedWarehouses) {
      setWarehouses(JSON.parse(storedWarehouses));
    } else {
      localStorage.setItem("fasaldrishti_warehouses", JSON.stringify(DEFAULT_WAREHOUSES));
      setWarehouses(DEFAULT_WAREHOUSES);
    }

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      localStorage.setItem("fasaldrishti_warehouse_reviews", JSON.stringify(DEFAULT_REVIEWS));
      setReviews(DEFAULT_REVIEWS);
    }
  }, []);

  const saveWarehousesToStorage = (updated: WarehouseListing[]) => {
    setWarehouses(updated);
    localStorage.setItem("fasaldrishti_warehouses", JSON.stringify(updated));
  };

  const saveBookingsToStorage = (updated: StorageBooking[]) => {
    setBookings(updated);
    localStorage.setItem("fasaldrishti_warehouse_bookings", JSON.stringify(updated));
  };

  const saveReviewsToStorage = (updated: WarehouseReview[]) => {
    setReviews(updated);
    localStorage.setItem("fasaldrishti_warehouse_reviews", JSON.stringify(updated));
  };

  // Handle Cascading Filter Selection
  const handleRegionChange = (reg: string) => {
    setFilterRegion(reg);
    setFilterDistrict("all");
    setFilterVillage("all");
  };

  const handleDistrictChange = (dist: string) => {
    setFilterDistrict(dist);
    setFilterVillage("all");
  };

  // Get dynamic districts for filter
  const getAvailableDistricts = () => {
    if (filterRegion === "all") {
      return Object.values(REGION_DISTRICT_MAP).flat();
    }
    return REGION_DISTRICT_MAP[filterRegion] || [];
  };

  // Get dynamic villages for filter
  const getAvailableVillages = () => {
    if (filterDistrict === "all") {
      const activeDistricts = getAvailableDistricts();
      const setOfVillages = new Set<string>();
      activeDistricts.forEach((d) => {
        (DISTRICT_VILLAGE_MAP[d] || []).forEach((v) => setOfVillages.add(v));
      });
      // also include villages from actual warehouse listings
      warehouses.forEach((w) => {
        if (filterRegion === "all" || w.region === filterRegion) {
          setOfVillages.add(w.village);
        }
      });
      return Array.from(setOfVillages);
    }
    const standard = DISTRICT_VILLAGE_MAP[filterDistrict] || [];
    const fromListings = warehouses.filter(w => w.district === filterDistrict).map(w => w.village);
    return Array.from(new Set([...standard, ...fromListings]));
  };

  // Main Warehouse Filtering Logic
  const filteredWarehouses = warehouses.filter((w) => {
    if (activeTab !== "admin" && w.status !== "Approved") return false;

    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      w.name.toLowerCase().includes(searchLower) ||
      w.ownerName.toLowerCase().includes(searchLower) ||
      w.village.toLowerCase().includes(searchLower) ||
      w.district.toLowerCase().includes(searchLower) ||
      w.region.toLowerCase().includes(searchLower) ||
      w.supportedCommodities.some(c => c.toLowerCase().includes(searchLower));

    const matchesRegion = filterRegion === "all" || w.region === filterRegion;
    const matchesDistrict = filterDistrict === "all" || w.district === filterDistrict;
    const matchesVillage = filterVillage === "all" || w.village.toLowerCase() === filterVillage.toLowerCase();

    const matchesType = filterType === "all" || w.warehouseType === filterType;
    const matchesCommodity = filterCommodity === "all" || w.supportedCommodities.includes(filterCommodity);
    const matchesCapacity = w.availableCapacityMT >= filterCapacity;
    const matchesPrice = w.rentalChargePerMT <= filterPrice;
    
    let matchesAvailability = true;
    if (filterAvailability === "available") matchesAvailability = w.availableCapacityMT > 0;
    else if (filterAvailability === "full") matchesAvailability = w.availableCapacityMT <= 0;

    const matchesOwnership = filterOwnership === "all" || w.ownershipType === filterOwnership;
    const matchesRating = w.rating >= filterRating;

    return matchesSearch && matchesRegion && matchesDistrict && matchesVillage && 
      matchesType && matchesCommodity && matchesCapacity && matchesPrice && 
      matchesAvailability && matchesOwnership && matchesRating;
  });

  // Handle Booking Submission (Partial Capacity Booking)
  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingWarehouse) return;

    const formData = new FormData(e.currentTarget);
    const quantityMT = Number(formData.get("quantityMT"));
    const durationMonths = Number(formData.get("durationMonths"));
    const arrivalDate = formData.get("arrivalDate") as string;

    if (quantityMT > bookingWarehouse.availableCapacityMT) {
      alert(`Requested quantity (${quantityMT} MT) exceeds available warehouse capacity (${bookingWarehouse.availableCapacityMT} MT).`);
      return;
    }

    if (quantityMT < bookingWarehouse.minBookingMT) {
      alert(`Minimum booking requirement is ${bookingWarehouse.minBookingMT} MT.`);
      return;
    }

    // Auto-calculate Pickup Date
    const arr = new Date(arrivalDate || Date.now());
    arr.setMonth(arr.getMonth() + durationMonths);
    const pickupDate = arr.toISOString().split("T")[0];

    const baseCharge = quantityMT * bookingWarehouse.rentalChargePerMT * durationMonths;
    const taxAmount = Math.round(baseCharge * 0.18); // 18% GST
    const securityDeposit = bookingWarehouse.securityDeposit;
    const grandTotal = baseCharge + taxAmount + securityDeposit;

    const newBooking: StorageBooking = {
      id: "KM-WH-" + Math.floor(10000 + Math.random() * 90000),
      warehouseId: bookingWarehouse.id,
      warehouseName: bookingWarehouse.name,
      farmerName: formData.get("farmerName") as string,
      farmerMobile: formData.get("farmerMobile") as string,
      region: formData.get("region") as string,
      district: formData.get("district") as string,
      village: formData.get("village") as string,
      commodity: formData.get("commodity") as string,
      quantityMT: quantityMT,
      arrivalDate: arrivalDate,
      durationMonths: durationMonths,
      pickupDate: pickupDate,
      specialInstructions: formData.get("specialInstructions") as string,
      warehouseCharges: baseCharge,
      taxAmount: taxAmount,
      securityDeposit: securityDeposit,
      totalAmount: grandTotal,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    };

    // Automatically Update Warehouse Available Capacity
    const updatedWarehouses = warehouses.map((w) => {
      if (w.id === bookingWarehouse.id) {
        const newAvailable = Math.max(0, w.availableCapacityMT - quantityMT);
        return { ...w, availableCapacityMT: newAvailable };
      }
      return w;
    });

    const updatedBookings = [newBooking, ...bookings];

    saveWarehousesToStorage(updatedWarehouses);
    saveBookingsToStorage(updatedBookings);

    setBookingWarehouse(null);
    setConfirmedBooking(newBooking);
  };

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return;

    if (confirm("Are you sure you want to cancel this warehouse storage booking? Available capacity will be restored.")) {
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: "Cancelled" as const } : b);
      
      // Restore capacity
      const updatedWarehouses = warehouses.map(w => {
        if (w.id === bookingToCancel.warehouseId) {
          return { ...w, availableCapacityMT: w.availableCapacityMT + bookingToCancel.quantityMT };
        }
        return w;
      });

      saveBookingsToStorage(updatedBookings);
      saveWarehousesToStorage(updatedWarehouses);
    }
  };

  // Handle Owner Publish Warehouse (Form Submit)
  const handlePublishWarehouse = (isDraft: boolean) => {
    const newId = "wh-" + (warehouses.length + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
    const newWarehouse: WarehouseListing = {
      id: newId,
      name: ownerForm.name || "Agricultural Storage Warehouse",
      ownerName: ownerForm.ownerName,
      ownerMobile: ownerForm.ownerMobile,
      ownerEmail: ownerForm.ownerEmail,
      ownershipType: ownerForm.ownershipType,
      region: ownerForm.region || "Central Gujarat",
      district: ownerForm.district || "Anand",
      village: ownerForm.village || "Samarkha",
      fullAddress: ownerForm.fullAddress || "APMC Yard Road",
      pincode: ownerForm.pincode || "388001",
      mapsUrl: ownerForm.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(ownerForm.fullAddress)}`,
      warehouseType: ownerForm.warehouseType,
      licenseNumber: ownerForm.licenseNumber || "CWD-GJ-2026-" + Math.floor(1000 + Math.random() * 9000),
      gstNumber: ownerForm.gstNumber,
      aadhaarNumber: ownerForm.aadhaarNumber,
      totalCapacityMT: Number(ownerForm.totalCapacityMT),
      availableCapacityMT: Number(ownerForm.availableCapacityMT),
      minBookingMT: Number(ownerForm.minBookingMT),
      rentalChargePerMT: Number(ownerForm.rentalChargePerMT),
      securityDeposit: Number(ownerForm.securityDeposit),
      workingHours: ownerForm.workingHours,
      supportedCommodities: ownerForm.supportedCommodities.length > 0 ? ownerForm.supportedCommodities : ["Wheat", "Paddy"],
      facilities: ownerForm.facilities.length > 0 ? ownerForm.facilities : ["24x7 Security", "Pest Control"],
      description: ownerForm.description || "Modern, pest-controlled grain storage godown.",
      images: ownerForm.images.length > 0 ? ownerForm.images : ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      isLicenseVerified: true,
      isOwnerVerified: true,
      isGstVerified: !!ownerForm.gstNumber,
      status: isDraft ? "Pending" : "Approved"
    };

    const updated = [newWarehouse, ...warehouses];
    saveWarehousesToStorage(updated);

    // Reset Form
    setOwnerForm({
      ownerName: "", ownerMobile: "", ownerEmail: "", aadhaarNumber: "", gstNumber: "",
      region: "", district: "", village: "", fullAddress: "", pincode: "", mapsUrl: "",
      name: "", warehouseType: WAREHOUSE_TYPES[0], ownershipType: "Private", licenseNumber: "",
      totalCapacityMT: 500, availableCapacityMT: 500, minBookingMT: 5, rentalChargePerMT: 350,
      securityDeposit: 1000, workingHours: "08:00 AM - 08:00 PM",
      supportedCommodities: [], facilities: [], images: [], description: "", notes: ""
    });
    setFormStep(1);

    // Switch to Find Storage & pre-filter location so owner immediately sees listed warehouse
    setActiveTab("find");
    setFilterRegion(newWarehouse.region);
    setFilterDistrict(newWarehouse.district);
    setFilterVillage(newWarehouse.village);
  };

  // Submit Farmer Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouse || !newReviewText.trim()) return;

    const newRev: WarehouseReview = {
      id: "rev-" + Date.now(),
      warehouseId: selectedWarehouse.id,
      farmerName: "Rajesh Kumar (Verified Farmer)",
      rating: newReviewRating,
      comment: newReviewText,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedReviews = [newRev, ...reviews];
    saveReviewsToStorage(updatedReviews);

    // Update warehouse rating average
    const warehouseRevs = updatedReviews.filter(r => r.warehouseId === selectedWarehouse.id);
    const avgRating = Number((warehouseRevs.reduce((acc, r) => acc + r.rating, 0) / warehouseRevs.length).toFixed(1));

    const updatedWarehouses = warehouses.map(w => {
      if (w.id === selectedWarehouse.id) {
        return { ...w, rating: avgRating, reviewsCount: warehouseRevs.length };
      }
      return w;
    });
    saveWarehousesToStorage(updatedWarehouses);

    setNewReviewText("");
  };

  // Admin Controls
  const handleAdminStatus = (id: string, status: WarehouseListing["status"]) => {
    const updated = warehouses.map(w => w.id === id ? { ...w, status } : w);
    saveWarehousesToStorage(updated);
  };

  const handleAdminToggleFeature = (id: string) => {
    const updated = warehouses.map(w => w.id === id ? { ...w, isFeatured: !w.isFeatured } : w);
    saveWarehousesToStorage(updated);
  };

  const handleAdminDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this warehouse listing?")) {
      const updated = warehouses.filter(w => w.id !== id);
      saveWarehousesToStorage(updated);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14] flex flex-col items-center justify-center text-emerald-400">
        <RefreshCw className="h-10 w-10 animate-spin" />
        <span className="mt-4 text-xs font-bold tracking-wider">LOADING WAREHOUSE MARKETPLACE...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <LiveBreezeBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col pb-24">
        {/* Marketplace Header */}
        <section className="py-12 bg-transparent">
          <Container className="text-center space-y-4 max-w-4xl">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8B949E]">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">Services</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Warehouse Rental Marketplace</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A]">
              <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gujarat's Verified Agricultural Warehousing Platform</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tight leading-tight">
              Warehouse Storage <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Rental Marketplace</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
              Book partial MT storage capacity in verified agricultural godowns, or list your private/cooperative warehouse to earn storage revenue.
            </p>

            {/* TAB SELECT SWITCHER */}
            <div className="pt-6 flex flex-wrap justify-center gap-2">
              <div className="inline-flex rounded-2xl bg-white/80 dark:bg-[#161B22]/90 p-1.5 border border-emerald-100 dark:border-[#2A2F3A] backdrop-blur-md shadow-sm">
                <button
                  onClick={() => setActiveTab("find")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === "find" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Box className="h-4 w-4" />
                  📦 Find Storage
                </button>
                <button
                  onClick={() => { setActiveTab("list"); setFormStep(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === "list" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" : "text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  <Building2 className="h-4 w-4" />
                  🏢 List Your Storage
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* ===========================================================
            TAB 1: FIND STORAGE
            =========================================================== */}
        {activeTab === "find" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-7xl space-y-6">
              
              {/* SEARCH BAR & QUICK COUNTER */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-[#161B22]/90 border border-emerald-100/80 dark:border-[#2A2F3A] p-4 rounded-3xl backdrop-blur-md shadow-xs">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by warehouse name, commodity, village, district, region or owner..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0">
                  Showing {filteredWarehouses.length} Verified Warehouses
                </div>
              </div>

              {/* MAIN CONTENT LAYOUT: SIDEBAR FILTERS + WAREHOUSE GRID */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* CASCADING SIDEBAR FILTERS */}
                <div className="w-full lg:w-80 shrink-0 bg-white/80 dark:bg-[#161B22]/95 border border-emerald-100/80 dark:border-[#2A2F3A] rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-sm sticky top-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                    <h3 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white">
                      <SlidersHorizontal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Warehouse Filters
                    </h3>
                    <button
                      onClick={() => {
                        setFilterRegion("all");
                        setFilterDistrict("all");
                        setFilterVillage("all");
                        setFilterType("all");
                        setFilterCommodity("all");
                        setFilterCapacity(0);
                        setFilterPrice(1000);
                        setFilterAvailability("all");
                        setFilterOwnership("all");
                        setFilterRating(0);
                        setSearch("");
                      }}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* 1. REGION FILTER (Cascading) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">1. Region</label>
                    <select
                      value={filterRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Regions (Statewide)</option>
                      {Object.keys(REGION_DISTRICT_MAP).map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. DISTRICT FILTER (Cascading) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">2. District</label>
                    <select
                      value={filterDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Districts</option>
                      {getAvailableDistricts().map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. VILLAGE FILTER (Cascading) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">3. Village / Taluka</label>
                    <select
                      value={filterVillage}
                      onChange={(e) => setFilterVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Villages</option>
                      {getAvailableVillages().map((vil) => (
                        <option key={vil} value={vil}>{vil}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. WAREHOUSE TYPE */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Warehouse Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Warehouse Types</option>
                      {WAREHOUSE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. COMMODITY SUPPORTED */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Commodity to Store</label>
                    <select
                      value={filterCommodity}
                      onChange={(e) => setFilterCommodity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Commodities</option>
                      {SUPPORTED_COMMODITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* 6. OWNERSHIP TYPE */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Ownership Type</label>
                    <select
                      value={filterOwnership}
                      onChange={(e) => setFilterOwnership(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Ownership Types</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Cooperative">Cooperative</option>
                    </select>
                  </div>

                  {/* 7. MAX RENTAL PRICE SLIDER */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 dark:text-[#8B949E]">Max Price / MT:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono">₹{filterPrice}/MT/Mo</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* 8. RATING FILTER */}
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

                {/* WAREHOUSE CARDS GRID */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((w) => {
                      const occupiedPct = Math.round(((w.totalCapacityMT - w.availableCapacityMT) / w.totalCapacityMT) * 100);
                      const isFull = w.availableCapacityMT <= 0;

                      return (
                        <div
                          key={w.id}
                          className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                        >
                          {/* Image & Header visual */}
                          <div className="space-y-3">
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0B0F14]">
                              <img
                                src={w.images[0]}
                                alt={w.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              
                              {/* Badges on image */}
                              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <ShieldCheck className="h-3 w-3" />
                                  FasalDrishti Verified
                                </span>
                                {w.ownershipType && (
                                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                                    {w.ownershipType}
                                  </span>
                                )}
                              </div>

                              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                <div className="text-white">
                                  <span className="text-[10px] uppercase font-bold text-emerald-300">{w.warehouseType}</span>
                                  <h3 className="text-base font-extrabold leading-tight text-white">{w.name}</h3>
                                </div>
                                <div className="bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-amber-500 flex items-center gap-1 shadow-sm">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                                  <span>{w.rating}</span>
                                  <span className="text-[10px] text-slate-500">({w.reviewsCount})</span>
                                </div>
                              </div>
                            </div>

                            {/* Location & Verification Row */}
                            <div className="space-y-2 text-xs text-slate-600 dark:text-[#C9D1D9]">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span>{w.village}, {w.district} ({w.region})</span>
                                </div>
                                <a
                                  href={w.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Map
                                </a>
                              </div>

                              {/* Owner & Verification Badges */}
                              <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300">Owner: {w.ownerName}</span>
                                {w.isLicenseVerified && <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">✓ License</span>}
                                {w.isGstVerified && <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">✓ GST</span>}
                              </div>

                              {/* CAPACITY METRICS BAR */}
                              <div className="rounded-xl bg-slate-50 dark:bg-[#111827] p-3 border border-slate-100 dark:border-[#2A2F3A] space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-extrabold">
                                  <span>Available: <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{w.availableCapacityMT} MT</span></span>
                                  <span className="text-slate-500 dark:text-[#8B949E]">Total: {w.totalCapacityMT} MT</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${isFull ? "bg-rose-500" : occupiedPct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    style={{ width: `${occupiedPct}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 dark:text-[#8B949E]">
                                  <span>Occupied: {occupiedPct}%</span>
                                  <span>Min Booking: {w.minBookingMT} MT</span>
                                </div>
                              </div>

                              {/* COMMODITIES BADGES */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {w.supportedCommodities.slice(0, 4).map((c) => (
                                  <span key={c} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30">
                                    {c}
                                  </span>
                                ))}
                                {w.supportedCommodities.length > 4 && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]">
                                    +{w.supportedCommodities.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* FOOTER ACTIONS */}
                          <div className="pt-3 border-t border-slate-100 dark:border-[#2A2F3A] flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">Rental Charge</div>
                              <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                                ₹{w.rentalChargePerMT} <span className="text-xs font-normal text-slate-500">/MT/mo</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedWarehouse(w)}
                                className="text-xs font-bold"
                              >
                                Details
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={isFull}
                                onClick={() => setBookingWarehouse(w)}
                                className="gap-1 text-xs font-black shadow-sm"
                              >
                                Book Storage <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-16 text-center space-y-4 bg-white/70 dark:bg-[#161B22]/70 border border-emerald-100 dark:border-[#2A2F3A] rounded-3xl backdrop-blur-md">
                      <Warehouse className="h-12 w-12 text-slate-400 mx-auto animate-pulse" />
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Warehouses Found</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] max-w-md mx-auto">
                        No warehouse listing matches your active search and location filters. Try resetting the filters or switching regions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ===========================================================
            TAB 2: LIST YOUR STORAGE (7-STEP OWNER FORM)
            =========================================================== */}
        {activeTab === "list" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-4xl">
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 sm:p-10 shadow-xl space-y-8">
                
                {/* STEP PROGRESS BAR */}
                <div className="space-y-4 border-b border-slate-100 dark:border-[#2A2F3A] pb-6">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                    <span>Step {formStep} of 7 — Owner Registration</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{Math.round((formStep / 7) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0B0F14] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full transition-all duration-300" style={{ width: `${(formStep / 7) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-[#8B949E] overflow-x-auto no-scrollbar">
                    {["Owner", "Location", "Specs", "Crops", "Facilities", "Uploads", "Publish"].map((lbl, idx) => (
                      <button key={lbl} onClick={() => setFormStep(idx + 1)} className={`cursor-pointer hover:text-emerald-600 ${formStep === idx + 1 ? "text-emerald-600 font-black dark:text-emerald-400" : ""}`}>
                        {idx + 1}. {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 1: OWNER DETAILS */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 1: Warehouse Owner Information</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Provide contact details for farmer inquiries and verified booking notifications.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Full Owner / Business Name *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.ownerName}
                          onChange={(e) => setOwnerForm({ ...ownerForm, ownerName: e.target.value })}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Mobile Number (WhatsApp Enabled) *</label>
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
                          placeholder="owner@warehouse.com"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Aadhaar Number (Optional Verification)</label>
                        <input
                          type="text"
                          value={ownerForm.aadhaarNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, aadhaarNumber: e.target.value })}
                          placeholder="XXXX-XXXX-XXXX"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1">GST Number (Optional for Tax Invoicing)</label>
                        <input
                          type="text"
                          value={ownerForm.gstNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, gstNumber: e.target.value })}
                          placeholder="e.g. 24AAAAA0000A1Z5"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: LOCATION DETAILS */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 2: Warehouse Location</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Select location hierarchy. Your warehouse will automatically appear under Region → District → Village.</p>
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
                          {Object.keys(REGION_DISTRICT_MAP).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
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
                          {(REGION_DISTRICT_MAP[ownerForm.region] || []).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Village / Taluka *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.village}
                          onChange={(e) => setOwnerForm({ ...ownerForm, village: e.target.value })}
                          placeholder="e.g. Samarkha / Fatehpura"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1">Complete Street Address *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.fullAddress}
                          onChange={(e) => setOwnerForm({ ...ownerForm, fullAddress: e.target.value })}
                          placeholder="Plot No, Near APMC Market Yard, Road Name"
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
                        <label className="block font-bold mb-1">Google Maps Query / Location Link</label>
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

                {/* STEP 3: WAREHOUSE DETAILS */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 3: Warehouse Capacity & Tariffs</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Specify total MT capacity, minimum booking requirements, and rental charges per MT.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Warehouse Name *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.name}
                          onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                          placeholder="e.g. Shri Ram Storage Silo"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Warehouse Type *</label>
                        <select
                          value={ownerForm.warehouseType}
                          onChange={(e) => setOwnerForm({ ...ownerForm, warehouseType: e.target.value })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        >
                          {WAREHOUSE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Ownership Category *</label>
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
                        <label className="block font-bold mb-1">Warehouse License Number *</label>
                        <input
                          type="text"
                          required
                          value={ownerForm.licenseNumber}
                          onChange={(e) => setOwnerForm({ ...ownerForm, licenseNumber: e.target.value })}
                          placeholder="CWD-GJ-2026-XXXX"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
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
                        <label className="block font-bold mb-1">Currently Available Capacity (MT) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max={ownerForm.totalCapacityMT}
                          value={ownerForm.availableCapacityMT}
                          onChange={(e) => setOwnerForm({ ...ownerForm, availableCapacityMT: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Minimum Booking Quantity (MT) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={ownerForm.minBookingMT}
                          onChange={(e) => setOwnerForm({ ...ownerForm, minBookingMT: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Rental Charges (₹ / MT / Month) *</label>
                        <input
                          type="number"
                          required
                          min="50"
                          value={ownerForm.rentalChargePerMT}
                          onChange={(e) => setOwnerForm({ ...ownerForm, rentalChargePerMT: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Refundable Security Deposit (₹)</label>
                        <input
                          type="number"
                          value={ownerForm.securityDeposit}
                          onChange={(e) => setOwnerForm({ ...ownerForm, securityDeposit: Number(e.target.value) })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Working Hours *</label>
                        <input
                          type="text"
                          value={ownerForm.workingHours}
                          onChange={(e) => setOwnerForm({ ...ownerForm, workingHours: e.target.value })}
                          placeholder="e.g. 08:00 AM - 08:00 PM"
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: ACCEPTED COMMODITIES */}
                {formStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 4: Supported Commodities</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Select all crop types and agricultural produce allowed inside your warehouse.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {SUPPORTED_COMMODITIES.map((c) => {
                        const isChecked = ownerForm.supportedCommodities.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              const updated = isChecked
                                ? ownerForm.supportedCommodities.filter((item) => item !== c)
                                : [...ownerForm.supportedCommodities, c];
                              setOwnerForm({ ...ownerForm, supportedCommodities: updated });
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between font-bold transition-all cursor-pointer ${isChecked ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300" : "bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#2A2F3A] text-slate-700 dark:text-[#C9D1D9]"}`}
                          >
                            <span>{c}</span>
                            {isChecked ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5: FACILITIES AVAILABLE */}
                {formStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 5: Available Facilities</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Check all security, moisture control, and equipment amenities present in your facility.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {ALL_FACILITIES.map((f) => {
                        const isChecked = ownerForm.facilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              const updated = isChecked
                                ? ownerForm.facilities.filter((item) => item !== f)
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

                {/* STEP 6: UPLOADS & IMAGES */}
                {formStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 6: Warehouse Photos & Verification Documents</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Provide image URLs or select sample warehouse visual presets.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Image URL (Public HTTPS Image Link)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={ownerForm.images[0] || ""}
                          onChange={(e) => setOwnerForm({ ...ownerForm, images: [e.target.value] })}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-bold">Or Select Preset High-Resolution Visual:</label>
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

                {/* STEP 7: DESCRIPTION & SUBMISSION */}
                {formStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Step 7: Final Review & Publish</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">Review location details and publish your warehouse listing to the marketplace.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Warehouse Description *</label>
                        <textarea
                          rows={4}
                          value={ownerForm.description}
                          onChange={(e) => setOwnerForm({ ...ownerForm, description: e.target.value })}
                          placeholder="Describe security, access roads, ventilation, loading docks, proximity to APMC market yards..."
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* SUMMARY CARD */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30 space-y-2">
                        <div className="font-extrabold text-emerald-800 dark:text-emerald-300">Listing Summary Overview:</div>
                        <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-[#C9D1D9]">
                          <div>Warehouse: <strong className="text-slate-900 dark:text-white">{ownerForm.name || "Untitled Godown"}</strong></div>
                          <div>Location: <strong className="text-slate-900 dark:text-white">{ownerForm.village}, {ownerForm.district}</strong></div>
                          <div>Capacity: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{ownerForm.totalCapacityMT} MT</strong></div>
                          <div>Rate: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">₹{ownerForm.rentalChargePerMT}/MT/Month</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM NAVIGATION BUTTONS */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#2A2F3A] flex items-center justify-between">
                  {formStep > 1 ? (
                    <Button variant="outline" size="sm" onClick={() => setFormStep(formStep - 1)} className="gap-1">
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </Button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    {formStep === 7 ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handlePublishWarehouse(true)}>
                          Save Draft
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handlePublishWarehouse(false)} className="gap-1 font-black">
                          Publish Warehouse <Check className="h-4 w-4" />
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
                    My Storage Bookings
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">View active capacity reservations, download official payment receipts, and manage pickup dates.</p>
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

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{b.warehouseName}</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-[#C9D1D9]">
                          <div>Farmer: <strong className="text-slate-900 dark:text-white">{b.farmerName}</strong></div>
                          <div>Commodity: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{b.commodity}</strong></div>
                          <div>Quantity: <strong className="text-slate-900 dark:text-white font-mono">{b.quantityMT} MT</strong></div>
                          <div>Duration: <strong className="text-slate-900 dark:text-white">{b.durationMonths} Months</strong></div>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-[#8B949E]">
                          Arrival Date: {b.arrivalDate} • Expected Pickup: {b.pickupDate}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-[#2A2F3A] pt-3 md:pt-0 md:pl-6 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 dark:text-[#8B949E]">Total Billing Amount</div>
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
                  <FileText className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">No Active Storage Bookings</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">You haven't reserved storage in any warehouse yet. Switch to "Find Storage" to browse available godowns.</p>
                </div>
              )}
            </Container>
          </section>
        )}

        {/* ===========================================================
            SECONDARY VIEW 2: MY WAREHOUSES / OWNER DASHBOARD
            =========================================================== */}
        {activeTab === "my-warehouses" && (
          <section className="py-2 bg-transparent">
            <Container className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  Warehouse Owner Management Dashboard
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8B949E]">Track occupancy levels, storage tariffs, total bookings, and monthly revenue analytics.</p>
              </div>

              {/* STATS METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Total Registered Warehouses</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{warehouses.length}</div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Total Capacity</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {warehouses.reduce((acc, w) => acc + w.totalCapacityMT, 0)} MT
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Available Capacity</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {warehouses.reduce((acc, w) => acc + w.availableCapacityMT, 0)} MT
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-[#8B949E]">Monthly Revenue (Est.)</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    ₹{bookings.reduce((acc, b) => acc + b.warehouseCharges, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* LISTINGS TABLE */}
              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Warehouse Listings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#2A2F3A] text-slate-400 dark:text-[#8B949E]">
                        <th className="py-3 px-2">Warehouse Name</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">Total Cap</th>
                        <th className="py-3 px-2">Available</th>
                        <th className="py-3 px-2">Rate / MT</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2F3A]">
                      {warehouses.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{w.name}</td>
                          <td className="py-3 px-2">{w.village}, {w.district}</td>
                          <td className="py-3 px-2 font-mono">{w.totalCapacityMT} MT</td>
                          <td className="py-3 px-2 font-mono font-bold text-emerald-600">{w.availableCapacityMT} MT</td>
                          <td className="py-3 px-2 font-mono">₹{w.rentalChargePerMT}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                              {w.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button onClick={() => setSelectedWarehouse(w)} className="text-emerald-600 hover:underline font-bold">
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
                    Marketplace Admin Management Panel
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">Approve, suspend, verify license documents, or feature warehouse listings across Gujarat.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/95 backdrop-blur-md p-6 space-y-4 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#2A2F3A] text-slate-400 dark:text-[#8B949E]">
                        <th className="py-3 px-2">Warehouse</th>
                        <th className="py-3 px-2">Owner & Mobile</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">License No</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Featured</th>
                        <th className="py-3 px-2 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2F3A]">
                      {warehouses.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{w.name}</td>
                          <td className="py-3 px-2">{w.ownerName} ({w.ownerMobile})</td>
                          <td className="py-3 px-2">{w.village}, {w.district}</td>
                          <td className="py-3 px-2 font-mono text-[11px]">{w.licenseNumber}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${w.status === "Approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"}`}>
                              {w.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button onClick={() => handleAdminToggleFeature(w.id)} className="cursor-pointer">
                              {w.isFeatured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <Star className="h-4 w-4 text-slate-300" />}
                            </button>
                          </td>
                          <td className="py-3 px-2 text-right space-x-1">
                            {w.status !== "Approved" && (
                              <button onClick={() => handleAdminStatus(w.id, "Approved")} className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 cursor-pointer">
                                Approve
                              </button>
                            )}
                            {w.status !== "Suspended" && (
                              <button onClick={() => handleAdminStatus(w.id, "Suspended")} className="px-2 py-1 bg-amber-600 text-white rounded-md text-[10px] font-bold hover:bg-amber-700 cursor-pointer">
                                Suspend
                              </button>
                            )}
                            <button onClick={() => handleAdminDelete(w.id)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-[10px] font-bold hover:bg-rose-700 cursor-pointer">
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
            MODAL 1: WAREHOUSE DETAILS & AVAILABILITY CALENDAR & REVIEWS
            =========================================================== */}
        {selectedWarehouse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedWarehouse(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Hero Image & Verification Badges */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#161B22]">
                <img src={selectedWarehouse.images[0]} alt={selectedWarehouse.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> FasalDrishti Verified
                    </span>
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedWarehouse.ownershipType} Ownership
                    </span>
                  </div>
                  <h2 className="text-2xl font-black">{selectedWarehouse.name}</h2>
                  <p className="text-xs text-slate-300">{selectedWarehouse.village}, {selectedWarehouse.district} ({selectedWarehouse.region})</p>
                </div>
              </div>

              {/* Grid Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                  <div className="text-slate-400">Total Capacity</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{selectedWarehouse.totalCapacityMT} MT</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="text-emerald-700 dark:text-emerald-300">Available Capacity</div>
                  <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">{selectedWarehouse.availableCapacityMT} MT</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                  <div className="text-slate-400">Rental Charge</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">₹{selectedWarehouse.rentalChargePerMT} <span className="text-xs font-normal">/MT/mo</span></div>
                </div>
              </div>

              {/* AVAILABILITY CALENDAR INDICATOR */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Warehouse Availability Calendar (30-Day Outlook)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {selectedWarehouse.availableCapacityMT > 0 ? "🟢 Available for Instant Booking" : "🔴 Fully Occupied"}
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const isReserved = i % 7 === 2 || i % 7 === 5;
                    const isFullyOccupied = selectedWarehouse.availableCapacityMT <= 0;
                    return (
                      <div
                        key={i}
                        title={`Day ${i + 1}: ${isFullyOccupied ? "Fully Occupied" : isReserved ? "Reserved" : "Available"}`}
                        className={`h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white transition-all ${isFullyOccupied ? "bg-rose-500" : isReserved ? "bg-amber-500" : "bg-emerald-500"}`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-[#8B949E] pt-1">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Reserved</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Fully Occupied</span>
                </div>
              </div>

              {/* Supported Commodities & Facilities */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Accepted Commodities:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWarehouse.supportedCommodities.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/50">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Facilities & Amenities:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedWarehouse.facilities.map((f) => (
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
                  <div>Owner Name: <strong className="text-slate-900 dark:text-white">{selectedWarehouse.ownerName}</strong></div>
                  <div>Contact Mobile: <a href={`tel:${selectedWarehouse.ownerMobile}`} className="text-emerald-600 font-bold hover:underline">{selectedWarehouse.ownerMobile}</a></div>
                  <div>Address: {selectedWarehouse.fullAddress}, Pincode: {selectedWarehouse.pincode}</div>
                  <div>Working Hours: {selectedWarehouse.workingHours}</div>
                </div>
              </div>

              {/* REVIEWS & RATING SECTION */}
              <div className="border-t border-slate-100 dark:border-[#2A2F3A] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    Farmer Reviews ({reviews.filter(r => r.warehouseId === selectedWarehouse.id).length})
                  </h4>
                  <span className="text-xs font-mono font-extrabold text-amber-500">{selectedWarehouse.rating} / 5.0 ★</span>
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="cursor-pointer text-amber-400"
                      >
                        <Star className={`h-4 w-4 ${star <= newReviewRating ? "fill-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Write your experience storing crops here..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                    />
                    <Button variant="primary" size="sm" type="submit">Submit</Button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {reviews.filter(r => r.warehouseId === selectedWarehouse.id).map((r) => (
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
                  disabled={selectedWarehouse.availableCapacityMT <= 0}
                  onClick={() => {
                    setBookingWarehouse(selectedWarehouse);
                    setSelectedWarehouse(null);
                  }}
                  className="w-full sm:w-auto justify-center font-black"
                >
                  Proceed to Book Storage Space
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===========================================================
            MODAL 2: BOOK STORAGE FORM (PARTIAL CAPACITY BOOKING)
            =========================================================== */}
        {bookingWarehouse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-5">
              <button
                onClick={() => setBookingWarehouse(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Book Storage Space</h3>
                <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-0.5">
                  {bookingWarehouse.name} • Available: <strong className="text-emerald-600">{bookingWarehouse.availableCapacityMT} MT</strong>
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
                      placeholder="e.g. Rajesh Kumar"
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
                    <input type="text" name="region" readOnly defaultValue={bookingWarehouse.region} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">District</label>
                    <input type="text" name="district" readOnly defaultValue={bookingWarehouse.district} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Village</label>
                    <input type="text" name="village" readOnly defaultValue={bookingWarehouse.village} className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#8B949E]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Select Commodity *</label>
                    <select name="commodity" required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white">
                      {bookingWarehouse.supportedCommodities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Quantity Required (MT) *</label>
                    <input
                      type="number"
                      name="quantityMT"
                      required
                      min={bookingWarehouse.minBookingMT}
                      max={bookingWarehouse.availableCapacityMT}
                      defaultValue={Math.min(10, bookingWarehouse.availableCapacityMT)}
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
                    <label className="block font-bold mb-1">Storage Duration *</label>
                    <select name="durationMonths" required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white">
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months (1 Year)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Special Handling Instructions (Optional)</label>
                  <input
                    type="text"
                    name="specialInstructions"
                    placeholder="e.g. Requires pallet stacking / fumigation before entry"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full justify-center py-3 font-black text-xs shadow-md">
                  Confirm Capacity Reservation
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
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Storage Booking Confirmed!</h3>
                      <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                        Booking ID: {item.id}
                      </div>
                    </div>

                    {/* RECEIPT BREAKDOWN */}
                    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#2A2F3A]">
                      <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-[#2A2F3A] pb-2">
                        Official Payment Summary Invoice
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Warehouse:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.warehouseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farmer Name:</span>
                        <span>{item.farmerName} ({item.farmerMobile})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Commodity & Quantity:</span>
                        <span className="font-bold text-emerald-600 font-mono">{item.commodity} • {item.quantityMT} MT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Storage Period:</span>
                        <span>{item.arrivalDate} to {item.pickupDate}</span>
                      </div>
                      
                      <div className="border-t border-slate-200 dark:border-[#2A2F3A] pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Warehouse Storage Fee:</span>
                          <span className="font-mono">₹{item.warehouseCharges.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Taxes (18% GST):</span>
                          <span className="font-mono">₹{item.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Refundable Security Deposit:</span>
                          <span className="font-mono">₹{item.securityDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-[#2A2F3A]">
                          <span>Grand Total Amount:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{item.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => {
                          alert(`Downloading Official Invoice Receipt ${item.id}.pdf`);
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
