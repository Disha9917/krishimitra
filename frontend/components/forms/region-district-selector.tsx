"use client";

import React, { useState, useEffect } from "react";
import { getRegions, getDistrictsByRegion, getDistrictById, getDistrictCropMap } from "../../lib/regionData";
import { Region, District } from "../../types/region";
import { MapPin, Search, Check, ChevronDown, Sparkles, Layers, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RegionDistrictSelectorProps {
  selectedRegionId: string;
  selectedDistrictId: string;
  onSelect: (regionId: string, districtId: string) => void;
  className?: string;
}

export function RegionDistrictSelector({
  selectedRegionId,
  selectedDistrictId,
  onSelect,
  className = "",
}: RegionDistrictSelectorProps) {
  const regions = getRegions();
  const [activeRegionId, setActiveRegionId] = useState<string>(selectedRegionId || "central-gujarat");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedRegionId) {
      setActiveRegionId(selectedRegionId);
    }
  }, [selectedRegionId]);

  const activeRegion = regions.find((r) => r.id === activeRegionId) || regions[0];
  const regionDistricts = getDistrictsByRegion(activeRegionId);
  const currentDistrict = getDistrictById(selectedDistrictId) || regionDistricts[0];

  const filteredDistricts = regionDistricts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameGujarati.includes(searchQuery)
  );

  const cropMap = getDistrictCropMap(currentDistrict?.id || "");
  const isRegionLevelData = cropMap?.dataConfidence === "region-level";

  const handleRegionClick = (regionId: string) => {
    setActiveRegionId(regionId);
    const districts = getDistrictsByRegion(regionId);
    if (districts.length > 0) {
      onSelect(regionId, districts[0].id);
    }
  };

  const handleDistrictClick = (districtId: string) => {
    onSelect(activeRegionId, districtId);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative z-30 space-y-4 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-white/95 dark:bg-[#0D1117] p-4 sm:p-6 shadow-xl dark:shadow-2xl transition-all ${className}`}>
      {/* Step 1: 6 Regional Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Step 1: Select Gujarat Region</span>
          </label>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-slate-700">
            6 Agro-Climatic Zones
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {regions.map((region) => {
            const isSelected = region.id === activeRegionId;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleRegionClick(region.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-600/20 scale-[1.02]"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-400 text-slate-800 dark:text-slate-100"
                }`}
              >
                <span className={`text-sm font-black ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {region.name}
                </span>
                <span className={`text-[11px] font-bold mt-0.5 ${isSelected ? "text-emerald-100" : "text-emerald-700 dark:text-emerald-400"}`}>
                  {region.nameGujarati}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="activeRegionGlow"
                    className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: District Selection & Combobox */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Step 2: Select District ({activeRegion.name})</span>
          </label>

          {isRegionLevelData && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-500/40 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              Region-level data
            </span>
          )}
        </div>

        {/* Selected District Display & Dropdown Toggle */}
        <div className="relative z-40">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl border-2 border-emerald-500/40 dark:border-emerald-500/50 bg-emerald-50/60 dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer hover:border-emerald-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold shadow-xs">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {currentDistrict ? `${currentDistrict.name} (${currentDistrict.nameGujarati})` : "Select District"}
                </span>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </div>

          {/* Floating District Dropdown Drawer */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 z-[100] rounded-xl border-2 border-emerald-500/50 bg-white dark:bg-[#0F172A] shadow-2xl p-4 space-y-3 max-h-80 overflow-y-auto"
              >
                {/* Search Combobox Input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search district in ${activeRegion.name}...`}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredDistricts.map((district) => {
                    const isSelected = district.id === selectedDistrictId;
                    return (
                      <button
                        key={district.id}
                        type="button"
                        onClick={() => handleDistrictClick(district.id)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white border-2 border-emerald-400 shadow-md font-black"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className={`text-sm font-black ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                            {district.name}
                          </span>
                          <span className={`text-xs ${isSelected ? "text-emerald-100" : "text-emerald-700 dark:text-emerald-400"}`}>
                            {district.nameGujarati}
                          </span>
                        </div>
                        {isSelected && <Check className="h-5 w-5 ml-2 text-white shrink-0" />}
                      </button>
                    );
                  })}
                  {filteredDistricts.length === 0 && (
                    <div className="col-span-2 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                      No matching district found in {activeRegion.name}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
