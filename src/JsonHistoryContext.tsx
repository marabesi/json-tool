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
    const first10 = entry.slice(0, 10);
    setEntries([
      ...entries,
      { snippet: first10, rawContent: entry },
    ]);
  };

  return (
    <JsonHistoryContext.Provider value={{ appendEntry, entries }}>
      {children}
    </JsonHistoryContext.Provider>
  );
};