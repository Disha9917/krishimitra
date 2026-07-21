import * as React from "react";
import { DiseasePrediction } from "../../types/disease";
import { ConfidenceBadge } from "../common/confidence-badge";
import { AlertTriangle, CheckCircle2, ShieldCheck, Stethoscope } from "lucide-react";

export interface DiseaseResultProps {
  prediction: DiseasePrediction;
  className?: string;
}

export function DiseaseResult({ prediction, className }: DiseaseResultProps) {
  return (
    <div className={`space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className || ""}`}>
      {/* Header & Image Preview */}
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {prediction.imageUrl && (
          <div className="relative h-44 w-full md:w-48 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={prediction.imageUrl} alt={prediction.diseaseName} className="h-full w-full object-cover" />
            <div className="absolute bottom-2 left-2 rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
              AI Diagnostic Image
            </div>
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnosis for {prediction.cropName}</span>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">{prediction.diseaseName}</h3>
              {prediction.scientificName && (
                <p className="text-xs italic text-slate-500">{prediction.scientificName}</p>
              )}
            </div>
            <ConfidenceBadge confidence={prediction.confidence} score={prediction.confidenceScore} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Severity Level: {prediction.severity}
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Stethoscope className="h-4 w-4 text-emerald-600" />
          Key Identified Symptoms
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
          {prediction.symptoms.map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Treatments (Chemical & Organic) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Prescribed AI Treatments & Remedy
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-900 block mb-1">Recommended Product & Spray</span>
            <p className="text-sm font-black text-emerald-950">{prediction.treatment.recommendedProduct || "Standard Fungicide Spray"}</p>
            <p className="text-xs font-semibold text-emerald-800 mt-1">Dosage: {prediction.treatment.dosage || "200 ml / acre"}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-700 block">Organic Alternatives</span>
            <ul className="text-xs text-slate-600 space-y-0.5">
              {prediction.treatment.organic.map((org, i) => (
                <li key={i} className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>{org}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
