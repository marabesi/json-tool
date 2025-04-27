import { ReactNode } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import Drawer from './Drawer';
import { useThemeContext } from '../../../DarkModeContext';
import { useSettingsContext } from '../../../settings/SettingsContext';
import { useDrawerContext } from '../../../DrawerContext';
import { useJsonHistoryContext } from '../../../JsonHistoryContext';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const { darkModeEnabled } = useThemeContext();
  const { featureOptions } = useSettingsContext();
  const { isOpen, setOpen } = useDrawerContext();
  const { entries } = useJsonHistoryContext();
  
  const isHistoryEnabled = featureOptions.options.find(item => item.title === 'JSON History' && item.active);

  return (
    <div data-testid="app-container" className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      <div className="bg-blue-400 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header />
        { children }
        <Footer />
        { isHistoryEnabled && <Drawer open={isOpen} setOpen={setOpen}>
          <div data-testid="history-content" className="w-full">
            {entries.map((item, index) => {
              return (
                <div key={index} className="flex items-center">
                  <p data-testid="history-entry" className="mr-2 w-full">{item.snippet}</p>
                  <FaRegCopy data-testid="json-copy-entry" />
                </div>
              );
            })}
          </div>
        </Drawer>}
      </div>
    </div>
  );
}
