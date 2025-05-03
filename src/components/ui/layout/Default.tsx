import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Drawer from './Drawer';
import { useThemeContext } from '../../../DarkModeContext';
import { useSettingsContext } from '../../../settings/SettingsContext';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const { darkModeEnabled } = useThemeContext();
  const { isHistoryEnabled } = useSettingsContext();

  return (
    <div data-testid="app-container" className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      <div className="bg-blue-400 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header />
        { children }
        <Footer />
        { isHistoryEnabled && <Drawer />}
      </div>
    </div>
  );
}
