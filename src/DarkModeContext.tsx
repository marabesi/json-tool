import { createContext, ReactElement, useContext, useState } from 'react';

interface ThemeContextInterface {
  onDarkThemeChanged: (isDarkThemeEnabled: boolean) => void;
  darkModeEnabled: boolean;
}

const isDarkModeSet = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactElement }) => {
  const [darkModeEnabled, setDarkMode] = useState<boolean>(() => isDarkModeSet());

  const onDarkThemeChanged = (isDarkThemeEnabled: boolean)  => {
    // for some reason the event is fired with undefined
    if (isDarkThemeEnabled !== undefined) {
      setDarkMode(isDarkThemeEnabled);
    }
  };

  return (
    <ThemeContext.Provider value={{ onDarkThemeChanged, darkModeEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};