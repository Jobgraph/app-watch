import { useState, type ReactNode } from 'react';
import type { AppConfig } from '../../lib/config';
import type { HistoryEntry } from '../../lib/types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  config: AppConfig;
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClearAll: () => void;
  children: ReactNode;
}

export function AppShell({
  config,
  entries,
  activeId,
  onSelect,
  onDelete,
  onNew,
  onClearAll,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header config={config} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72 border-r border-border shrink-0 overflow-hidden">
          <Sidebar
            entries={entries}
            activeId={activeId}
            onSelect={(e) => {
              onSelect(e);
              setSidebarOpen(false);
            }}
            onDelete={onDelete}
            onNew={() => {
              onNew();
              setSidebarOpen(false);
            }}
            onClearAll={onClearAll}
            onClose={() => setSidebarOpen(false)}
            brandColour={config.brandColour}
          />
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-72 z-50 md:hidden shadow-xl">
              <Sidebar
                entries={entries}
                activeId={activeId}
                onSelect={(e) => {
                  onSelect(e);
                  setSidebarOpen(false);
                }}
                onDelete={onDelete}
                onNew={() => {
                  onNew();
                  setSidebarOpen(false);
                }}
                onClearAll={onClearAll}
                onClose={() => setSidebarOpen(false)}
                brandColour={config.brandColour}
              />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
