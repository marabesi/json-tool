import { createContext, ReactElement, useContext, useState } from 'react';

interface PersistenceContextInterface {
  savedState: string;
  resultState: string;
  saveState: (json: string, result: string) => void;
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
  const [resultState, setResultState] = useState<string>('');

  const saveState = (json: string, result: string) => {
    setSavedState(json);
    setResultState(result);
  };

  return (
    <PersistenceContext.Provider value={{ savedState, saveState, resultState }}>
      {children}
    </PersistenceContext.Provider>
  );
};