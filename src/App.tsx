import { HashRouter as Router, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Editors from './pages/Editors';
import Table from './pages/Table';
import Schema from './pages/Schema';
import Diff from './pages/Diff';
import { Settings } from './pages/Settings';
import DefaultLayout from './components/ui/layout/Default';
import { ThemeContextProvider } from './DarkModeContext';
import { SettingsContextProvider } from './settings/SettingsContext';
import { PersistenceContextProvider } from './PersistenceContext';
import { DrawerContextProvider } from './DrawerContext';
import { ToolbarContextProvider } from './ToolbarContext';
import { ClipboardContextProvider } from './ClipboardContext';
import { EditorLayoutContextProvider } from './EditorLayoutContext';
import { ShortcutsContextProvider } from './ShortcutsContext';

export default function App() {
  return (
    <Router>
      <ShortcutsContextProvider>
        <PersistenceContextProvider>
          <EditorLayoutContextProvider>
            <ClipboardContextProvider>
              <ThemeContextProvider>
                <DrawerContextProvider>
                  <SettingsContextProvider>
                    <ToolbarContextProvider>
                      <DefaultLayout>
                        <Routes>
                          <Route path="/" element={<Editors/>}/>
                          <Route path="/table" element={<Table/>}/>
                          <Route path="/schema" element={<Schema/>}/>
                          <Route path="/diff" element={<Diff/>}/>
                          <Route path="/settings" element={<Settings/>}/>
                        </Routes>
                        <Toaster/>
                      </DefaultLayout>
                    </ToolbarContextProvider>
                  </SettingsContextProvider>
                </DrawerContextProvider>
              </ThemeContextProvider>
            </ClipboardContextProvider>
          </EditorLayoutContextProvider>
        </PersistenceContextProvider>
      </ShortcutsContextProvider>
    </Router>
  );
}
