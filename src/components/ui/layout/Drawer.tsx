import { FaRegCopy, FaReply } from 'react-icons/fa';
import { useDrawerContext } from '../../../DrawerContext';
import { HistoryEntry } from '../../../types/jsonHistory';
import { useClipboardContext } from '../../../ClipboardContext';
import { usePersistenceContext } from '../../../PersistenceContext';

const Drawer = () => {
  const { isOpen, toggle } = useDrawerContext();
  const transitionVisible = isOpen ? 'opacity-100 duration-50 ease-in-out visible': 'opacity-0 duration-50 ease-in-out invisible';
  const transitionWidth = isOpen ? 'translate-x-0': 'translate-x-full';
  const { close } = useDrawerContext();
  const { sendStringToClipboard } = useClipboardContext();
  const { spacing, onChange, entries } = usePersistenceContext();

  function sendToEditor(item: HistoryEntry) {
    onChange(item.rawContent, spacing, false);
    close();
  }
  
  return (
    <div
      id="dialog-right"
      className="relative z-10"
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      onClick={toggle}
    >
      <div
        data-testid="drawer"
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-all ${transitionVisible}`}
      ></div>
      <div className={isOpen ? 'fixed inset-0 overflow-hidden' : ''}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed w-4/12 inset-y-0 right-0">
            <div
              className={`pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500 ${transitionWidth}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div
                className='flex h-full w-full overflow-y-scroll p-2 shadow-xl bg-blue-400 text-gray-100 dark:text-gray-400 dark:bg-gray-600'
              >
                <div data-testid="history-content" className="w-full">
                  {entries.map((item, index) => {
                    return (
                      <div key={index} className="flex items-center justify-around p-1 hover:bg-blue-800 dark:hover:bg-gray-800">
                        <p data-testid="history-entry" className="mr-2 w-full">{item.snippet}</p>
                        <FaReply
                          data-testid="json-send-to-editor-entry"
                          className="cursor-pointer m-3 hover:text-blue-300 dark:hover:text-gray-300"
                          onClick={() => sendToEditor(item)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
