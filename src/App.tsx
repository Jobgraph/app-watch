import { useState, useEffect } from 'react';
import { type AppConfig, loadConfig } from './config';

interface Signal {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

const MOCK_RESPONSE: Signal[] = [
  { severity: 'high', title: 'Revenue drop detected', detail: 'Weekly revenue down 23% vs. previous 4-week average (£18.2k → £14.0k)', action: 'Review pricing changes deployed last Tuesday; check conversion funnel for drop-off' },
  { severity: 'high', title: 'Churn spike', detail: '12 cancellations this week vs. typical 3-4. Cluster: all Enterprise tier.', action: 'Urgent: reach out to churned accounts for exit interviews; check recent Enterprise feature changes' },
  { severity: 'medium', title: 'Support ticket volume rising', detail: '47 tickets this week (+65%). Top category: "billing issues" (18 tickets)', action: 'Investigate billing system; consider proactive comms to affected users' },
  { severity: 'low', title: 'New sign-ups steady', detail: '34 new trials this week (within normal range of 28-40)', action: 'No action needed — monitor for trend changes' },
];

const severityColour = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Signal[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadConfig().then(setConfig); }, []);
  if (!config) return null;

  async function analyse() {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      if (config!.deploymentId === 'local') {
        await new Promise((r) => setTimeout(r, 1500));
        setResult(MOCK_RESPONSE);
      } else {
        const res = await fetch(
          `https://app.jobgraph.com/api/apps/${config!.deploymentId}/process`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, type: 'watch' }) }
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setResult(data.signals ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        {config.logoUrl && <img src={config.logoUrl} alt="" className="h-8 w-8 rounded" />}
        <h1 className="text-xl font-semibold">{config.appName}</h1>
        <span className="text-sm text-white/50">{config.orgName}</span>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your data (CSV, metrics, KPIs, or plain text)..."
          className="w-full min-h-[200px] bg-white/5 border border-white/10 rounded-lg p-4 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={analyse} disabled={loading || !input.trim()} style={{ backgroundColor: config.brandColour }} className="px-6 py-2.5 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
          {loading ? 'Analysing...' : 'Analyse data'}
        </button>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>
        )}
        {result && result.length > 0 && (
          <div className="space-y-4 pt-4">
            {result.map((signal, i) => (
              <section key={i} className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColour[signal.severity] }} />
                  <h2 className="text-lg font-semibold">{signal.title}</h2>
                  <span className="ml-auto text-xs uppercase tracking-wide" style={{ color: severityColour[signal.severity] }}>{signal.severity}</span>
                </div>
                <p className="text-white/70 text-sm mb-2">{signal.detail}</p>
                <p className="text-white/50 text-sm"><span className="font-medium text-white/70">Recommended action:</span> {signal.action}</p>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
