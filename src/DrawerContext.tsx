import { createContext, ReactElement, useContext, useState } from 'react';

interface DrawerContextInterface {
  setOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

const DrawerContext = createContext<DrawerContextInterface | undefined>(undefined);

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be uased within a DrawerContextProvider');
  }
  return context;
};

export const DrawerContextProvider = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setOpen = (isOpen: boolean)  => {
    setIsOpen(isOpen);
  };

  return (
    <DrawerContext.Provider value={{ setOpen, isOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};