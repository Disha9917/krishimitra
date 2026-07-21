export interface ReportSummary {
  id: string;
  title: string;
  category: "Advisory" | "Disease Diagnosis" | "Market Intelligence" | "Post-Harvest Analysis";
  dateGenerated: string;
  fileFormat: "PDF" | "CSV";
  fileSize: string;
  summaryText: string;
  downloadUrl: string;
}