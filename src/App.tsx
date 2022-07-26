import {
  HashRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
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
export const SettingsContext = createContext(defaultOp);

function App() {
  const [options, setOptions] = useState<Option[]>(defaultOp);

  const handleChange = (event: Option) => {
    setOptions(options.map((option: Option) => {
      if (option.title === event.title) {
        option.active = !event.active;
      }
      return option;
    }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editors settings={options} />} />
        <Route path="/settings" element={
          <SettingsContext.Provider value={options as never}>
            <Settings options={options} handleChange={handleChange} />
          </SettingsContext.Provider>
        } />
      </Routes>
    </Router>
  );
}

export default App;
