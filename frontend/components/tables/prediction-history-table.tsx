import * as React from "react";
import { PredictionHistoryRecord } from "../../types/prediction";
import { ConfidenceBadge } from "../common/confidence-badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { SearchBar } from "../forms/search-bar";
import { downloadPDFSummary } from "../../utils/download";
import { FileText, Download } from "lucide-react";

export interface PredictionHistoryTableProps {
  records: PredictionHistoryRecord[];
}

export function PredictionHistoryTable({ records }: PredictionHistoryTableProps) {
  const [search, setSearch] = React.useState("");

  const filtered = records.filter(
    (r) =>
      r.crop.toLowerCase().includes(search.toLowerCase()) ||
      r.prediction.toLowerCase().includes(search.toLowerCase()) ||
      r.recommendation.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadReport = (record: PredictionHistoryRecord) => {
    downloadPDFSummary(
      `${record.crop} ${record.predictionType} Summary`,
      `Prediction: ${record.prediction}\nDisease: ${record.disease || "None"}\nRecommendation: ${record.recommendation}\nConfidence: ${record.confidence}`
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">AI Prediction & Advisory History</h3>
          <p className="text-xs text-slate-500">Log of generated crop recommendations and disease checks</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search history..." />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Prediction / Diagnosis</TableHead>
            <TableHead>Disease Status</TableHead>
            <TableHead>Recommendation</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="text-xs font-semibold text-slate-500">{record.date}</TableCell>
              <TableCell className="font-bold text-slate-900">{record.crop}</TableCell>
              <TableCell className="font-semibold text-slate-800">{record.prediction}</TableCell>
              <TableCell>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {record.disease || "N/A"}
                </span>
              </TableCell>
              <TableCell className="max-w-xs truncate text-xs text-slate-600">{record.recommendation}</TableCell>
              <TableCell>
                <ConfidenceBadge confidence={record.confidence} />
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => handleDownloadReport(record)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  Report
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
