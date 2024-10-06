import { createContext, ReactElement, useContext, useState } from 'react';

interface PersistenceContextInterface {
  savedState: string;
  saveState: (json: string) => void;
}

const PersistenceContext = createContext<PersistenceContextInterface | undefined>(undefined);

export const usePersistenceContext = () => {
  const context = useContext(PersistenceContext);
  if (context === undefined) {
    throw new Error('usePersistenceContext must be used within a PersistenceContextProvider');
  }
  return context;
};

export const PersistenceContextProvider = ({ children }: { children: ReactElement }) => {
  const [savedState, setSavedState] = useState<string>('');

  const saveState = (json: string) => {
    setSavedState(json);
  };

  return (
    <PersistenceContext.Provider value={{ savedState, saveState }}>
      {children}
    </PersistenceContext.Provider>
  );
};