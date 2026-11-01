import { createContext, ReactElement, useCallback, useContext, useState } from 'react';

interface DrawerContextInterface {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
}

const DrawerContext = createContext<DrawerContextInterface | undefined>(undefined);

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a DrawerContextProvider');
  }
  return context;
};

export const DrawerContextProvider = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  return (
    <DrawerContext.Provider value={{ isOpen, close, toggle }}>
      {children}
    </DrawerContext.Provider>
  );
};