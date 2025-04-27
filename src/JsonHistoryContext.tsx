import { createContext, ReactElement, useContext, useState } from 'react';

interface JsonHistoryContextInterface {
  entries: string[];
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
  const [entries, setEntries] = useState<string[]>([]);

  const appendEntry = (entry: string)  => {
    setEntries([
      ...entries,
      entry,
    ]);
  };

  return (
    <JsonHistoryContext.Provider value={{ appendEntry, entries }}>
      {children}
    </JsonHistoryContext.Provider>
  );
};