export type Severity = 'high' | 'medium' | 'low';

export type AnalysisType =
  | 'performance-review'
  | 'trend-analysis'
  | 'anomaly-detection'
  | 'kpi-health-check';

export interface Signal {
  severity: Severity;
  title: string;
  detail: string;
  action: string;
}

export interface WatchResult {
  signals: Signal[];
  analysisType: AnalysisType;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  inputPreview: string;
  input: string;
  analysisType: AnalysisType;
  result: WatchResult | null;
  status: 'pending' | 'complete' | 'error';
  errorMessage?: string;
}
