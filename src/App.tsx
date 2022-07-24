import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Editors from './pages/Editors';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editors />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
