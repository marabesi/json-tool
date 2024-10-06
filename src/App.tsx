import { useLayoutEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import DefaultLayout from './components/ui/layout/Default';
import { theme, ThemeProvider } from './DarkMode';
import { SettingsContextProvider } from './settings/SettingsContext';

const isDarkModeSet = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function App() {
  const [savedState, setSavedState] = useState<string>('');
  const [darkModeEnabled, setDarkMode] = useState<boolean>(theme.darkMode);

  const saveState = (json: string) => {
    setSavedState(json);
  };

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
    <Router>
      <ThemeProvider value={theme as never}>
        <DefaultLayout onDarkThemeChanged={onDarkThemeChanged} darkModeEnabled={darkModeEnabled}>
          <SettingsContextProvider>
            <Routes>
              <Route path="/" element={<Editors onPersist={saveState} currentJson={savedState} />} />
              <Route path="/settings" element={
                <Settings />
              } />
            </Routes>
          </SettingsContextProvider>
          <Toaster />
        </DefaultLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
