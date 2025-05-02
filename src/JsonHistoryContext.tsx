import { createContext, ReactElement, useContext, useState } from 'react';

interface HistoryEntry {
  rawContent: string;
  snippet: string;
}

interface JsonHistoryContextInterface {
  entries: HistoryEntry[];
  appendEntry(entries: string): void;
}

const JsonHistoryContext = createContext<JsonHistoryContextInterface | undefined>(undefined);

export const useJsonHistoryContext = () => {
  const context = useContext(JsonHistoryContext);
  if (context === undefined) {
    throw new Error('useJsonHistoryContext must be used within a JsonHistoryContext');
  }
  return context;
};

export const JsonHistoryContextProvider = ({ children }: { children: ReactElement }) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const appendEntry = (entry: string)  => {
    if (!entry) {
      return;
    }

    const MAX_TO_DISPLAY = 10;
    const firstChars = entry.slice(0, MAX_TO_DISPLAY);

    setEntries([
      ...entries,
      { snippet: entry.length > MAX_TO_DISPLAY ? `${firstChars}...` : entry, rawContent: entry },
    ]);
  };

  return (
    <JsonHistoryContext.Provider value={{ appendEntry, entries }}>
      {children}
    </JsonHistoryContext.Provider>
  );
};