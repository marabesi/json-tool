import { ReactNode } from 'react';
import { FaRegCopy, FaReply } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import Drawer from './Drawer';
import { useThemeContext } from '../../../DarkModeContext';
import { useSettingsContext } from '../../../settings/SettingsContext';
import { useDrawerContext } from '../../../DrawerContext';
import { useJsonHistoryContext } from '../../../JsonHistoryContext';
import { useClipboardContext } from '../../../ClipboardContext';
import { usePersistenceContext } from '../../../PersistenceContext';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const { darkModeEnabled } = useThemeContext();
  const { featureOptions } = useSettingsContext();
  const { isOpen, setOpen } = useDrawerContext();
  const { entries } = useJsonHistoryContext();
  const { sendStringToClipboard } = useClipboardContext();
  const { spacing, onChange } = usePersistenceContext();
  
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
                <div key={index} className="flex items-center justify-around p-1 hover:bg-blue-800 dark:hover:bg-gray-800">
                  <p data-testid="history-entry" className="mr-2 w-full">{item.snippet}</p>
                  <FaReply
                    data-testid="json-send-to-editor-entry"
                    className="cursor-pointer m-3 hover:text-blue-300 dark:hover:text-gray-300"
                    onClick={() => onChange(item.rawContent, spacing, false)}
                  />
                  <FaRegCopy
                    data-testid="json-copy-entry"
                    className="cursor-pointer m-3 hover:text-blue-300 dark:hover:text-gray-300"
                    onClick={() => sendStringToClipboard(item.rawContent)}
                  />
                </div>
              );
            })}
          </div>
        </Drawer>}
      </div>
    </div>
  );
}
