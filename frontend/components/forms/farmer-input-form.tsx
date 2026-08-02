import * as React from "react";
import { FarmerCropInput } from "../../types/crop";
import { CROP_OPTIONS } from "../../utils/constants";
import { getCurrentGPSLocation } from "../../utils/location";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { FileUpload } from "./file-upload";
import { MapPin, Calendar, CloudSun, Upload, Sparkles, Navigation } from "lucide-react";

export interface FarmerInputFormProps {
  onSubmit: (data: FarmerCropInput) => void;
  isLoading?: boolean;
}

export function FarmerInputForm({ onSubmit, isLoading }: FarmerInputFormProps) {
  const [gpsLocation, setGpsLocation] = React.useState("30.9010° N, 75.8573° E (Ludhiana)");
  const [pinCode, setPinCode] = React.useState("141001");
  const [cropType, setCropType] = React.useState("Wheat");
  const [sowingDate, setSowingDate] = React.useState("2026-06-10");
  const [weatherObservation, setWeatherObservation] = React.useState("High humidity with morning dew & light breeze");
  const [leafImage, setLeafImage] = React.useState<File | null>(null);
  const [isFetchingGPS, setIsFetchingGPS] = React.useState(false);

  const handleFetchGPS = async () => {
    setIsFetchingGPS(true);
    try {
      const loc = await getCurrentGPSLocation();
      setGpsLocation(loc.formatted);
    } catch (e) {
      // fallback
    } finally {
      setIsFetchingGPS(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      gpsLocation,
      pinCode,
      cropType,
      sowingDate,
      weatherObservation,
      leafImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Farmer Field & Crop Details
          </h3>
          <p className="text-xs text-slate-500">Provide field parameters to generate ranked AI advisories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPS Location with Auto-detect */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              GPS Location Coordinates
            </label>
            <button
              type="button"
              onClick={handleFetchGPS}
              disabled={isFetchingGPS}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
            >
              <Navigation className="h-3 w-3" />
              {isFetchingGPS ? "Detecting..." : "Auto Detect GPS"}
            </button>
          </div>
          <div className="relative">
            <Input
              value={gpsLocation}
              onChange={(e) => setGpsLocation(e.target.value)}
              placeholder="e.g. 30.9010° N, 75.8573° E"
              required
            />
          </div>
        </div>

        {/* Crop Type Select */}
        <Select
          label="Crop Type"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          options={CROP_OPTIONS}
          required
        />

        {/* Sowing Date */}
        <Input
          label="Sowing Date"
          type="date"
          value={sowingDate}
          onChange={(e) => setSowingDate(e.target.value)}
          required
        />
      </div>

      {/* Weather Observation */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Local Weather Observation
        </label>
        <textarea
          value={weatherObservation}
          onChange={(e) => setWeatherObservation(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="e.g. High humidity, sudden rainfall yesterday, overcast sky"
        />
      </div>

      {/* Optional Leaf Image Upload */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Optional Leaf Image Upload (For Disease Risk Check)
        </label>
        <FileUpload onFileSelect={(file) => setLeafImage(file)} />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Analyzing Field Data with AI..."
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Precision AI Advisory
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
