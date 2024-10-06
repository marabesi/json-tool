import { createContext, ReactElement, useContext } from 'react';
import { editorOptions } from 'src/components/ui/editor/default-options';

const SettingsContext = createContext(editorOptions);


export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider');
  }
  return context;
};

export const SettingsContextProvider = ({ children }: { children: ReactElement}) => (
  <SettingsContext.Provider value={editorOptions.options as never}>
    {children}
  </SettingsContext.Provider>
);

export default SettingsContext;