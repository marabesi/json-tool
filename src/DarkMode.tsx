import { createContext } from 'react';

export const theme = { darkMode: false };
export const ThemeContext = createContext(theme);

export const ThemeProvider = ThemeContext.Provider;

