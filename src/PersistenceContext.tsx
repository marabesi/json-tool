import { createContext, ReactElement, useContext, useState } from 'react';

interface PersistenceContextInterface {
  jsonState: string;
  resultState: string;
  saveState: (json: string, result: string) => void;
  isValidateEnabled: boolean;
  setValidateEnabled: (validate: boolean) => void;
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
  const [isValidateEnabled, setValidateEnabled] = useState<boolean>(true);
  const [jsonState, setJsonState] = useState<string>('');
  const [resultState, setResultState] = useState<string>('');

  const saveState = (json: string, result: string) => {
    setJsonState(json);
    setResultState(result);
  };

  return (
    <PersistenceContext.Provider value={{ jsonState, saveState, resultState, isValidateEnabled, setValidateEnabled }}>
      {children}
    </PersistenceContext.Provider>
  );
};