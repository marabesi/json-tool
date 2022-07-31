import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Editors from './pages/Editors';
import { Option, Settings } from './pages/Settings';
import { createContext, useState } from 'react';

const defaultOp: Option[] = [
  { title: 'foldGutter', active: true },
  { title: 'syntaxHighlighting', active : true },
  { title: 'history', active: false },
  { title: 'highlightActiveLine', active: true },
  { title: 'autocompletion', active: false } ,
  { title: 'closeBrackets', active: false },
];

export interface Properties {
  key: string;
  value: string;
}

export interface EditorOptions {
  options: Option[],
  properties: Properties[]
}

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
