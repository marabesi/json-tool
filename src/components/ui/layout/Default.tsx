import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Drawer from './Drawer';
import { useThemeContext } from 'src/DarkModeContext';
import { useSettingsContext } from '../../../settings/SettingsContext';
import { useDrawerContext } from '../../../DrawerContext';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const { darkModeEnabled } = useThemeContext();
  const { featureOptions } = useSettingsContext();
  const { isOpen, setOpen } = useDrawerContext();
  const isHistoryEnabled = featureOptions.options.find(item => item.title === 'JSON History' && item.active);

  return (
    <div data-testid="app-container" className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      <div className="bg-blue-400 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header />
        { children }
        <Footer />
        { isHistoryEnabled && <Drawer open={isOpen} setOpen={setOpen}>
          <p>Working in progress</p>
        </Drawer>}
      </div>
    </div>
  );
}
