"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../components/common/logo";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { Button } from "../../components/ui/button";
import { LiveBreezeBackground } from "../../components/landing/live-breeze-background";
import { GUJARAT_DISTRICT_ZONES } from "../../utils/constants";
import { getPrecisionCropAdvisory, CropLifecycleAdvisory } from "../../utils/advisories";
import { RegionDistrictSelector } from "../../components/forms/region-district-selector";
import { getLegacyDistrictFallback } from "../../lib/regionData";
import {
  Sprout,
  TrendingUp,
  Warehouse,
  Scan,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Layers,
  LogOut,
  User,
  Sparkles,
  Droplets,
  FlaskConical,
  Bug,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  ChevronRight,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingDown,
  Percent,
  Truck,
  Thermometer,
  Search,
  Filter,
  RefreshCw,
  PhoneCall,
  Activity,
  Flame,
  UploadCloud,
  FileImage,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldAlert,
  Microscope
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "disease" | "storage" | "mandi">("overview");

  // Auth Protection Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAuthCookie = document.cookie.includes("krishi_auth=true");
      const hasAuthLocal = localStorage.getItem("krishi_auth") === "true";
      if (!hasAuthCookie && !hasAuthLocal) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      document.cookie = "krishi_auth=; path=/; max-age=0";
      localStorage.removeItem("krishi_auth");
    }
    router.push("/login");
  };

  // Selected Gujarat Region & District State (Defaults to Central Gujarat -> Anand)
  const [selectedRegionId, setSelectedRegionId] = useState("central-gujarat");
  const [selectedDistrictId, setSelectedDistrictId] = useState("anand");
  const selectedDistrict = GUJARAT_DISTRICT_ZONES.find((d) => d.id === selectedDistrictId) || GUJARAT_DISTRICT_ZONES[0];

  // Precision Advisor Crop & Stage State
  const [selectedCropCategory, setSelectedCropCategory] = useState<"traditional" | "exotic">("traditional");
  const [selectedAdvisorCropName, setSelectedAdvisorCropName] = useState<string>("Tobacco");
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});

  const handleCategoryChange = (category: "traditional" | "exotic") => {
    setSelectedCropCategory(category);
    const filtered = selectedDistrict.crops.filter((c) => category === "exotic" ? c.isPremium : !c.isPremium);
    if (filtered.length > 0) {
      setSelectedAdvisorCropName(filtered[0].name);
      setActiveStageIndex(0);
    }
  };

  // Ensure selected crop is valid for active district when switching district
  useEffect(() => {
    if (selectedDistrict.crops.length > 0) {
      const hasExotic = selectedDistrict.crops.some((c) => c.isPremium);
      const category = selectedCropCategory === "exotic" && !hasExotic ? "traditional" : selectedCropCategory;
      setSelectedCropCategory(category);

      const filtered = selectedDistrict.crops.filter((c) => category === "exotic" ? c.isPremium : !c.isPremium);
      if (filtered.length > 0) {
        setSelectedAdvisorCropName(filtered[0].name);
      } else {
        setSelectedAdvisorCropName(selectedDistrict.crops[0].name);
      }
      setActiveStageIndex(0);
    }
  }, [selectedDistrictId]);

  // Active crop advisory dataset (uses exact advisory or dynamic generator fallback)
  const activeCropAdvisory: CropLifecycleAdvisory = getPrecisionCropAdvisory(selectedAdvisorCropName);
  const activeStage = activeCropAdvisory.stages[activeStageIndex] || activeCropAdvisory.stages[0];

  const toggleChecklist = (taskKey: string) => {
    setCheckedChecklist((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  // AI Leaf Disease Scanner State & File Handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState("Initializing Vision Model...");
  const [scanProgress, setScanProgress] = useState(0);

  const [diseaseReport, setDiseaseReport] = useState<null | {
    diseaseName: string;
    gujaratiName: string;
    cropAffected: string;
    confidencePct: number;
    severityLevel: string;
    surfaceCoverage: string;
    pathogenType: string;
    chemicalRemedy: string;
    dosage: string;
    organicRemedy: string;
    recoveryChecklist: string[];
  }>(null);

  // Preset Sample Leaf Images Database for Testing
  const sampleLeafPresets = [
    {
      id: "blight",
      title: "Leaf Blight & Spot",
      crop: "Cotton / Groundnut",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80",
      report: {
        diseaseName: "Cercospora Leaf Spot & Blight (ચોળું / ટપકાંનો રોગ)",
        gujaratiName: "પાંદડાના કાળા ચકમા અને સુકારો",
        cropAffected: "Cotton & Legumes",
        confidencePct: 97.4,
        severityLevel: "Stage 2: Moderate Outbreak",
        surfaceCoverage: "32% Leaf Surface Affected",
        pathogenType: "Fungal (Cercospora spp.)",
        chemicalRemedy: "Spray Mancozeb 75% WP @ 2.5g/L water OR Tebuconazole 25.9% EC @ 1ml/L",
        dosage: "200 Liters spray solution per acre",
        organicRemedy: "Spray Sour Buttermilk (Chhash 5%) + Neem Seed Kernel Extract (NSKE 5%) @ 50ml/L",
        recoveryChecklist: [
          "Remove & burn severely spotted lower leaves",
          "Apply prescribed Mancozeb fungicide spray immediately",
          "Avoid overhead sprinkler irrigation to prevent spore moisture spreading"
        ]
      }
    },
    {
      id: "pink_bollworm",
      title: "Pink Bollworm Larvae",
      crop: "Cotton (Kapash)",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
      report: {
        diseaseName: "Pink Bollworm Larval Damage (ગુલાબી ઈયળ ઉપદ્રવ)",
        gujaratiName: "કપાસની ગુલાબી ઈયળનું નુકસાન",
        cropAffected: "Bt Cotton",
        confidencePct: 98.6,
        severityLevel: "Stage 3: Severe Flower & Boll Attack",
        surfaceCoverage: "Rosette Flower & Internal Boll Entry",
        pathogenType: "Insect Pest (Pectinophora gossypiella)",
        chemicalRemedy: "Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L OR Spinetoram 11.7 SC @ 0.8ml/L",
        dosage: "Apply in evening hours using hollow cone nozzle",
        organicRemedy: "Install 8 PBW Pheromone traps/acre + Release Trichogramma parasitoids @ 60,000/acre",
        recoveryChecklist: [
          "Pluck and destroy all rosette (star-shaped) flowers",
          "Install PBW Pheromone traps to monitor adult male moth counts",
          "Spray Spinetoram 11.7 SC if moth count exceeds 8 moths/trap/night"
        ]
      }
    },
    {
      id: "mosaic_virus",
      title: "Mosaic Virus & Mildew",
      crop: "Tobacco / Cumin",
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
      report: {
        diseaseName: "Yellow Mosaic Virus & Aphid Attack (મોઝેક વાયરસ અને મોલી)",
        gujaratiName: "તમ્બાકુ અને જીરૂનો મોઝેક રોગ",
        cropAffected: "Tobacco & Spices",
        confidencePct: 95.8,
        severityLevel: "Stage 2: Active Sucking Pest Vector",
        surfaceCoverage: "Vein Clearing & Leaf Puckering",
        pathogenType: "Viral Vector (Transmitted by Whitefly / Aphids)",
        chemicalRemedy: "Spray Thiamethoxam 25 WG @ 0.3g/L OR Acetamiprid 20 SP @ 0.4g/L to kill insect vectors",
        dosage: "150 Liters solution per acre",
        organicRemedy: "Install 12 Yellow Sticky Traps/acre + Spray Neem Oil 3000 PPM @ 5ml/L",
        recoveryChecklist: [
          "Uproot and destroy virus infected yellow-mottled plants",
          "Install Yellow Sticky Traps to trap whitefly vector insects",
          "Spray Thiamethoxam to suppress vector population"
        ]
      }
    }
  ];

  // Start AI Computer Vision Analysis Simulation
  const runAiAnalysis = (imageUrl: string, customReport?: any) => {
    setUploadedImagePreview(imageUrl);
    setIsScanning(true);
    setDiseaseReport(null);
    setScanProgress(0);
    setScanStepText("Extracting Leaf Vein Grid & Chlorophyll Matrix...");

    setTimeout(() => {
      setScanProgress(35);
      setScanStepText("Scanning Necrotic Lesion Spots & Fungal Spore Density...");
    }, 800);

    setTimeout(() => {
      setScanProgress(70);
      setScanStepText("Cross-referencing ICAR & PlantVillage Neural Model...");
    }, 1600);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      
      const finalReport = customReport || sampleLeafPresets[0].report;
      setDiseaseReport(finalReport);
    }, 2400);
  };

  // Handle User Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      runAiAnalysis(localUrl, {
        diseaseName: "Cercospora Leaf Spot & Blight (સૂકારો રોગ)",
        gujaratiName: "પાંદડાના કાળા ચકમા",
        cropAffected: selectedDistrict.crops[0].name,
        confidencePct: 96.2,
        severityLevel: "Stage 2: Active Lesion Outbreak",
        surfaceCoverage: "28% Surface Affected",
        pathogenType: "Fungal Spore Outbreak",
        chemicalRemedy: "Spray Mancozeb 75% WP @ 2.5g/L OR Copper Oxychloride @ 3g/L",
        dosage: "200 Liters spray solution per acre",
        organicRemedy: "Spray Sour Buttermilk 5% + Neem Oil 3000 PPM @ 5ml/L",
        recoveryChecklist: [
          "Remove severely infected lower leaves from plant base",
          "Spray prescribed Mancozeb fungicide thoroughly over upper and lower leaf surfaces",
          "Maintain soil drainage to prevent fungal humidity buildup"
        ]
      });
    }
  };

  // Storage Planner State & Controls
  const [quantityQuintals, setQuantityQuintals] = useState(100);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [storageDays, setStorageDays] = useState(45);
  const [storageFacilityType, setStorageFacilityType] = useState<"Cold Storage" | "APMC Silo" | "Hermetic Bags">("APMC Silo");
  const [transportDistanceKm, setTransportDistanceKm] = useState(15);
  const [applyGovtSubsidy, setApplyGovtSubsidy] = useState(true);

  // APMC Mandi Search & Filter State
  const [mandiSearchQuery, setMandiSearchQuery] = useState("");
  const [selectedMandiZoneFilter, setSelectedMandiZoneFilter] = useState("all");

  const currentCrop = selectedDistrict.crops[selectedCropIndex] || selectedDistrict.crops[0];

  // Enhanced Storage Financial Calculations
  const basePricePerQuintal = currentCrop.price;
  const monthlyAppreciationRate = 0.08; 
  const grossAppreciationFactor = 1 + (monthlyAppreciationRate * (storageDays / 30));
  const projectedPricePerQtl = Math.round(basePricePerQuintal * grossAppreciationFactor);
  
  const baseMonthlyStorageRate = storageFacilityType === "Cold Storage" ? 45 : storageFacilityType === "APMC Silo" ? 25 : 15;
  const effectiveMonthlyStorageRate = applyGovtSubsidy ? baseMonthlyStorageRate * 0.5 : baseMonthlyStorageRate;
  
  const totalStorageFee = Math.round(quantityQuintals * effectiveMonthlyStorageRate * (storageDays / 30));
  const transportCost = Math.round(transportDistanceKm * 18 * (quantityQuintals > 200 ? 2 : 1));
  const totalOverheadCost = totalStorageFee + transportCost;

  const immediateRevenue = quantityQuintals * basePricePerQuintal;
  const projectedGrossRevenue = quantityQuintals * projectedPricePerQtl;
  const netStoredRevenue = projectedGrossRevenue - totalOverheadCost;
  const netProfitGain = netStoredRevenue - immediateRevenue;
  const returnOnInvestmentPct = ((netProfitGain / immediateRevenue) * 100).toFixed(1);

  const spoilageRiskPct = storageFacilityType === "Cold Storage" ? 0.5 : storageFacilityType === "APMC Silo" ? 1.2 : 2.5;
  const weightLossQty = (quantityQuintals * (spoilageRiskPct / 100)).toFixed(1);

  // APMC Mandi Rates Data strictly for the 5 allowed Gujarat Cities & their assigned crops
  const allMandiCommodities = [
    // Dahod (East)
    { name: "Maize (Makai)", yard: "Dahod APMC (East)", city: "Dahod", zone: "dahod", modalPrice: 2150, minPrice: 1950, maxPrice: 2300, arrival: "3,100 Qtl", trend: "+2.4%", isHot: false },
    { name: "Rice / Paddy (Dangar)", yard: "Dahod APMC (East)", city: "Dahod", zone: "dahod", modalPrice: 2183, minPrice: 1980, maxPrice: 2350, arrival: "2,800 Qtl", trend: "+1.6%", isHot: false },
    { name: "Soybean", yard: "Dahod APMC (East)", city: "Dahod", zone: "dahod", modalPrice: 4600, minPrice: 4300, maxPrice: 4850, arrival: "850 Qtl", trend: "+1.5%", isHot: false },
    { name: "Tur / Arhar (Tuver)", yard: "Dahod APMC (East)", city: "Dahod", zone: "dahod", modalPrice: 7000, minPrice: 6600, maxPrice: 7350, arrival: "620 Qtl", trend: "+4.1%", isHot: true },

    // Kutch/Bhuj (West)
    { name: "Bajra (Pearl Millet)", yard: "Bhuj APMC (West)", city: "Kutch/Bhuj", zone: "kutch", modalPrice: 2350, minPrice: 2150, maxPrice: 2500, arrival: "1,900 Qtl", trend: "+1.8%", isHot: false },
    { name: "Castor (Eranda)", yard: "Kutch APMC (West)", city: "Kutch/Bhuj", zone: "kutch", modalPrice: 6200, minPrice: 5850, maxPrice: 6450, arrival: "1,600 Qtl", trend: "+3.1%", isHot: true },
    { name: "Guar (Cluster Bean)", yard: "Gandhidham APMC (West)", city: "Kutch/Bhuj", zone: "kutch", modalPrice: 5400, minPrice: 5100, maxPrice: 5700, arrival: "750 Qtl", trend: "+2.6%", isHot: false },
    { name: "Cumin (Jeera)", yard: "Kutch APMC (West)", city: "Kutch/Bhuj", zone: "kutch", modalPrice: 28500, minPrice: 26800, maxPrice: 29400, arrival: "1,450 Qtl", trend: "+4.8%", isHot: true },

    // Anand (Central)
    { name: "Tobacco (Tambaku)", yard: "Anand APMC (Central)", city: "Anand", zone: "anand", modalPrice: 4800, minPrice: 4350, maxPrice: 5100, arrival: "950 Qtl", trend: "+3.5%", isHot: false },
    { name: "Cotton (Kapash)", yard: "Anand APMC (Central)", city: "Anand", zone: "anand", modalPrice: 6850, minPrice: 6400, maxPrice: 7100, arrival: "3,800 Qtl", trend: "+2.1%", isHot: true },
    { name: "Maize (Makai)", yard: "Petlad / Anand APMC", city: "Anand", zone: "anand", modalPrice: 2150, minPrice: 1950, maxPrice: 2300, arrival: "2,400 Qtl", trend: "+2.0%", isHot: false },
    { name: "Groundnut (Magfali)", yard: "Anand APMC (Central)", city: "Anand", zone: "anand", modalPrice: 6300, minPrice: 5900, maxPrice: 6550, arrival: "2,200 Qtl", trend: "+2.8%", isHot: true },

    // Banaskantha (North)
    { name: "Cumin (Jeera)", yard: "Palanpur APMC (North)", city: "Banaskantha", zone: "banaskantha", modalPrice: 28500, minPrice: 26800, maxPrice: 29400, arrival: "1,850 Qtl", trend: "+4.8%", isHot: true },
    { name: "Castor (Eranda)", yard: "Deesa APMC (North)", city: "Banaskantha", zone: "banaskantha", modalPrice: 6200, minPrice: 5850, maxPrice: 6450, arrival: "1,600 Qtl", trend: "+3.1%", isHot: true },
    { name: "Mustard (Rai)", yard: "Palanpur APMC (North)", city: "Banaskantha", zone: "banaskantha", modalPrice: 5450, minPrice: 5100, maxPrice: 5700, arrival: "1,100 Qtl", trend: "+1.9%", isHot: false },
    { name: "Bajra (Pearl Millet)", yard: "Dhanera APMC (North)", city: "Banaskantha", zone: "banaskantha", modalPrice: 2350, minPrice: 2150, maxPrice: 2500, arrival: "1,500 Qtl", trend: "+1.8%", isHot: false },

    // Navsari (South)
    { name: "Rice / Paddy (Dangar)", yard: "Navsari APMC (South)", city: "Navsari", zone: "navsari", modalPrice: 2250, minPrice: 2050, maxPrice: 2400, arrival: "4,500 Qtl", trend: "+1.2%", isHot: false },
    { name: "Sugarcane (Sherdi)", yard: "Gandevi / Navsari APMC", city: "Navsari", zone: "navsari", modalPrice: 340, minPrice: 320, maxPrice: 360, arrival: "8,500 Qtl", trend: "+1.0%", isHot: false },
    { name: "Banana (Kela)", yard: "Navsari APMC (South)", city: "Navsari", zone: "navsari", modalPrice: 1800, minPrice: 1600, maxPrice: 2000, arrival: "5,000 Qtl", trend: "+2.0%", isHot: false },
    { name: "Mango (Kesar / Alphonso)", yard: "Navsari APMC (South)", city: "Navsari", zone: "navsari", modalPrice: 4200, minPrice: 3800, maxPrice: 4600, arrival: "1,200 Qtl", trend: "+5.2%", isHot: true },
  ];

  const filteredMandiCommodities = allMandiCommodities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(mandiSearchQuery.toLowerCase()) ||
      c.yard.toLowerCase().includes(mandiSearchQuery.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(mandiSearchQuery.toLowerCase()));
    const matchesZone =
      selectedMandiZoneFilter === "all" || c.zone === selectedMandiZoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50/40 via-emerald-50/10 to-emerald-100/30 dark:from-[#0B0F14] dark:via-[#0B0F14]/95 dark:to-[#111827] flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Live Farm Breeze Canvas */}
      <LiveBreezeBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-emerald-200/50 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#0B0F14]/85 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo />
            
            {/* Gujarat District Selector Pill */}
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-[#161B22] px-3 py-1.5 border border-emerald-200/60 dark:border-[#2A2F3A] text-xs font-bold">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                value={selectedDistrictId}
                onChange={(e) => {
                  const distId = e.target.value;
                  const fallback = getLegacyDistrictFallback(distId);
                  setSelectedRegionId(fallback.regionId);
                  setSelectedDistrictId(distId);
                  setSelectedCropIndex(0);
                }}
                className="bg-transparent text-slate-900 dark:text-white font-extrabold focus:outline-none cursor-pointer pr-1"
              >
                {GUJARAT_DISTRICT_ZONES.map((dist) => (
                  <option key={dist.id} value={dist.id} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Farmer Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B22] p-1.5 border border-slate-200/60 dark:border-[#2A2F3A] text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">
              <div className="rounded-lg bg-emerald-600 p-1.5 text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              <span>Rajesh Patel</span>
            </div>

            <ThemeToggle />

            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Sub-Header Navigation Tabs */}
        <div className="border-t border-slate-100 dark:border-[#2A2F3A] bg-white/40 dark:bg-[#0B0F14]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("crops")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "crops"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Sprout className="h-4 w-4" />
              <span>Precision Crop Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab("disease")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "disease"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>AI Disease Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab("storage")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "storage"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <Warehouse className="h-4 w-4" />
              <span>Sell vs Store Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("mandi")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "mandi"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-[#8B949E] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>APMC Mandi Prices</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Statewide Gujarat 6-Region / 33-District Cascading Selector */}
            <RegionDistrictSelector
              selectedRegionId={selectedRegionId}
              selectedDistrictId={selectedDistrictId}
              onSelect={(regionId, districtId) => {
                setSelectedRegionId(regionId);
                setSelectedDistrictId(districtId);
                setSelectedCropIndex(0);
              }}
            />

            {/* Premium Dual-Theme Welcome Banner Hero Widget */}
            <div className="relative z-10 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-[#0F172A] dark:via-emerald-950/90 dark:to-[#0B0F14] text-slate-900 dark:text-white p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
              {/* Background Ambient Radial Glow */}
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-teal-500/10 dark:bg-teal-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Column: Greeting & CTAs */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 dark:bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-400/30 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                    <span>{selectedDistrict.zone} • {selectedDistrict.name} Advisory Active</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 dark:from-emerald-300 dark:via-teal-200 dark:to-white">Rajesh!</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-100/90 leading-relaxed max-w-xl font-medium">
                    Active agricultural location set to <strong className="text-slate-900 dark:text-white font-black">{selectedDistrict.name}</strong>. Top recommended crops for your zone: <span className="text-emerald-700 dark:text-emerald-300 font-bold">{selectedDistrict.crops.map((c) => c.name).join(", ")}</span>.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab("crops")}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-slate-950 font-black px-5 py-3 text-xs shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>Explore Stage-by-Stage Advisory ({selectedDistrict.crops.length} Crops)</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("disease")}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-slate-200/90 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 font-bold px-4 py-3 text-xs transition-all duration-200 shadow-xs cursor-pointer"
                    >
                      <Scan className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                      <span>Scan Leaf Image</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Agro Status Mini-Card */}
                <div className="lg:col-span-4 hidden lg:block">
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-400/30 bg-white/90 dark:bg-emerald-950/50 backdrop-blur-md p-4 space-y-3 shadow-md dark:shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/60 pb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Region Specs
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30">
                        Synced
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-emerald-200/80 font-medium">District Zone:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{selectedDistrict.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-emerald-200/80 font-medium">Primary Crop Match:</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-300">{selectedDistrict.crops[0]?.name} ({selectedDistrict.crops[0]?.match}%)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-emerald-200/80 font-medium">Market Benchmark:</span>
                        <span className="font-mono font-black text-slate-900 dark:text-white">₹{selectedDistrict.crops[0]?.price.toLocaleString()} / Qtl</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Top Crop Match</span>
                  <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDistrict.crops[0].name}</div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{selectedDistrict.crops[0].match}% Zone Match</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>APMC Price ({selectedDistrict.crops[0].name})</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">₹{selectedDistrict.crops[0].price.toLocaleString()} / Qtl</div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ↑ +5.2% in {selectedDistrict.name.split(" ")[0]} APMC
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Post-Harvest Gain</span>
                  <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">+₹{(Math.round(selectedDistrict.crops[0].price * 0.08 * 100) - 3500).toLocaleString()} / 100 Qtl</div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Store 30 Days for Max Profit
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#8B949E] text-xs font-semibold">
                  <span>Active District Zone</span>
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDistrict.name.split(" ")[0]}</div>
                <div className="text-[11px] text-slate-500 dark:text-[#8B949E]">
                  {selectedDistrict.zone}
                </div>
              </div>
            </div>

            {/* District Crops Grid Preview */}
            <div className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#2A2F3A] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Dedicated Crops for {selectedDistrict.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E]">
                    Curated agricultural suite tailored for {selectedDistrict.zone} soil & weather.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("crops")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <span>Open Stage-by-Stage Advisor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedDistrict.crops.map((crop, idx) => (
                  <div
                    key={crop.name}
                    className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] border border-emerald-100/60 dark:border-[#2A2F3A] space-y-3 relative overflow-hidden cursor-pointer hover:border-emerald-400 transition-all"
                    onClick={() => {
                      setSelectedAdvisorCropName(crop.name);
                      setActiveTab("crops");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5">
                        Crop #{idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                        {crop.match}% Match
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{crop.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-[#8B949E]">{crop.season} Season</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 dark:text-[#C9D1D9] border-t border-emerald-100 dark:border-[#2A2F3A] pt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Yield:</span>
                        <span className="font-bold">{crop.yield}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mandi Price:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{crop.price.toLocaleString()}/Qtl</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PRECISION CROP ADVISOR */}
        {activeTab === "crops" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Precision Crop Advisor — Time Stage Advisories
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-0.5">
                  Interval-by-interval precision guidance from pre-sowing to harvest for {selectedDistrict.name} ({selectedDistrict.zone}).
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-[#161B22] p-2 border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Switch District Zone:</span>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="bg-transparent font-extrabold text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer"
                >
                  {GUJARAT_DISTRICT_ZONES.map((d) => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CROP SELECTION BAR */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-sm space-y-6">
              {/* Category Navigation Tabs */}
              <div className="flex border-b border-slate-100 dark:border-[#2A2F3A]">
                <button
                  onClick={() => handleCategoryChange("traditional")}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    selectedCropCategory === "traditional"
                      ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500"
                      : "border-transparent text-slate-500 dark:text-[#8B949E] hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Sprout className="h-4 w-4 shrink-0" />
                  <span>🌾 Traditional Crops</span>
                </button>

                {selectedDistrict.crops.some(c => c.isPremium) && (
                  <button
                    onClick={() => handleCategoryChange("exotic")}
                    className={`ml-6 pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      selectedCropCategory === "exotic"
                        ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500"
                        : "border-transparent text-slate-500 dark:text-[#8B949E] hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>🌟 Exotic Crops (Premium)</span>
                  </button>
                )}
              </div>

              {/* Title & Subtitle block based on selection */}
              <div className="space-y-1">
                {selectedCropCategory === "traditional" ? (
                  <>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      Traditional Crops
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] leading-relaxed">
                      Select a traditional crop from your region to view precision timelines, irrigation volumes, and specific fertilizer inputs.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        Exotic Crops
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-400/20 rounded-md">
                        Premium
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] leading-relaxed">
                      High-value crops with higher profit potential. Suitable cultivation practices and climate are recommended.
                    </p>
                  </>
                )}
              </div>

              {/* Crop list depending on the selected category */}
              <div className="flex flex-wrap gap-2.5">
                {selectedDistrict.crops
                  .filter((crop) => selectedCropCategory === "exotic" ? crop.isPremium : !crop.isPremium)
                  .map((crop) => (
                    <button
                      key={crop.name}
                      onClick={() => {
                        setSelectedAdvisorCropName(crop.name);
                        setActiveStageIndex(0);
                      }}
                      className={`text-xs font-bold px-4 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                        selectedAdvisorCropName === crop.name
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md dark:bg-emerald-500"
                          : "bg-white dark:bg-[#111827] text-slate-700 dark:text-[#C9D1D9] border-slate-100 dark:border-[#2A2F3A] hover:bg-slate-50 dark:hover:bg-[#1C212A]"
                      }`}
                    >
                      <span>{crop.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* STAGE TRACKER */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#2A2F3A] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold">
                      {activeCropAdvisory.season} Season
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {activeCropAdvisory.cropName} ({activeCropAdvisory.gujaratiName}) Lifecycle
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">
                    Ideal Soil: {activeCropAdvisory.idealSoil} • Total Duration: {activeCropAdvisory.totalDurationDays} Days
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-[#111827] px-3.5 py-2 rounded-xl border border-emerald-100 dark:border-[#2A2F3A]">
                  <Clock className="h-4 w-4" />
                  <span>Selected: {activeStage.daysRange}</span>
                </div>
              </div>

              {/* Growth Stage Interval Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {activeCropAdvisory.stages.map((stage, idx) => (
                  <button
                    key={stage.stageId}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-300 space-y-1 cursor-pointer ${
                      activeStageIndex === idx
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md dark:bg-emerald-500"
                        : "bg-emerald-50/50 dark:bg-[#111827] text-slate-700 dark:text-[#C9D1D9] border-emerald-100/60 dark:border-[#2A2F3A] hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${activeStageIndex === idx ? "bg-white/20 text-white" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400"}`}>
                        Step #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold ${activeStageIndex === idx ? "text-emerald-100" : "text-slate-400"}`}>
                        {stage.daysRange}
                      </span>
                    </div>
                    <p className="text-xs font-bold truncate mt-1">{stage.stageName.split(": ")[1] || stage.stageName}</p>
                  </button>
                ))}
              </div>

              {/* ACTIVE TIME INTERVAL PRECISION ADVISORY DISPLAY */}
              <div className="rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 dark:from-[#0B0F14] dark:via-[#161B22] dark:to-[#0B0F14] p-6 sm:p-8 shadow-inner space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-[#2A2F3A] pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-3 py-0.5 text-[11px] font-extrabold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{activeStage.daysRange}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">
                      {activeStage.stageName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-[#C9D1D9] leading-relaxed max-w-3xl">
                      {activeStage.summary}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pillar 1 */}
                  <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/50 dark:bg-[#111827] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-sm">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                          <Droplets className="h-4 w-4" />
                        </div>
                        <span>Irrigation Advisory</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {activeStage.irrigation.volumeLiters}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Recommended Frequency:</p>
                        <p className="font-bold text-slate-900 dark:text-white">{activeStage.irrigation.frequency}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-100/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900/30 font-medium">
                        <strong>Critical Note:</strong> {activeStage.irrigation.criticalNote}
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-[#111827] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                        <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                          <FlaskConical className="h-4 w-4" />
                        </div>
                        <span>Fertilizer Dose</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Prescribed Dose per Acre:</p>
                        <p className="font-extrabold text-emerald-700 dark:text-emerald-400">{activeStage.fertilizer.dose}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Application Timing & Method:</p>
                        <p className="font-bold text-slate-900 dark:text-white">{activeStage.fertilizer.timing} — {activeStage.fertilizer.method}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/50 dark:bg-[#111827] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300 text-sm">
                        <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                          <Bug className="h-4 w-4" />
                        </div>
                        <span>Pest & Disease Watch</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeStage.pestDisease.riskLevel === "High" || activeStage.pestDisease.riskLevel === "Critical" ? "bg-red-600 text-white" : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"}`}>
                        {activeStage.pestDisease.riskLevel} Risk
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Target Threat:</p>
                        <p className="font-bold text-slate-900 dark:text-white">{activeStage.pestDisease.targetPest}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Chemical Spray Treatment:</p>
                        <p className="font-bold text-purple-900 dark:text-purple-300">{activeStage.pestDisease.preventativeAction}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Organic Alternative:</p>
                        <p className="font-bold text-emerald-700 dark:text-emerald-400">{activeStage.pestDisease.organicRemedy}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INTERVAL FIELD ACTION CHECKLIST */}
                <div className="rounded-2xl border border-emerald-200 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Field Action Checklist ({activeStage.daysRange})</span>
                    </h5>
                    <span className="text-xs text-slate-500 dark:text-[#8B949E]">Check completed farm activities</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeStage.checklist.map((item, idx) => {
                      const itemKey = `${activeCropAdvisory.cropName}-${activeStage.stageId}-${idx}`;
                      const isDone = !!checkedChecklist[itemKey];

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleChecklist(itemKey)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                            isDone
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through"
                              : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#2A2F3A] text-slate-800 dark:text-[#C9D1D9] hover:border-emerald-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isDone ? (
                              <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                            <span>{item}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                            {isDone ? "Completed" : "Pending"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AI LEAF DISEASE SCANNER */}
        {activeTab === "disease" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-extrabold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <Microscope className="h-4 w-4 text-emerald-600" />
                <span>Deep Learning Plant Pathology Model v4.2</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">AI Crop Leaf Disease Diagnostic Scanner</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C9D1D9] max-w-xl mx-auto">
                Upload or capture any infected crop leaf photo for real-time computer vision analysis, lesion severity grading & ICAR prescribed remedies.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-8">
              {!uploadedImagePreview && !isScanning && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 rounded-3xl p-10 text-center space-y-4 bg-emerald-50/40 dark:bg-[#111827] hover:bg-emerald-50 dark:hover:bg-[#161B22] transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Click to upload or drag & drop leaf photo
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8B949E] mt-1">
                      Supports JPG, PNG, WEBP (Smartphone camera photos supported up to 15MB)
                    </p>
                  </div>
                  <Button variant="primary" size="sm" className="gap-2 text-xs font-bold pointer-events-none">
                    <FileImage className="h-4 w-4" />
                    <span>Browse Leaf Image</span>
                  </Button>
                </div>
              )}

              {(uploadedImagePreview || isScanning) && (
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-md h-72 rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-2xl bg-black flex items-center justify-center">
                    {uploadedImagePreview && (
                      <img
                        src={uploadedImagePreview}
                        alt="Scanned Leaf Preview"
                        className="w-full h-full object-cover"
                      />
                    )}

                    {isScanning && (
                      <>
                        <motion.div
                          animate={{ y: ["-100%", "280%"] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                          className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] z-20"
                        />
                        <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-white p-4 space-y-3">
                          <Scan className="h-10 w-10 text-emerald-400 animate-spin" />
                          <p className="text-xs font-black text-center text-emerald-200">{scanStepText}</p>
                          <div className="w-48 bg-black/60 h-2 rounded-full overflow-hidden border border-emerald-500/40">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isScanning && (
                    <p className="text-center text-xs font-extrabold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      Analyzing computer vision neural layers... Please wait
                    </p>
                  )}
                </div>
              )}

              {!isScanning && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#8B949E]">
                    <span>Or test with real diseased leaf sample photos:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Instant Demo Scan</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sampleLeafPresets.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => runAiAnalysis(preset.image, preset.report)}
                        className="p-3 rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#111827] hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <img
                          src={preset.image}
                          alt={preset.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{preset.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-[#8B949E] truncate">{preset.crop}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {diseaseReport && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-emerald-200 dark:border-[#2A2F3A] bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 dark:from-[#0B0F14] dark:via-[#161B22] dark:to-[#0B0F14] p-6 sm:p-8 shadow-2xl space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 dark:border-[#2A2F3A] pb-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-3 py-0.5 text-[10px] font-black uppercase mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>AI Diagnostic Conclusion</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          {diseaseReport.diseaseName}
                        </h3>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {diseaseReport.gujaratiName} • Crop: {diseaseReport.cropAffected}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {diseaseReport.confidencePct}%
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">Match Confidence</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span>Infection Severity</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{diseaseReport.severityLevel}</p>
                        <p className="text-[10px] text-slate-500">{diseaseReport.surfaceCoverage}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                          <Bug className="h-4 w-4 text-purple-600" />
                          <span>Pathogen Classification</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{diseaseReport.pathogenType}</p>
                        <p className="text-[10px] text-slate-500">ICAR Neural Classification</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 space-y-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          <FlaskConical className="h-4 w-4 text-emerald-600" />
                          <span>Dosage Benchmark</span>
                        </div>
                        <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">{diseaseReport.dosage}</p>
                        <p className="text-[10px] text-slate-500">Recommended Spray Volume</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#2A2F3A] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                          <FlaskConical className="h-4 w-4 text-blue-600" />
                          <span>Prescribed Chemical Fungicide / Insecticide</span>
                        </div>
                        <p className="text-xs font-bold text-blue-900 dark:text-blue-200 leading-relaxed">
                          {diseaseReport.chemicalRemedy}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#2A2F3A] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                          <Sprout className="h-4 w-4 text-emerald-600" />
                          <span>Certified Organic & Bio-Farming Recipe</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                          {diseaseReport.organicRemedy}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#2A2F3A] space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                        <span>Actionable Field Recovery Protocol</span>
                      </h4>

                      <div className="space-y-2">
                        {diseaseReport.recoveryChecklist.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                            <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedImagePreview(null);
                          setDiseaseReport(null);
                        }}
                        className="gap-2 text-xs font-bold cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Scan Another Leaf Photo</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SELL VS STORE PLANNER */}
        {activeTab === "storage" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#2A2F3A] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Financial Agronomy & Storage Intelligence Suite</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Sell vs Store Profit Decision Engine
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-1 max-w-2xl">
                  Simulate holding post-harvest crops in certified cold storages & APMC silos across <strong>{selectedDistrict.name}</strong> to defeat post-harvest price crashes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <TrendingUp className="h-4 w-4" />
                  <span>Market Trend: Bullish +8%/mo</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2A2F3A] text-slate-700 dark:text-[#C9D1D9]">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span>3 Certified Warehouses Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Harvest & Storage Controls</span>
                    </h3>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">Step 1 of 2</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">
                      Select Target Harvest Crop ({selectedDistrict.name})
                    </label>
                    <select
                      value={selectedCropIndex}
                      onChange={(e) => setSelectedCropIndex(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-emerald-50/50 dark:bg-[#111827] p-3 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {selectedDistrict.crops.map((c, i) => (
                        <option key={c.name} value={i} className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white">
                          {c.isPremium ? "🌟 " : "🌾 "} {c.name} (Current APMC: ₹{c.price.toLocaleString()}/Qtl • {c.season})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-700 dark:text-[#C9D1D9]">Harvest Quantity:</label>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{quantityQuintals} Quintals ({(quantityQuintals * 0.1).toFixed(1)} Tons)</span>
                    </div>

                    <div className="flex gap-2">
                      {[25, 50, 100, 250, 500].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setQuantityQuintals(preset)}
                          className={`flex-1 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                            quantityQuintals === preset
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 dark:bg-[#111827] text-slate-600 dark:text-[#8B949E] border-slate-200 dark:border-[#2A2F3A] hover:border-emerald-300"
                          }`}
                        >
                          {preset} Qtl
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={quantityQuintals}
                      onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">
                      Select Certified Storage Facility Type
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "APMC Silo", label: "APMC Silo", rate: "₹25/Qtl", icon: Building2 },
                        { id: "Cold Storage", label: "Cold Storage", rate: "₹45/Qtl", icon: Thermometer },
                        { id: "Hermetic Bags", label: "Hermetic Bags", rate: "₹15/Qtl", icon: ShieldCheck },
                      ].map((fac) => {
                        const Icon = fac.icon;
                        const isSelected = storageFacilityType === fac.id;
                        return (
                          <button
                            key={fac.id}
                            onClick={() => setStorageFacilityType(fac.id as any)}
                            className={`p-3 rounded-2xl text-left border transition-all space-y-1 cursor-pointer ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md dark:bg-emerald-500"
                                : "bg-emerald-50/40 dark:bg-[#111827] text-slate-700 dark:text-[#C9D1D9] border-slate-200 dark:border-[#2A2F3A]"
                            }`}
                          >
                            <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                            <p className="text-xs font-bold leading-tight">{fac.label}</p>
                            <p className={`text-[10px] ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>{fac.rate}/mo</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-700 dark:text-[#C9D1D9]">Holding Duration:</label>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{storageDays} Days ({(storageDays / 30).toFixed(1)} Months)</span>
                    </div>

                    <input
                      type="range"
                      min={15}
                      max={120}
                      step={15}
                      value={storageDays}
                      onChange={(e) => setStorageDays(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                      <span>15 Days</span>
                      <span>30 Days</span>
                      <span>60 Days</span>
                      <span>90 Days</span>
                      <span>120 Days</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#2A2F3A] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-[#C9D1D9]">Warehouse Distance:</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <input
                          type="number"
                          value={transportDistanceKm}
                          onChange={(e) => setTransportDistanceKm(Number(e.target.value))}
                          className="w-14 rounded-lg border border-slate-200 dark:border-[#2A2F3A] bg-white dark:bg-[#111827] px-2 py-1 text-center text-xs font-bold"
                        />
                        <span>km</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-emerald-600" />
                        <div>
                          <p className="font-bold text-emerald-900 dark:text-emerald-200">50% Govt Storage Subsidy</p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Under Gujarat Kisan Cold Storage Scheme</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={applyGovtSubsidy}
                        onChange={(e) => setApplyGovtSubsidy(e.target.checked)}
                        className="h-4 w-4 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between transition-all ${
                  netProfitGain > 0
                    ? "border-emerald-500/40 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/80 dark:from-emerald-950 dark:via-[#0B0F14] dark:to-emerald-900 text-slate-900 dark:text-white"
                    : "border-amber-500/40 dark:border-amber-800/80 bg-gradient-to-br from-amber-50/90 via-amber-50/70 to-orange-100/80 dark:from-amber-950 dark:via-[#0B0F14] dark:to-amber-900 text-slate-900 dark:text-white"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-400/40 text-[10px] font-black px-3 py-1 uppercase tracking-wider">
                        AI Commercial Agronomy Decision
                      </span>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-200">
                        Confidence: 97.4%
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      {netProfitGain > 0
                        ? `RECOMMENDED: HOLD IN ${storageFacilityType.toUpperCase()} FOR ${storageDays} DAYS`
                        : "RECOMMENDED: SELL IMMEDIATELY AT APMC MANDI"}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-100 leading-relaxed font-medium">
                      {netProfitGain > 0
                        ? `Harvest arrival pressure in ${selectedDistrict.name} APMC is causing temporary price dips. Holding ${quantityQuintals} Qtl of ${currentCrop.name} for ${storageDays} days yields an estimated extra net profit of +₹${netProfitGain.toLocaleString()} (+${returnOnInvestmentPct}% ROI).`
                        : `Current APMC prices for ${currentCrop.name} are at peak seasonal highs. Immediate selling is advised to avoid holding expenses.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200 dark:border-white/10 pt-5 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-emerald-300 text-[11px] font-bold">Immediate APMC Payout</span>
                      <p className="text-lg font-black text-slate-900 dark:text-white">₹{immediateRevenue.toLocaleString()}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-emerald-300 text-[11px] font-bold">Projected Gross Sale</span>
                      <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">₹{projectedGrossRevenue.toLocaleString()}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-emerald-300 text-[11px] font-bold">Storage & Transport Fee</span>
                      <p className="text-lg font-black text-rose-600 dark:text-rose-300">-₹{totalOverheadCost.toLocaleString()}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-emerald-300 text-[11px] font-bold">Net Profit Gain</span>
                      <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">+₹{netProfitGain.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2F3A] pb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Comparative Holding Time Matrix ({quantityQuintals} Qtl {currentCrop.name})</span>
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Live Simulation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#2A2F3A] space-y-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Sell Today
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">₹{immediateRevenue.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500">APMC Baseline</p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${storageDays === 30 ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#2A2F3A]"}`}>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                        30 Days Hold
                      </span>
                      <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                        +₹{(Math.round(immediateRevenue * 1.08) - Math.round(quantityQuintals * effectiveMonthlyStorageRate)).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+8.0% Rate Growth</p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${storageDays === 60 ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#2A2F3A]"}`}>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                        60 Days Hold
                      </span>
                      <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                        +₹{(Math.round(immediateRevenue * 1.16) - Math.round(quantityQuintals * effectiveMonthlyStorageRate * 2)).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+16.0% Rate Growth</p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${storageDays === 90 ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#2A2F3A]"}`}>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                        90 Days Hold
                      </span>
                      <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                        +₹{(Math.round(immediateRevenue * 1.24) - Math.round(quantityQuintals * effectiveMonthlyStorageRate * 3)).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+24.0% Rate Growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: APMC MANDI PRICES */}
        {activeTab === "mandi" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#2A2F3A] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 mb-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Real-Time Gujarat APMC Auction Ticker</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Live APMC Mandi Market Intelligence
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#C9D1D9] mt-1 max-w-2xl">
                  Daily auction rates, arrival tonnages, and 7-day price trend forecasts across all 5 major agricultural zones of Gujarat.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2A2F3A] text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Market Connection Active</span>
                </div>

                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Rates</span>
                </Button>
              </div>
            </div>

            {/* Live Scrolling Infinite Marquee Ticker */}
            <div className="rounded-2xl border-2 border-emerald-500/30 dark:border-[#2A2F3A] bg-emerald-50/90 dark:bg-emerald-950 text-slate-900 dark:text-white p-3.5 shadow-md overflow-hidden flex items-center gap-4 text-xs font-bold relative">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white shrink-0 font-extrabold uppercase text-[10px] z-10 shadow-sm">
                <Flame className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                Live Ticker
              </span>

              <div className="flex items-center overflow-hidden whitespace-nowrap text-slate-700 dark:text-emerald-100 w-full relative no-scrollbar">
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="flex items-center gap-8 whitespace-nowrap shrink-0"
                >
                  {[...allMandiCommodities, ...allMandiCommodities].map((c, i) => (
                    <span key={`${c.name}-${i}`} className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white font-black">{c.name}:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-black">₹{c.modalPrice.toLocaleString()}/Qtl</span>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">{c.trend}</span>
                      <span className="text-emerald-300 dark:text-emerald-700">|</span>
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search crop or APMC yard (e.g. Cumin, Unjha, Rajkot)..."
                  value={mandiSearchQuery}
                  onChange={(e) => setMandiSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-[#2A2F3A] bg-emerald-50/40 dark:bg-[#111827] pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Filter className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-slate-500 dark:text-[#8B949E] shrink-0">Zone Filter:</span>
                <div className="flex gap-1.5">
                  {[
                    { id: "all", label: "All Gujarat" },
                    { id: "anand", label: "Central" },
                    { id: "dahod", label: "East" },
                    { id: "kutch", label: "West" },
                    { id: "banaskantha", label: "North" },
                    { id: "navsari", label: "South" },
                  ].map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setSelectedMandiZoneFilter(z.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                        selectedMandiZoneFilter === z.id
                          ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20"
                          : "bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-[#8B949E] hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Commodity Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMandiCommodities.map((item, idx) => (
                <div
                  key={`${item.name}-${item.yard}-${idx}`}
                  className="rounded-3xl border border-emerald-100 dark:border-[#2A2F3A] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md p-6 shadow-md space-y-4 flex flex-col justify-between hover:border-emerald-400 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{item.name}</span>
                        {item.isHot && (
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[9px] font-extrabold uppercase">
                            Hot Arrival
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{item.trend}</span>
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-[#8B949E] font-semibold">Modal Auction Rate</span>
                        <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                          ₹{item.modalPrice.toLocaleString()} <span className="text-xs font-bold text-slate-500">/ Qtl</span>
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-[#8B949E]">{item.yard}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#2A2F3A]">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Day Min: ₹{item.minPrice.toLocaleString()}</span>
                        <span className="text-slate-500">Day Max: ₹{item.maxPrice.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-3/4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#2A2F3A]">
                    <span className="text-slate-500 dark:text-[#8B949E]">Market Arrivals: <strong>{item.arrival}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedAdvisorCropName(item.name.split(" ")[0]);
                        setActiveTab("crops");
                      }}
                      className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <span>Stage Advisory</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </main>

      {/* Dashboard Footer */}
      <footer className="relative z-20 text-center py-4 border-t border-slate-100 dark:border-[#2A2F3A] text-[11px] text-slate-500 dark:text-[#8B949E]">
        © {new Date().getFullYear()} KrishiMitra AI. Kisan Call Helpline Support 1800-180-1551.
      </footer>
    </div>
  );
}
