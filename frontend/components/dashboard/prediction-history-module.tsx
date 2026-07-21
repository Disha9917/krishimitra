import * as React from "react";
import { PredictionHistoryTable } from "../tables/prediction-history-table";
import { MOCK_HISTORY } from "../../services/history.service";

export function PredictionHistoryModule() {
  return <PredictionHistoryTable records={MOCK_HISTORY} />;
}