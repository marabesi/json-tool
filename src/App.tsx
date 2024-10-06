import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import { useLayoutEffect, useState } from 'react';
import DefaultLayout from './components/ui/layout/Default';
import { editorOptions as defaultOptions } from './components/ui/editor/default-options';
import { EditorOptions } from './types/components/Editor';
import { theme, ThemeProvider } from './DarkMode';
import { Toaster } from 'react-hot-toast';
import { SettingsContextProvider } from './settings/SettingsContext';

const isDarkModeSet = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function App() {
  const [savedState, setSavedState] = useState<string>('');
  const [darkModeEnabled, setDarkMode] = useState<boolean>(theme.darkMode);
  const [editorOptions, setEditorOptions] = useState<any>(defaultOptions);

  const handleChange = (changed: EditorOptions) => {
    editorOptions.properties = changed.properties;
    editorOptions.options = changed.options;
    setEditorOptions(editorOptions);
  };

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
          <Routes>
            <Route path="/" element={<Editors onPersist={saveState} currentJson={savedState} />} />
            <Route path="/settings" element={
              <SettingsContextProvider>
                <Settings options={editorOptions} handleChange={handleChange} />
              </SettingsContextProvider>
            } />
          </Routes>
          <Toaster />
        </DefaultLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
