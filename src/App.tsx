import { HashRouter as Router, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import { Docs } from './pages/Docs';
import DefaultLayout from './components/ui/layout/Default';
import { ThemeContextProvider } from './DarkModeContext';
import { SettingsContextProvider } from './settings/SettingsContext';
import { PersistenceContextProvider } from './PersistenceContext';
import { DrawerContextProvider } from './DrawerContext';
import { ToolbarContextProvider } from './ToolbarContext';
import { ClipboardContextProvider } from './ClipboardContext';

export default function App() {
  return (
    <Router>
      <PersistenceContextProvider>
        <ClipboardContextProvider>
          <ThemeContextProvider>
            <DrawerContextProvider>
              <SettingsContextProvider>
                <ToolbarContextProvider>
                  <DefaultLayout>
                    <Routes>
                      <Route path="/" element={<Editors/>}/>
                      <Route path="/settings" element={<Settings/>}/>
                      <Route path="/docs" element={<Docs/>}/>
                    </Routes>
                    <Toaster/>
                  </DefaultLayout>
                </ToolbarContextProvider>
              </SettingsContextProvider>
            </DrawerContextProvider>
          </ThemeContextProvider>
        </ClipboardContextProvider>
      </PersistenceContextProvider>
    </Router>
  );
}
