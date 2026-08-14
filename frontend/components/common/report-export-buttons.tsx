import * as React from "react";
import { Button } from "../ui/button";
import { exportToCSV, triggerPrint, downloadPDFSummary } from "../../utils/download";
import { FileText, Download, Printer } from "lucide-react";

export interface ReportExportButtonsProps {
  title?: string;
  dataHeaders?: string[];
  dataRows?: (string | number)[][];
  summaryText?: string;
  className?: string;
}

export function ReportExportButtons({
  title = "AgriTech Advisory Report",
  dataHeaders = ["Date", "Crop", "Recommendation", "Confidence"],
  dataRows = [["2026-07-21", "Wheat", "Optimal Nitrogen Application", "High"]],
  summaryText = "FasalDrishti AI Advisory Summary",
  className,
}: ReportExportButtonsProps) {
  const handleExportCSV = () => {
    exportToCSV(`FasalDrishti_Report_${Date.now()}`, dataHeaders, dataRows);
  };

  const handleExportPDF = () => {
    downloadPDFSummary(title, summaryText);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 text-emerald-600" />
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportCSV}>
        <Download className="h-4 w-4 text-blue-600" />
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={triggerPrint}>
        <Printer className="h-4 w-4 text-slate-600" />
        Print
      </Button>
    </div>
  );
}
