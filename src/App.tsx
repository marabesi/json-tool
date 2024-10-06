import { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import DefaultLayout from './components/ui/layout/Default';
import { ThemeContextProvider } from './DarkModeContext';
import { SettingsContextProvider } from './settings/SettingsContext';

function App() {
  const [savedState, setSavedState] = useState<string>('');

  const saveState = (json: string) => {
    setSavedState(json);
  };

  return (
    <Router>
      <ThemeContextProvider>
        <DefaultLayout>
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
      </ThemeContextProvider>
    </Router>
  );
}

export default App;
