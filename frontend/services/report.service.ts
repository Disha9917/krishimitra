import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./axios";
import { ReportSummary } from "../types/report";

export const MOCK_REPORTS: ReportSummary[] = [
  {
    id: "REP-001",
    title: "Seasonal Wheat Crop Precision Advisory Report",
    category: "Advisory",
    dateGenerated: "2026-07-20",
    fileFormat: "PDF",
    fileSize: "1.8 MB",
    summaryText: "Comprehensive top 3 recommendations, 7-day irrigation timeline, and nitrogen fertilizer dosage for Ludhiana district.",
    downloadUrl: "#",
  },
  {
    id: "REP-002",
    title: "AI Disease Diagnosis & Fungicide Spray Schedule",
    category: "Disease Diagnosis",
    dateGenerated: "2026-07-18",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    summaryText: "Detailed leaf rust diagnosis with confidence rating of 94.6% and prescribed organic/chemical treatments.",
    downloadUrl: "#",
  },
  {
    id: "REP-003",
    title: "Post-Harvest Spoilage Risk & Commercial Selling Analysis",
    category: "Post-Harvest Analysis",
    dateGenerated: "2026-07-15",
    fileFormat: "CSV",
    fileSize: "450 KB",
    summaryText: "30-day spoilage projection and Sell vs Store vs Transport profit matrix.",
    downloadUrl: "#",
  },
];

export const reportService = {
  async getReports(): Promise<ReportSummary[]> {
    try {
      const data = await apiClient.get<Record<string, unknown>[]>(API_ENDPOINTS.REPORTS.LIST);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((rep, idx) => ({
          id: String(rep.id ?? `REP-00${idx + 1}`),
          title: String(rep.title ?? "Agricultural Advisory Report"),
          category: String(rep.reportType ?? rep.category ?? "Advisory"),
          dateGenerated: String(rep.createdAt ?? rep.created_at ?? new Date().toISOString().split("T")[0]),
          fileFormat: String(rep.format ?? rep.fileFormat ?? "PDF").toUpperCase(),
          fileSize: String(rep.fileSize ?? "1.5 MB"),
          summaryText: String(rep.summary ?? rep.summaryText ?? "Detailed report summary."),
          downloadUrl: API_ENDPOINTS.REPORTS.DOWNLOAD(String(rep.id)),
        }));
      }
    } catch {
      // Safe fallback to mock reports
    }

    return MOCK_REPORTS;
  },
};