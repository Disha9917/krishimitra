import * as React from "react";
import { ReportExportButtons } from "../common/report-export-buttons";
import { MOCK_REPORTS } from "../../services/report.service";
import { FileText, Download } from "lucide-react";

export function ReportsModule() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900">AgriTech Reports & Export Center</h3>
          <p className="text-xs text-slate-500">Download formatted PDF, CSV data tables, or print official field reports</p>
        </div>
        <ReportExportButtons
          title="KrishiMitra Advisory Comprehensive Report"
          summaryText="Includes 7-day crop advisory, soil moisture metrics, disease diagnosis, and APMC mandi price history."
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Generated Reports</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_REPORTS.map((rep) => (
            <div key={rep.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  {rep.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">{rep.fileSize}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">{rep.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rep.summaryText}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{rep.dateGenerated}</span>
                <ReportExportButtons title={rep.title} summaryText={rep.summaryText} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}