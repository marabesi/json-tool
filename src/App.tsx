import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import { Docs } from './pages/Docs';
import DefaultLayout from './components/ui/layout/Default';
import { ThemeContextProvider } from './DarkModeContext';
import { SettingsContextProvider } from './settings/SettingsContext';
import { PersistenceContextProvider } from './PersistenceContext';

function App() {
  return (
    <Router>
      <PersistenceContextProvider>
        <ThemeContextProvider>
          <DefaultLayout>
            <SettingsContextProvider>
              <Routes>
                <Route path="/" element={<Editors />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/docs" element={<Docs />} />
              </Routes>
            </SettingsContextProvider>
            <Toaster />
          </DefaultLayout>
        </ThemeContextProvider>
      </PersistenceContextProvider>
    </Router>
  );
}

export default App;
