import { useCallback, useState, useEffect } from 'react';
import { ThemeContext } from './lib/theme';
import type { AnalysisType, HistoryEntry } from './lib/types';
import { useThemeProvider } from './hooks/useTheme';
import { useConfig } from './hooks/useConfig';
import {
  getHistory,
  addEntry,
  updateEntry,
  removeEntry,
  clearHistory,
} from './lib/history';
import { getMockAnalysis } from './lib/mock';
import { AppShell } from './components/shell/AppShell';
import { WatchPanel } from './components/watch/WatchPanel';
import { Loader2 } from 'lucide-react';

export default function App() {
  const themeCtx = useThemeProvider();
  const { config, loading: configLoading } = useConfig();

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Load history on mount
  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const activeEntry = entries.find((e) => e.id === activeId) ?? null;

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  const handleNew = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleSelect = useCallback((entry: HistoryEntry) => {
    setActiveId(entry.id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const next = removeEntry(id);
      setEntries(next);
      if (activeId === id) setActiveId(null);
    },
    [activeId],
  );

  const handleClearAll = useCallback(() => {
    const next = clearHistory();
    setEntries(next);
    setActiveId(null);
  }, []);

  const handleAnalyse = useCallback(
    async (input: string, analysisType: AnalysisType) => {
      const id = crypto.randomUUID();
      const preview =
        input.trim().slice(0, 80) + (input.trim().length > 80 ? '...' : '');

      const entry: HistoryEntry = {
        id,
        createdAt: new Date().toISOString(),
        inputPreview: preview,
        input,
        analysisType,
        result: null,
        status: 'pending',
      };

      setEntries(addEntry(entry));
      setActiveId(id);
      setAnalysisLoading(true);

      try {
        // Simulate processing time
        await new Promise((r) => setTimeout(r, 1200));
        const result = getMockAnalysis(input, analysisType);
        const updated = updateEntry(id, { result, status: 'complete' });
        setEntries(updated);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        const updated = updateEntry(id, {
          status: 'error',
          errorMessage: message,
        });
        setEntries(updated);
      } finally {
        setAnalysisLoading(false);
      }
    },
    [],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  if (configLoading || !config) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!config.isConfigured && config.deploymentId !== 'local') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-extrabold text-foreground">{config.appName}</h1>
          <p className="text-sm text-muted-foreground">This app is not yet configured. Deploy it from Jobgraph to get started.</p>
          <a href="https://app.jobgraph.com" className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Go to Jobgraph</a>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={themeCtx}>
      <AppShell
        config={config}
        entries={entries}
        activeId={activeId}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onNew={handleNew}
        onClearAll={handleClearAll}
      >
        <WatchPanel
          activeEntry={activeEntry}
          onAnalyse={handleAnalyse}
          loading={analysisLoading}
          brandColour={config.brandColour}
        />
      </AppShell>
    </ThemeContext.Provider>
  );
}
