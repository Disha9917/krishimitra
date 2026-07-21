import * as React from "react";
import { FileUpload } from "../forms/file-upload";
import { DiseaseResult } from "../cards/disease-result";
import { useDiseaseDetection } from "../../hooks/useDiseaseDetection";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { CROP_OPTIONS } from "../../utils/constants";
import { Scan, Sparkles, Upload } from "lucide-react";

export function DiseaseDetectionModule() {
  const [selectedCrop, setSelectedCrop] = React.useState("Wheat");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { prediction, isLoading, detect, reset } = useDiseaseDetection();

  const handleAnalyze = async () => {
    if (selectedFile) {
      await detect(selectedFile, selectedCrop);
    } else {
      // Demo run
      await detect("https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop", selectedCrop);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scan className="h-5 w-5 text-emerald-600" />
            AI Leaf Disease Scanner Workflow
          </h3>
          <p className="text-xs text-slate-500">Upload affected crop leaf image to identify diseases, symptoms & treatments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <Select
            label="Select Crop"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            options={CROP_OPTIONS}
          />
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Sample Upload / Camera</label>
            <FileUpload onFileSelect={(file) => setSelectedFile(file)} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" size="lg" className="flex-1" onClick={handleAnalyze} disabled={isLoading}>
            <Sparkles className="h-5 w-5" />
            {isLoading ? "Running AI Vision Model..." : "Run AI Disease Diagnosis"}
          </Button>
          {prediction && (
            <Button variant="outline" size="lg" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {prediction && <DiseaseResult prediction={prediction} className="animate-fade-in" />}
    </div>
  );
}