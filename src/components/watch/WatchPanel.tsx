import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  LineChart,
  AlertTriangle,
  Activity,
  Download,
  Loader2,
} from 'lucide-react';
import type { AnalysisType, HistoryEntry, Severity, Signal } from '../../lib/types';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Analysis-type card definitions                                     */
/* ------------------------------------------------------------------ */

const ANALYSIS_TYPES: {
  type: AnalysisType;
  label: string;
  description: string;
  icon: typeof TrendingUp;
}[] = [
  {
    type: 'performance-review',
    label: 'Performance Review',
    description: 'Revenue, costs, and conversion metrics',
    icon: TrendingUp,
  },
  {
    type: 'trend-analysis',
    label: 'Trend Analysis',
    description: 'Market shifts and emerging patterns',
    icon: LineChart,
  },
  {
    type: 'anomaly-detection',
    label: 'Anomaly Detection',
    description: 'Unusual spikes, drops, and outliers',
    icon: AlertTriangle,
  },
  {
    type: 'kpi-health-check',
    label: 'KPI Health Check',
    description: 'Score each key metric against targets',
    icon: Activity,
  },
];

/* ------------------------------------------------------------------ */
/*  Severity helpers                                                   */
/* ------------------------------------------------------------------ */

const SEVERITY_BORDER: Record<Severity, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-500',
};

const SEVERITY_BG: Record<Severity, string> = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const SEVERITY_DOT: Record<Severity, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

type FilterValue = 'all' | Severity;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface WatchPanelProps {
  activeEntry: HistoryEntry | null;
  onAnalyse: (input: string, analysisType: AnalysisType) => void;
  loading: boolean;
  brandColour: string;
}

export function WatchPanel({
  activeEntry,
  onAnalyse,
  loading,
  brandColour,
}: WatchPanelProps) {
  const [input, setInput] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('performance-review');
  const [filter, setFilter] = useState<FilterValue>('all');

  // Sync local state when the active entry changes
  useEffect(() => {
    if (activeEntry) {
      setInput(activeEntry.input);
      setAnalysisType(activeEntry.analysisType);
      setFilter('all');
    } else {
      setInput('');
      setAnalysisType('performance-review');
      setFilter('all');
    }
  }, [activeEntry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const signals = activeEntry?.result?.signals ?? [];
  const filtered =
    filter === 'all' ? signals : signals.filter((s) => s.severity === filter);

  const countBySeverity = (sev: Severity) =>
    signals.filter((s) => s.severity === sev).length;

  const highCount = countBySeverity('high');
  const mediumCount = countBySeverity('medium');
  const lowCount = countBySeverity('low');

  function handleExport() {
    const text = signals
      .map(
        (s) =>
          `[${s.severity.toUpperCase()}] ${s.title}\n${s.detail}\nAction: ${s.action}`,
      )
      .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watch-signals-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasResult =
    activeEntry?.status === 'complete' && activeEntry.result !== null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* ---------- Input section ---------- */}
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your data -- CSV, metrics, KPIs, or plain text..."
          rows={7}
          className="w-full rounded-xl border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />

        {/* Analysis type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ANALYSIS_TYPES.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setAnalysisType(type)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                type === analysisType
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-muted-foreground/30',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 mb-0.5',
                  type === analysisType
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              />
              <span className="text-sm font-medium text-foreground leading-tight">
                {label}
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {description}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onAnalyse(input, analysisType)}
          disabled={loading || !input.trim()}
          style={{ backgroundColor: brandColour }}
          className="px-6 py-2.5 rounded-lg font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Analysing...' : 'Analyse'}
        </button>
      </div>

      {/* ---------- Results section ---------- */}
      {hasResult && (
        <div className="space-y-4 pt-2">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {signals.length} signal{signals.length !== 1 ? 's' : ''} detected
            </span>
            <span className="hidden sm:inline">--</span>
            <span className="flex items-center gap-1">
              <span className={cn('w-2 h-2 rounded-full', SEVERITY_DOT.high)} />
              {highCount} high
            </span>
            <span className="flex items-center gap-1">
              <span className={cn('w-2 h-2 rounded-full', SEVERITY_DOT.medium)} />
              {mediumCount} medium
            </span>
            <span className="flex items-center gap-1">
              <span className={cn('w-2 h-2 rounded-full', SEVERITY_DOT.low)} />
              {lowCount} low
            </span>
            <div className="flex-1" />
            <button
              onClick={handleExport}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            {(
              [
                ['all', 'All', signals.length],
                ['high', 'High', highCount],
                ['medium', 'Medium', mediumCount],
                ['low', 'Low', lowCount],
              ] as [FilterValue, string, number][]
            ).map(([value, label, count]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filter === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Signal cards */}
          <AnimatePresence mode="popLayout">
            {filtered.map((signal, i) => (
              <SignalCard key={`${signal.title}-${i}`} signal={signal} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signal card                                                        */
/* ------------------------------------------------------------------ */

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className={cn(
        'rounded-xl border border-border bg-card p-5 border-l-4',
        SEVERITY_BORDER[signal.severity],
      )}
    >
      <div className="flex items-start gap-3 mb-2">
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0',
            SEVERITY_BG[signal.severity],
          )}
        >
          {signal.severity}
        </span>
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {signal.title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {signal.detail}
      </p>
      <div className="rounded-lg bg-muted/60 px-3 py-2.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Recommended action: </span>
          {signal.action}
        </p>
      </div>
    </motion.div>
  );
}
