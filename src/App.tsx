import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';
import { createContext, useState } from 'react';
import { EditorOptions, Option, Properties } from './components/ui/Editor';

const defaultOp: Option[] = [
  { title: 'foldGutter', active: true },
  { title: 'syntaxHighlighting', active : true },
  { title: 'history', active: false },
  { title: 'highlightActiveLine', active: true },
  { title: 'autocompletion', active: false } ,
  { title: 'closeBrackets', active: false },
];

const properties: Properties = {
  key: 'fontSize',
  value: '12px'
};

const editorOptions: EditorOptions = {
  options: defaultOp,
  properties: [properties]
};

export const SettingsContext = createContext(editorOptions);

function App() {
  const [savedState, setSavedState] = useState<string>('');

  const handleChange = (changed: EditorOptions) => {
    editorOptions.properties = changed.properties;
    editorOptions.options = changed.options;
  };

  const saveState = (json: string) => {
    setSavedState(json);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editors onPersist={saveState} currentJson={savedState} />} />
        <Route path="/settings" element={
          <SettingsContext.Provider value={editorOptions.options as never}>
            <Settings options={editorOptions} handleChange={handleChange} />
          </SettingsContext.Provider>
        } />
      </Routes>
    </Router>
  );
}

export default App;
