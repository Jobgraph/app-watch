import type { HistoryEntry } from './types';

const STORAGE_KEY = 'jg-watch-history';
const MAX_ENTRIES = 50;

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function getHistory(): HistoryEntry[] {
  return read();
}

export function addEntry(entry: HistoryEntry): HistoryEntry[] {
  const entries = [entry, ...read()].slice(0, MAX_ENTRIES);
  write(entries);
  return entries;
}

export function updateEntry(
  id: string,
  patch: Partial<HistoryEntry>,
): HistoryEntry[] {
  const entries = read().map((e) => (e.id === id ? { ...e, ...patch } : e));
  write(entries);
  return entries;
}

export function removeEntry(id: string): HistoryEntry[] {
  const entries = read().filter((e) => e.id !== id);
  write(entries);
  return entries;
}

export function clearHistory(): HistoryEntry[] {
  write([]);
  return [];
}
