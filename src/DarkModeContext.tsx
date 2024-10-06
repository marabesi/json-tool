import { createContext, ReactElement, useContext, useLayoutEffect, useState } from 'react';

interface Theme {
  darkMode: boolean;
}

interface ThemeContextInterface {
  theme: Theme;
  onDarkThemeChanged: (isDarkThemeEnabled: boolean) => void;
  darkModeEnabled: boolean;
}

const isDarkModeSet = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const theme = { darkMode: false };

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactElement }) => {
  const [darkModeEnabled, setDarkMode] = useState<boolean>(theme.darkMode);

  const onDarkThemeChanged = (isDarkThemeEnabled: boolean)  => {
    // for some reason the event is fired with undefined
    if (isDarkThemeEnabled !== undefined) {
      setDarkMode(isDarkThemeEnabled);
      theme.darkMode = isDarkThemeEnabled;
    }
  };

  useLayoutEffect(() => {
    onDarkThemeChanged(isDarkModeSet());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, onDarkThemeChanged, darkModeEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};