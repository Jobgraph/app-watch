import { Activity, Plus, Trash2, X } from 'lucide-react';
import type { AnalysisType, HistoryEntry } from '../../lib/types';
import { cn, relativeTime } from '../../lib/utils';

const TYPE_LABELS: Record<AnalysisType, string> = {
  'performance-review': 'Performance',
  'trend-analysis': 'Trends',
  'anomaly-detection': 'Anomalies',
  'kpi-health-check': 'KPI Health',
};

interface SidebarProps {
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClearAll: () => void;
  onClose: () => void;
  brandColour: string;
}

export function Sidebar({
  entries,
  activeId,
  onSelect,
  onDelete,
  onNew,
  onClearAll,
  onClose,
  brandColour,
}: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Top bar */}
      <div className="h-14 border-b border-border px-3 flex items-center gap-2 shrink-0">
        <button
          onClick={onNew}
          style={{ backgroundColor: brandColour }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New analysis
        </button>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Entries list */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4 gap-3">
            <Activity className="h-10 w-10 opacity-40" />
            <p className="text-sm text-center">No analyses yet. Paste some data and run your first analysis.</p>
          </div>
        ) : (
          <ul className="py-2">
            {entries.map((entry) => (
              <li key={entry.id} className="group relative">
                <button
                  onClick={() => onSelect(entry)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 hover:bg-muted transition-colors',
                    activeId === entry.id && 'bg-muted',
                  )}
                >
                  <p className="text-sm font-medium text-foreground truncate pr-6">
                    {entry.inputPreview}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                      {TYPE_LABELS[entry.analysisType]}
                    </span>
                    {entry.result && (
                      <span className="text-[11px] text-muted-foreground">
                        {entry.result.signals.length} signal{entry.result.signals.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {entry.status === 'pending' && (
                      <span className="text-[11px] text-muted-foreground italic">
                        analysing...
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      {relativeTime(entry.createdAt)}
                    </span>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className="absolute right-2 top-3 p-1 rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom */}
      {entries.length > 0 && (
        <div className="border-t border-border px-3 py-2 shrink-0">
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  );
}
